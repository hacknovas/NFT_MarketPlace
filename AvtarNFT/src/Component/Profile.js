import React, { useEffect, useState } from "react";
import MarketPlace from "../NFTMarket.json";
import { GetIpfsUrlFromPinata } from "../utils";
import axios from "axios";
import { InfinitySpin, Oval } from "react-loader-spinner";
import NFTTile from "./NFTTile";
import NFTPage from "./NFTPage";

export default function Profile() {
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
  const [openWind, setOpenWind] = useState(false);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState("");

  const getMyNft = async () => {
    setEdit(true);
    const ethers = require("ethers");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(
      MarketPlace.address,
      MarketPlace.abi,
      signer
    );

    const myToken = await contract.getMyNFT();

    const items = await Promise.all(
      myToken.map(async (i) => {
        // console.log(i.tokenId);
        var tokenURI = await contract.tokenURI(i.tokenId);
        // console.log("getting this tokenUri", tokenURI);

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

    // console.log(items);
    updateData(items);
  };

  useEffect(() => {
    return () => {
      setOpenWind(false);
      setFetch(true);
      getMyNft();
      setTimeout(() => {
        setFetch(false);
      }, 1500);
    };
  }, []);

  return (
    <>
      {fetch ? (
        <div
          className="d-flex flex-wrap"
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            // position:'relative'
          }}
        >
          <Oval
            height={80}
            width={80}
            color="lightblue"
            wrapperStyle={{}}
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="lightgrey"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      ) : (
        <div
          className="d-flex flex-wrap"
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            fontWeight: "bold",
            flexDirection: "column",
          }}
        >
          <h3 className="border-bottom"> Your Avtar</h3>
          <div
            className="d-flex flex-wrap"
            style={{
              flexDirection: "row",
            }}
          >
            {data.map((value, index) => {
              return (
                <NFTTile
                  data={value}
                  key={index}
                  wind={setOpenWind}
                  setId={setId}
                  edit={edit}
                />
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
