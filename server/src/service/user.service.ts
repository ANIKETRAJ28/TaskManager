import UserRepository from "../repository/user.repository";
import { IUser, IUserWithPassword } from "../interface/user.interface";

class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async registerUser(user: IUserWithPassword): Promise<IUser> {
    const existingUser: IUser = await this.userRepository.register(user);
    return existingUser;
  }

  async login(user: IUserWithPassword): Promise<IUser> {
    const existingUser: IUser = await this.userRepository.login(user);
    return existingUser;
  }
}

export default UserService;
