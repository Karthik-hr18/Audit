import app from "./app";
import dotenv from "dotenv"

dotenv.config();

const PORT = process.env.PORT || 5000;
try {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
  console.log("Error in starting the server", error);
}