import Company from "../models/CompanyModel.js";
import User from "../models/UserModel.js";

// Obtener todas las compañías
export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll({
      include: {
        model: User,
        attributes: ["uuid", "name", "surname", "email"], // Incluir información del usuario asociado
      },
    });
    res.status(200).json(companies);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al obtener las compañías", error: error.message });
  }
};

// Obtener una compañía por su ID
export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findOne({
      where: {
        uuid: req.params.id,
      },
      include: {
        model: User,
        attributes: ["uuid", "name", "surname", "email"], // Incluir información del usuario asociado
      },
    });

    if (!company)
      return res.status(404).json({ msg: "Compañía no encontrada" });

    res.status(200).json(company);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al obtener la compañía", error: error.message });
  }
};

// Crear una nueva compañía
export const createCompany = async (req, res) => {
  const { name, userId } = req.body;
  try {
    await Company.create({
      name: name,
      userId: userId,
    });

    res.status(201).json({ msg: "Compañia creada con éxito" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Actualizar una compañía existente
export const updateCompany = async (req, res) => {
  const { name, userId } = req.body;
  try {
    const company = await Company.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!company)
      return res.status(404).json({ msg: "Compañía no encontrada" });

    company.name = name || company.name;
    company.userId = userId || company.userId;

    await company.save();

    res.status(200).json(company);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al actualizar la compañía", error: error.message });
  }
};

// Eliminar una compañía
export const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (!company)
      return res.status(404).json({ msg: "Compañía no encontrada" });

    await company.destroy();

    res.status(200).json({ msg: "Compañía eliminada correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al eliminar la compañía", error: error.message });
  }
};
