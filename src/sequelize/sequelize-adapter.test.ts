import { DataTypes } from 'sequelize';
import { SequelizeAdapter } from './sequelize-adapter';
import type { ModelProvider } from './types';

describe('SequelizeAdapter', () => {
  let adapter: SequelizeAdapter;

  beforeAll(() => {
    adapter = new SequelizeAdapter({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    });
  });

  it('should define and register associations for all models', () => {
    const UserModel = {
      modelName: 'User',
      attributes: {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      options: {
        timestamps: false,
      },
      associations: [
        {
          belongsTo: {
            target: () => RoleModel,
            options: {
              foreignKey: 'roleId',
            },
          },
        },
      ],
    };

    const RoleModel = {
      modelName: 'Role',
      attributes: {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      options: {
        timestamps: false,
      },
      associations: [
        {
          hasMany: {
            target: () => UserModel,
            options: {
              foreignKey: 'roleId',
            },
          },
        },
      ],
    };

    const models: ModelProvider[] = [UserModel, RoleModel];

    adapter.addModels(models);

    expect(adapter.isDefined('User')).toBe(true);
    expect(adapter.isDefined('Role')).toBe(true);

    const user = adapter.model('User');
    const role = adapter.model('Role');

    expect(user.associations.Role).toBeDefined();
    expect(role.associations.Users).toBeDefined();
  });
});
