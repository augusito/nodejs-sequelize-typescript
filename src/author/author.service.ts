import { Sequelize } from 'sequelize';
import { Hydrator } from '../common/hydrator';
import { Author } from './author.entity';
import { AuthorModelList } from './types';

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

  async getAuthorList(): Promise<Author[]> {
    const authors = await this.models.Author.findAll({
      include: [{ model: this.models.Book }],
    });

    const hydratedAuthors = authors.map((author) => {
      const authorJSON = this.hydrator.extract(author);
      const hydratedAuthor = new Author();
      this.hydrator.hydrate(authorJSON, hydratedAuthor);

      return hydratedAuthor;
    });

    return hydratedAuthors;
  }

  async createAuthor(authorDto: AuthorDto): Promise<Author> {
    const author = await this.models.Author.create({ name: authorDto.name });

    const authorJSON = this.hydrator.extract(author);
    const hydratedAuthor = new Author();
    this.hydrator.hydrate(authorJSON, hydratedAuthor);

    return hydratedAuthor;
  }
}
