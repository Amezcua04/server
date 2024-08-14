import { Sequelize } from "sequelize";

const db = new Sequelize("server_db", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});

export default db;