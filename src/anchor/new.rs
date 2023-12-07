use anchor_lang::prelude::*;
use anchor_lang::solana_program::{
    hash::hash, hash::Hash, program::invoke, system_instruction::transfer,
};

declare_id!("BwES9u4SUW1qdUeh1riZpUUfaQf1FybrrbTDGfxNiTL2");

#[program]
mod guess_number { 
    use super::*;

    pub fn init_vault(
        ctx: Context<InitVault>,
        game_name: String,
        treasury_amount: u64,
    ) -> Result<()> {
        let vault = &mut ctx.accounts.game_vault;
        vault.master = ctx.accounts.master.key();

        vault.game_name = game_name;
        vault.treasury_amount = treasury_amount;

        // Game owner should deposit some SOL initially to the treasury
        invoke(
            &transfer(
                &ctx.accounts.master.key(),
                &vault.key(),
                vault.treasury_amount,
            ),
            &[
                ctx.accounts.master.to_account_info(),
                vault.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        msg!("Game name is: {}", vault.game_name);
        msg!(
            "Initial treasury amount is: {} SOL",
            vault.treasury_amount / 1000000000
        );

        Ok(())
    }

    pub fn make_guess(ctx: Context<MakeGuess>, guessed_num: u8, amount: u64) -> Result<()> {
        let guess = &mut ctx.accounts.guess;
        let vault = &mut ctx.accounts.game_vault;

        guess.guess_id += 1;
        vault.game_id += 1;

        guess.user = ctx.accounts.signer.key();
        guess.amount = amount;
        guess.guessed_num = guessed_num;

        // if guess amount greater than 0.05 SOL user can make a guess and deposit SOL to user guess PDA
        if guess.amount >= 50000000 {
            invoke(
                &transfer(&ctx.accounts.signer.key(), &guess.key(), guess.amount),
                &[
                    ctx.accounts.signer.to_account_info(),
                    guess.to_account_info(),
                    ctx.accounts.system_program.to_account_info(),
                ],
            )?;

            msg!("User deposit {} SOL!", (guess.amount / 1000000000));
        } else {
            msg!("Amount must be greater than 0.05 SOL !!");
        }

        msg!("User guess is: {}", guess.guessed_num);

        Ok(())
    }

    pub fn generate_random(ctx: Context<GenerateRandom>, index: u8) -> Result<()> {
        let game_result = &mut ctx.accounts.new_result;
        let guess = &mut ctx.accounts.guess;
        let vault = &mut ctx.accounts.game_vault;
        let rand_var = index;

        game_result.result_id += 1;

        let mut slot = Clock::get().unwrap().unix_timestamp as u64;
        slot = slot.checked_add(rand_var.into()).unwrap();

        let hash = hash(&slot.to_be_bytes());
        let buf: [u8; 32] = Hash::to_bytes(hash);
        let slice: [u8; 4] = [buf[10], buf[12], buf[8], buf[16]];
        let random_num = u32::from_be_bytes(slice) % 6;

        game_result.generated_rand = random_num;

        if u32::from(guess.guessed_num) == random_num
            && guess.amount >= 50000000
            && game_result.result_id == guess.guess_id
        {
            game_result.bet_result = "Won".to_string();
            msg!("Won");

            **vault.to_account_info().try_borrow_mut_lamports()? -= guess.amount; // take prize from vault PDA
            **guess.to_account_info().try_borrow_mut_lamports()? += guess.amount; // add prize to the user PDA

            // Updates the SOL balance info in treasury
            vault.treasury_amount -= guess.amount;

            // basically guess amount + reward
            game_result.total_amount += guess.amount * 2;
        } else {
            game_result.bet_result = "Lost".to_string();
            msg!("Lost");

            **guess.to_account_info().try_borrow_mut_lamports()? -= guess.amount; // take bet amount from user PDA
            **vault.to_account_info().try_borrow_mut_lamports()? += guess.amount; // add bet amount to the vault PDA

            // Updates the SOL balance info in treasury
            vault.treasury_amount += guess.amount;
        }
        msg!("Random variable is: {}", rand_var);
        msg!(
            "Randomly(pseudo-randomly) generated number is: {}",
            game_result.generated_rand
        );

        Ok(())
    }

    pub fn claim_reward(ctx: Context<ClaimReward>) -> Result<()> {
        let game_result = &mut ctx.accounts.new_result;
        let guess = &mut ctx.accounts.guess;

        let user = &ctx.accounts.authority;

        // if total reward greater than or equal to 0.1 SOL
        if game_result.total_amount >= 100000000 && guess.user.key() == user.key() {
            **guess.to_account_info().try_borrow_mut_lamports()? -= game_result.total_amount; // take total reward from user PDA
            **user.to_account_info().try_borrow_mut_lamports()? += game_result.total_amount; // add/send total reward to the user wallet

            msg!("User has been claimed the total reward!");
            msg!("Claimed reward is: {}", game_result.total_amount);

            // Updates total amount info
            game_result.total_amount -= game_result.total_amount;
        }

        Ok(())
    }

    pub fn withdraw_from_vault(ctx: Context<WithdrawFromVault>) -> Result<()> {
        let vault = &mut ctx.accounts.game_vault;
        let withdrawer = &ctx.accounts.master;

        // if vault master equals to current signer which is invoking this function
        if vault.master.key() == withdrawer.key() {
            **vault.to_account_info().try_borrow_mut_lamports()? -= vault.treasury_amount; // take whole treasury amount from vault PDA
            **withdrawer.to_account_info().try_borrow_mut_lamports()? += vault.treasury_amount; // add whole treasury amount to the creator wallet

            // Updates the SOL balance info in treasury which will remain only rent fee
            vault.treasury_amount -= vault.treasury_amount;
        } else {
            msg!("Only game master can withdraw from game vault!")
        }

        msg!("Vault creator is: {}", vault.master);
        msg!("Withdrawer is: {}", withdrawer.key());

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(game_name: String)]
pub struct InitVault<'info> {
    #[account(
        init, 
        payer = master, 
        space = 100, 
        seeds = [game_name.as_bytes().as_ref()],
        bump
    )]
    pub game_vault: Account<'info, GameVault>,
    #[account(mut)]
    pub master: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct GameVault {
    pub master: Pubkey,
    pub treasury_amount: u64,
    pub game_name: String,
    pub game_id: u8,
}

#[derive(Accounts)]
pub struct MakeGuess<'info> {
    #[account(
        init_if_needed,
        payer = signer,
        space = 100,
        seeds = [game_vault.game_name.as_bytes().as_ref(), game_vault.key().as_ref(), signer.key().as_ref()],
        bump
    )]
    pub guess: Account<'info, Guess>,
    #[account(
        mut,
        seeds = [game_vault.game_name.as_bytes().as_ref()], 
        bump)]
    pub game_vault: Account<'info, GameVault>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Guess {
    pub user: Pubkey,
    pub guessed_num: u8,
    pub amount: u64,
    pub guess_id: u8,
}

