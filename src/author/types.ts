import { Model, Optional } from 'sequelize';

export interface AuthorAttributes {
  id: number;
  name: string;
}

export interface AuthorInstance
  extends Model<AuthorAttributes, Optional<AuthorAttributes, 'id'>>,
    AuthorAttributes {}
