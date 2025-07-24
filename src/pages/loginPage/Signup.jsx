// Example login handler for token generation
const handleLogin = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${accessToken}` }, // Authorization written on header
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.token) {
      localStorage.setItem("accessToken", data.token); // Store token
      console.log("Generated token:", data.token);
      // Redirect or update UI
    } else {
      alert("Login failed: " + (data.message || "No token received"));
    }
  } catch (error) {
    console.error("Login error:", error);
  }
};