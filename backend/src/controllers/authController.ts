import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      status: "error",
      message: "Name and email are required"
    });
  }

  try {
    const existUser = await prisma.user.findUnique({
      where: { email: String(email) }
    });

    if (existUser) {
      return res.status(400).json({
        status: "error",
        message: "User already exists"
      });
    }

    await prisma.user.create({
      data: {
        name: String(name),
        email: String(email)
      }
    });

    ("User created successfully");

    return res.status(201).json({
      status: "success",
      message: "User created successfully"
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
};
