import { DataTypes } from 'sequelize';
import { AuthorModel } from '../author/author.model';
import type { ModelProvider } from '../sequelize/types';

export const BookModel: ModelProvider = {
  modelName: 'Book',
  attributes: {
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  options: {
    name: {
      singular: 'book',
      plural: 'books',
    },
  },
  associations: [
    {
      belongsTo: {
        target: () => AuthorModel,
        options: {
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
          foreignKey: {
            name: 'author_id',
            allowNull: true,
          },
        },
      },
    },
  ],
};
