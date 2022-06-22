'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.userOTP, {
        as: 'user',
        foreignKey: 'userId'
      });
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    gender: DataTypes.STRING,
    profileImage: DataTypes.STRING,
    supportDoc: DataTypes.STRING,
    identificationNumber: DataTypes.STRING,
    resetPasswordToken: DataTypes.STRING,
    resetPasswordExpires: DataTypes.DATE,
    age: DataTypes.INTEGER,
    dob: DataTypes.DATE,
    maritalStatus: {
      type: DataTypes.ENUM,
        values: ['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED'],
    },
    status: DataTypes.STRING,
    nationality: DataTypes.STRING,
    password: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};