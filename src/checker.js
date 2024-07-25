const fs = require("fs").promises;

const {
  getUserTotalBalance,
  getUserTokenBalance,
  getUserTokenList,
  getUserProtocolList,
} = require("./helper/apiHelper");

async function fetchChainDetails(address, chain) {
  const [nativeBalance, tokenList, protocolList] = await Promise.all([
    getUserTokenBalance(address, chain.id, chain.native_token_id),
    getUserTokenList(address, chain.id),
    getUserProtocolList(address, chain.id),
  ]);

  let tokensBalance = tokenList.data
    .filter((token) => token.id !== chain.native_token_id)
    .reduce((acc, token) => acc + token.price * token.amount, 0);

  return { nativeBalance, tokensBalance, protocolList };
}

async function processAddress(address) {
  console.log(
    `\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ADDRESS: ${address}~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`
  );

  const balance = await getUserTotalBalance(address);
  let allUserBalance = balance.data.total_usd_value;

  let totalLockedAmount = 0;
  for (const chain of balance.data.chain_list) {
    const chainBalance = Math.floor(chain.usd_value);
    if (chainBalance === 0) continue;

    const { nativeBalance, tokensBalance, protocolList } =
      await fetchChainDetails(address, chain);

    const chainHeader = `
===================================================================
                            Chain: ${chain.name}
===================================================================`;

    console.log(chainHeader);

    console.log(
      `Native Balance: $${Math.floor(
        nativeBalance.data.price * nativeBalance.data.amount
      )}`
    );
    console.log(`Tokens balance: $${Math.floor(tokensBalance)}`);

    let lockedAmount = 0;
    if (protocolList.data.length !== 0) {
      protocolList.data.forEach((protocol) => {
        protocol.portfolio_item_list.forEach((item) => {
          if (Math.floor(item.stats.net_usd_value) != 0) {
            console.log("\n====================");

            console.log(
              "Protocol:",
              item.pool.adapter_id.replace(/_.*$/, "").toUpperCase()
            );

            console.log("Type:", item.name);

            let amountInUsd = 0;
            for (const asset of item.asset_token_list) {
              amountInUsd += Math.floor(asset.amount * asset.price);

              console.log(
                `Asset: ${asset.symbol} | Balance in USD: ${amountInUsd}$`
              );

              if (asset.claimable_amount)
                console.log(
                  `Claimable amount in USD: ${Math.floor(
                    asset.claimable_amount * asset.price
                  )}$`
                );
            }

            const locked = (item.detail.end_at || item.detail.unlock_at) * 1000;
            if (Date.now() < locked) {
              const endDate = new Date(locked);
              const formattedDate = endDate.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              });
              console.log("Locked until:", formattedDate);

              lockedAmount += amountInUsd;
            }

            console.log("====================");
          }
        });
      });
    }

    console.log(`\nTotal chain balance: $${chainBalance}`);
    console.log(`Available amount: $${chainBalance - lockedAmount}`);
    console.log(`Locked amount: $${lockedAmount}`);

    totalLockedAmount += lockedAmount;
  }

  const totalBalanceMessage = `
==============================================================
            Total Balance: $${Math.floor(allUserBalance)}
            Total Available Amount: $${Math.floor(
              allUserBalance - totalLockedAmount
            )}
            Total Locked Amount:    $${totalLockedAmount}
==============================================================
`;

  console.log(totalBalanceMessage);
  return allUserBalance;
}

const main = async () => {
  const addresses = await fs.readFile("src/addresses.txt", "utf8");
  const addressList = addresses.split("\n").filter(Boolean);

  let totalBalance = 0;
  for (const address of addressList) {
    const balance = await processAddress(address);
    totalBalance += balance;
  }

  console.log(
    `\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ALL USER BALANCE: $${Math.floor(
      totalBalance
    )}~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`
  );
};

(async () => {
  try {
    await main();
  } catch (error) {
    console.error(error);
  }
})();
