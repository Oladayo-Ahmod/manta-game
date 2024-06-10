"use client"
import React, { useEffect,useState } from 'react';
import { getWeb3 } from '../lib/web3';


const Header = () => {

  // useEffect(async()=>{
  //   const connector = await window.ethereum.request({method : 'eth_requestAccounts'})
  //   setAccount(connector[0])
  // })
  

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl">Arcade Game</h1>
      <button className="bg-green-500 p-2 rounded" onClick={getWeb3}>
        connect wallet
      {/* {account ? `${account.slice(0,6)}...${account.slice(account.length -4)}` : 'connect wallet'} */}
      </button>
    </header>
  );
};

export default Header;
