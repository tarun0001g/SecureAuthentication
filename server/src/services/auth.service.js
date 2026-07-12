import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/sendEmail.js";
import { generateToken } from "../utils/generateToken.js";
import { sendResetPasswordEmail } from "../utils/sendResetPasswordEmail.js";

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

export const loginUserService = async (data) => {
  const { email, password } = data;

  // Check required fields
  if (!email || !password) {
    return {
      success: false,
      statusCode: 400,
      message: "Email and password are required.",
    };
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  // User not found
  if (!user) {
    return {
      success: false,
      statusCode: 404,
      message: "User not found.",
    };
  }

  // Check password
  const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordCorrect) {
    return {
      success: false,
      statusCode: 401,
      message: "Invalid credentials.",
    };
  }

  // Check email verification
  if (!user.isVerified) {
    return {
      success: false,
      statusCode: 403,
      message: "Please verify your email first.",
    };
  }

  // Generate JWT
  const token = generateToken(user.id);

  return {
    success: true,
    statusCode: 200,
    message: "Login successful.",
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
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

export const forgotPasswordService = async (email) => {
  // Find user
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  // User not found
  if (!user) {
    return {
      success: false,
      statusCode: 404,
      message: "User not found.",
    };
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Token expires in 1 hour
  const resetTokenExpiry = new Date(
    Date.now() + 60 * 60 * 1000
  );

  // Save token in database
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      resetToken,
      resetTokenExpiry,
    },
  });

  // Send reset email
  await sendResetPasswordEmail(
    user.email,
    user.name,
    resetToken
  );

  return {
    success: true,
    statusCode: 200,
    message: "Password reset email sent successfully.",
  };
};

export const resetPasswordService = async (  token,newPassword) => {

  // ✅ Validate password
  if (!newPassword) {
    return {
      success: false,
      statusCode: 400,
      message: "Password is required.",
    };
  }

  // Find user by reset token
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
    },
  });

  // Invalid token
  if (!user) {
    return {
      success: false,
      statusCode: 404,
      message: "Invalid reset token.",
    };
  }

  // Token expired
  if (user.resetTokenExpiry < new Date()) {
    return {
      success: false,
      statusCode: 400,
      message: "Reset token has expired.",
    };
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password and clear token
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return {
    success: true,
    statusCode: 200,
    message: "Password reset successfully.",
  };
};

export const getCurrentUserService = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return {
      success: false,
      statusCode: 404,
      message: "User not found.",
    };
  }

  return {
    success: true,
    statusCode: 200,
    message: "User fetched successfully.",
    data: user,
  };
};

