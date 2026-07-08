import { registerUserService } from "../services/auth.service.js";

export const registerUser = async (req, res) => {
  try {
    const result = await registerUserService(req.body);

    return res.status(result.statusCode).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};