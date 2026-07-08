import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";


export const registerUserService = async (data) => {
  const { name, email, password } = data;

  if (!name || !email || !password) {
    return {
      success: false,
      statusCode: 400,
      message: "All fields are required.",
    };
  }

  // Check existing user
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return {
      success: false,
      statusCode: 409,
      message: "User already exists.",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const verifyToken = crypto.randomBytes(32).toString("hex");

  const verifyTokenExpiry = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  );

  const user = await prisma.user.create({
  data: {
    name,
    email,
    password: hashedPassword,
    verifyToken,
    verifyTokenExpiry,
  },
});

  return {
  success: true,
  statusCode: 201,
  message: "User registered successfully.",
  data: {
    id: user.id,
    name: user.name,
    email: user.email,
    isVerified: user.isVerified,
  },
};

};

