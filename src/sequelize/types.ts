import {
  ModelAttributes,
  ModelOptions,
  BelongsToManyOptions,
  BelongsToOptions,
  HasManyOptions,
  HasOneOptions,
} from 'sequelize';

export interface BelongsToAssociation {
  belongsTo: {
    target: (() => ModelProvider) | ModelProvider;
    options: BelongsToOptions;
  };
}

export interface HasOneAssociation {
  hasOne: {
    target: (() => ModelProvider) | ModelProvider;
    options: HasOneOptions;
  };
}

export interface HasManyAssociation {
  hasMany: {
    target: (() => ModelProvider) | ModelProvider;
    options: HasManyOptions;
  };
}

export interface BelongsToManyAssociation {
  belongsToMany: {
    target: (() => ModelProvider) | ModelProvider;
    options?: BelongsToManyOptions;
  };
}

export type Association =
  | BelongsToAssociation
  | HasOneAssociation
  | HasManyAssociation
  | BelongsToManyAssociation;

export interface ModelProvider {
  modelName: string;
  attributes: ModelAttributes;
  options?: ModelOptions;
  associations?: Association | Association[];
}
