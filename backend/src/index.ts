import { app } from "./app";
import { ENV, PORT } from "./env";
import { PrismaClient } from "@prisma/client/extension";

const prisma = new PrismaClient();

app.listen(PORT, () => {
  (`[server]: listening at http://localhost:${PORT} in ${ENV} mode`);
});
