import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "../../../entities/users/user.entity";
import { TokenService } from "../../../@common/services/token.service";
import { Login } from "../dto/login.dto";
import { States } from "../../../entities/enums/states.enum";

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(User, 'users') private readonly userRepository: Repository<User>,
    private readonly tokenService: TokenService,
  ){}

  async login(body: Login) {
    const user = await this.userRepository.findOne({ select: ["id", "email", "state"], relations: ["client"], where: body });

    if (!user)
      return { error: "USER_NOT_EXIST", detail: "Tu correo electronico o contraseña no son válidos." }
    else if(!user.client)
      return { error: "IS_NOT_CLIENT", detail: "Este usuario no es un cliente." }
    else if(user.client.state === States.Inactive)
      return { error: "CLIENT_INACTIVE", detail: "Cliente inactivo." }
    else if (user.state === States.Inactive)
      return { error: "USER_INACTIVE", detail: "Usuario inactivo." }

    return await this.tokenService.serializeToken(user.email);
  }
}