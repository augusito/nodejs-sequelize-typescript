import { isFunction, isNull, omit } from '@hemjs/notions';
import { FindOptions, Model, ModelStatic } from 'sequelize';

export class Pageable<M extends Model> {
  constructor(
    readonly model: ModelStatic<M>,
    readonly options: FindOptions<M> = {},
  ) {
    if (isNull(model)) {
      throw new Error('Model must not be null');
    }

    this.model = model;
    this.options = options;
  }

  getModel(): ModelStatic<M> {
    return this.model;
  }

  getOptions(): FindOptions<M> {
    return this.options;
  }

  async getItems(): Promise<{ rows: M[]; count: number }> {
    if (!isFunction(this.model.count)) {
      throw new Error(`Expects the provided model to implement count()`);
    }

    if (!isFunction(this.model.findAll)) {
      throw new Error(`Expects the provided model to implement findAll()`);
    }

    const countOptions: FindOptions<M> = omit(this.options, [
      'limit',
      'offset',
      'order',
      'attributes',
      'include',
    ]);

    const [count, rows] = await Promise.all([
      this.model.count(countOptions),
      this.model.findAll(this.options),
    ]);

    return {
      count,
      rows: count === 0 ? [] : rows,
    };
  }
}
