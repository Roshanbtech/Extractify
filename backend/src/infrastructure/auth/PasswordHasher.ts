import bcrypt from "bcryptjs";

export interface IPasswordHasher {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}

export class PasswordHasher implements IPasswordHasher {
  private readonly saltRounds: number;

  constructor(saltRounds: number = 10) {
    this.saltRounds = saltRounds;
  }

  async hash(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, this.saltRounds);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error hashing password: ${error.message}`);
      }
      throw new Error("Error hashing password");
    }
  }

  async compare(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error comparing password: ${error.message}`);
      }
      throw new Error("Error comparing password");
    }
  }
}
