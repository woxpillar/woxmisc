import { Client } from "dsteem";

import fs from "fs";
// const fs = require("fs");
// const Client = require("dsteem");
const config = JSON.parse(fs.readFileSync("config.json").toString());
const client = new Client(config.steemApi);
const targetAccount = "xpilar"; //config.targetAccount;

export const getSP = async () => {
  try {
    const account = await client.database.getAccounts([targetAccount]);

    const vesting_shares = account[0].vesting_shares.toString().split(" ")[0];
    const received_vesting_shares = account[0].received_vesting_shares
      .toString()
      .split(" ")[0];
    const delegated_vesting_shares = account[0].delegated_vesting_shares
      .toString()
      .split(" ")[0];

    const total_vesting_shares =
      parseFloat(vesting_shares) +
      parseFloat(received_vesting_shares) -
      parseFloat(delegated_vesting_shares);

    const result = await client.database.getDynamicGlobalProperties();
    const totalVestingFundSteem = parseFloat(
      result.total_vesting_fund_steem.toString().split(" ")[0],
    );
    const totalVestingShares = parseFloat(
      result.total_vesting_shares.toString().split(" ")[0],
    );
    const conversionRate = totalVestingFundSteem / totalVestingShares;
    console.log("conversion rate:", conversionRate);
    const SP = total_vesting_shares * conversionRate;
    return SP;
  } catch (error) {
    console.log(error);
    return null;
  }
};

console.log(await getSP());
