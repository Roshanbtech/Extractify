import { IUserRepository } from "../repositories/IUserRepository";
import { User } from "../entities/User";
import { IPasswordHasher } from "../../infrastructure/auth/PasswordHasher";
import { AppError } from "../../shared/errors/AppError";
import { HTTPStatusCodes } from "../../shared/enums/HTTPStatusCodes";

export class RegisterUser {
  constructor(
    private userRepository: IUserRepository,
    private passwordHasher: IPasswordHasher
  ) {}

  async execute(name: string, email: string, password: string): Promise<User> {
    try {
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw new AppError("User already exists", HTTPStatusCodes.CONFLICT);
      }
      const hashedPassword = await this.passwordHasher.hash(password);
      const user = new User({ name, email, password: hashedPassword });
      return await this.userRepository.create(user);
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
