import { Model, ModelStatic, Optional } from 'sequelize';
import { AuthorInstance, AuthorJSON } from '../author/types';

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

export interface BookJSON {
  id: number;
  title: string;
  author?: AuthorJSON;
  created_at: Date;
  updated_at: Date;
}
