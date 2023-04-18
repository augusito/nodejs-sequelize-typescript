import { Model, ModelStatic, Optional } from 'sequelize';
import { AuthorInstance } from '../author/types';

export interface BookAttributes {
  id: number;
  author_id: number;
  title: string;
}

export interface BookInstance
  extends Model<BookAttributes, Optional<BookAttributes, 'id'>>,
    BookAttributes {}

export type BookModelList = {
  Book: ModelStatic<BookInstance>;
  Author: ModelStatic<AuthorInstance>;
};
