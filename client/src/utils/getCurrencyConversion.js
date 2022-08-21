import Web3 from 'web3';

export const getCurrencyConversion = async (network) => {
  const aggregatorV3InterfaceABI = [
    {
      inputs: [],
      name: 'decimals',
      outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'description',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'uint80', name: '_roundId', type: 'uint80' }],
      name: 'getRoundData',
      outputs: [
        { internalType: 'uint80', name: 'roundId', type: 'uint80' },
        { internalType: 'int256', name: 'answer', type: 'int256' },
        { internalType: 'uint256', name: 'startedAt', type: 'uint256' },
        { internalType: 'uint256', name: 'updatedAt', type: 'uint256' },
        {
          internalType: 'uint80',
          name: 'answeredInRound',
          type: 'uint80',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'latestRoundData',
      outputs: [
        { internalType: 'uint80', name: 'roundId', type: 'uint80' },
        { internalType: 'int256', name: 'answer', type: 'int256' },
        { internalType: 'uint256', name: 'startedAt', type: 'uint256' },
        { internalType: 'uint256', name: 'updatedAt', type: 'uint256' },
        {
          internalType: 'uint80',
          name: 'answeredInRound',
          type: 'uint80',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'version',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
  ];
  const web3 = new Web3('https://rpc.ankr.com/eth');
  const priceFeed = new web3.eth.Contract(
    aggregatorV3InterfaceABI,
    '0x7bAC85A8a13A4BcD8abb3eB7d6b4d632c5a57676' // address of aggregator contract for matic framework
  );
  const { answer } = await priceFeed.methods.latestRoundData().call();
  const price = Number(answer);
  // here ether is actually matic since price feed is for the matic framework
  return (price / 100000000).toFixed(2);
};
