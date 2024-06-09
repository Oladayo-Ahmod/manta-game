import React, { useEffect, useState } from 'react';
import { getWeb3 } from '../lib/web3';

const Game = () => {
  const [player, setPlayer] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const init = async () => {
      const web3 = await getWeb3();
      if (web3) {
        const { contract } = web3;
        setContract(contract);
        const player = await contract.players(window.ethereum.selectedAddress);
        setPlayer(player);
      }
    };
    init();
  }, []);

  const playGame = async () => {
    await contract.playGame(100); // example score
  };

  const claimRewards = async () => {
    await contract.claimRewards();
  };

  if (!player) return <div>Loading...</div>;

  return (
    <div className="p-4 bg-white bg-opacity-75 rounded">
      <h2 className="text-xl mb-4">Player Details</h2>
      <p>Score: {player.score.toString()}</p>
      <p>Rewards: {player.rewards.toString()}</p>
      <p>Level: {player.level.toString()}</p>
      <button className="bg-blue-500 p-2 rounded mt-4" onClick={playGame}>
        Play Game
      </button>
      <button className="bg-yellow-500 p-2 rounded mt-4" onClick={claimRewards}>
        Claim Rewards
      </button>
    </div>
  );
};

export default Game;
