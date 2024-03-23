import { OpenloginUserInfo } from '@web3auth/react-native-sdk';

export type Auth = {
  address?: string;
  isAuthenticated: boolean;
  userInfo?: OpenloginUserInfo;
};

export type AuthType = 'google' | 'facebook';
