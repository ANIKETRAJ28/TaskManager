import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import prisma from "../config/db.config";
import { IUser, IUserWithPassword } from "../interface/user.interface";
import { ApiError } from "../util/api.util";
import { SALT_ROUNDS } from "../config/dotenv.config";

class UserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async register(data: IUserWithPassword) {
    let user = await this.prisma.user.findFirst({
      where: { username: data.username },
    });
    if (user) {
      throw new ApiError(400, "User already exists");
    }
    const salt = await bcrypt.genSalt(+SALT_ROUNDS);
    data.password = await bcrypt.hash(data.password, salt);
    user = await this.prisma.user.create({
      data: {
        username: data.username,
        password: data.password,
      },
    });
    const newUser: IUser = {
      id: user.id,
      username: user.username,
    };
    return newUser;
  }

  async login(data: IUserWithPassword): Promise<IUser> {
    const user = await this.prisma.user.findFirst({
      where: { username: data.username },
    });
    if (user == null) {
      throw new ApiError(401, "Invalid credentials");
    }
    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (isValidPassword == false) {
      throw new ApiError(401, "Invalid credentials");
    }
    const existingUser = {
      id: user.id,
      username: user.username,
    };
    return existingUser;
  }
}

export default UserRepository;
