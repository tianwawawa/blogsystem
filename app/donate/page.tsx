'use client';

import { useReadContract, useWriteContract, useBalance } from 'wagmi';
import { formatEther } from 'viem';
import { contractConfig } from './contract';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function DonationBoard() {
  const [donateMount, setDonate] = useState(0);
  const [checkAddr, setAddress] = useState<`0x${string}`>('0x');
  const [balanceAddress, setBalanceAddress] = useState<`0x${string}`>('0x');
  const { writeContract } = useWriteContract();
  // 捐赠
  const donate = async (eth: number) => {
    const data = writeContract({
      ...contractConfig,
      functionName: 'donate',
      args: [],
      value: BigInt(eth * 1e18), // 单位转换
    });
  };

  // top3
  const { data: top3 } = useReadContract({
    ...contractConfig,
    functionName: 'rankTop3',
    query: { refetchInterval: 6_000 },
  });

  // 合约余额
  const { data: balance } = useBalance({
    address: contractConfig.address,
    query: { refetchInterval: 6_000 },
  });

  // 查询某个地址的捐赠金额
  const { data: amount } = useReadContract({
    ...contractConfig,
    functionName: 'getDonation',
    args: [checkAddr],
  });

  // 提取余额
  const withdraw = async (address: `0x${string}`) => {
    writeContract({
      ...contractConfig,
      functionName: 'withdraw',
      args: [address],
    });
  };

  return (
    <div className="p-4 border rounded space-y-3">
      <h3 className="font-bold">捐赠榜（Sepolia）</h3>

      {/* 排行榜 */}
      {top3 && top3.length > 0 ? (
        <ol className="list-decimal list-inside">
          {top3.map((addr, i) => (
            <li key={i}>{addr}</li>
          ))}
        </ol>
      ) : (
        <p>暂无捐赠</p>
      )}

      {/* 合约余额 */}
      <p>
        合约余额：{balance ? formatEther(balance.value) : '0'}{' '}
        <span className="text-gray-600">ETH</span>
      </p>

      {/* 捐赠按钮 */}
      <div className="flex gap-2 justify-items-center items-center">
        <Button onClick={() => donate(donateMount)}>捐赠</Button>
        <Input
          className="w-[800px]"
          type="number"
          placeholder="捐款金额"
          onBlur={(e) => {
            setDonate(Number(e.target.value));
          }}
        />
        <p className="text-gray-600">ETH</p>
      </div>
      <div className="flex gap-2 justify-items-center items-center">
        <Button onClick={() => withdraw(balanceAddress)}>提取余额到</Button>
        <Input
          type="text"
          className="w-[800px]"
          placeholder="地址"
          onBlur={(e) => {
            const address = e.target.value;
            setBalanceAddress(address as `0x${string}`);
          }}
        />
      </div>

      <div className="flex gap-2 justify-items-center items-center">
        <p>查询某个地址的捐赠金额: </p>
        <Input
          className="w-[800px]"
          type="text"
          placeholder="地址"
          onBlur={(e) => {
            console.log('查询地址', e.target.value);
            const address = e.target.value;
            setAddress(address as `0x${string}`);
          }}
        />
        <div className="w-20">
          {amount ? formatEther(amount) : 0}
          <span className="text-gray-600">ETH</span>
        </div>
      </div>

      {/* 钱包连接 */}
      <div className="mt-4 flex items-center gap-2">
        <span>钱包：</span>
        <ConnectButton />
      </div>
    </div>
  );
}
