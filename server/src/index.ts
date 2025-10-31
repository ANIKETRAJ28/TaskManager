import app from "./app";
import { PORT } from "./config/dotenv.config";

app.listen(PORT, () => {
  console.log(`Alive at http://localhost:${PORT}`);
});
