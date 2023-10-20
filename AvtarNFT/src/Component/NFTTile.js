import { useState } from "react";
import { GetIpfsUrlFromPinata } from "../utils";
import { Link } from "react-router-dom";

function NFTTile(prop) {
  const IPFSUrl = GetIpfsUrlFromPinata(prop.data.image);
  const [isHover, setIsHover] = useState(false);

  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };

  const boxStyle = {
    height: "230px",
    width: "230px",
    cursor: "pointer",
    backgroundColor: isHover ? "light" : "white",
    color: isHover ? "red" : "green",
    // position: "relative",
  };

  return (
    <div
      onClick={() => {
        prop.wind(true);
        prop.setId(prop.data.tokenId);
      }}
      className="text-center rounded m-3 p-4"
      style={boxStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div>
        {prop.edit ? (
          <Link
            to={"/edit/" + prop.data.tokenId}
            className="text-dark d-block text-end"
            style={{ textDecoration: "none" }}
          >
            &#9998;
          </Link>
        ) : (
          <></>
        )}
        <img
          src={IPFSUrl}
          alt="NA"
          height="130vh"
          width="130vw"
          crossOrigin="anonymous"
        />
        <div className="text-dark ">
          <strong
            className="text-xl text-uppercase "
            style={{ textDecoration: "none" }}
          >
            {prop.data.name}
          </strong>
          <p className="display-inline" style={{ textDecoration: "none" }}>
            {prop.data.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default NFTTile;
