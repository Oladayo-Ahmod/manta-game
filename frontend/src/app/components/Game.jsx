"use client"

import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getWeb3 } from '../lib/web3';
import { TOKEN_ADDRESS,TOKEN_ABI } from '../lib/deployedContracts';
import { toast } from 'react-toastify';

const Game = () => {
  const [player, setPlayer] = useState(null);
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tokenBalance, setTokenBalance] = useState()

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();
      if (web3) {
        const { provider, signer, contract } = web3;
        const tokenAddress = TOKEN_ADDRESS;
        const tokenContract = new ethers.Contract(tokenAddress, TOKEN_ABI, signer);
        setProvider(provider);
        setSigner(signer);
        setContract(contract);
        setTokenContract(tokenContract);
        const playerAddress = await signer.getAddress();
        try {
          const player = await contract.getPlayerDetails(playerAddress);
          let balance = await tokenContract.balanceOf(playerAddress);
          balance = ethers.utils.formatUnits(balance.toString(),'ether')
          balance = Math.round(balance)
          setTokenBalance(balance);
          setPlayer(player);
        } catch (error) {
          console.error(error);
          // Handle the case where player is not initialized
          setPlayer(null);
        }
        
      }
    };
    init();
  }, []);

  const initialize =async()=>{
    const playerAddress = await signer.getAddress();
    await contract.initializePlayer(playerAddress)
    const player = await contract.getPlayerDetails(playerAddress);
    setPlayer(player)
    console.log(player,'here')
  }

  const approveTokens = async (amount) => {
    setLoading(true);
    try {
      const tx = await tokenContract.approve(contract.address, ethers.utils.parseUnits(amount.toString(), 18));
      await tx.wait();
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const playGame = async (score) => {
    setLoading(true);
    try {
      const gameCost = ethers.utils.parseUnits("100", 18); // Example game cost
      await approveTokens(100); // Approving 100 tokens to be spent by the contract
      const tx = await contract.playGame(score);
      await tx.wait();
      const updatedPlayer = await contract.players(await signer.getAddress());
      let balance = await tokenContract.balanceOf(await signer.getAddress());
      balance = ethers.utils.formatUnits(balance.toString(),'ether')
      balance = Math.round(balance)
      setTokenBalance(balance);
      setPlayer(updatedPlayer);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  if (!player) return <button className='bg-primary text-white font-bold py-2 px-4 rounded'
   onClick={initialize}>Enter Game</button>;

  return (
    <div className="p-4 bg-white bg-opacity-75 rounded">
      <h2 className="text-xl mb-4">Player Details</h2>
      <p>Score: {player.score.toString()}</p>
      <p>Rewards: {player.rewards.toString()}</p>
      <p>Level: {player.level.toString()}</p>
      <p>Token balance : {`${tokenBalance} AGT`}</p>
      <button 
        className="bg-blue-500 p-2 rounded mt-4" 
        onClick={() => playGame(1000)} 
        disabled={loading}
      >
        Play Game
      </button>
    </div>
  );
};

export default Game;
