
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginSignup from "./pages/loginPage/loginPage";
import DashboardPage from "./pages/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginSignup />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/signup" element={<LoginSignup />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
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
