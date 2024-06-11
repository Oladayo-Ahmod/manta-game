// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Counters.sol";

contract ArcadeGame is ERC721, Ownable {
    using Counters for Counters.Counter;

    struct Player {
        uint256 score;
        uint256 rewards;
        uint256 level;
        uint256[] items;
    }

    struct Item {
        uint256 id;
        string name;
        uint256 power;
    }

    IERC20 public token;
    Counters.Counter private _itemIdCounter;
    Counters.Counter private _nftIdCounter;
    uint256 public gameCost;
    uint256 public levelUpScore;
    uint256 public initialAirdropAmount;

    mapping(address => Player) public players;
    mapping(uint256 => Item) public items;
    mapping(uint256 => address) public nftOwners;

    event GamePlayed(address indexed player, uint256 score, uint256 level);
    event RewardsClaimed(address indexed player, uint256 rewards);
    event ItemAdded(uint256 indexed itemId, string name, uint256 power);
    event ItemPurchased(address indexed player, uint256 indexed itemId);
    event LevelUp(address indexed player, uint256 newLevel);

    constructor(address _token, address _initialOwner, uint256 _initialAirdropAmount) 
    ERC721("ArcadeGameToken", "AGT") 
    Ownable(_initialOwner) {
        token = IERC20(_token);
        gameCost = 10 * 10**18; // cost in tokens
        levelUpScore = 1000; // Score needed to level up
        initialAirdropAmount = _initialAirdropAmount; // Initial airdrop amount for new players
    }

    function initializePlayer(address playerAddress) public {
        if (players[playerAddress].level == 0 && players[playerAddress].score == 0 && players[playerAddress].rewards == 0) {
            players[playerAddress] = Player(0, 0, 1, new uint256[](0)); // Initialize player with default values
            require(token.transfer(playerAddress, initialAirdropAmount), "Airdrop failed"); // Airdrop tokens to new player
        }
    }

    function playGame(uint256 _score) public {
        require(token.balanceOf(msg.sender) >= gameCost, "Insufficient tokens to play");
        require(token.transferFrom(msg.sender, address(this), gameCost), "Token transfer failed");

        initializePlayer(msg.sender); // Ensure player is initialized

        Player storage player = players[msg.sender];
        player.score += _score;

        // Calculate a pseudo-random reward between 1 and 100
        uint256 randomReward = (uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, msg.sender))) % 100) + 1;
        player.rewards += randomReward;

        if (player.score >= levelUpScore) {
            player.level++;
            player.score -= levelUpScore;
            emit LevelUp(msg.sender, player.level);
        }

        emit GamePlayed(msg.sender, _score, player.level);
    }

    function claimRewards() external {
        Player storage player = players[msg.sender];
        uint256 rewards = player.rewards;
        require(rewards > 0, "No rewards to claim");

        player.rewards = 0;
        require(token.transfer(msg.sender, rewards), "Reward transfer failed");

        emit RewardsClaimed(msg.sender, rewards);
    }

    function mintNFT() public {
        uint256 nftId = _nftIdCounter.current();
        _nftIdCounter.increment();

        _mint(msg.sender, nftId);
        nftOwners[nftId] = msg.sender;
    }

    function addItem(string memory _name, uint256 _power) external onlyOwner {
        uint256 itemId = _itemIdCounter.current();
        _itemIdCounter.increment();

        items[itemId] = Item(itemId, _name, _power);
        emit ItemAdded(itemId, _name, _power);
    }

    function purchaseItem(uint256 _itemId) external {
        Item memory item = items[_itemId];
        require(token.balanceOf(msg.sender) >= item.power, "Insufficient tokens to purchase item");
        require(token.transferFrom(msg.sender, address(this), item.power), "Token transfer failed");

        players[msg.sender].items.push(_itemId);
        emit ItemPurchased(msg.sender, _itemId);
    }

    function getPlayerDetails(address _player) external view returns (Player memory) {
        require(players[_player].level != 0 || players[_player].score != 0 || players[_player].rewards != 0, "Player not initialized");
        return players[_player];
    }

    function getItems() external  view returns (Item[] memory) {
        uint256 itemCount = _itemIdCounter.current();
        Item[] memory itemList = new Item[](itemCount);

        for (uint256 i = 0; i < itemCount; i++) {
            itemList[i] = items[i];
        }

        return itemList;
    }

    function setGameCost(uint256 _gameCost) external onlyOwner {
        gameCost = _gameCost;
    }

    function setLevelUpScore(uint256 _levelUpScore) external onlyOwner {
        levelUpScore = _levelUpScore;
    }

    function setInitialAirdropAmount(uint256 _initialAirdropAmount) external onlyOwner {
        initialAirdropAmount = _initialAirdropAmount;
    }
}
