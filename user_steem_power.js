var steem = require("steem");

steem.api.getAccountsAsync(["xpilar"]).then(function (result) {
  steem.api.getDynamicGlobalPropertiesAsync().then(function (gprops) {
    const totalVestingFundSteem = parseFloat(
      gprops.total_vesting_fund_steem.replace(" STEEM", ""),
    );
    const totalVestingShares = parseFloat(
      gprops.total_vesting_shares.replace(" VESTS", ""),
    );
    const vestingShares = parseFloat(
      result[0].vesting_shares.replace(" VESTS", ""),
    );
    const receivedVestingShares = parseFloat(
      result[0].received_vesting_shares.replace(" VESTS", ""),
    );

    let totalSteemPower =
      totalVestingFundSteem *
      ((vestingShares + receivedVestingShares) / totalVestingShares);

    if (totalSteemPower == null) {
      totalSteemPower = 0;
    }

    console.log("sp", totalSteemPower.toFixed(3));
    console.log("vesting_shares", vestingShares.toFixed(3));
  });
});
