const { expect } = require("chai");

describe("Deal with Land", () => {
  it("try to deploy", async () => {
    const [owner] = await ethers.getSigners();

    const token = await ethers.getContractFactory("NFTMarketPlace"); //instances contract

    const hardhatTokent = await token.deploy();

    const addressContract = await hardhatTokent.getAddress();

    console.log(addressContract);
  });

  it("deploy on local with data on src", async () => {
    const token = await ethers.getContractFactory("NFTMarketPlace"); //instances contract

    const hardhatTokent = await token.deploy();

    const data = {
      address: hardhatTokent.address,
      abi: JSON.parse(hardhatTokent.interface.format("json")),
    };

    fs.writeFileSync(
      "../../landdeals/src/NFTMarketPlace.json",
      JSON.stringify(data)
    );
  });
});
