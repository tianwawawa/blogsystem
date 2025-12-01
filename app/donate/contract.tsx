export const contractConfig = {
  address: '0x2DEEF104A9F51548FB8F79B6Cdf128e1cd10C0b8',
  abi: [
    {
      inputs: [],
      name: 'donate',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      inputs: [
        {
          internalType: 'address payable',
          name: 'to',
          type: 'address',
        },
      ],
      name: 'withdraw',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      name: 'donations',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'addr',
          type: 'address',
        },
      ],
      name: 'getDonation',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'rankTop3',
      outputs: [
        {
          internalType: 'address[3]',
          name: 'addrs',
          type: 'address[3]',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ],
} as const;
