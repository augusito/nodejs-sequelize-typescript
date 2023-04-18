import { Sequelize } from 'sequelize';
import { Hydrator } from '../common/hydrator';
import { Book } from './book.entity';
import { BookModelList } from './types';

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

  async getBookList(): Promise<Book[]> {
    const books = await this.models.Book.findAll({
      include: [{ model: this.models.Author }],
    });

    const hydratedBooks = books.map((book) => {
      const bookJSON = this.hydrator.extract(book);
      const hydratedBook = new Book();
      this.hydrator.hydrate(bookJSON, hydratedBook);

      return hydratedBook;
    });

    return hydratedBooks;
  }

  async createBook(bookDto: BookDto): Promise<Book> {
    const book = await this.models.Book.create({
      author_id: bookDto.author_id,
      title: bookDto.title,
    });

    const bookJSON = this.hydrator.extract(book);
    const hydratedBook = new Book();
    this.hydrator.hydrate(bookJSON, hydratedBook);

    return hydratedBook;
  }
}
