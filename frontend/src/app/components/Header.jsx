import React from 'react';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl">Arcade Game</h1>
      <button className="bg-green-500 p-2 rounded">Connect Wallet</button>
    </header>
  );
};

export default Header;
