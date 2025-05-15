import jwt, { JwtPayload } from "jsonwebtoken";

export class JwtService {
  generateToken(payload: object): string {
    return jwt.sign(payload, process.env.JWT_SECRET || "defaultsecret", {
      expiresIn: "1d",
    });
  }

  verifyToken(token: string): JwtPayload | string | null {
    try {
      return jwt.verify(
        token,
        process.env.JWT_SECRET || "defaultsecret"
      ) as JwtPayload;
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  }
}
