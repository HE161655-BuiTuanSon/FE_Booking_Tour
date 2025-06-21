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
import ManageTransportationMethods from "./pages/Admin/ManageTransportationMethods";
import ManagePost from "./pages/Admin/ManagePost";
import ListConsultation from "./pages/Admin/ListConsultation";
import Chatbot from "./components/Chatbot";
import Booking from "./pages/Client/Booking";
import ListBooking from "./pages/Admin/ListBooking";

const ClientLayout = ({ children }) => (
  <div className="relative">
    {children}
    <Chatbot />
  </div>
);
function App() {
  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <ClientLayout>
              <Home />
            </ClientLayout>
          }
        />
        <Route path="/list-booking" element={<ListBooking />} />
        <Route path="/loginadmin" element={<LoginAdmin />} />
        <Route
          path="/about"
          element={
            <ClientLayout>
              <About />
            </ClientLayout>
          }
        />
        <Route
          path="/tours"
          element={
            <ClientLayout>
              <Tours />
            </ClientLayout>
          }
        />
        <Route
          path="/posts"
          element={
            <ClientLayout>
              <Posts />
            </ClientLayout>
          }
        />
        <Route
          path="/posts/post-detail/:postId"
          element={
            <ClientLayout>
              <PostDetail />
            </ClientLayout>
          }
        />
        <Route
          path="/booked"
          element={
            <ClientLayout>
              <BookedTour />
            </ClientLayout>
          }
        />
        <Route
          path="/shop"
          element={
            <ClientLayout>
              <Shop />
            </ClientLayout>
          }
        />
        Add commentMore actions
        <Route
          path="/shop/:productId"
          element={
            <ClientLayout>
              <ProductDetail />
            </ClientLayout>
          }
        />
        <Route path="/manage-tour" element={<ManageTours />} />
        <Route
          path="/contact"
          element={
            <ClientLayout>
              <Contact />
            </ClientLayout>
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/manage-destination" element={<ManageDestination />} />
        <Route
          path="/manage-departure-point"
          element={<ManageDeparturePoint />}
        />
        <Route
          path="/manage-method"
          element={<ManageTransportationMethods />}
        />
        <Route path="/tours/:tourId/booking" element={<Booking />} />
        <Route path="/list-reviews" element={<ListConsultation />} />
        <Route path="/manage-post" element={<ManagePost />} />
        <Route path="/manage-shop" element={<ManageShop />} />
        <Route path="/manage-tour-category" element={<ManageTourCategory />} />
        <Route path="/authorization" element={<Authorization />} />
        <Route
          path="/tour/tour-detail/:tourId"
          element={
            <ClientLayout>
              <TourDetail />
            </ClientLayout>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
