var steem = require("steem");

// steem.api.getRewardFundAsync("post").then(console.log).catch(console.error);

steem.api.getFeedHistoryAsync().then(console.log);
