import React from "react";

export default function Footer() {
  return (
    <>
      <nav
        className="border-top rounded"
        style={{
          backgroundColor: "rgb(240,249,250)",
        }}
      >
        <div class="m-3 navbar  navbar-expand-lg navbar-light bg-grey">
          <div class="container">
            <a class="navbar-brand" href="/">
              Blockchain Powered @AvtarNFT
            </a>
            <div>Created by @Doni_Prathamesh</div>
          </div>
        </div>
        <div className="mb-2 container text-center">
          Copyright © 2023 HackNovas - All rights reserved.
        </div>
      </nav>
    </>
  );
}
