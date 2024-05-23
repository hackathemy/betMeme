'use client';

import '@/styles/globals.scss';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { RecoilRoot } from 'recoil';

const queryClient = new QueryClient();

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
            <SuiClientProvider>
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
