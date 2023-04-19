import { Author } from '../author/author.entity';
import type { BookJSON } from './types';

export class Book {
  public id: number;
  public title: string;
  public author?: Author;
  public created_at: Date;
  public updated_at: Date;

  public toJSON(): BookJSON {
    return {
      id: this.id,
      title: this.title,
      author: this.author?.toJSON(),
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }

  public fromJSON(data: BookJSON): void {
    this.id = data.id;
    this.title = data.title;
    if (data.author) {
      const author = new Author();
      author.fromJSON(data.author);
      this.author = author;
    }
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }
}
