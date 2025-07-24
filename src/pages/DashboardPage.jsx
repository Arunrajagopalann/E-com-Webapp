import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import ApiDebugger from "../components/ApiDebugger";

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // Dashboard stats
  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalBrands: 0,
    totalWarehouses: 0, // Changed from featuredProducts to totalWarehouses
  });

  // Add effect to monitor dashboardStats changes
  useEffect(() => {
    console.log("Dashboard stats updated:", dashboardStats);
  }, [dashboardStats]);

  // Products data
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API Base URL - make sure this is correct
  const API_BASE = "http://localhost:8001/api/v1";
  const isDev = process.env.NODE_ENV !== "production";
  console.log("Using API base URL:", API_BASE);

  // Development helper function to display API response structure
  const debugApiResponse = (label, data) => {
    if (isDev && data) {
      const structure = {};
      if (Array.isArray(data)) {
        structure.type = "array";
        structure.length = data.length;
        structure.sample = data.length > 0 ? Object.keys(data[0]) : [];
      } else {
        structure.type = "object";
        structure.keys = Object.keys(data);
        structure.hasData = "data" in data;
        structure.hasSuccess = "success" in data;
        if (structure.hasData) {
          structure.dataType = data.data === null ? "null" : typeof data.data;
          structure.isArray = Array.isArray(data.data);
          if (structure.isArray) {
            structure.length = data.data.length;
          }
        }
      }
      console.log(`API STRUCTURE [${label}]:`, structure);
    }
  };

  // Backend API paths - based on code analysis from the actual backend
  // The backend uses /products (plural) not /product (singular)
  const CORRECT_API_PATHS = {
    products: `${API_BASE}/products`,
    categories: `${API_BASE}/category`,
    brands: `${API_BASE}/brand`,
    warehouses: `${API_BASE}/warehouse`, // Added warehouse endpoint
  };

  // Check if API is available by trying different endpoints
  useEffect(() => {
    const checkApiAvailability = async () => {
      try {
        console.log("Checking API availability...");

        // Try multiple potential endpoints to see if any respond
        const endpoints = [
          `${API_BASE}`,
          `${API_BASE}/product`,
          `${API_BASE}/category`,
          `${API_BASE}/brand`,
        ];

        let serverReachable = false;

        // Test each endpoint
        for (const endpoint of endpoints) {
          try {
            const response = await fetch(endpoint, { method: "HEAD" });
            if (response) {
              console.log(
                `API endpoint ${endpoint} is reachable with status: ${response.status}`
              );
              serverReachable = true;
              break;
            }
          } catch (err) {
            console.log(`Endpoint ${endpoint} check failed:`, err.message);
          }
        }

        if (!serverReachable) {
          console.error("API server is not reachable at any tested endpoint");
          setError(
            "Cannot connect to API server. Please check if the backend is running at port 8001."
          );
        }
      } catch (error) {
        console.error("API availability check failed:", error);
        setError(
          "Cannot connect to API server. Please check if the backend is running."
        );
      }
    };

    checkApiAvailability();
  }, []);

  // Fetch products and stats from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Starting API data fetch using correct paths");
        console.log("Products path:", CORRECT_API_PATHS.products);
        console.log("Categories path:", CORRECT_API_PATHS.categories);
        console.log("Brands path:", CORRECT_API_PATHS.brands);

        // Only use mock data as fallback when API is not available
        const useMockData = false; // Now trying to use real data from API

        // Mock data for fallback only
        const mockData = {
          products: {
            success: true,
            data: [
              {
                _id: "prod1",
                name: "Product 1",
                price: 299,
                stock: 10,
                status: "ACTIVE",
                categoryName: "Electronics",
              },
              {
                _id: "prod2",
                name: "Product 2",
                price: 399,
                stock: 5,
                status: "ACTIVE",
                categoryName: "Fashion",
              },
              {
                _id: "prod3",
                name: "Product 3",
                price: 199,
                stock: 0,
                status: "OUT_OF_STOCK",
                categoryName: "Home",
              },
              {
                _id: "prod4",
                name: "Featured Item",
                price: 599,
                stock: 20,
                status: "FEATURED",
                categoryName: "Electronics",
              },
            ],
          },
          categories: {
            success: true,
            data: [
              { _id: "cat1", name: "Electronics" },
              { _id: "cat2", name: "Fashion" },
              { _id: "cat3", name: "Home" },
            ],
          },
          brands: {
            success: true,
            data: [
              { _id: "brand1", name: "Apple" },
              { _id: "brand2", name: "Samsung" },
              { _id: "brand3", name: "Nike" },
              { _id: "brand4", name: "Adidas" },
            ],
          },
        };

        // Create an array to hold all API fetch promises
        const promises = [
          // Try to fetch real data first, fallback to mock data if errors occur
          fetch(CORRECT_API_PATHS.products)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Products API error: ${response.status}`);
              }
              return response.json();
            })
            .then((data) => {
              console.log("Products API response:", data);
              debugApiResponse("products", data);
              return { type: "products", data };
            })
            .catch((error) => {
              console.error("Products fetch error:", error);
              // Only use mock data as fallback when API fails
              return useMockData
                ? { type: "products", data: mockData.products }
                : { type: "products", error };
            }),

          // Fetch categories
          fetch(CORRECT_API_PATHS.categories)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Categories API error: ${response.status}`);
              }
              return response.json();
            })
            .then((data) => {
              console.log("Categories API response:", data);
              debugApiResponse("categories", data);
              return { type: "categories", data };
            })
            .catch((error) => {
              console.error("Categories fetch error:", error);
              // Only use mock data as fallback when API fails
              return useMockData
                ? { type: "categories", data: mockData.categories }
                : { type: "categories", error };
            }),

          // Fetch brands
          fetch(CORRECT_API_PATHS.brands)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Brands API error: ${response.status}`);
              }
              return response.json();
            })
            .then((data) => {
              console.log("Brands API response:", data);
              debugApiResponse("brands", data);
              return { type: "brands", data };
            })
            .catch((error) => {
              console.error("Brands fetch error:", error);
              // Only use mock data as fallback when API fails
              return useMockData
                ? { type: "brands", data: mockData.brands }
                : { type: "brands", error };
            }),

          // Fetch warehouses
          fetch(CORRECT_API_PATHS.warehouses)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Warehouses API error: ${response.status}`);
              }
              return response.json();
            })
            .then((data) => {
              console.log("Warehouses API response:", data);
              debugApiResponse("warehouses", data);
              return { type: "warehouses", data };
            })
            .catch((error) => {
              console.error("Warehouses fetch error:", error);
              // No mock data for warehouses, just return the error
              return { type: "warehouses", error };
            }),
        ];

        // Wait for all API calls to complete
        const results = await Promise.all(promises);

        // Process results
        let productsData, categoriesData, brandsData, warehousesData;
        let hasErrors = false;

        // Extract data from results
        results.forEach((result) => {
          if (result.error) {
            hasErrors = true;
          }

          if (result.type === "products") {
            productsData = result.error ? null : result.data;
          } else if (result.type === "categories") {
            categoriesData = result.error ? null : result.data;
          } else if (result.type === "brands") {
            brandsData = result.error ? null : result.data;
          } else if (result.type === "warehouses") {
            warehousesData = result.error ? null : result.data;
          }
        });

        // Initialize stats and products
        let products = [];
        let warehouses = [];
        let stats = {
          totalProducts: 0,
          totalCategories: 0,
          totalBrands: 0,
          totalWarehouses: 0,
        };

        // Process products data
        if (productsData) {
          console.log("Processing products data:", productsData);

          // More flexible data extraction - check multiple possible paths
          let productArray = [];

          // Check all possible paths for product data
          if (Array.isArray(productsData)) {
            // Direct array response
            productArray = productsData;
            console.log("Found product array directly:", productArray.length);
          } else if (productsData.data && Array.isArray(productsData.data)) {
            // Standard {data: [...]} pattern
            productArray = productsData.data;
            console.log(
              "Found product array in data property:",
              productArray.length
            );
          } else if (
            productsData.data?.data &&
            Array.isArray(productsData.data.data)
          ) {
            // Nested {data: {data: [...]}} pattern
            productArray = productsData.data.data;
            console.log(
              "Found product array in nested data property:",
              productArray.length
            );
          } else if (
            productsData.results &&
            Array.isArray(productsData.results)
          ) {
            // {results: [...]} pattern
            productArray = productsData.results;
            console.log(
              "Found product array in results property:",
              productArray.length
            );
          } else if (
            productsData.products &&
            Array.isArray(productsData.products)
          ) {
            // {products: [...]} pattern
            productArray = productsData.products;
            console.log(
              "Found product array in products property:",
              productArray.length
            );
          } else if (
            productsData.success === true &&
            productsData.data === null
          ) {
            // Success but empty data
            productArray = [];
            console.log("API returned success but null data");
          } else {
            console.error(
              "Unable to find product array in response",
              productsData
            );
            // Additional fallback - try to extract any array from the response
            const possibleArrays = Object.values(productsData).filter((val) =>
              Array.isArray(val)
            );
            if (possibleArrays.length > 0) {
              productArray = possibleArrays[0];
              console.log(
                "Found potential product array in unexpected location:",
                productArray.length
              );
            }
          }

          products = productArray;
          stats.totalProducts = productArray.length;
          console.log("Product count updated to:", stats.totalProducts);

          // No longer tracking featured products as we're showing warehouses instead
          console.log("Processed product array:", productArray);
        } else {
          console.error("No products data available");
        }

        // Process categories data
        if (categoriesData) {
          console.log("Processing categories data:", categoriesData);

          // More flexible data extraction for categories
          let categoryArray = [];

          // Check all possible paths for category data
          if (Array.isArray(categoriesData)) {
            // Direct array response
            categoryArray = categoriesData;
          } else if (
            categoriesData.data &&
            Array.isArray(categoriesData.data)
          ) {
            // Standard {data: [...]} pattern
            categoryArray = categoriesData.data;
          } else if (
            categoriesData.data?.data &&
            Array.isArray(categoriesData.data.data)
          ) {
            // Nested {data: {data: [...]}} pattern
            categoryArray = categoriesData.data.data;
          } else if (
            categoriesData.results &&
            Array.isArray(categoriesData.results)
          ) {
            // {results: [...]} pattern
            categoryArray = categoriesData.results;
          } else if (
            categoriesData.categories &&
            Array.isArray(categoriesData.categories)
          ) {
            // {categories: [...]} pattern
            categoryArray = categoriesData.categories;
          } else if (
            categoriesData.success === true &&
            categoriesData.data === null
          ) {
            // Success but empty data
            categoryArray = [];
          } else {
            console.error(
              "Unable to find category array in response",
              categoriesData
            );
          }

          stats.totalCategories = categoryArray.length;
          console.log("Processed category array:", categoryArray);
        } else {
          console.error("No categories data available");
        }

        // Process brands data
        if (brandsData) {
          console.log("Processing brands data:", brandsData);

          // More flexible data extraction for brands
          let brandArray = [];

          // Check all possible paths for brand data
          if (Array.isArray(brandsData)) {
            // Direct array response
            brandArray = brandsData;
          } else if (brandsData.data && Array.isArray(brandsData.data)) {
            // Standard {data: [...]} pattern
            brandArray = brandsData.data;
          } else if (
            brandsData.data?.data &&
            Array.isArray(brandsData.data.data)
          ) {
            // Nested {data: {data: [...]}} pattern
            brandArray = brandsData.data.data;
          } else if (brandsData.results && Array.isArray(brandsData.results)) {
            // {results: [...]} pattern
            brandArray = brandsData.results;
          } else if (brandsData.brands && Array.isArray(brandsData.brands)) {
            // {brands: [...]} pattern
            brandArray = brandsData.brands;
          } else if (brandsData.success === true && brandsData.data === null) {
            // Success but empty data
            brandArray = [];
          } else {
            console.error("Unable to find brand array in response", brandsData);
          }

          stats.totalBrands = brandArray.length;
          console.log("Processed brand array:", brandArray);
        } else {
          console.error("No brands data available");
        }

        // Process warehouses data
        if (warehousesData) {
          console.log("Processing warehouses data:", warehousesData);

          // More flexible data extraction for warehouses
          let warehouseArray = [];

          // Check all possible paths for warehouse data
          if (Array.isArray(warehousesData)) {
            // Direct array response
            warehouseArray = warehousesData;
            console.log(
              "Found warehouse array directly:",
              warehouseArray.length
            );
          } else if (
            warehousesData.data &&
            Array.isArray(warehousesData.data)
          ) {
            // Standard {data: [...]} pattern
            warehouseArray = warehousesData.data;
            console.log(
              "Found warehouse array in data property:",
              warehouseArray.length
            );
          } else if (
            warehousesData.data?.data &&
            Array.isArray(warehousesData.data.data)
          ) {
            // Nested {data: {data: [...]}} pattern
            warehouseArray = warehousesData.data.data;
            console.log(
              "Found warehouse array in nested data property:",
              warehouseArray.length
            );
          } else if (
            warehousesData.results &&
            Array.isArray(warehousesData.results)
          ) {
            // {results: [...]} pattern
            warehouseArray = warehousesData.results;
            console.log(
              "Found warehouse array in results property:",
              warehouseArray.length
            );
          } else if (
            warehousesData.warehouses &&
            Array.isArray(warehousesData.warehouses)
          ) {
            // {warehouses: [...]} pattern
            warehouseArray = warehousesData.warehouses;
            console.log(
              "Found warehouse array in warehouses property:",
              warehouseArray.length
            );
          } else if (
            warehousesData.success === true &&
            warehousesData.data === null
          ) {
            // Success but empty data
            warehouseArray = [];
            console.log("API returned success but null data for warehouses");
          } else {
            console.error(
              "Unable to find warehouse array in response",
              warehousesData
            );
            // Additional fallback - try to extract any array from the response
            const possibleArrays = Object.values(warehousesData).filter((val) =>
              Array.isArray(val)
            );
            if (possibleArrays.length > 0) {
              warehouseArray = possibleArrays[0];
              console.log(
                "Found potential warehouse array in unexpected location:",
                warehouseArray.length
              );
            }
          }

          warehouses = warehouseArray;
          stats.totalWarehouses = warehouseArray.length;
          console.log("Processed warehouse array:", warehouseArray);
        } else {
          console.error("No warehouses data available");
        }

        console.log("Final calculated dashboard stats:", stats);
        console.log("Setting products array length:", products.length);
        setProducts(products);
        setDashboardStats({
          totalProducts: stats.totalProducts,
          totalCategories: stats.totalCategories,
          totalBrands: stats.totalBrands,
          totalWarehouses: stats.totalWarehouses,
        });

        if (hasErrors) {
          setError("Some data could not be loaded. Stats may be incomplete.");
        }
      } catch (error) {
        console.error("Error in API fetch orchestration:", error);
        // Set an error state that can be displayed to the user
        setDashboardStats({
          totalProducts: 0,
          totalCategories: 0,
          totalBrands: 0,
          totalWarehouses: 0,
          error: error.message,
        });
        setError("Failed to load dashboard data: " + error.message);
      } finally {
        setLoading(false);
        console.log("API fetch completed");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Main Content */}
      <div className="dashboard-main">
        {/* Header */}

        {/* Content */}
        <div className="dashboard-content">
          {error && (
            <div className="error-message">
              <strong>Connection Error:</strong> {error}
              <div className="mt-2">
                <small>
                  Attempting to fetch real data from API. Please check your
                  backend server.
                </small>
              </div>
            </div>
          )}

          <h1 className="section-title">Inventory Overview</h1>

          {/* Overview Cards */}
          <div className="overview-cards">
            {dashboardStats.error ? (
              <div className="error-message">
                Error loading data: {dashboardStats.error}
              </div>
            ) : (
              <>
                <div className="card card-primary">
                  <div className="card-body">
                    <div className="card-title">Total Products</div>
                    <div className="card-value">
                      {dashboardStats.totalProducts}
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-body">
                    <div className="card-title">Categories</div>
                    <div className="card-value">
                      {dashboardStats.totalCategories}
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-body">
                    <div className="card-title">Brands</div>
                    <div className="card-value">
                      {dashboardStats.totalBrands}
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-body">
                    <div className="card-title">Warehouses</div>
                    <div className="card-value">
                      {dashboardStats.totalWarehouses}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Products Showcase */}
          <h1 className="section-title">Product Catalog</h1>
          <div className="declarations-table product-table">
            {loading ? (
              <div className="loading-indicator">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="no-data">
                No products found. Add products to see them here.
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 4).map((product, index) => (
                    <tr key={product._id || index}>
                      <td>{product.name}</td>
                      <td className="product-category">
                        {product.categoryName || "General"}
                      </td>
                      <td className="product-price">₹{product.price}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            product.status === "ACTIVE"
                              ? "active"
                              : product.status === "OUT_OF_STOCK"
                                ? "declined"
                                : "inactive"
                          }`}
                        >
                          {product.status || "INACTIVE"}
                        </span>
                      </td>
                     
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="view-more">
              <button
                className="btn-view-more"
                onClick={() => navigate("/product")}
              >
                View all products
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* API Debugger */}
      {/* <ApiDebugger baseUrl="http://localhost:8001" /> */}
    </div>
  );
};

export default Dashboard;
