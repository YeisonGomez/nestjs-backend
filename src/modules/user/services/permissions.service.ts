import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Client } from "../../../entities/user/client.entity";
import { UserRole } from "../../../entities/user/userRole.entity";
import { UserPermission } from "../../../entities/user/userPermission.entity";
import { State } from "../../../entities/enums/states.enum";

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Client, 'user') private readonly clientRepository: Repository<Client>,
    @InjectRepository(UserRole, 'user') private readonly userRolRepository: Repository<UserRole>,
    @InjectRepository(UserPermission, 'user') private readonly userPermissionRepository: Repository<UserPermission>
  ){}

  async getPermissions(id: number) {

    const client = await this.clientRepository.findOne({
      select: ['id', 'state'],
      where: { user: { id } }
    })

    if(client)
      return { roles: ['client'], state: client.state }

    let roles: any = await this.userRolRepository.createQueryBuilder('roles')
      .innerJoin('roles.user', 'user', 'user.state = :stat AND user.id = :id', { stat: State.Active, id })
      .innerJoinAndSelect('roles.role', 'role')
      .where('roles.state = :state' , { state: State.Active })
      .getMany()


    let permissions: any = await this.userPermissionRepository.createQueryBuilder('permissions')
      .innerJoin('permissions.user', 'user', 'user.state = :stat  AND user.id = :id', { stat: State.Active, id })
      .innerJoinAndSelect('permissions.permission', 'permission', 'permission.state = :stat', { stat: State.Active })
      .where('permissions.state = :state', { state: State.Active })
      .getMany()

    roles = roles.map(roles => roles.role.key )
    permissions = permissions.map(permissions => permissions.permission.key)
    
    return { roles, permissions }
  
  }

}