import "./shim.js";

import { Web3AuthProvider } from "./src/context/web3auth";

import React from "react";
import { useFonts } from "expo-font";
import StackNavigator from "./src/navigation/StackNavigator";
import { WalletProvider } from "./src/context/wallet";

const App = () => {
  let [fontsLoaded] = useFonts({
    bold: require("./assets/fonts/Poppins-Bold.ttf"),
    ExtraBold: require("./assets/fonts/Poppins-ExtraBold.ttf"),
    Light: require("./assets/fonts/Poppins-Light.ttf"),
    Medium: require("./assets/fonts/Poppins-Medium.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Web3AuthProvider>
      <StackNavigator />
    </Web3AuthProvider>

    // <Web3AuthProvider>
    //   <WalletProvider>
    //     <StackNavigator />
    //   </WalletProvider>
    // </Web3AuthProvider>
  );
};

export default App;
