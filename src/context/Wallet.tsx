import { AlchemyProvider } from '@alchemy/aa-alchemy';
import { Address, SmartAccountSigner } from '@alchemy/aa-core';
import { useAlchemyProvider } from '../useProvider/useAlchemyProvider';
import { useAsyncEffect } from '../useProvider/useAsyncEffect';
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState
} from 'react';
import { Auth } from '../Type/Auth';
import { useAlertContext } from '../useProvider/Alert';
import {
  LOGIN_PROVIDER_TYPE,
  OpenloginUserInfo
} from '@web3auth/react-native-sdk';
import { useWeb3AuthContext } from './web3auth';
import { PublicClient, WalletClient } from 'viem';

type WalletContextProps = {
  // Functions
  login: (type: LOGIN_PROVIDER_TYPE, params: any) => Promise<void>;
  logout: () => Promise<void>;
  getUserInfo: () => Promise<OpenloginUserInfo | undefined>;

  // Properties
  loading: boolean;
  provider: AlchemyProvider;
  auth: Auth;
  address?: Address;
  signer?: SmartAccountSigner;
  walletClient?: WalletClient;
  publicClient: PublicClient;
};

const defaultUnset: any = null;
const WalletContext = createContext<WalletContextProps>({
  // Default Values
  loading: false,
  provider: defaultUnset,
  auth: defaultUnset,
  publicClient: defaultUnset,

  // Default Methods
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  getUserInfo: () => Promise.resolve(undefined)
});

export const useWalletContext = () => useContext(WalletContext);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { dispatchAlert } = useAlertContext();

  const [auth, setAuth] = useState<Auth>({
    isAuthenticated: false
  });
  const [loading, setLoading] = useState<boolean>(true);

  const {
    signer,
    walletClient,
    publicClient,
    login: web3authLogin,
    logout: web3authLogout,
    getUserinfo,
    init
  } = useWeb3AuthContext();
  const [scaAddress, setScaAddress] = useState<Address>();
  const { provider, connectProviderToAccount, disconnectProviderFromAccount } =
    useAlchemyProvider();

  useAsyncEffect(async () => {
    await init();
    if (provider.isConnected()) {
      const _userInfo = await getUserinfo();
      setAuth({
        ...auth,
        userInfo: _userInfo
      });
      setScaAddress(await provider.getAddress());
    }
  }, [provider]);

  useAsyncEffect(async () => {
    if (signer && !scaAddress) {
      try {
        connectProviderToAccount(signer, scaAddress);
        setScaAddress(await provider.getAddress());
        return;
      } catch (err) {
        console.error(err);
      }
    }
  }, [signer]);

  const login = useCallback(
    async (type: LOGIN_PROVIDER_TYPE, params: any) => {
      try {
        setLoading(true);
        const userInfo = await web3authLogin(type, params);

        if (signer) {
          connectProviderToAccount(signer);
          const address = await provider?.getAddress();
          setScaAddress(address);
          setAuth({
            ...auth,
            address,
            isAuthenticated: true
          });
        }

        if (userInfo) {
          setAuth({
            ...auth,
            userInfo
          });
        }

        dispatchAlert({
          type: 'open',
          alertType: 'success',
          message: `Logged in using ${type}`
        });
      } catch (error) {
        console.error(error);
        setAuth({
          address: undefined,
          isAuthenticated: false
        });
        setScaAddress(undefined);
        dispatchAlert({
          type: 'open',
          alertType: 'error',
          message: `Error logging in using ${type}`
        });
      } finally {
        setLoading(false);
      }
    },
    [connectProviderToAccount, web3authLogin, dispatchAlert]
  );

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      disconnectProviderFromAccount();
      await web3authLogout();
    } catch (error) {
      console.error(error);
    } finally {
      setAuth({
        address: undefined,
        isAuthenticated: false,
        userInfo: undefined
      });
      setScaAddress(undefined);
      setLoading(false);
      dispatchAlert({
        type: 'open',
        alertType: 'info',
        message: 'Logged out'
      });
    }
  }, [disconnectProviderFromAccount, web3authLogout, dispatchAlert]);

  return (
    <WalletContext.Provider
      value={{
        loading,
        login,
        logout,
        auth,
        signer,
        walletClient,
        publicClient,
        provider,
        address: scaAddress,
        getUserInfo: getUserinfo
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

