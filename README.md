

# ArcadeGame

## Overview

ArcadeGame is a blockchain-based gaming platform on the Manta blockchain built with Solidity, where players can play games, earn rewards, and purchase items using an ERC20 token of the contract (AGT). This project leverages OpenZeppelin's ERC20 and ERC721 standards, along with custom game logic to provide an engaging experience.

## Features

- **Player Initialization**: New players receive an airdrop of tokens upon initialization.
- **Play Game**: Players can play games to earn rewards and level up.
- **Claim Rewards**: Players can claim their accumulated rewards.
- **Mint NFTs**: Players can mint NFTs representing their in-game achievements.
- **Add Items**: The game owner can add items that players can purchase.
- **Purchase Items**: Players can use their tokens to purchase in-game items.

## Contracts

### `ArcadeGameToken.sol`

An ERC20 token contract used as the in-game currency.

### `ArcadeGame.sol`

The main game contract that handles player actions, rewards, and items. Inherits from ERC721 for minting NFTs.

## Prerequisites

- Node.js (>= 12.x)
- Hardhat
- NPM or Yarn

## Setup

1. Clone the repository:

```sh
git clone https://github.com/Oladayo-Ahmod/manta-game.git
cd manta-game
```

2. Install dependencies:

```sh
npm install
# or
yarn install
```
cd frontend

```sh
npm install
# or
yarn install
```


3. Compile the contracts:

```sh
npx hardhat compile
```

## Running Tests

To run the tests, execute:

```sh
npx hardhat test
```

## Contract Deployment

To deploy the contracts to a network, follow these steps:

1. Create a `.env` file in the project root and add your private key by following `.env.example` file.



2. Modify the `hardhat.config.js` file to include your network configuration.

3. Deploy the contracts:

```sh
npx hardhat deploy --network your-network
```

## Hardhat Tasks

### Compile

```sh
npx hardhat compile
```

### Test

```sh
npx hardhat test
```