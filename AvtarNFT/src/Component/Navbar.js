import React, { useContext, useEffect } from "react";
import { ethers } from "ethers";
import { conApp } from "../StateManager/ContextAPI";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { userAdd, setUserAdd } = useContext(conApp);

  const connectWallet = async () => {
    if (window.ethereum) {
      const Provider = new ethers.BrowserProvider(window.ethereum);

      const signer = await Provider.getSigner();

      setUserAdd(signer.address);
    } else {
      alert("Metamask Not Installed");
    }
  };

  useEffect(() => {
    return () => {
      connectWallet();
    };
  });

  return (
    <>
      <div
        style={{
          top: "0px",
          position: "sticky",
        }}
      >
        <nav className="navbar shadow-sm ">
          <div className="container">
            <Link to="/" className="navbar-brand">
              <b className="">AvtarNFT</b>
            </Link>
            <div className="d-flex" role="search">
              <Link
                to="/sell"
                className="navbar-brand badge text-dark mt-2 shadow-sm"
              >
                Sell NFT
              </Link>
              <button
                className="btn shadow-sm"
                type="submit"
                onClick={connectWallet}
              >
                {userAdd === "" ? (
                  <b>connect to wallet</b>
                ) : (
                  <Link to="/profile" style={{textDecoration:"none",color:"black",fontWeight:"bold"}}>
                    {userAdd.substring(0, 4) +
                      ".." +
                      userAdd.substring(userAdd.length - 5, userAdd.length)}
                  </Link>
                )}
              </button>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
