
// require("dotenv").config();

// const app = require("./src/app");
// const { sequelize } = require("./src/models");

// const { initializeSocket } = require("./config/socket");

// const startServer = async () => {
//   try {
//     await sequelize.authenticate();

//     console.log("MySQL database connected successfully.");

//     if (process.env.NODE_ENV !== "production") {
//       await sequelize.sync();
//       console.log("Database models synchronized successfully.");
//     }

//     const PORT = Number(process.env.PORT) || 3007;

//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   } catch (error) {
//     console.error("Server startup error:", error);
//     process.exit(1);
//   }
// };

// startServer();



require("dotenv").config();

const http = require("http");

const app = require("./src/app");
const { sequelize } = require("./src/models");

const { initializeSocket } = require("./src/config/socket");

const startServer = async () => {
  try {
    // 1. Connect to MySQL
    await sequelize.authenticate();

    console.log("MySQL database connected successfully.");

    // 2. Synchronize models during development
    if (process.env.NODE_ENV !== "production") {
      await sequelize.sync();

      console.log("Database models synchronized successfully.");
    }

    // 3. Create HTTP server using Express app
    const httpServer = http.createServer(app);

    // 4. Initialize Socket.IO
    initializeSocket(httpServer);

    // 5. Start HTTP and Socket.IO on the same port
    const PORT = Number(process.env.PORT) || 3008;

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Socket.IO running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
};

startServer();
