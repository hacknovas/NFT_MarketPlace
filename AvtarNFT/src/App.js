import ChangeDoc from "./Component/ChangeDoc";
import Footer from "./Component/Footer";
import MarketPlace from "./Component/MarketPlace";
import Navbar from "./Component/Navbar";
import Profile from "./Component/Profile";
import SellNFT from "./Component/SellNFT";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SellCollectible from "./Component/SellCollectible";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<MarketPlace />} />
          <Route path="/sell" element={<SellNFT />} exact />
          <Route path="/sell1" element={<SellCollectible />} exact />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit/:id" element={<ChangeDoc />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
