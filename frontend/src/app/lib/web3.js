
import { ethers } from 'ethers';
import {GAME_ADDRESS,GAME_ABI} from './deployedContracts'
import { toast } from 'react-toastify';


export const getWeb3 = async () => {

  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    const account = await signer.getAddress();
    const contract = new ethers.Contract(GAME_ADDRESS, GAME_ABI, signer);
    return { provider, signer, contract, account };
  } else {
    toast.error('Please install MetaMask!');  
    return null;
  }
};
