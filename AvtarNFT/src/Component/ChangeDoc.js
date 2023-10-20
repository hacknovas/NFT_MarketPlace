import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Marketplace from "../NFTMarket.json";
import { GetIpfsUrlFromPinata } from "../utils";
import axios from "axios";
import { Oval } from "react-loader-spinner";

export default function ChangeDoc() {
  const par = useParams();
  const [fetch, setFetch] = useState(false);
  const [data, updateData] = useState({});

  const getNFTData = async () => {
    const ethers = require("ethers");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    let contract = new ethers.Contract(
      Marketplace.address,
      Marketplace.abi,
      signer
    );

    var tokenURI = await contract.tokenURI(par.id);
    const listedToken = await contract.getListedforTokenId(par.id);
    tokenURI = GetIpfsUrlFromPinata(tokenURI);
    let meta = await axios.get(tokenURI);
    meta = meta.data;
    console.log(listedToken);

    let item = {
      price: meta.price,
      tokenId: par.id,
      seller: listedToken.seller,
      owner: listedToken.owner,
      image: meta.image,
      name: meta.name,
      description: meta.description,
    };
    console.log(item);

    // console.log(data);
    updateData(item);
  };

  useEffect(() => {
    return () => {
      setFetch(true);
      getNFTData();
      setTimeout(() => {
        setFetch(false);
      }, 1000);
    };
  }, []);

  return (
    <>
      {fetch ? (
        <div>
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
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <div class="card">
            <img class="card-img-top" src={data.image} alt="Card image cap" />
            <div class="card-body">
              <h5 class="card-title">{data.name}</h5>
              <p class="card-text">{data.description}</p>
              <a href="#" class="btn btn-primary">
                {data.price}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
