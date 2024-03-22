var steem = require("steem");

const STEEMIT_VOTE_REGENERATION_SECONDS = 5 * 60 * 60 * 24; // it takes 5 days to regenerate 100% voting power
const STEEMIT_100_PERCENT = 10000;

// Adjust these values to use something other than 100% for voting power and vote weight.
// Note: Value = percentage * 100, so 100% = 10000, 25.33% = 2533, etc.
const current_voting_power = STEEMIT_100_PERCENT;
const vote_pct_weight = STEEMIT_100_PERCENT;

steem.api.getAccountsAsync(["xpilar"]).then(function (results) {
  const account = results[0];

  const acct_vesting_shares = parseFloat(
    account.vesting_shares.replace(" VESTS", ""),
  );
  const acct_delegated_vesting_shares = parseFloat(
    account.delegated_vesting_shares.replace(" VESTS", ""),
  );
  const acct_received_vesting_shares = parseFloat(
    account.received_vesting_shares.replace(" VESTS", ""),
  );

  const effective_vesting_shares =
    acct_vesting_shares -
    acct_delegated_vesting_shares +
    acct_received_vesting_shares;

  console.log("acct_vesting_shares", acct_vesting_shares);
  console.log("acct_delegated_vesting_shares", acct_delegated_vesting_shares);
  console.log("acct_received_vesting_shares", acct_received_vesting_shares);
  console.log("effective_vesting_shares", effective_vesting_shares);

  steem.api.getRewardFundAsync("post").then(function (fund) {
    const pot = parseFloat(fund.reward_balance.replace(" STEEM", ""));
    const total_r2 = parseInt(fund.recent_claims, 10);

    console.log("pot", pot);
    console.log("total_r2", total_r2);

    steem.api.getDynamicGlobalPropertiesAsync().then(function (gprops) {
      const max_vote_denom =
        (gprops.vote_power_reserve_rate * STEEMIT_VOTE_REGENERATION_SECONDS) /
        (60 * 60 * 24);

      let used_power =
        (current_voting_power * vote_pct_weight) / STEEMIT_100_PERCENT;
      used_power = (used_power + max_vote_denom - 1) / max_vote_denom;

      let rshares =
        (effective_vesting_shares * used_power) / STEEMIT_100_PERCENT;
      rshares = Math.floor(rshares * 1000000);

      console.log("max_vote_denom", max_vote_denom);
      console.log("used_power", used_power);
      console.log("rshares", rshares);
      console.log("STEEM value", (rshares * pot) / total_r2);
    });
  });
});
