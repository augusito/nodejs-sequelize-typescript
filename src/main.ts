import { AuthorModel } from './author/author.model';
import { AuthorService } from './author/author.service';
import { BookModel } from './book/book.model';
import { BookService } from './book/book.service';
import { SequelizeAdapter } from './sequelize/sequelize-adapter';

async function main() {
  const sequelize = new SequelizeAdapter({
    dialect: 'sqlite',
    storage: 'data/dev.sqlite',
    benchmark: true,
    logging: (sql: string, duration?: number) => {
      console.info(
        `Sequelize operation was just executed in ${duration} ms with sql: ${sql}`,
      );
    },
    logQueryParameters: true,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      paranoid: false,
      underscored: true,
      createdAt: 'created_at',
      deletedAt: 'deleted_at',
      updatedAt: 'updated_at',
    },
  });

  sequelize.addModels([AuthorModel, BookModel]);
  await sequelize.sync({ force: true });

  const authorService = new AuthorService(sequelize);

  await authorService.createAuthor({ name: 'Kate Chopin' });
  await authorService.createAuthor({ name: 'Paul Auster' });

  const bookService = new BookService(sequelize);
  await bookService.createBook({ author_id: 1, title: 'The Awakening' });
  await bookService.createBook({ author_id: 2, title: 'City of Glass' });

  const authors = await authorService.getAuthorList(1, 2);
  const books = await bookService.getBookList(1, 2);

  console.log(JSON.stringify(authors, null, 2));
  console.log(JSON.stringify(books, null, 2));

  const updatedAuthor = await authorService.updateAuthor(2, {
    name: 'Paul Graham',
  });
  console.log(JSON.stringify(updatedAuthor, null, 2));

  const deletedAuthor = await authorService.deleteAuthor(2);
  console.log(JSON.stringify(deletedAuthor, null, 2));

  const book2 = await bookService.getBook(2);
  console.log(JSON.stringify(book2, null, 2));

  const updatedBook = await bookService.updateBook(2, {
    author_id: 1,
  });
  console.log(JSON.stringify(updatedBook, null, 2));

  const deletedBook = await bookService.deleteBook(2);
  console.log(JSON.stringify(deletedBook, null, 2));
}

main().catch((err) => {
  console.error(err);
});
