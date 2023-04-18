import { AuthorJSON } from './types';

export class Author {
  public id: number;
  public name: string;
  public created_at: Date;
  public updated_at: Date;

  public toJSON(): AuthorJSON {
    return {
      id: this.id,
      name: this.name,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  public fromJSON(data: AuthorJSON): void {
    this.id = data.id;
    this.name = data.name;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}
