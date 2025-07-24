const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect('mongodb://localhost:27017/ecomdb')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// JWT Secret
const JWT_SECRET = 'your-secret-key'; // In production, use environment variables
const JWT_REFRESH_SECRET = 'your-refresh-secret-key';

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['User', 'Admin', 'manager', 'guest'],
    default: 'User'
  }
}, { timestamps: true });

// Define Brand Schema
const brandSchema = new mongoose.Schema({
  brandName: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, { timestamps: true });

// Define Category Schema
const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, { timestamps: true });

// Define Warehouse Schema
const warehouseSchema = new mongoose.Schema({
  warehouseName: {
    type: String,
    required: true
  },
  warehouseType: {
    type: String,
    enum: ['PRIMARY', 'SECONDARY', 'DISTRIBUTION'],
    default: 'PRIMARY'
  },
  poc: String,
  phone: String,
  email: String,
  stock: Number,
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE'
  },
  address: [{
    addressLine1: {
      type: String,
      required: true
    },
    addressLine2: String,
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  }]
}, { timestamps: true });

// Define Product Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true,
    min: 0
  },
  salePrice: {
    type: Number,
    min: 0
  },
  category: {  // Changed from categoryId
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  brand: {  // Changed from brandId
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true
  },
  stock: {
    type: Number,
    default: 0
  },
  sku: String,
  images: [String],
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK'],
    default: 'ACTIVE'
  }
}, { timestamps: true });

// Models
const User = mongoose.model('User', userSchema);
const Brand = mongoose.model('Brand', brandSchema);
const Category = mongoose.model('Category', categorySchema);
const Warehouse = mongoose.model('Warehouse', warehouseSchema);
const Product = mongoose.model('Product', productSchema);

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ statusCode: 401, message: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ statusCode: 403, message: 'Forbidden: Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Authentication Routes
// Register
app.post('/api/v1/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;
    
    // Validation
    if (password !== confirmPassword) {
      return res.status(400).json({ statusCode: 400, message: 'Passwords do not match' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ statusCode: 400, message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role
    });
    
    await user.save();
    
    res.status(201).json({ statusCode: 200, message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: 'Server error', error: error.message });
  }
});

// Login
app.post('/api/v1/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ statusCode: 400, message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ statusCode: 400, message: 'Invalid credentials' });
    }
    
    // Generate tokens
    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    const refreshToken = jwt.sign(
      { id: user._id },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      statusCode: 200,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: 'Server error', error: error.message });
  }
});

// Refresh Token
app.post('/api/v1/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(401).json({ statusCode: 401, message: 'Refresh token required' });
  }
  
  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ statusCode: 404, message: 'User not found' });
    }
    
    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({
      statusCode: 200,
      message: 'Token refreshed',
      data: { accessToken }
    });
  } catch (error) {
    res.status(403).json({ statusCode: 403, message: 'Invalid refresh token' });
  }
});

// Brand Routes
// Get all brands
app.get('/api/v1/brand', async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json({ statusCode: 200, success: true, data: brands });
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({ statusCode: 500, success: false, message: 'Server error', error: error.message });
  }
});

// Get a single brand
app.get('/api/v1/brand/:id', async (req, res) => {
  try {
    console.log('Get brand by ID request received:', req.params.id);
    
    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log('Invalid MongoDB ID:', req.params.id);
      return res.status(400).json({ statusCode: 400, success: false, message: 'Invalid brand ID format' });
    }
    
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      console.log('Brand not found with ID:', req.params.id);
      return res.status(404).json({ statusCode: 404, success: false, message: 'Brand not found' });
    }
    
    console.log('Brand found:', brand);
    res.json({ statusCode: 200, success: true, data: brand });
  } catch (error) {
    console.error('Get brand error:', error);
    res.status(500).json({ statusCode: 500, success: false, message: 'Server error', error: error.message });
  }
});

// Create a brand
app.post('/api/v1/brand', authenticateToken, async (req, res) => {
  try {
    const { brandName, status } = req.body;
    const brand = new Brand({ brandName, status });
    await brand.save();
    res.status(201).json({ statusCode: 200, success: true, message: 'Brand created successfully', data: brand });
  } catch (error) {
    console.error('Create brand error:', error);
    res.status(500).json({ statusCode: 500, success: false, message: 'Server error', error: error.message });
  }
});

// Update a brand
app.put('/api/v1/brand/:id', authenticateToken, async (req, res) => {
  try {
    console.log('Brand update request received:');
    console.log('ID:', req.params.id);
    console.log('Body:', req.body);
    console.log('User:', req.user);
    
    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log('Invalid MongoDB ID:', req.params.id);
      return res.status(400).json({ statusCode: 400, success: false, message: 'Invalid brand ID format' });
    }
    
    const { brandName, status } = req.body;
    
    // Make sure we're using the correct field names in the database
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      { brandName, status },
      { new: true, runValidators: true }
    );
    
    if (!brand) {
      console.log('Brand not found with ID:', req.params.id);
      return res.status(404).json({ statusCode: 404, success: false, message: 'Brand not found' });
    }
    
    console.log('Brand updated successfully:', brand);
    res.json({ statusCode: 200, success: true, message: 'Brand updated successfully', data: brand });
  } catch (error) {
    console.error('Brand update error:', error);
    res.status(500).json({ statusCode: 500, success: false, message: 'Server error', error: error.message });
  }
});

// Delete a brand
app.delete('/api/v1/brand/:id', authenticateToken, async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) {
      return res.status(404).json({ statusCode: 404, success: false, message: 'Brand not found' });
    }
    res.json({ statusCode: 200, success: true, message: 'Brand deleted successfully' });
  } catch (error) {
    console.error('Delete brand error:', error);
    res.status(500).json({ statusCode: 500, success: false, message: 'Server error', error: error.message });
  }
});

