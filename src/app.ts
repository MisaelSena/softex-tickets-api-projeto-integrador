import express from "express";
import dotenv from "dotenv";
import { UserRoutes } from "./users/routes/user.routes";
import { LoginRoutes } from "./login/routes/login.route";
import { commentsRoutes } from "./comments/routes/comments.routes";

import { categoriesRoutes } from "./categories/routes/category.routes";

import { TicketRoutes } from "./tickets/routes/ticket.routes";


dotenv.config();

const app = express();

app.use(express.json());

//Rota para ações em usuários
app.use("/user", UserRoutes());

//Rota de Autenticação de usuário
app.use("/login", LoginRoutes());

app.use(commentsRoutes());



app.use(categoriesRoutes());

//Rota para ações em tickets
app.use('/ticket', TicketRoutes());


export async function startWebServer() {
  return new Promise((resolve) => {
    app.listen(process.env.PORT, () => {
      console.log(`Servidor Express Ativo na porta: ${process.env.PORT}`);
      resolve(null);
    });
  });
}
