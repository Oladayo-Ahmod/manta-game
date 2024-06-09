// lib/web3.js
import { ethers } from 'ethers';
import ArcadeGameABI from '../artifacts/contracts/ArcadeGame.sol/ArcadeGame.json';

const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with your deployed contract address

export const getWeb3 = async () => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, ArcadeGameABI.abi, signer);
    return { provider, signer, contract };
  } else {
    alert('Please install MetaMask!');
    return null;
  }
};
