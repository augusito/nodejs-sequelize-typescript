import { Model, Optional } from 'sequelize';

export interface BookAttributes {
  id: number;
  author_id: number;
  title: string;
}

export interface BookInstance
  extends Model<BookAttributes, Optional<BookAttributes, 'id' | 'author_id'>>,
    BookAttributes {}
