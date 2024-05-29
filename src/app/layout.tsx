'use client';

import '@/styles/globals.scss';
import '@fontsource/inter';

import { SuiClientProvider, WalletProvider, createNetworkConfig } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui.js/client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { RecoilRoot } from 'recoil';

const queryClient = new QueryClient();

const { networkConfig } = createNetworkConfig({
  localnet: { url: getFullnodeUrl('localnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
  testnet: { url: getFullnodeUrl('testnet') },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <RecoilRoot>
          <QueryClientProvider client={queryClient}>
            <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
              <WalletProvider autoConnect stashedWallet={{ name: 'Sui Coins' }}>
                {children}
              </WalletProvider>
            </SuiClientProvider>
          </QueryClientProvider>
        </RecoilRoot>
      </body>
    </html>
  );
}
