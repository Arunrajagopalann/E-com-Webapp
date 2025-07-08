
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginSignup from "./pages/loginPage/loginPage";
import DashboardPage from "./pages/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import CatagoryList from "./pages/catagory/catagoryList";
import AddCategory from "./pages/catagory/addCatagory";
import { AuthProvider } from "./context/AuthContext";
import BrandList from "./pages/Brand/BrandList";
import Warehouse from "./pages/Warehouse/WarehouseList";
import Product from "./pages/Product/Product";
import AddBrand from "./pages/Brand/addBrand";
import WarehouseList from "./pages/Warehouse/WarehouseList";
import AddWarehouse from "./pages/Warehouse/addWarehouse";


function App() {
  return (
    <Router>
      <div className="App">
        <DashboardPage />
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/signup" element={<LoginSignup />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/category" element={<CatagoryList />} />
          <Route path="/addCategory" element={<AddCategory />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/Brand" element={<BrandList />} />
          <Route path="/Warehouse" element={<Warehouse />} />
          <Route path="/Product" element={<Product/>} />
          <Route path="/addBrand" element={<AddBrand />} />
          <Route path="/*" element={<NotFoundPage />} />
          <Route path="/warehouse" element={<WarehouseList />} />
          <Route path="/addWarehouse" element={<AddWarehouse />} />
        </Routes>
      </div>
    </Router>
    // <AuthProvider>
    //   <div className="App">
    //     <LoginSignup/>
    //   </div>
    // </AuthProvider>
  );
}

export default App;
