import {
  LightSmartContractAccount,
  getDefaultLightAccountFactoryAddress,
} from "@alchemy/aa-accounts";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { SmartAccountSigner } from "@alchemy/aa-core";
import { useCallback, useMemo } from "react";
import { alchemyAPIKey, chain } from "../web3";
import { Address } from "viem";
const factoryAddress = getDefaultLightAccountFactoryAddress(chain);

export const useAlchemyProvider = () => {
  const provider = useMemo<AlchemyProvider>(
    () =>
      new AlchemyProvider({
        chain,
        apiKey: alchemyAPIKey,
      }),
    [chain]
  );

  const getAddressFromAccount = async () => {
    try {
      const address = await provider.getAddress();
      return address;
    } catch (err: any) {
      console.error("[getAddressFromAccount]", err);
    }
    return null;
  };

  const connectProviderToAccount = useCallback(
    (signer: SmartAccountSigner, account?: Address) => {
      try {
        provider
          .connect(
            (rpcClient) =>
              new LightSmartContractAccount({
                rpcClient,
                owner: signer,
                chain,
                factoryAddress,
                accountAddress: account,
              })
          )
      } catch (err) {
        console.error(err);
      }
      return provider;
    },
    [provider]
  );

  const disconnectProviderFromAccount = useCallback(() => {
    provider.disconnect();
  }, [provider]);

  return {
    provider,
    getAddressFromAccount,
    connectProviderToAccount,
    disconnectProviderFromAccount,
  };
};
