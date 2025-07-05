import LoginSignup from "./pages/loginPage/loginPage";
import { AuthProvider } from "./context/AuthContext";

function App() {
  
  return (
    <AuthProvider>
      <div className="App">
        <LoginSignup/>
      </div>
    </AuthProvider>
  );
}

export default App;
