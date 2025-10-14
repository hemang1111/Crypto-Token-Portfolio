"use client";

import React from "react";
import {
  WagmiProvider,
  createConfig,
  http,
} from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";

// ✅ Pick default chain dynamically
const defaultChain = import.meta.env.MODE === "development" ? sepolia : mainnet;

const projectId = "17ca520db331ffed05669afcad766ad8"; // ✅ Replace with your own WalletConnect project ID

// ✅ Get RainbowKit default connectors
const { connectors } = getDefaultWallets({
  appName: "My DApp",
  projectId,
});

// ✅ Create Wagmi config
const config = createConfig({
  chains: [defaultChain],
  connectors,
  transports: {
    [defaultChain.id]: http(),
  },
});

const queryClient = new QueryClient();

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={[defaultChain]}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
