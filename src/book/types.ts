import type { Model, ModelStatic, Optional } from 'sequelize';
import type { AuthorInstance, AuthorJSON } from '../author/types';
import type { Book } from './book.entity';

export interface BookAttributes {
  id: number;
  author_id?: number;
  title: string;
}

export interface BookInstance
  extends Model<BookAttributes, Optional<BookAttributes, 'id'>>,
    BookAttributes {}

export type BookModelList = {
  Book: ModelStatic<BookInstance>;
  Author: ModelStatic<AuthorInstance>;
};

export interface BookDto {
  author_id?: number;
  title: string;
}

export interface BookJSON {
  id: number;
  title: string;
  author?: AuthorJSON;
  created_at?: Date;
  updated_at?: Date;
}

export interface BookListJSON {
  data: Book[];
  page: number;
  per_page: number;
  total: number;
}
