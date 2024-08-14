import Publication from "../models/PublicationModel.js";
import User from "../models/UserModel.js";
import { Op } from "sequelize";

export const getBlog = async (req, res) => {
  try {
    let response;
    response = await Publication.findAll({
      attributes: ["uuid", "title", "description", "company", "vacancyType"],
      include: [
        {
          model: User,
          attributes: ["name", "surname", "email"],
        },
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const publication = await Publication.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!publication)
      return res.status(404).json({ msg: "Publicación no encontrada" });
    let response;
    response = await Publication.findOne({
      attributes: ["uuid", "title", "description", "company", "vacancyType"],
      where: {
        id: publication.id,
      },
      include: [
        {
          model: User,
          attributes: ["name", "surname", "email"],
        },
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getPublications = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await Publication.findAll({
        attributes: ["uuid", "title", "description", "company", "vacancyType"],
        include: [
          {
            model: User,
            attributes: ["name", "surname", "email"],
          },
        ],
      });
    } else {
      response = await Publication.findAll({
        attributes: ["uuid", "title", "description", "company", "vacancyType"],
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: User,
            attributes: ["name", "surname", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getPublicationById = async (req, res) => {
  try {
    const publication = await Publication.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!publication)
      return res.status(404).json({ msg: "Publicación no encontrada" });
    let response;
    if (req.role === "admin") {
      response = await Publication.findOne({
        attributes: ["uuid", "title", "description", "company", "vacancyType"],
        where: {
          id: publication.id,
        },
        include: [
          {
            model: User,
            attributes: ["name", "surname", "email"],
          },
        ],
      });
    } else {
      response = await Publication.findOne({
        attributes: ["uuid", "title", "description", "company", "vacancyType"],
        where: {
          [Op.and]: [{ id: publication.id }, { userId: req.userId }],
        },
        include: [
          {
            model: User,
            attributes: ["name", "surname", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createPublication = async (req, res) => {
  const { title, description, company, vacancyType } = req.body;
  try {
    await Publication.create({
      title: title,
      description: description,
      company: company,
      vacancyType: vacancyType,
      userId: req.userId,
    });
    res.status(201).json({ msg: "Publicación creada con éxito" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updatePublication = async (req, res) => {
  try {
    const publication = await Publication.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!publication)
      return res.status(404).json({ msg: "Publicación no encontrada" });
    const { title, description, company, vacancyType } = req.body;
    if (req.role === "admin") {
      await Publication.update(
        { title, description, company, vacancyType },
        {
          where: {
            id: publication.id,
          },
        }
      );
    } else {
      if (req.userId !== publication.userId)
        return res.status(403).json({ msg: "Acceso no autorizado" });
      await Publication.update(
        { title, description, company, vacancyType },
        {
          where: {
            [Op.and]: [{ id: publication.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Publicación actualizada" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deletePublication = async (req, res) => {
  try {
    const publication = await Publication.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!publication)
      return res.status(404).json({ msg: "Publicación no encontrada" });
    if (req.role === "admin") {
      await Publication.destroy({
        where: {
          id: publication.id,
        },
      });
    } else {
      if (req.userId !== publication.userId)
        return res.status(403).json({ msg: "Acceso no autorizado" });
      await Publication.destroy({
        where: {
          [Op.and]: [{ id: publication.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Publicación eliminada" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
