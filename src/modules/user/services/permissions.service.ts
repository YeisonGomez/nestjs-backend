import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Client } from "../../../entities/users/client.entity";
import { UserRole } from "../../../entities/users/userRole.entity";
import { UserPermission } from "../../../entities/users/userPermission.entity";

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
      return { rols: ['client'], state: client.state }

    let rols: any = await this.userRolRepository.find({
      relations: ['rol'],
      where: { user: { id }, state: 'active' }
    })
    rols = rols.map(item => ({ ...item.rol }))
    
    let permissions: any = await this.userPermissionRepository.find({
      relations: ['permission'],
      where: { user: { id }, state: 'active' }
    })
    permissions = permissions.map(item => ({ ...item.permission }))

    return { rols, permissions }
  }

}