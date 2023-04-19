import type { Sequelize } from 'sequelize';
import { DeletedObject } from '../common/deleted-object';
import { Hydrator } from '../common/hydrator';
import { Pageable } from '../common/pageable';
import { Book } from './book.entity';
import type {
  BookDto,
  BookInstance,
  BookListJSON,
  BookModelList,
} from './types';

export class BookService {
  private readonly models: BookModelList;
  private readonly hydrator: Hydrator;

  constructor(readonly sequelize: Sequelize) {
    this.models = sequelize.models as BookModelList;
    this.hydrator = new Hydrator();
  }

  async getBook(id: number): Promise<Book> {
    const book = await this.models.Book.findByPk(id, {
      include: { model: this.models.Author },
    });

    if (!book) {
      throw new Error('Book not found');
    }

    const bookJSON = this.hydrator.extract(book);
    const hydratedBook = new Book();
    this.hydrator.hydrate(bookJSON, hydratedBook);

    return hydratedBook;
  }

  async getBookList(page: number, perPage: number): Promise<BookListJSON> {
    const offset = (page - 1) * perPage;
    const limit = perPage;
    const options = {
      include: [{ model: this.models.Author }],
      limit,
      offset,
    };

    const pageable = new Pageable<BookInstance>(this.models.Book, options);
    const { count, rows } = await pageable.getItems();
    const hydratedBooks = rows.map((row) => {
      const bookJSON = this.hydrator.extract(row);
      const hydratedBook = new Book();
      this.hydrator.hydrate(bookJSON, hydratedBook);

      return hydratedBook;
    });

    return { data: hydratedBooks, page: page, per_page: perPage, total: count };
  }

  async createBook(bookDto: BookDto): Promise<Book> {
    const row = await this.models.Book.create({
      author_id: bookDto.author_id,
      title: bookDto.title,
    });

    const bookJSON = this.hydrator.extract(row);
    const hydratedBook = new Book();
    this.hydrator.hydrate(bookJSON, hydratedBook);

    return hydratedBook;
  }

  async updateBook(id: number, bookDto: Partial<BookDto>): Promise<Book> {
    const row = await this.models.Book.findByPk(id);

    if (!row) {
      throw new Error('Book not found');
    }

    row.author_id = bookDto.author_id || row.author_id;
    row.title = bookDto.title || row.title;
    await row.save();

    const bookJSON = this.hydrator.extract(row);
    const hydratedBook = new Book();
    this.hydrator.hydrate(bookJSON, hydratedBook);

    return hydratedBook;
  }

  async deleteBook(id: number): Promise<DeletedObject> {
    const rows = await this.models.Book.destroy({
      where: { id },
    });

    if (rows !== 1) {
      throw new Error('Book not found');
    }

    const hydratedObject = new DeletedObject();
    this.hydrator.hydrate({ id, deleted: true }, hydratedObject);

    return hydratedObject;
  }
}
