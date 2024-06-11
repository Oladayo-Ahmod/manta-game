const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ArcadeGame", function () {
  let Token;
  let Game;
  let token;
  let game;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("ArcadeGameToken");
    Game = await ethers.getContractFactory("ArcadeGame");

    [owner, addr1, addr2, _] = await ethers.getSigners();

    token = await Token.deploy(owner.address);
    await token.deployed();

    game = await Game.deploy(token.address, owner.address, ethers.utils.parseUnits("100", 18));
    await game.deployed();

    // Mint tokens for addr1 and addr2 for testing
    await token.mint(addr1.address, ethers.utils.parseUnits("1000", 18));
    await token.mint(addr2.address, ethers.utils.parseUnits("1000", 18));
  });

  it("Should initialize player with airdrop", async function () {
    await game.connect(addr1).initializePlayer(addr1.address);
    const player = await game.getPlayerDetails(addr1.address);
    const balance = await token.balanceOf(addr1.address);

    expect(player.level).to.equal(1);
    expect(balance).to.equal(ethers.utils.parseUnits("1100", 18)); // 1000 initial + 100 airdrop
  });

  it("Should play game and update player details", async function () {
    await game.connect(addr1).initializePlayer(addr1.address);
    await token.connect(addr1).approve(game.address, ethers.utils.parseUnits("100", 18));
    await game.connect(addr1).playGame(1000);

    const player = await game.getPlayerDetails(addr1.address);
    const balance = await token.balanceOf(addr1.address);

    expect(player.level).to.equal(2); // Player should level up
    expect(player.score).to.equal(0); // Remaining score after leveling up
    expect(player.rewards).to.be.above(0); // Reward calculation
    expect(balance).to.equal(ethers.utils.parseUnits("1000", 18)); // 1100 - 100 game cost
  });

  it("Should claim rewards", async function () {
    await game.connect(addr1).initializePlayer(addr1.address);
    await token.connect(addr1).approve(game.address, ethers.utils.parseUnits("100", 18));
    await game.connect(addr1).playGame(1000);

    const playerBeforeClaim = await game.getPlayerDetails(addr1.address);
    const balanceBeforeClaim = await token.balanceOf(addr1.address);

    await game.connect(addr1).claimRewards();

    const playerAfterClaim = await game.getPlayerDetails(addr1.address);
    const balanceAfterClaim = await token.balanceOf(addr1.address);

    expect(playerBeforeClaim.rewards).to.be.above(0); // Player had rewards before claim
    expect(playerAfterClaim.rewards).to.equal(0); // Rewards should be 0 after claim
    expect(balanceAfterClaim).to.be.above(balanceBeforeClaim); // Token balance should increase
  });

  it("Should not allow non-owners to add items", async function () {
    await expect(
      game.connect(addr1).addItem("Sword", 100)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should allow owner to add items", async function () {
    await game.connect(owner).addItem("Sword", 100);
    const items = await game.getItems();
    expect(items.length).to.equal(1);
    expect(items[0].name).to.equal("Sword");
    expect(items[0].power).to.equal(100);
  });

  it("Should purchase item", async function () {
    await game.connect(owner).addItem("Shield", 200);
    await token.connect(addr1).approve(game.address, ethers.utils.parseUnits("200", 18));
    await game.connect(addr1).purchaseItem(0);

    const player = await game.getPlayerDetails(addr1.address);
    expect(player.items.length).to.equal(1);
    expect(player.items[0]).to.equal(0);
  });
});
