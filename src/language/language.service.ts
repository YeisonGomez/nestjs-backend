import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { language } from '../entities/users/language';

@Injectable()
export class LanguageService {

    constructor(
        @InjectRepository(language, 'users') private readonly languageRepository: Repository<language>
    ) { }

    async getLanguageAll() {
        return await this.languageRepository.find({
            select: ["id", "name", "key"],
            order: { id: "ASC" }
        })
    }
}
