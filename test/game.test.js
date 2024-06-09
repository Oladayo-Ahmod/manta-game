// test/ArcadeGame.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ArcadeGame", function () {
  let Token, token, ArcadeGame, arcadeGame, owner, addr1, addr2;

  beforeEach(async function () {
    // Deploy the ERC20 token contract
    Token = await ethers.getContractFactory("ArcadeGameToken");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    token = await Token.deploy();
    await token.deployed();

    // Deploy the ArcadeGame contract
    ArcadeGame = await ethers.getContractFactory("ArcadeGame");
    arcadeGame = await ArcadeGame.deploy(token.address, owner.address);
    await arcadeGame.deployed();
  });

  it("Should set the right owner", async function () {
    expect(await arcadeGame.owner()).to.equal(owner.address);
  });

  it("Should allow a player to play the game and level up", async function () {
    await token.transfer(addr1.address, ethers.utils.parseUnits("1000", 18));
    await token.connect(addr1).approve(arcadeGame.address, ethers.utils.parseUnits("100", 18));

    await arcadeGame.connect(addr1).playGame(1000); // Level up should occur here
    const player = await arcadeGame.getPlayerDetails(addr1.address);
    expect(player.level).to.equal(1);
    expect(player.score).to.equal(0); // Remaining score after leveling up
    expect(player.rewards).to.equal(100); // Reward calculation
  });

  it("Should allow a player to claim rewards", async function () {
    await token.transfer(addr1.address, ethers.utils.parseUnits("1000", 18));
    await token.connect(addr1).approve(arcadeGame.address, ethers.utils.parseUnits("100", 18));

    await arcadeGame.connect(addr1).playGame(100); // Play game and earn rewards
    const playerBefore = await arcadeGame.getPlayerDetails(addr1.address);
    expect(playerBefore.rewards).to.equal(10); // Ensure rewards are correct

    await arcadeGame.connect(addr1).claimRewards(); // Claim rewards

    const playerAfter = await arcadeGame.getPlayerDetails(addr1.address);
    expect(playerAfter.rewards).to.equal(0); // Rewards should be reset to 0

    // const balanceAfter = await token.balanceOf(addr1.address);
    // console.log(balanceAfter)
    // expect(balanceAfter).to.equal(ethers.utils.parseUnits("910", 18)); // 910 tokens remaining + 10 tokens rewards
  });


  it("Should allow a player to purchase items", async function () {
    await arcadeGame.addItem("Speed Boost", ethers.utils.parseUnits("10", 18));
    await token.transfer(addr1.address, ethers.utils.parseUnits("1000", 18));
    await token.connect(addr1).approve(arcadeGame.address, ethers.utils.parseUnits("10", 18));

    await arcadeGame.connect(addr1).purchaseItem(0);
    const player = await arcadeGame.getPlayerDetails(addr1.address);
    expect(player.items.length).to.equal(1);
    expect(player.items[0]).to.equal(0);
  });

  it("Should mint an NFT", async function () {
    await arcadeGame.connect(addr1).mintNFT();
    expect(await arcadeGame.ownerOf(0)).to.equal(addr1.address);
  });
});