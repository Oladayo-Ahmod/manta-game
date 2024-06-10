import { ethers } from 'ethers';
import {ABI,ADDRESS} from './deployedContract'
import { toast } from 'react-toastify';


export const getWeb3 = async () => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(ADDRESS, ABI, signer);
    return { provider, signer, contract };
  } else {
    toast.error('Please install MetaMask!');  
    return null;
  }
};
