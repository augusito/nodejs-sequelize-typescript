import type { Sequelize } from 'sequelize';
import { DeletedObject } from '../common/deleted-object';
import { Hydrator } from '../common/hydrator';
import { Pageable } from '../common/pageable';
import { Author } from './author.entity';
import type { AuthorDto, AuthorListJSON, AuthorModelList } from './types';

export class AuthorService {
  private readonly models: AuthorModelList;
  private readonly hydrator: Hydrator;

  constructor(readonly sequelize: Sequelize) {
    this.models = sequelize.models as AuthorModelList;
    this.hydrator = new Hydrator();
  }

  async getAuthor(id: number): Promise<Author> {
    const row = await this.models.Author.findByPk(id);

    if (!row) {
      throw new Error('Author not found');
    }

    const authorJSON = this.hydrator.extract(row);
    const hydratedAuthor = new Author();
    this.hydrator.hydrate(authorJSON, hydratedAuthor);

    return hydratedAuthor;
  }

  async getAuthorList(page: number, perPage: number): Promise<AuthorListJSON> {
    const offset = (page - 1) * perPage;
    const limit = perPage;
    const options = {
      limit,
      offset,
    };

    const pageable = new Pageable(this.models.Author, options);
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

  async updateAuthor(
    id: number,
    authorDto: Partial<AuthorDto>,
  ): Promise<Author> {
    const row = await this.models.Author.findByPk(id);

    if (!row) {
      throw new Error('Author not found');
    }

    row.name = authorDto.name || row.name;
    await row.save();

    const authorJSON = this.hydrator.extract(row);
    const hydratedAuthor = new Author();
    this.hydrator.hydrate(authorJSON, hydratedAuthor);

    return hydratedAuthor;
  }

  async deleteAuthor(id: number): Promise<DeletedObject> {
    const rows = await this.models.Author.destroy({
      where: { id },
    });

    if (rows !== 1) {
      throw new Error('Author not found');
    }

    const hydratedObject = new DeletedObject();
    this.hydrator.hydrate({ id, deleted: true }, hydratedObject);

    return hydratedObject;
  }
}
