import { Sequelize } from 'sequelize';
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

  constructor(readonly sequelize: Sequelize) {
    this.models = sequelize.models as BookModelList;
  }

  async getBookList() {
    const books = await this.models.Book.findAll({
      include: [{ model: this.models.Author }],
    });
    return books;
  }

  async createBook(bookDto: BookDto) {
    const book = await this.models.Book.create({
      author_id: bookDto.author_id,
      title: bookDto.title,
    });
    return book;
  }
}
