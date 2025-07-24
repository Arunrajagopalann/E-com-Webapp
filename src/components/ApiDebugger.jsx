import React, { useState } from "react";
import "./ApiDebugger.css";

const ApiDebugger = ({ baseUrl = "http://localhost:8001" }) => {
  const [apiUrl, setApiUrl] = useState(baseUrl);
  const [endpoint, setEndpoint] = useState("/api/v1/product");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDebugger, setShowDebugger] = useState(false);

  // Common endpoints to test
  const commonEndpoints = [
    "/api/v1/product",
    "/api/v1/products",
    "/api/v1/category",
    "/api/v1/categories",
    "/api/v1/brand",
    "/api/v1/brands",
    "/api/v1",
    "/",
  ];

  const testEndpoint = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const url = `${apiUrl}${endpoint}`;
      console.log(`Testing API endpoint: ${url}`);

      const response = await fetch(url);

      // Get response status
      const status = response.status;
      let data = null;

      // Try to parse JSON response
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Response is not valid JSON:", parseError);
        setError(`Response status: ${status}, but not valid JSON`);
      }

      // Format the results
      setResults({
        url,
        status,
        data,
        ok: response.ok,
      });
    } catch (err) {
      console.error("Error testing endpoint:", err);
      setError(`Connection error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Format JSON with indentation
  const formatJson = (json) => {
    if (!json) return "No data";
    try {
      return JSON.stringify(json, null, 2);
    } catch (e) {
      return "Invalid JSON";
    }
  };

  // Analyze data structure
  const analyzeDataStructure = (data) => {
    if (!data) return null;

    const structure = {
      type: Array.isArray(data) ? "Array" : typeof data,
    };

    if (Array.isArray(data)) {
      structure.length = data.length;
      structure.sampleKeys =
        data.length > 0 ? Object.keys(data[0]).join(", ") : "empty array";
    } else if (typeof data === "object") {
      structure.keys = Object.keys(data).join(", ");

      // Check for common patterns
      if (data.data) {
        structure.hasDataProperty = true;
        structure.dataType = Array.isArray(data.data)
          ? `Array with ${data.data.length} items`
          : typeof data.data;

        if (Array.isArray(data.data) && data.data.length > 0) {
          structure.dataItemKeys = Object.keys(data.data[0]).join(", ");
        }
      }

      if (data.success !== undefined) {
        structure.hasSuccessProperty = true;
        structure.successValue = data.success;
      }
    }

    return structure;
  };

  return (
    <div className="api-debugger">
      <button
        className="toggle-debugger-btn"
        onClick={() => setShowDebugger(!showDebugger)}
      >
        {showDebugger ? "Hide API Debugger" : "Show API Debugger"}
      </button>

      {showDebugger && (
        <div className="debugger-panel">
          <h3>API Endpoint Debugger</h3>
          <p className="debugger-info">
            Use this tool to test your backend API endpoints and verify their
            responses
          </p>

          <div className="input-group">
            <label>Base URL:</label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="http://localhost:8001"
            />
          </div>

          <div className="input-group">
            <label>Endpoint:</label>
            <input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="/api/v1/product"
            />
          </div>

          <div className="common-endpoints">
            <p>Quick Test:</p>
            <div className="endpoint-buttons">
              {commonEndpoints.map((ep) => (
                <button
                  key={ep}
                  onClick={() => {
                    setEndpoint(ep);
                    setTimeout(testEndpoint, 0);
                  }}
                  className={endpoint === ep ? "active" : ""}
                >
                  {ep}
                </button>
              ))}
            </div>
          </div>

          <button
            className="test-btn"
            onClick={testEndpoint}
            disabled={loading}
          >
            {loading ? "Testing..." : "Test Endpoint"}
          </button>

          {error && <div className="error-message">{error}</div>}

          {results && (
            <div className="results">
              <h4>Results for {results.url}</h4>

              <div className="status-info">
                <p className={`status ${results.ok ? "success" : "error"}`}>
                  Status: {results.status} ({results.ok ? "OK" : "Error"})
                </p>
              </div>

              {results.data && (
                <>
                  <h5>Data Structure Analysis:</h5>
                  <div className="structure-analysis">
                    <pre>{formatJson(analyzeDataStructure(results.data))}</pre>
                  </div>

                  <h5>Full Response:</h5>
                  <div className="json-response">
                    <pre>{formatJson(results.data)}</pre>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiDebugger;
