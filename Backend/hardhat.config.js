require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

const Alchemy_key = "pvBRRIqjRaGrWQvanqYvwEMcggpJpz2H";
const sepolia_key ="8e3e6175e88b98c07ba0364a415cf2b05f0e36840a123bac9f5806ce72a41593";
module.exports = {
  solidity: "0.8.18",

  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${Alchemy_key}`,
      accounts: [`${sepolia_key}`],
    },
    fuji: {
      url: `https://avalanche-fuji.infura.io/v3/d89390b8cb594a8c960198b6c76dcb2c`,
      accounts: [`8e3e6175e88b98c07ba0364a415cf2b05f0e36840a123bac9f5806ce72a41593`],
    },  
  },
};


// 0x7AB7081638cCD71a3e27066720Af3cC5Bdd87f39
// npx hardhat run scripts/deploy.js --network sepolia
