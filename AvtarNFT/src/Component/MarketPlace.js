import React, { useEffect, useState } from "react";
import Marketplace from "../NFTMarket.json";
import { GetIpfsUrlFromPinata } from "../utils";
import axios from "axios";
import NFTTile from "../Component/NFTTile";
import { RotatingLines } from "react-loader-spinner";
import NFTPage from "./NFTPage";
import { Link } from "react-router-dom";

export default function MarketPlace() {
  const [fetch, setFetch] = useState(false);
  const sampleData = [
    {
      name: "NFT#1",
      description: "Alchemy's First NFT",
      website: "http://axieinfinity.io",
      image:
        "https://gateway.pinata.cloud/ipfs/QmTsRJX7r5gyubjkdmzFrKQhHv74p5wT9LdeF1m3RTqrE5",
      price: "0.03ETH",
      currentlySelling: "True",
      address: "0xe81Bf5A757CB4f7F82a2F23b1e59bE45c33c5b13",
    },
  ];

  const [data, updateData] = useState(sampleData);
  const [dataFetched, updateFetched] = useState(false);
  const [openWind, setOpenWind] = useState(false);
  const [id, setId] = useState("");

  useEffect(() => {
    async function getAllNFTs() {
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
        //create an NFT Token
        let transaction = await contract.getAllNFTs();

        //Fetch all the details of every NFT from the contract and display
        const items = await Promise.all(
          transaction.map(async (i) => {
            var tokenURI = await contract.tokenURI(i.tokenId);
            console.log("getting this tokenUri", tokenURI);

            tokenURI = GetIpfsUrlFromPinata(tokenURI);
            let meta = await axios.get(tokenURI);
            meta = meta.data;

            let price = ethers.formatUnits(i.price.toString(), "ether");
            let item = {
              price,
              tokenId: i.tokenId,
              seller: i.seller,
              owner: i.owner,
              image: meta.image,
              name: meta.name,
              description: meta.description,
            };
            return item;
          })
        );

        // console.log("get data");

        updateFetched(true);
        updateData(items);
        setFetch(false);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      }
    }

    if (!dataFetched && !fetch) {
      setFetch(true);
      getAllNFTs();
    }
  }, [dataFetched, fetch]);

  // if (!dataFetched) {
  //   getAllNFTs();
  // }

  // useEffect(() => {
  //   return () => {
  //     getAllNFTs();
  //     setFetch(true);
  //   };
  // }, [dataFetched]);

  return (
    <>
      <div
        className="mt-4 mb-4 container d-flex"
        style={{ justifyContent: "space-around", alignItems: "center" }}
      >
        <div>
          <h1>
            <b>Collect/Sell</b>
            <br></br> Your Favourite <br /> Avtar and NFTs
          </h1>
          <div className="btn mt-3 btn-secondary">
            <Link
              to="/sell"
              className="text-light"
              style={{ textDecoration: "none" }}
            >
              Create Your NFT
            </Link>
          </div>
        </div>
        <div>
          <img src="./localFile/just chill.png" height="420vh" alt="NA" />
        </div>
      </div>
      {/*  */}

      <div
        className="m-3 rounded d-flex"
        style={{ backgroundColor: "rgb(27 10 41)" }}
      >
        {fetch ? (
          <div style={{ position: "relative", left: "45vw" }}>
            <RotatingLines
              strokeColor="grey"
              strokeWidth="5"
              animationDuration="0.75"
              width="96"
              visible={true}
            />
          </div>
        ) : (
          <div className="d-flex" style={{ justifyContent: "center" }}>
            <div>
              <div
                className="text-center rounded mb-2 text-uppercase text-light p-3 w-100 "
                style={{ boxShadow: "10px 2px 2px 2px white" }}
              >
                <h4 className="text-center">Listed NFTs</h4>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                {data.map((value, index) => {
                  return (
                    <NFTTile
                      data={value}
                      key={index}
                      wind={setOpenWind}
                      setId={setId}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {openWind ? (
          <div
            style={{
              position: "fixed",
              top: "15vh",
              left: "10vw",
              height: "77vh",
              width: "79vw",
              backgroundColor: "rgba(18,0,41,0.75)",
            }}
            className="rounded border shadow-lg container"
          >
            <NFTPage id={id} setOpenWind={setOpenWind} />
          </div>
        ) : (
          <></>
        )}
      </div>

      {/*  */}

      <div
        className="mt-5 mb-5 p-2 d-flex flex-wrap"
        style={{ justifyContent: "center" }}
      >
        <div className="mt-3">
          <h1>
            <b>Showcase</b> Your Avtar <br />
          </h1>
          <p className="text-end ">
            Buy your first NFT
            <br />
            Here
          </p>
        </div>
        <div>
          <h1>
            <img src="./localFile/arrow.png" height="150vh"></img>
          </h1>
        </div>
      </div>
    </>
  );
}
