import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import PublicationRoute from "./routes/PublicationRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import CompanyRoute from "./routes/CompanyRoute.js";
dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
  db: db,
  checkExpirationInterval: 15 * 60 * 1000, // Opcional: Revisa sesiones expiradas cada 15 minutos
  expiration: 1 * 60 * 60 * 1000, // Expiración de la sesión en milisegundos (1 hora)
});

// (async () => {
//   await db.sync({ alter: true });
// })();

app.use(
  session({
    secret: "Atenea07",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      secure: "auto",
      maxAge: 1 * 60 * 60 * 1000,
    },
  })
);
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(express.json());
app.use(UserRoute);
app.use(PublicationRoute);
app.use(AuthRoute);
app.use(CompanyRoute);

// store.sync();

app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});
