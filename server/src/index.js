import { env } from "./config/env.js";
import app from "./app.js";
import { pool } from "./config/db.js";

async function startServer() {
  try {
    await pool.query("SELECT 1"); // בדיקת תקינות פינג ל-DB
    console.log("✅ Connected to MySQL Database");

    app.listen(env.PORT, () => {
      console.log(`🚀 API Server running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();