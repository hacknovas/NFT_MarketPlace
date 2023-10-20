import React, { useEffect, useState } from "react";
import { GetIpfsUrlFromPinata } from "../utils";
import axios from "axios";
import Marketplace from "../NFTMarket.json";  
import { ProgressBar, RotatingLines } from "react-loader-spinner";

export default function NFTPage({ id, setOpenWind }) {
  const [data, updateData] = useState({});
  const [start, setStart] = useState(false);
  const [fetch, setFetch] = useState(false);
  const [currAddress, updateCurrAddress] = useState("0x");

  async function getNFTData(tokenId) {
    const ethers = require("ethers");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    let contract = new ethers.Contract(
      Marketplace.address,
      Marketplace.abi,
      signer
    );

    var tokenURI = await contract.tokenURI(tokenId);
    const listedToken = await contract.getListedforTokenId(tokenId);
    tokenURI = GetIpfsUrlFromPinata(tokenURI);
    let meta = await axios.get(tokenURI);
    meta = meta.data;
    console.log(listedToken);

    let item = {
      price: meta.price,
      tokenId: tokenId,
      seller: listedToken.seller,
      owner: listedToken.owner,
      image: meta.image,
      name: meta.name,
      description: meta.description,
    };
    console.log(item);

    updateData(item);
  }

  async function buyNFT(tokenId) {
    setStart(true);
    try {
      const ethers = require("ethers");
      //After adding your Hardhat network to your metamask, this code will get providers and signers
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      //Pull the deployed contract instance
      let contract = new ethers.Contract(
        Marketplace.address,
        Marketplace.abi,
        signer
      );
      const salePrice = ethers.parseUnits(data.price, "ether");
      //   updateMessage("Buying the NFT... Please Wait (Upto 5 mins)");
      //run the executeSale function
      let transaction = await contract.executeSale(tokenId, {
        value: salePrice,
      });
      await transaction.wait();

      alert("You successfully bought the NFT!");
    } catch (e) {
      alert("Upload Error" + e);
    }
    setStart(false);
  }

  useEffect(() => {
    return () => {
      getNFTData(id);
      setFetch(true);
      setTimeout(() => {
        setFetch(false);
      }, 1500);
    };
  }, [id]);

  return (
    <>
      {fetch ? (
        <div className="text-center">
          <ProgressBar
            height="80"
            width="80"
            ariaLabel="progress-bar-loading"
            wrapperStyle={{}}
            wrapperClass="progress-bar-wrapper"
            borderColor="white"
            barColor="white"
          />
        </div>
      ) : (
        <main style={{ position: "relative" }}>
          <div>
            <div
              onClick={() => {
                setOpenWind(false);
              }}
            >
              <h4 className="text-light " style={{ cursor: "pointer" }}>
                &#10008;
              </h4>
            </div>

            <div
              className="d-flex flex-wrap container border-bottom rounded p-2"
              style={{ justifyContent: "space-evenly" }}
            >
              <div>
                <img src={data.image} alt="NA" width="320vw" height="320vh" />
              </div>

              {/* <div className="border-start"></div> */}
              <div className="text-light border-start  p-2 mt-3">
                <div>
                  <b>Name:</b>
                  <br></br> {data.name}
                </div>
                <br />
                <div>
                  <b>Description: </b>
                  <br></br>
                  {data.description}
                </div>
                <br />
                <div>
                  <b>Price:</b> <br></br>
                  <span className="">{data.price + " ETH"}</span>
                </div>
                <br />
                <div>
                  <b>Owner:</b> <span className="text-sm">{data.owner}</span>
                </div>
                <div>
                  <b>Seller: </b>
                  <span className="text-sm">{data.seller}</span>
                </div>
              </div>
            </div>

            <div className="text-center text-light mt-4 ">
              {currAddress != data.owner && currAddress != data.seller ? (
                <span
                  className="border p-2 "
                  onClick={() => buyNFT(id)}
                  style={{ cursor: "pointer", backgroundColor: "#362955" }}
                >
                  {start ? <b>Buying...</b> : <b>Make it Yours</b>}
                </span>
              ) : (
                <div>You are the owner of this NFT</div>
              )}
            </div>
            <div className="text-center text-light mt-4">{"message"}</div>
          </div>
        </main>
      )}
    </>
  );
}
