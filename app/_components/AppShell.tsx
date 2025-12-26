'use client';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
// 自定义Sepolia链（替换RPC节点）
const customSepolia = {
  ...sepolia,
  rpcUrls: {
    // 用Alchemy的Sepolia节点（需要自己注册Alchemy账号获取API_KEY）
    default: { http: [`https://sepolia.infura.io/v3/${process.env.INFRU_KEY}`] },
    // 或用Infura节点
    // default: { http: [`https://sepolia.infura.io/v3/你的Infura_API_KEY`] },
    // 或用Sepolia官方节点（可能有CORS，但试试）
    // default: { http: [`https://rpc.sepolia.org`] },
  },
};

const config = getDefaultConfig({
  appName: 'TYQProject',
  projectId: 'd521022e055965f78cbd536f8c76cd82',
  chains: [customSepolia],
  ssr: false, // If your dApp uses server side rendering (SSR)
});
export default function AppShell({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
