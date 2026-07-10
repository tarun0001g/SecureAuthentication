import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/sendEmail.js";

export const registerUserService = async (data) => {
  const { name, email, password } = data;

  // Validation
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

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate verification token
  const verifyToken = crypto.randomBytes(32).toString("hex");

  // Token expiry (24 hours)
  const verifyTokenExpiry = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  );

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      verifyToken,
      verifyTokenExpiry,
    },
  });

  // Send verification email
  await sendVerificationEmail(
    user.email,
    user.name,
    user.verifyToken
  );

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

export const verifyEmailService = async (token) => {
  // Find user by token
  const user = await prisma.user.findFirst({
    where: {
      verifyToken: token,
    },
  });

  // Invalid token
  if (!user) {
    return {
      success: false,
      statusCode: 404,
      message: "Invalid verification token.",
    };
  }

  // Expired token
  if (user.verifyTokenExpiry < new Date()) {
    return {
      success: false,
      statusCode: 400,
      message: "Verification token expired.",
    };
  }

  // Mark user as verified
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      isVerified: true,
      verifyToken: null,
      verifyTokenExpiry: null,
    },
  });

  return {
    success: true,
    statusCode: 200,
    message: "Email verified successfully.",
  };
};