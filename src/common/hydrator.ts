import { isPlainObject, isUndefined } from '@hemjs/notions';

export class Hydrator {
  public extract<TObj extends { toJSON(): any }>(
    object: TObj,
  ): ReturnType<TObj['toJSON']> {
    if (isUndefined(object?.toJSON)) {
      throw new Error(`Invalid object provided to extract: ${object}`);
    }

    const data = object.toJSON();
    return data;
  }

  public hydrate<TObj extends { fromJSON(data: any): void }>(
    data: Record<string, any>,
    object: TObj,
  ): TObj {
    if (isUndefined(object?.fromJSON) || !isPlainObject(data)) {
      throw new Error(
        `Invalid data or object provided to hydrate: data=${data}, object=${object}`,
      );
    }

    object.fromJSON(data);
    return object;
  }
}