// Category Routes
// Get all categories
app.get('/api/v1/category', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ statusCode: 200, success: true, data: categories });
  } catch (error) {
    res.status(500).json({ statusCode: 500, success: false, message: 'Server error', error: error.message });
  }
});

// Get a single category
app.get('/api/v1/category/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ statusCode: 404, success: false, message: 'Category not found' });
    }
    res.json({ statusCode: 200, success: true, data: category });
  } catch (error) {
    res.status(500).json({ statusCode: 500, success: false, message: 'Server error', error: error.message });
  }
});

// Create a category
app.post('/api/v1/category', authenticateToken, async (req, res) => {
  try {
    const { categoryName, description, status } = req.body;
    const category = new Category({ categoryName, description, status });
    await category.save();
    res.status(201).json({ statusCode: 200, success: true, message: 'Category created successfully', data: category });
  } catch (error) {
    res.status(500).json({ statusCode: 500, success: false, message: 'Server error', error: error.message });
  }
});

// Update a category
app.put('/api/v1/category/:id', authenticateToken, async (req, res) => {
  try {
    const { categoryName, description, status } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { categoryName, description, status },
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).json({ statusCode: 404, success: false, message: 'Category not found' });
    }
    res.json({ statusCode: 200, success: true, message: 'Category updated successfully', data: category });
  } catch (error) {
    res.status(500).json({ statusCode: 500, success: false, message: 'Server error', error: error.message });
  }
});

// Delete a category
app.delete('/api/v1/category/:id', authenticateToken, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ statusCode: 404, success: false, message: 'Category not found' });
    }
    res.json({ statusCode: 200, success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ statusCode: 500, success: false, message: 'Server error', error: error.message });
  }
});

// Warehouse Routes
// Get all warehouses
app.get('/api/v1/warehouse', async (req, res) => {
  try {
    const warehouses = await Warehouse.find();
    res.json({ statusCode: 200, success: true, data: warehouses });
  } catch (error) {
    res.status(500).json({ statusCode: 500, success: false, message: 'Server error', error: error.message });
  }
});

// Get a single warehouse
app.get('/api/v1/warehouse/:id', async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ statusCode: 404, success: false, message: 'Warehouse not found' });
    }
    res.json({ statusCode: 200, success: true, data: warehouse });
  } catch (error) {
    res.status(500).json({ statusCode: 500, success: false, message: 'Server error', error: error.message });
  }
});

// Create a warehouse
app.post('/api/v1/warehouse', authenticateToken, async (req, res) => {
  try {
    const warehouse = new Warehouse(req.body);
    await warehouse.save();
    res.status(201).json({ statusCode: 200, success: true, message: 'Warehouse created successfully', data: warehouse });
  } catch (error) {
    res.status(500).json({ statusCode: 500, success: false, message: 'Server error', error: error.message });
  }
});

// Update a warehouse
app.put('/api/v1/warehouse/:id', authenticateToken, async (req, res) => {
  try {
    const warehouse = await Warehouse.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!warehouse) {
      return res.status(404).json({ statusCode: 404, success: false, message: 'Warehouse not found' });
    }
    res.json({ statusCode: 200, success: true, message: 'Warehouse updated successfully', data: warehouse });
  } catch (error) {
    res.status(500).json({ statusCode: 500, success: false, message: 'Server error', error: error.message });
  }
});

// Delete a warehouse
app.delete('/api/v1/warehouse/:id', authenticateToken, async (req, res) => {
  try {
    const warehouse = await Warehouse.findByIdAndDelete(req.params.id);
    if (!warehouse) {
      return res.status(404).json({ statusCode: 404, success: false, message: 'Warehouse not found' });
    }
    res.json({ statusCode: 200, success: true, message: 'Warehouse deleted successfully' });
  } catch (error) {
    res.status(500).json({ statusCode: 500, success: false, message: 'Server error', error: error.message });
  }
});

// Product Routes
// Get all products
app.get('/api/v1/product', async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category', 'categoryName')  // Changed from categoryId
      .populate('brand', 'brandName');       // Changed from brandId
    res.json({ statusCode: 200, success: true, data: products });
  } catch (error) {
    res.status(500).json({ statusCode: 500, success: false, message: 'Server error', error: error.message });
  }
});

// Get a single product
app.get('/api/v1/product/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'categoryName')  // Changed from categoryId
      .populate('brand', 'brandName');       // Changed from brandId
    if (!product) {
      return res.status(404).json({ statusCode: 404, success: false, message: 'Product not found' });
    }
    res.json({ statusCode: 200, success: true, data: product });
  } catch (error) {
    res.status(500).json({ statusCode: 500, success: false, message: 'Server error', error: error.message });
  }
});

// Create a product
app.post('/api/v1/product', authenticateToken, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ statusCode: 200, success: true, message: 'Product created successfully', data: product });
  } catch (error) {
    res.status(500).json({ statusCode: 500, success: false, message: 'Server error', error: error.message });
  }
});

// Update a product
app.put('/api/v1/product/:id', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ statusCode: 404, success: false, message: 'Product not found' });
    }
    res.json({ statusCode: 200, success: true, message: 'Product updated successfully', data: product });
  } catch (error) {
    res.status(500).json({ statusCode: 500, success: false, message: 'Server error', error: error.message });
  }
});

// Delete a product
app.delete('/api/v1/product/:id', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ statusCode: 404, success: false, message: 'Product not found' });
    }
    res.json({ statusCode: 200, success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ statusCode: 500, success: false, message: 'Server error', error: error.message });
  }
});

// Example route
app.get('/api/hello', (req, res) => {
  res.send('Hello from backend');
});

const PORT = process.env.PORT || 8001; // Changed port to 8001 to match the .env file
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));