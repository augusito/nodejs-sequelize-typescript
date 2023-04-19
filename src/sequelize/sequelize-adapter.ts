import { isUndefined } from '@hemjs/notions';
import { ModelStatic, Sequelize } from 'sequelize';
import type {
  Association,
  BelongsToManyAssociation,
  BelongsToAssociation,
  HasManyAssociation,
  HasOneAssociation,
  ModelProvider,
} from './types';

export class SequelizeAdapter extends Sequelize {
  addModels(models: ModelProvider[]): this {
    for (const model of models) {
      this.defineModels(model);
    }

    for (const model of models) {
      this.registerAssociations(model);
    }

    return this;
  }

  defineModels(model: ModelProvider): void {
    this.define(model.modelName, model.attributes, model.options);
  }

  registerAssociations(model: ModelProvider): void {
    let associations = model?.associations;

    if (isUndefined(associations)) {
      return;
    }

    if (!Array.isArray(associations)) {
      associations = [associations];
    }

    const source = this.model(model.modelName);

    for (const association of associations) {
      if (this.isBelongsToAssociation(association)) {
        this.registerBelongsToAssociation(source, association);
      } else if (this.isHasOneAssociation(association)) {
        this.registerHasOneAssociation(source, association);
      } else if (this.isHasManyAssociation(association)) {
        this.registerHasManyAssociation(source, association);
      } else if (this.isBelongsToManyAssociation(association)) {
        this.registerBelongsToManyAssociation(source, association);
      } else {
        throw new Error(`Unknown association: ${JSON.stringify(association)}`);
      }
    }
  }

  private registerBelongsToAssociation(
    source: ModelStatic<any>,
    association: BelongsToAssociation,
  ): void {
    const { target, options } = association.belongsTo;
    const targetModel = this.getTargetModel(target);
    source.belongsTo(targetModel, options);
  }

  private registerHasOneAssociation(
    source: ModelStatic<any>,
    association: HasOneAssociation,
  ): void {
    const { target, options } = association.hasOne;
    const targetModel = this.getTargetModel(target);
    source.hasOne(targetModel, options);
  }

  private registerHasManyAssociation(
    source: ModelStatic<any>,
    association: HasManyAssociation,
  ): void {
    const { target, options } = association.hasMany;
    const targetModel = this.getTargetModel(target);
    source.hasMany(targetModel, options);
  }

  private registerBelongsToManyAssociation(
    source: ModelStatic<any>,
    association: BelongsToManyAssociation,
  ): void {
    const { target, options } = association.belongsToMany;
    const targetModel = this.getTargetModel(target);
    source.belongsToMany(targetModel, options);
  }

  private isBelongsToAssociation(
    association: Association,
  ): association is BelongsToAssociation {
    return !isUndefined((association as BelongsToAssociation).belongsTo);
  }

  private isHasOneAssociation(
    association: Association,
  ): association is HasOneAssociation {
    return !isUndefined((association as HasOneAssociation).hasOne);
  }

  private isHasManyAssociation(
    association: Association,
  ): association is HasManyAssociation {
    return !isUndefined((association as HasManyAssociation).hasMany);
  }

  private isBelongsToManyAssociation(
    association: Association,
  ): association is BelongsToManyAssociation {
    return !isUndefined(
      (association as BelongsToManyAssociation).belongsToMany,
    );
  }

  private getTargetModel(target: any) {
    const forwardModel = this.getForwardedModel(target);
    return this.model(forwardModel.modelName);
  }

  private getForwardedModel(model: any): ModelProvider {
    return typeof model === 'function' ? model() : model;
  }
}
