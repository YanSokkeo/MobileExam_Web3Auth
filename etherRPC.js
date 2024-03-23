import "@ethersproject/shims";

import { Buffer } from "buffer";
import { createPublicClient, http } from 'viem'
import { mainnet, sepolia } from 'viem/chains'
import { createWalletClient, parseEther, WalletClient } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { ethers } from "ethers";
global.Buffer = global.Buffer || Buffer;

const providerUrl = "https://eth-sepolia.g.alchemy.com/v2/vCOjubGd4jsMqjEiOJznDbIVACrIeehF"; // Or your desired provider url

const client = createPublicClient({
  chain: sepolia,
  transport: http(providerUrl)
})

const wallet = (account) => createWalletClient({
  account,
  chain: sepolia,
  transport: http(providerUrl)
})

const getChainId = async () => {
  try {
    const networkDetails = client.chain;
    return networkDetails;
  } catch (error) {
    return error;
  }
};

const getAccounts = async (key) => {
  try {
    const account = privateKeyToAccount(`0x${key}`);
    const address = account.address;
    return address;
  } catch (error) {
    return error;
  }
};

const getBalance = async (key) => {
  try {
    const address = await getAccounts(key)
    const balance = await client.getBalance({
      address
    });
    return balance;
  } catch (error) {
    console.error(error);
  }
};

const sendTransaction = async (key) => {
  try {
  const account = privateKeyToAccount(`0x${key}`);
  const walletClient = wallet(account);

  // Submit transaction to the blockchain
  const tx = await walletClient.sendTransaction({
    to: "0x5b9c2A5f9D0396E43f128B2d462edCc48EBa8150",
    value: parseEther("0.001")
  });

  return tx;
} catch (error) {
  return error;
}
};

const signMessage = async (key) => {
  try {
    const account = privateKeyToAccount(`0x${key}`);

    const originalMessage = "YOUR_MESSAGE";

    // Sign the message
    const signedMessage = account.signMessage({ message: originalMessage });
    return signedMessage;
  } catch (error) {
    return error;
  }
};

export default {
  getChainId,
  getAccounts,
  getBalance,
  sendTransaction,
  signMessage,
};
