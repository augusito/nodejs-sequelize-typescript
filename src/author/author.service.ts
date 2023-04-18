import { Sequelize } from 'sequelize';
import { AuthorModelList } from './types';

export class AuthorDto {
  readonly name: string;

  constructor(payload: any) {
    this.name = payload.name;
  }
}

export class AuthorService {
  private readonly models: AuthorModelList;

  constructor(readonly sequelize: Sequelize) {
    this.models = sequelize.models as AuthorModelList;
  }

  async getAuthorList() {
    const authors = await this.models.Author.findAll({
      include: [{ model: this.models.Book }],
    });
    return authors;
  }

  async createAuthor(authorDto: AuthorDto) {
    const author = await this.models.Author.create({ name: authorDto.name });
    return author;
  }
}
