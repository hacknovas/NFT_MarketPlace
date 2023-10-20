import React, { useState } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../../src/pinata";
import Marketplace from "../NFTMarket.json";
import { Bars, LineWave } from "react-loader-spinner";
const ethers = require("ethers");

export default function SellNFT() {
  const [load, setLoad] = useState(false);
  const [load1, setLoad1] = useState(false);
  const [fileImg, setFileImg] = useState();
  const [fileURL, setFileURL] = useState(null);
  const [displayImage, setdisplayImage] = useState(false);
  const [formPara, setformPara] = useState({
    name: "",
    description: "",
    price: "",
  });

  const changeFile = async (e) => {
    setLoad(true);

    const response = await fetch(
      `https://api.dicebear.com/7.x/adventurer/svg?seed=${formPara.description}`
    );
    const svgData = await response.text();

    // Convert SVG data to a Blob
    const blob = new Blob([svgData], { type: "image/svg+xml" });

    // Create a File object from the Blob
    const fileName = `${formPara.description.substring(0, 4)}.svg`;
    const fileX = new File([blob], fileName, { type: "image/svg+xml" });

    setFileImg(
      `https://api.dicebear.com/7.x/adventurer/svg?seed=${formPara.description}`
    );

    try {
      const response = await uploadFileToIPFS(fileX);

      if (response.success === true) {
        console.log("Uploaded image to Pinata: ", response.pinataURL);
        setFileURL(response.pinataURL);
      }

      console.log("uploaedde");
    } catch (e) {
      console.log("Error during file upload", e);
    }

    setdisplayImage(true);
    setLoad(false);
  };

  async function uploadMetadataToIPFS() {
    const { name, description, price } = formPara;
    //Make sure that none of the fields are empty

    if (!name || !description || !price || !fileURL) {
      return -1;
    }

    const nftJSON = {
      name,
      description,
      price,
      image: fileURL,
    };
    try {
      //upload the metadata JSON to IPFS
      const response = await uploadJSONToIPFS(nftJSON);

      if (response.success === true) {
        console.log("Uploaded JSON to Pinata: ", response);
        return response.pinataURL;
      }
    } catch (e) {
      console.log("error uploading JSON metadata:", e);
    }
  }

  const listNFT = async (e) => {
    setLoad1(true);
    // e.preventDefault();

    try {
      const metadataURL = await uploadMetadataToIPFS();
      if (metadataURL === -1) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      //Pull the deployed contract i
      let contract = new ethers.Contract(
        Marketplace.address,
        Marketplace.abi,
        signer
      );

      //massage the params to be sent to the create NFT request

      const price = ethers.parseUnits(formPara.price, "ether");
      let listingPrice = await contract.getListPrice();
      listingPrice = listingPrice.toString();

      //actually create the NFT
      let transaction = await contract.createToken(metadataURL, price, {
        value: listingPrice,
      });
      await transaction.wait();

      alert("Successfully listed your NFT!");
      setformPara({ name: "", description: "", price: "" });
      // window.location.replace("/");
    } catch (e) {
      alert("Upload error" + e);
    }
    setLoad1(false);
    setdisplayImage(false);
  };

  return (
    <>
      <div className="d-flex flex-wrap " style={{ justifyContent: "center" }}>
        <div
          className="m-5 border-bottom p-3 border-end rounded shadow"
          style={{ width: "40vw", backgroundColor: "#e5e4e487" }}
        >
          <div className="mb-3">
            <label
              htmlFor="exampleFormControlInput1"
              className="text-uppercase form-label text-dark"
            >
              Name for You NFT
            </label>
            <input
              name="name"
              type="text"
              className="form-control"
              id="exampleFormControlInput1"
              placeholder=""
              value={formPara.name}
              onChange={(e) =>
                setformPara({ ...formPara, name: e.target.value })
              }
            />
          </div>
          <label
            htmlFor="exampleFormControlTextarea1"
            className="text-uppercase text-dark form-label"
          >
            Describe your NFT
          </label>
          <div className="mb-3 d-flex">
            <textarea
              name="Description"
              className="form-control"
              id="exampleFormControlTextarea1"
              rows="2"
              value={formPara.description}
              onFocus={() => {
                setdisplayImage(true);
              }}
              onChange={(e) => {
                setformPara({ ...formPara, description: e.target.value });
                setFileImg(
                  `https://api.dicebear.com/7.x/adventurer/svg?seed=${formPara.description}`
                );
              }}
            ></textarea>
            <div onClick={changeFile} className="btn  border">
              Generate NFT (once)
            </div>
          </div>
          <div className="mb-3">
            <label
              htmlFor="exampleFormControlInput1"
              className="font-weight-bold text-uppercase text-dark form-label"
            >
              Price
            </label>
            <input
              name="Price"
              type="text"
              className="form-control"
              id="exampleFormControlInput1"
              placeholder="Enter Price"
              value={formPara.price}
              onChange={(e) =>
                setformPara({ ...formPara, price: e.target.value })
              }
            />
          </div>
          <div className="d-flex">
            {load ? (
              <div className="d-flex">
                <LineWave
                  height="12vh"
                  width="15vw"
                  color="blue"
                  ariaLabel="line-wave"
                  wrapperStyle={{}}
                  visible={true}
                />
              </div>
            ) : (
              <div></div>
            )}
          </div>

          {load1 ? (
            <div className="d-flex" style={{ justifyContent: "center" }}>
              <div>
                <Bars
                  height="40"
                  width="80"
                  color="lightblue"
                  ariaLabel="bars-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                />
                <p style={{ color: "lightblue" }}>
                  <b>Uploading...</b>
                </p>
              </div>
            </div>
          ) : (
            <button
              onClick={listNFT}
              className="bg-grey rounded w-100 "
              id="list-button"
            >
              List NFT
            </button>
          )}
        </div>

        {displayImage ? (
          <div className="m-5 text-center">
            <img
              src={fileImg}
              alt="Failting to preview...Upload another one."
              className="ml-3"
              height="410vh"
              style={{ borderRadius: "50%", backgroundColor: "grey" }}
            ></img>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
