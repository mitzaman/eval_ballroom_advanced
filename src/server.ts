import express from "express";
import dotenv from "dotenv";
import danceRoutes from "./routes/danceRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// Use Routes
app.post("/calculate-partners", danceRoutes);

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
export { server };
