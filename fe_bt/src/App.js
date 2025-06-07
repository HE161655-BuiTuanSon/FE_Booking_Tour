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
import ProductDetail from "./pages/Client/ProductDetail";
import ManageTours from "./pages/Admin/ManageTours";
import PostDetail from "./pages/Client/PostDetail";
import ManageDestination from "./pages/Admin/ManageDestination";
import ManageDeparturePoint from "./pages/Admin/ManageDeparturePoint";
import ManageTourCategory from "./pages/Admin/ManageTourCategory";
import ManageShop from "./pages/Admin/ManageShop";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loginadmin" element={<LoginAdmin />} />
        <Route path="/about" element={<About />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/post-detail/:postId" element={<PostDetail />} />
        <Route path="/booked" element={<BookedTour />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:productId" element={<ProductDetail />} />
        <Route path="/manageTour" element={<ManageTours />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/manage-destination" element={<ManageDestination />} />
        <Route
          path="/manage-departure-point"
          element={<ManageDeparturePoint />}
        />
        <Route path="/manage-shop" element={<ManageShop />} />
        <Route path="/manage-tour-category" element={<ManageTourCategory />} />
        <Route path="/authorization" element={<Authorization />} />
        <Route path="/tour/tour-detail/:tourId" element={<TourDetail />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
