import { Model, ModelStatic, Optional } from 'sequelize';
import { BookInstance } from '../book/types';
import { Author } from './author.entity';

export interface AuthorAttributes {
  id: number;
  name: string;
}

export interface AuthorInstance
  extends Model<AuthorAttributes, Optional<AuthorAttributes, 'id'>>,
    AuthorAttributes {}

export type AuthorModelList = {
  Author: ModelStatic<AuthorInstance>;
  Book: ModelStatic<BookInstance>;
};

export interface AuthorJSON {
  id: number;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface AuthorListJSON {
  data: Author[];
  page?: number;
  per_page?: number;
  total: number;
}
