import { Request, Response, NextFunction } from "express";
import { JwtService } from "../infrastructure/auth/JWTService";
import { AppError } from "../shared/errors/AppError";
import { HTTPStatusCodes } from "../shared/enums/HTTPStatusCodes";

const jwtService = new JwtService();

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken || req.header("Authorization")?.split(" ")[1];
    if (!token) {
        throw new AppError("Not authenticated or token not found", HTTPStatusCodes.UNAUTHORIZED);
    }
    const decodedToken = jwtService.verifyToken(token);
    if (!decodedToken || typeof decodedToken === "string") {
        throw new AppError("Invalid token", HTTPStatusCodes.UNAUTHORIZED);
    }
    req.user = { id: decodedToken.userId, email: decodedToken.email, role: decodedToken.role };
    next();
};