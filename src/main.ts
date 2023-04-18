import { ModelStatic } from 'sequelize';
import { SequelizeAdapter } from './sequelize/sequelize-adapter';
import { AuthorModel } from './author/author.model';
import { AuthorInstance } from './author/types';
import { BookModel } from './book/book.model';
import { BookInstance } from './book/types';
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

  type ModelList = {
    Author: ModelStatic<AuthorInstance>;
    Book: ModelStatic<BookInstance>;
  };

  const { Author, Book } = sequelize.models as ModelList;

  await Author.bulkCreate([
    {
      name: 'Kate Chopin',
    },
    { name: 'Paul Auster' },
  ]);
  await Book.bulkCreate([
    {
      title: 'The Awakening',
      author_id: 1,
    },
    {
      title: 'City of Glass',
      author_id: 2,
    },
  ]);

  const authors = await Author.findAll({ include: [{ model: Book }] });
  const books = await Book.findAll({ include: [{ model: Author }] });

  console.log(JSON.stringify(authors, null, 2));
  console.log(JSON.stringify(books, null, 2));
}
main().catch((err) => {
  console.error(err);
});
