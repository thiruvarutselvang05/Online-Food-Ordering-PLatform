const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt =require("jsonwebtoken");
const cors = require("cors");

const app = express();

// --- Configuration ---
// Your React app runs on 5173. Your server *must* run on a different port.
const PORT = 8080; 
const MONGODB_URI = "mongodb://localhost:27017/myDatabase";
const JWT_SECRET = "your_super_secret_key_please_change_this"; // Secret for signing tokens

// --- Middleware ---
app.use(cors()); // Allows requests from your React frontend
app.use(express.json()); // Allows server to read JSON from request bodies

// ----------------------------------------------------
// --- USER MODEL DEFINITION (Combined) ---
// ----------------------------------------------------
// Instead of a separate 'models/User.js' file, we define the schema here.

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // No two users can have the same email
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true, // This will store the hashed password
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the model from the schema
const User = mongoose.model("User", UserSchema);

// ----------------------------------------------------
// --- MONGODB CONNECTION & SERVER STARTUP ---
// ----------------------------------------------------

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully!");

    // Start the Express server ONLY after the database connection is successful
    app.listen(PORT, () => {
      console.log(`🚀 Express Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MONGODB CONNECTION FAILED!");
    console.error(`Error: ${err.message}`);
    process.exit(1);
  });

// ----------------------------------------------------
// --- API ROUTES ---
// ----------------------------------------------------

// --- Basic Route (to test the connection) ---
app.get("/", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";

  res.status(200).json({
    message: "Server is running!",
    port: PORT,
    databaseStatus: dbStatus,
  });
});


// --- SIGN UP (REGISTER) ROUTE ---
app.post("/api/auth/signup", async (req, res) => {
  const { username, phone, email, password, confirmPassword } = req.body;

  // --- 1. Validation ---
  if (!username || !phone || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // --- 2. Check if user already exists ---
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already in use" });
    }

    // --- 3. Hash the password ---
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // --- 4. Create and save the new user ---
    const newUser = new User({
      username,
      email,
      phone,
      password: hashedPassword,
    });

    await newUser.save();

    // --- 5. Send success response ---
    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error("Sign up error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// --- LOGIN ROUTE ---
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  // --- 1. Validation ---
  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  try {
    // --- 2. Find user in database ---
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // --- 3. Compare passwords ---
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // --- 4. Create and send JWT Token ---
    const payload = {
      user: {
        id: user.id, // We'll use the user's database ID
        email: user.email,
      },
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: "1h" }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        // Send the token back to the client
        res.status(200).json({ token });
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});