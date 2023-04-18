import { DataTypes, Model, ModelStatic, Optional, Sequelize } from 'sequelize';

async function main() {
  const sequelize = new Sequelize({
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

  interface AuthorAttributes {
    id: number;
    name: string;
  }

  interface AuthorInstance
    extends Model<AuthorAttributes, Optional<AuthorAttributes, 'id'>>,
      AuthorAttributes {}

  const Author: ModelStatic<AuthorInstance> = sequelize.define(
    'Author',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      name: {
        singular: 'author',
        plural: 'authors',
      },
    },
  );

  interface BookAttributes {
    id: number;
    author_id: number;
    title: string;
  }

  interface BookInstance
    extends Model<BookAttributes, Optional<BookAttributes, 'id' | 'author_id'>>,
      BookAttributes {}

  const Book: ModelStatic<BookInstance> = sequelize.define(
    'Book',
    {
      author_id: {
        type: DataTypes.INTEGER,
      },
      title: {
        type: DataTypes.STRING,
      },
    },
    {
      name: {
        singular: 'book',
        plural: 'books',
      },
    },
  );

  Author.hasMany(Book, {
    foreignKey: 'author_id',
  });
  Book.belongsTo(Author, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    foreignKey: {
      name: 'author_id',
      allowNull: true,
    },
  });

  await sequelize.sync({ force: true });

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
