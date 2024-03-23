import Web3Auth, {
  type OpenloginUserInfo,
  LOGIN_PROVIDER_TYPE,
  LOGIN_PROVIDER,
  OPENLOGIN_NETWORK,
} from "@web3auth/react-native-sdk";
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  PublicClient,
  WalletClient,
  createPublicClient,
  createWalletClient,
  http,
} from "viem";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

const clientId =
  "BDEpdavxR21KMTkd4TFsPjVS2PxVNY60M3i2Ut6s0KMMfHlcA5pV6jaJmSmWy9Pt_TZXJmgOrJLVVwXIZ0-tuXE";

type Web3AuthContextProps = {
  walletClient?: WalletClient;
  client: PublicClient;
  login: (
    type: LOGIN_PROVIDER_TYPE,
    params: any
  ) => Promise<OpenloginUserInfo | undefined>;
  logout: () => Promise<boolean | undefined | void>;
  getUserinfo: () => Promise<OpenloginUserInfo | undefined>;
  init: () => Promise<void>;
};

const client = createPublicClient({
  chain: sepolia,
  transport: http(),
});

const defaultUnset: any = null;
const Web3AuthContext = createContext<Web3AuthContextProps>({
  login: defaultUnset,
  logout: defaultUnset,
  getUserinfo: defaultUnset,
  init: defaultUnset,
  client: client,
});

export const useWeb3AuthContext = () => useContext(Web3AuthContext);

export const Web3AuthProvider = ({ children }: { children: ReactNode }) => {
  const [walletClient, setWalletClient] = useState<WalletClient>();
  const web3auth = useMemo<Web3Auth>(
    () =>
      new Web3Auth(WebBrowser, SecureStore, {
        clientId: clientId,
        network: OPENLOGIN_NETWORK.SAPPHIRE_DEVNET, // or other networks
        useCoreKitKey: false,
        loginConfig: {
          google: {
            verifier: "goole-oauth", // Pass the Verifier name here
            typeOfLogin: "google", // Pass on the login provider of the verifier you've created
            clientId:
              "699355879293-f090is2vq12kmmribq5i2154na5hopk9.apps.googleusercontent.com", // Pass on the Google `Client ID` here
          },
        },
      }),
    []
  );

  const setSignerAndClient = (key?: string) => {
    if (key) {
      const _walletClient: WalletClient = createWalletClient({
        chain: sepolia,
        account: privateKeyToAccount(`0x${key}` as `0x${string}`),
        transport: http(),
      });
      setWalletClient(_walletClient);
    }
  };

  useEffect(() => {
    const init = async () => {
      await web3auth.init();
      setSignerAndClient(web3auth.privKey);
    };
    init();
  }, [web3auth.privKey]);

  useEffect(() => {
    const getWallet = async () => {
      if (!walletClient) return;
      const [addresses, chainId] = await Promise.all([
        walletClient.getAddresses(),
        walletClient.getChainId(),
      ]);
      console.log(
        `[useWeb3AuthContext] Connected to ${addresses.at(
          0
        )} on chain ${chainId}`
      );
    };
    getWallet();
  }, [walletClient?.account, walletClient?.chain]);

  const login = useCallback(async (type: LOGIN_PROVIDER_TYPE, params: any) => {
    console.log(params);
    if (!web3auth) return;

    // init the web3auth
    await web3auth.init();
    switch (type) {
      case LOGIN_PROVIDER.GOOGLE:
      case LOGIN_PROVIDER.FACEBOOK:
        await web3auth.login({
          loginProvider: type,
          redirectUrl: params.redirectUrl,
          mfaLevel: "default",
          curve: "secp256k1",
        });
        break;
      // case LOGIN_PROVIDER.JWT:
      //   await web3auth.login({
      //     loginProvider: LOGIN_PROVIDER.JWT,
      //     redirectUrl: params.redirectUrl,
      //     // mfaLevel: "default",
      //     // curve: "secp256k1",
      //     extraLoginOptions: {
      //       id_token: params.accessToken,
      //       verifierIdField: "email", // auth0 generally uses sub as unique identifier
      //     },
      //   });
      //   break;
      default:
        throw new Error(`Invalid auth type ${type}`);
    }

    if (!web3auth.ready) throw new Error("Not ready");
    if (web3auth.privKey == null) throw new Error("No signer");

    setSignerAndClient(web3auth.privKey);

    return web3auth.userInfo();
  }, []);

  const logout = useCallback(async () => {
    if (!web3auth) return;
    setWalletClient(undefined);
    return web3auth.logout();
  }, []);

  const init = useCallback(async () => {
    if (!web3auth) return;
    await web3auth.init();
  }, []);

  const getUserinfo = useCallback(async () => {
    if (!web3auth) return;
    await web3auth.init();

    if (web3auth.ready && web3auth.privKey) {
      return web3auth.userInfo();
    }
  }, [web3auth.ready]);

  return (
    <Web3AuthContext.Provider
      value={{
        client,
        walletClient,
        login,
        logout,
        getUserinfo,
        init,
      }}
    >
      {children}
    </Web3AuthContext.Provider>
  );
};
