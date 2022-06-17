'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      profileImage: {
        type: Sequelize.STRING
      },
      supportDoc: {
        type: Sequelize.STRING
      },
      identificationNumber: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING
      },
      resetPasswordToken: {
        type: Sequelize.STRING
      },
      resetPasswordExpires: {
        type: Sequelize.DATE
      },
      age: {
        type: Sequelize.INTEGER
      },
      dob: {
        type: Sequelize.DATE
      },
      maritalStatus: {
        type: Sequelize.ENUM,
        values: ['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED']
      },
      status: Sequelize.STRING,
      nationality: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};