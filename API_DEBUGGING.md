# E-commerce Dashboard - API Debugging Guide

## API Path Corrections

The backend API uses the following paths:

- Products: `/api/v1/products` (plural)
- Categories: `/api/v1/category` (singular)
- Brands: `/api/v1/brand` (singular)

Previously, the frontend was using inconsistent API paths which caused data loading issues.

## Debugging Tools Added

### 1. API Debugger Component

A new API Debugger component has been added to the Dashboard page. This floating tool allows you to:

- Test different API endpoints directly from the UI
- See the response structure and data
- Analyze different API path patterns
- Quickly identify connectivity issues

To use:

1. Click "Show API Debugger" in the bottom right corner
2. Select an endpoint or enter a custom one
3. Click "Test Endpoint" to see the results

### 2. Enhanced Error Handling

The dashboard now has:

- Better error messages
- API structure analysis
- Path fallbacks for different API formats
- Detailed console logging

### 3. Data Structure Flexibility

The dashboard now handles multiple API response formats:

- Direct arrays: `[{...}, {...}]`
- Standard format: `{ data: [{...}, {...}] }`
- Nested format: `{ data: { data: [{...}, {...}] } }`
- Named property: `{ products: [{...}, {...}] }`
- Results property: `{ results: [{...}, {...}] }`

## Troubleshooting Steps

If you're still having issues with the dashboard data:

1. Use the API Debugger to test each endpoint manually
2. Check the browser console for detailed logs about API responses
3. Verify that the backend server is running at `http://localhost:8001`
4. Check that the backend API endpoints match what the frontend is expecting

## API Path Reference

| Data Type  | Correct API Path   | Common Mistakes      |
| ---------- | ------------------ | -------------------- |
| Products   | `/api/v1/products` | `/api/v1/product`    |
| Categories | `/api/v1/category` | `/api/v1/categories` |
| Brands     | `/api/v1/brand`    | `/api/v1/brands`     |
