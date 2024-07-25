const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const getUserTotalBalance = async (address) => {
  return await axios.get(
    `https://pro-openapi.debank.com/v1/user/total_balance?id=${address}`,
    {
      headers: {
        accept: "application/json",
        AccessKey: process.env.DEBANK_ACCESS_KEY,
      },
    }
  );
};

const getUserTokenBalance = async (address, chain, token) => {
  return await axios.get(
    `https://pro-openapi.debank.com/v1/user/token?id=${address}&chain_id=${chain}&token_id=${token}`,
    {
      headers: {
        accept: "application/json",
        AccessKey: process.env.DEBANK_ACCESS_KEY,
      },
    }
  );
};

const getUserTokenList = async (address, chain) => {
  return await axios.get(
    `https://pro-openapi.debank.com/v1/user/token_list?id=${address}&chain_id=${chain}&is_all=false`,
    {
      headers: {
        accept: "application/json",
        AccessKey: process.env.DEBANK_ACCESS_KEY,
      },
    }
  );
};

const getUserProtocolList = async (address, chain) => {
  return await axios.get(
    `https://pro-openapi.debank.com/v1/user/complex_protocol_list?id=${address}&chain_id=${chain}`,
    {
      headers: {
        accept: "application/json",
        AccessKey: process.env.DEBANK_ACCESS_KEY,
      },
    }
  );
};

module.exports = {
  getUserTotalBalance,
  getUserTokenBalance,
  getUserTokenList,
  getUserProtocolList,
};
