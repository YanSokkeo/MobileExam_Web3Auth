import { OPENLOGIN_NETWORK } from "@web3auth/react-native-sdk";
import { sepolia } from "viem/chains";

import Constants, { AppOwnership } from "expo-constants";
import { Address } from "viem";

// testnet
export const chain = sepolia;
export const web3authNetwork = OPENLOGIN_NETWORK.SAPPHIRE_DEVNET;

export const alchemyAPIKey = process.env.ALCHEMY_API_KEY!;
export const web3AuthClientId = process.env.WEB3AUTH_CLIENT_ID!;
