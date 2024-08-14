import User from "../models/UserModel.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  try {
    const response = await User.findAll({
      attributes: { exclude: [] },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const response = await User.findOne({
      attributes: { exclude: [] },
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createUser = async (req, res) => {
  const { name, surname, email, password, confirmPassword, role, status } =
    req.body;
  if (password !== confirmPassword)
    return res.status(400).json({ msg: "Las contraseñas no coinciden" });
  const hashPassword = await bcrypt.hash(password, 10);
  try {
    await User.create({
      name: name,
      surname: surname,
      email: email,
      password: hashPassword,
      role: role,
      status: status,
    });
    res.status(201).json({ msg: "Registro exitoso!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

  const { name, surname, email, password, confirmPassword, role, status } =
    req.body;

  let hashPassword = user.password;
  if (password && password !== "") {
    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Las contraseñas no coinciden" });
    }
    hashPassword = await bcrypt.hash(password, 10);
  }

  try {
    await User.update(
      { name, surname, email, password: hashPassword, role, status },
      {
        where: {
          id: user.id,
        },
      }
    );
    res.status(200).json({ msg: "Usuario actualizado" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });
  try {
    await User.destroy({
      where: {
        id: user.id,
      },
    });
    res.status(200).json({ msg: "Usuario eliminado" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
