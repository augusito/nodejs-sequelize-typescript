import { Sequelize } from 'sequelize';
import { Hydrator } from '../common/hydrator';
import { Pageable } from '../common/pageable';
import { Author } from './author.entity';
import { AuthorInstance, AuthorListJSON, AuthorModelList } from './types';

export class AuthorDto {
  readonly name: string;

  constructor(payload: any) {
    this.name = payload.name;
  }
}

export class AuthorService {
  private readonly models: AuthorModelList;
  private readonly hydrator: Hydrator;

  constructor(readonly sequelize: Sequelize) {
    this.models = sequelize.models as AuthorModelList;
    this.hydrator = new Hydrator();
  }

  async getAuthorList(page: number, perPage: number): Promise<AuthorListJSON> {
    const offset = (page - 1) * perPage;
    const limit = perPage;
    const options = {
      limit,
      offset,
    };

    const pageable = new Pageable<AuthorInstance>(this.models.Author, options);
    const { count, rows } = await pageable.getItems();
    const hydratedAuthors = rows.map((row) => {
      const authorJSON = this.hydrator.extract(row);
      const hydratedAuthor = new Author();
      this.hydrator.hydrate(authorJSON, hydratedAuthor);

      return hydratedAuthor;
    });

    return {
      data: hydratedAuthors,
      page: page,
      per_page: perPage,
      total: count,
    };
  }

  async createAuthor(authorDto: AuthorDto): Promise<Author> {
    const row = await this.models.Author.create({ name: authorDto.name });

    const authorJSON = this.hydrator.extract(row);
    const hydratedAuthor = new Author();
    this.hydrator.hydrate(authorJSON, hydratedAuthor);

    return hydratedAuthor;
  }
}
