import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginSignup from "./pages/loginPage/loginPage";
import DashboardPage from "./pages/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import CatagoryList from "./pages/catagory/categoryList";
import BrandList from "./pages/Brand/BrandList";
import AddBrand from "./pages/Brand/addBrand";
import WarehouseList from "./pages/Warehouse/WarehouseList";
import AddWarehouse from "./pages/Warehouse/addWarehouse";
import AddCategory from "./pages/catagory/addCategory";
import "bootstrap/dist/css/bootstrap.min.css";
import OffCanvasMenu from "./pages/Layout/OffCanvasMenu";
import ProtectedRoute from "./utils/protectedRoutes";
import ProductList from "./pages/Product/ProductList";
import AddProduct from "./pages/Product/addProduct";
import { Navigate, Outlet } from 'react-router-dom';

function App() {
const isAuthenticated = localStorage.getItem("accessToken")? true : false;

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={ isAuthenticated? <Navigate to="/dashboard" replace /> : <LoginSignup />} />
          <Route path="/login" element={ isAuthenticated? <Navigate to="/dashboard" replace /> :<LoginSignup />} />
          <Route path="/signup" element={ isAuthenticated? <Navigate to="/dashboard" replace /> :<LoginSignup />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<OffCanvasMenu />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/category" element={<CatagoryList />} />
              <Route path="/addCategory" element={<AddCategory />} />
              <Route path="*" element={<NotFoundPage />} />
              <Route path="/brand" element={<BrandList />} />
              <Route path="/addBrand" element={<AddBrand />} />
              <Route path="/*" element={<NotFoundPage />} />
              <Route path="/warehouse" element={<WarehouseList />} />
               {/* <Route path="/addWarehouse" element={<AddWarehouse />} />  */}
              <Route path="/warehouse/add" element={<AddWarehouse />} />
              <Route path="/product" element={<ProductList />} />
              <Route path="/addProduct" element={<AddProduct />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
