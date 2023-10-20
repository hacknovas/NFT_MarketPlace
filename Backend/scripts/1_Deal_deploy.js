const hre = require("hardhat");

async function main() {
  const token = await ethers.getContractFactory("NFTMarketPlace"); //instances contract

  const hardhatTokent = await token.deploy();

  const ContractAdd = await hardhatTokent.getAddress();

  console.log(ContractAdd);
}

main()
  .then(() => {
    console.log("Deployed Successfully");
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
