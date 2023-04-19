import type { Model, ModelStatic, Optional } from 'sequelize';
import type { BookInstance } from '../book/types';
import type { Author } from './author.entity';

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

export interface AuthorDto {
  name: string;
}

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
