import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Language } from "../../../entities/users/language.entity";
import { States } from "../../../entities/enums/states.enum";

@Injectable()
export class FindService {
  constructor(
    @InjectRepository(Language, 'users') 
    private readonly languageRepository: Repository<Language>
  ) { }

  async findAll() {
    return await this.languageRepository.find({
      select: ["id", "name", "key"],
      order: { id: "ASC" },
      where: { state: States.Active }
    })
  }
}