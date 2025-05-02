// controllers/dog.controller.js
import Pet from '../models/pet.model.js';
import User from '../models/user.model.js';

export const createDog = async (req, res) => {
  const userId = req.user.user_id;
  const dogData = req.body;

  try {
    const existingDog = await Pet.findOne({
      where: {
        pet_name: dogData.pet_name,
        user_id: userId,
      },
    });

    if (existingDog) {
      return res.status(400).json({ message: "This dog already exists for this user." });
    }

    const newDog = await Pet.create({
      ...dogData,
      user_id: userId,
    });

    return res.status(201).json({ message: "Dog created successfully", dog: newDog });
  } catch (error) {
    console.error("Error while creating dog:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const findAllDogs = async (req, res) => {
  const userId = req.user.user_id;

  try {
    const dogs = await Pet.findAll({
      where: { user_id: userId },
      include: [
        {
          model: User,
          as: 'owner',
        },
      ],
    });

    return res.status(200).json({
      email: req.user.email,
      dogData: dogs,
    });
  } catch (error) {
    console.error("Error while finding dogs:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
