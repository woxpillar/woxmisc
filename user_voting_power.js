var steem = require("steem");

steem.api.getAccountsAsync(["xpilar"]).then(function (result) {
  let secondsago =
    (new Date() - new Date(result[0].last_vote_time + "Z")) / 1000;
  let vpow = result[0].voting_power + (10000 * secondsago) / 432000;
  console.log(Math.min(vpow / 100, 100).toFixed(2));
});
