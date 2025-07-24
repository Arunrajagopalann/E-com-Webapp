export const LoginService = async (data) => {
    const API_BASE = process.env.REACT_APP_BASE_URL;

  let result = null;
  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    result = await response.json();
    console.log('Login result:', result);
  } catch (error) {
    console.error('Login error:', error);
    result = { success: false, message: error.message };
  }
  return result;
}

// Add these brand-related API services
export const getBrands = async () => {
    const API_BASE = process.env.REACT_APP_BASE_URL;

  let result = null;
  try {
    const accessToken = localStorage.getItem("accessToken");
    
    const response = await fetch(`${API_BASE}/brand`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    result = await response.json();
    console.log('Get brands result:', result);
  } catch (error) {
    console.error('Get brands error:', error);
    result = { success: false, message: error.message };
  }
  return result;
}

export const getBrandById = async (id) => {
    const API_BASE = process.env.REACT_APP_BASE_URL;

  let result = null;
  try {
    const accessToken = localStorage.getItem("accessToken");
    
    console.log(`Fetching brand with ID: ${id} from ${API_BASE}/brand/${id}`);
    
    const response = await fetch(`${API_BASE}/brand/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    // Log the raw response for debugging
    console.log('Raw response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    result = await response.json();
    console.log('Get brand by ID result:', result);
  } catch (error) {
    console.error('Get brand by ID error:', error);
    result = { success: false, message: error.message };
  }
  return result;
}

export const createBrand = async (data) => {
    const API_BASE = process.env.REACT_APP_BASE_URL;

  let result = null;
  try {
    const accessToken = localStorage.getItem("accessToken");
    
    const response = await fetch(`${API_BASE}/brand`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error response (${response.status}):`, errorText);
      throw new Error(`Failed to create brand: ${response.status}`);
    }
    
    result = await response.json();
    console.log('Create brand result:', result);
  } catch (error) {
    console.error('Create brand error:', error);
    result = { success: false, message: error.message };
  }
  return result;
}

export const updateBrand = async (id, data) => {
  let result = null;
  try {
    const accessToken = localStorage.getItem("accessToken");
      const API_BASE = process.env.REACT_APP_BASE_URL;

    console.log(`Updating brand with ID: ${id}`);
    console.log('Update data:', data);
    console.log('API URL:', `${API_BASE}/brand/${id}`);
    
    const response = await fetch(`${API_BASE}/brand/${id}`, {
      method: 'PUT',  // Make sure this is PUT for updates
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(data)
    });
    
    // Log the raw response for debugging
    console.log('Raw response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const responseData = await response.json();
    console.log('Update brand result from API:', responseData);

    // The backend might return the updated object directly on success,
    // without the `{ success: true, ... }` wrapper.
    // We check for this and wrap it to ensure a consistent response format.
    if (responseData && responseData._id && typeof responseData.success === 'undefined') {
      result = { success: true, data: responseData };
    } else {
      result = responseData; // Assume it's already in the correct { success, ... } format
    }
  } catch (error) {
    console.error('Update brand error:', error);
    result = { success: false, message: error.message };
  }
  return result;
}

export const deleteBrand = async (id) => {
    const API_BASE = process.env.REACT_APP_BASE_URL;

  let result = null;
  try {
    const accessToken = localStorage.getItem("accessToken");
    
    const response = await fetch(`${API_BASE}/brand/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error response (${response.status}):`, errorText);
      throw new Error(`Failed to delete brand: ${response.status}`);
    }
    
    result = await response.json();
    console.log('Delete brand result:', result);
  } catch (error) {
    console.error('Delete brand error:', error);
    result = { success: false, message: error.message };
  }
  return result;
}