import { Request, Response, NextFunction } from "express";
import { RegisterUser } from "../../domain/usecases/RegisterUser";
import { AuthenticateUser } from "../../domain/usecases/AuthenticateUser";
import { UserRepository } from "../../infrastructure/database/UserRepository";
import { PasswordHasher } from "../../infrastructure/auth/PasswordHasher";
import { JwtService } from "../../infrastructure/auth/JWTService";
import { HTTPStatusCodes } from "../../shared/enums/HTTPStatusCodes";

const userRepository = new UserRepository();
const passwordHasher = new PasswordHasher();
const jwtService = new JwtService();

export class AuthController {
  static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, email, password } = req.body;
      const registerUser = new RegisterUser(userRepository, passwordHasher);
      const newUser = await registerUser.execute(name, email, password);
      res.status(HTTPStatusCodes.CREATED).json({
        message: "User registered successfully",
        user: newUser,
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      const authenticateUser = new AuthenticateUser(
        userRepository,
        passwordHasher,
        jwtService
      );
      const { token, user } = await authenticateUser.execute(email, password);
      res.cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000, 
      });
      res.status(HTTPStatusCodes.OK).json({
        message: "User logged in successfully",
        user: user,
        token: token,
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  static async logout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.clearCookie("accessToken");
      res.status(HTTPStatusCodes.OK).json({
        message: "User logged out successfully",
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  static async check(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const user = await userRepository.findByEmail(req.user!.email);
      if (!user) {
        res
          .status(HTTPStatusCodes.UNAUTHORIZED)
          .json({ message: "User not found" });
        return;
      }
      // strip out the password before sending
      const { id, name, email } = user;
      res.status(HTTPStatusCodes.OK).json({ user: { id, name, email } });
    } catch (err) {
      next(err);
    }
  
}
}
