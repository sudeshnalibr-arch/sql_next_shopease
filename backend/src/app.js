
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const routes = require("./routes");
const path = require("path");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();

// ============================================
// SECURITY MIDDLEWARE
// ============================================

app.use(helmet());

// ============================================
// CORS CONFIGURATION
// ============================================

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ============================================
// BODY AND COOKIE PARSERS
// ============================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


//image upload
//=============================================
app.use(
  "/uploads",
  express.static(path.resolve(__dirname, "../uploads"))
);

// ============================================
// HEALTH CHECK
// ============================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "E-commerce API is running.",
  });
});

// ============================================
// APPLICATION ROUTES
// ============================================

app.use("/api", routes);

// ============================================
// GLOBAL ERROR HANDLER
// ============================================

app.use(errorMiddleware);

module.exports = app;
