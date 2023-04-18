import { Sequelize } from 'sequelize';
import { Hydrator } from '../common/hydrator';
import { Pageable } from '../common/pageable';
import { Book } from './book.entity';
import { BookInstance, BookListJSON, BookModelList } from './types';

export class BookDto {
  readonly author_id: number;
  readonly title: string;

  constructor(payload: any) {
    this.author_id = payload.author_id;
    this.title = payload.title;
  }
}

export class BookService {
  private readonly models: BookModelList;
  private readonly hydrator: Hydrator;

  constructor(readonly sequelize: Sequelize) {
    this.models = sequelize.models as BookModelList;
    this.hydrator = new Hydrator();
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
}
