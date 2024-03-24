use anchor_lang::prelude::*;

declare_id!("STAGYb3HZJW8CV1QEbhyc8WkLuJt44RtWHDpRgHe2pX");

#[program]
pub mod solstage_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Initializing Filter Source");
        let filter_source = &mut ctx.accounts.filter_source;
        filter_source.signature = [0; 32];
        filter_source.url = "".to_string();
        Ok(())
    }

    pub fn set_filter(ctx: Context<SetFilter>, signature: [u8; 32], url: String) -> Result<()> {
        msg!("Setting Filter");
        let filter_source = &mut ctx.accounts.filter_source;
        filter_source.signature = signature;
        filter_source.url = url;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(init, payer = signer, space = 8 + 32 + 4 + 255,
        seeds = [b"filterSource:".as_ref(), signer.key.as_ref(), b":default".as_ref()], bump
    )]
    pub filter_source: Account<'info, FilterSource>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction()]
pub struct SetFilter<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut, 
        seeds = [b"filterSource:".as_ref(), signer.key.as_ref(), b":default".as_ref()], bump
        // constraint = filter.owner == *signer.key,
        // constraint = filter.is_initialized == false
    )]
    pub filter_source: Account<'info, FilterSource>,
}

#[account]
pub struct FilterSource {
    signature: [u8;32],
    url: String
}