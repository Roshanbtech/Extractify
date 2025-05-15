import { IUserRepository } from "../repositories/IUserRepository";
import { IPasswordHasher } from "../../infrastructure/auth/PasswordHasher";
import { JwtService } from "../../infrastructure/auth/JWTService";
import { User } from "../entities/User";
import { AppError } from "../../shared/errors/AppError";
import { HTTPStatusCodes } from "../../shared/enums/HTTPStatusCodes";

export class AuthenticateUser {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher,
    private jwtService: JwtService
  ) {}

  async execute(
    email: string,
    password: string
  ): Promise<{ token: string; user: User }> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new AppError("User not found", HTTPStatusCodes.NOT_FOUND);
      }
      const isPasswordValid = await this.passwordHasher.compare(
        password,
        user.password
      );
      if (!isPasswordValid) {
        throw new AppError("Invalid password", HTTPStatusCodes.UNAUTHORIZED);
      }
      const token = this.jwtService.generateToken({
        userId: user.id,
        email: user.email,
      });
      return { token, user };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AppError(
          error.message,
          HTTPStatusCodes.INTERNAL_SERVER_ERROR
        );
      }
      throw new AppError(
        "Unknown error occurred",
        HTTPStatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}
