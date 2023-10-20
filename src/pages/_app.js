import React from "react";
import "../../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, goerli } from "wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";
import { SnackbarProvider } from "notistack";
import NextNProgress from "nextjs-progressbar";
import Layout from "../components/layout/Layout";
import PropTypes from "prop-types";
import { NextUIProvider } from "@nextui-org/react";




const scrollSepolia = {
  id: 534351,
  name: 'Scroll Sepolia',
  network: 'scroll-sepolia',
  iconUrl: 'https://storage.googleapis.com/ethglobal-api-production/organizations%2Fyip67%2Fimages%2F5122.png',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia-rpc.scroll.io/'],
    },
    public: {
      http: ['https://sepolia-rpc.scroll.io/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: "https://sepolia-blockscout.scroll.io",
    },
  },
  testnet: true,
};

const mantleTestnet = {
  id: 5001,
  name: 'Mantle Testnet',
  network: 'mantle-testnet',
  iconUrl: 'https://storage.googleapis.com/ethglobal-api-production/organizations%2Fjzpj5%2Flogo%2F1677013312206_Screen%20Shot%202023-02-21%20at%204.01.34%20PM.png',
  nativeCurrency: {
    name: 'MNT',
    symbol: 'MNT',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.mantle.xyz'],
    },
    public: {
      http: ['https://rpc.testnet.mantle.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'MantleExplorer',
      url: "https://explorer.testnet.mantle.xyz/",
    },
  },
  testnet: true,
};

const { chains, provider } = configureChains(
  [scrollSepolia, mantleTestnet],
  [
    // infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_API }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }) {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={3000}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
    >
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <Layout>
            <NextNProgress options={{ showSpinner: false }} />
            <NextUIProvider>
              <Component {...pageProps} />
            </NextUIProvider>
          </Layout>
        </RainbowKitProvider>
      </WagmiConfig>
    </SnackbarProvider>

  );
}

MyApp.propTypes = {
  Component: PropTypes.any,
  pageProps: PropTypes.any,
};

export default MyApp;
