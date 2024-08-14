import Company from "../models/CompanyModel.js";
import User from "../models/UserModel.js";
import bcrypt from "bcrypt";

export const Login = async (req, res) => {
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
    include: {
      model: Company,
      attributes: { exclude: [] },
    },
  });
  if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });
  if (user.status === "Inactivo")
    return res
      .status(404)
      .json({ msg: "Usuario inactivo, contacte a soporte" });
  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) return res.status(400).json({ msg: "Credenciales incorrectas" });
  req.session.userId = user.uuid;
  const uuid = user.uuid;
  const name = user.name;
  const surname = user.surname;
  const email = user.email;
  const role = user.role;
  const status = user.status;
  const company = user.Companies.length > 0 ? user.Companies[0] : "Sin nombre";
  res.status(200).json({ uuid, name, surname, email, role, status, company });
};

export const Me = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: "Por favor, inicie sesión" });
  }
  const user = await User.findOne({
    attributes: ["uuid", "name", "surname", "email", "role", "status"],
    where: {
      uuid: req.session.userId,
    },
    include: {
      model: Company,
      attributes: { exclude: [] },
    },
  });
  if (!user)
    return res.status(404).json({ msg: "Usuario no encontrado sesión" });

  const company = user.Companies.length > 0 ? user.Companies[0] : "Sin Nombre";
  res.status(200).json({ ...user.dataValues, company });
};

export const logOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: "Error al cerrar la sesión" });
    res.status(200).json({ msg: "Sesión finalizada" });
  });
};