#[derive(Accounts)]
pub struct GenerateRandom<'info> {
    #[account(
        init_if_needed,
        payer = authority,
        space = 100,
        seeds = [game_vault.game_name.as_bytes().as_ref(), guess.key().as_ref(), authority.key().as_ref()],
        bump
    )]
    pub new_result: Account<'info, NewResult>,
    #[account(
        mut, 
        seeds = [game_vault.game_name.as_bytes().as_ref(), game_vault.key().as_ref(), authority.key().as_ref()],
        bump)]
    pub guess: Account<'info, Guess>,
    #[account(
        mut,
        seeds = [game_vault.game_name.as_bytes().as_ref()], 
        bump)]
    pub game_vault: Account<'info, GameVault>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct NewResult {
    pub authority: Pubkey,
    pub generated_rand: u32,
    pub bet_result: String,
    pub total_amount: u64,
    pub result_id: u8,
}

#[derive(Accounts)]
pub struct ClaimReward<'info> {
    #[account(
        mut,
        seeds = [game_vault.game_name.as_bytes().as_ref(), guess.key().as_ref(), authority.key().as_ref()],
        bump
    )]
    pub new_result: Account<'info, NewResult>,
    #[account(
        mut, 
        seeds = [game_vault.game_name.as_bytes().as_ref(), game_vault.key().as_ref(), authority.key().as_ref()],
        bump)]
    pub guess: Account<'info, Guess>,
    #[account(
        mut,
        seeds = [game_vault.game_name.as_bytes().as_ref()], 
        bump)]
    pub game_vault: Account<'info, GameVault>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct WithdrawFromVault<'info> {
    #[account(
        mut,
        has_one = master,
        seeds = [game_vault.game_name.as_bytes().as_ref()], 
        bump)]
    pub game_vault: Account<'info, GameVault>,
    #[account(mut)]
    pub master: Signer<'info>,
    pub system_program: Program<'info, System>,
}
