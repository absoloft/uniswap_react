// src/utils/getUniswapPairAddress.js
import Web3 from 'web3';
import UniswapV2FactoryABI from './UniswapV2FactoryABI.json';

const getUniswapPairAddress = async (contractAddress) => {
    const web3 = new Web3(new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`));
    const factory = new web3.eth.Contract(UniswapV2FactoryABI, '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'); // Uniswap V2 Factory Address

    const WETHAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'; // WETH Contract Address
    const pairAddress = await factory.methods.getPair(contractAddress, WETHAddress).call();
    return pairAddress;
};

export default getUniswapPairAddress;
