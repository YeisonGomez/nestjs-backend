import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Client } from "../../../entities/users/client.entity";
import { UserRole } from "../../../entities/users/userRole.entity";
import { UserPermission } from "../../../entities/users/userPermission.entity";
import { States } from "../../../entities/enums/states.enum";

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Client, 'users') private readonly clientRepository: Repository<Client>,
    @InjectRepository(UserRole, 'users') private readonly userRolRepository: Repository<UserRole>,
    @InjectRepository(UserPermission, 'users') private readonly userPermissionRepository: Repository<UserPermission>
  ){}

  async getPermissions(id: number) {

    const client = await this.clientRepository.findOne({
      select: ['id', 'state'],
      where: { user: { id } }
    })

    if(client)
      return { roles: ['client'], state: client.state }

    let roles: any = await this.userRolRepository.createQueryBuilder('roles')
      .innerJoin('roles.user', 'user', 'user.state = :stat AND user.id = :id', { stat: States.Active, id })
      .innerJoinAndSelect('roles.role', 'role')
      .where('roles.state = :state' , { state: States.Active })
      .getMany()


    let permissions: any = await this.userPermissionRepository.createQueryBuilder('permissions')
      .innerJoin('permissions.user', 'user', 'user.state = :stat  AND user.id = :id', { stat: States.Active, id })
      .innerJoinAndSelect('permissions.permission', 'permission', 'permission.state = :stat', { stat: States.Active })
      .where('permissions.state = :state', { state: States.Active })
      .getMany()

    roles = roles.map(roles => roles.role.key )
    permissions = permissions.map(permissions => permissions.permission.key)
    
    return { roles, permissions }
  
  }

}