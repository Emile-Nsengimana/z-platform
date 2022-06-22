'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userOTP extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      userOTP.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      });
    }
  }
  userOTP.init({
    userId: DataTypes.INTEGER,
    otp: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'userOTP',
  });
  return userOTP;
};