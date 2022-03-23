import "dotenv/config";
import { createServer } from "./server";

const port: number = 3001;

const start = async () => {
  const { veramoService, app } = await createServer();
  app.listen(port, () => {
    console.log(`server has started on port ${port}`);
  });
};

start();
