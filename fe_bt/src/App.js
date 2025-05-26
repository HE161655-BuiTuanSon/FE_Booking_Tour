import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Client/Home";
import Tours from "./pages/Client/Tours";
import About from "./pages/Client/About";
import Posts from "./pages/Client/Posts";
import Shop from "./pages/Client/Shop";
import Contact from "./pages/Client/Contact";
import Dashboard from "./pages/Admin/Dashboard";
import Authorization from "./components/authorization/Authorization";
import BookedTour from "./pages/Client/BookedTour";
import LoginAdmin from "./pages/Admin/LoginAdmin";
import TourDetail from "./pages/Client/TourDetail";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loginadmin" element={<LoginAdmin />} />
        <Route path="/about" element={<About />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/booked" element={<BookedTour />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/authorization" element={<Authorization />} />
        <Route path="/tour/tour-detail/:tourId" element={<TourDetail />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
