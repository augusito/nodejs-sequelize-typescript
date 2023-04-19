import type { DeletedObjectJSON } from './types';

export class DeletedObject {
  public id?: number;
  public slug?: string;
  public deleted: boolean;

  public toJSON(): DeletedObjectJSON {
    return {
      id: this.id,
      slug: this.slug,
      deleted: this.deleted,
    };
  }

  public fromJSON(data: DeletedObjectJSON): void {
    this.id = data.id || null;
    this.slug = data.slug || null;
    this.deleted = data.deleted;
  }
}
