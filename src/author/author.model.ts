import { DataTypes } from 'sequelize';
import { BookModel } from '../book/book.model';
import { ModelProvider } from '../sequelize/types';

export const AuthorModel: ModelProvider = {
  modelName: 'Author',
  attributes: {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  options: {
    name: {
      singular: 'author',
      plural: 'authors',
    },
  },
  associations: {
    hasMany: {
      target: () => BookModel,
      options: {
        foreignKey: {
          name: 'author_id',
        },
      },
    },
  },
};
