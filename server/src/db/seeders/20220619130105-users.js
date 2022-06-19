'use strict';

const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        firstName: 'Test',
        lastName: 'User',
        gender: 'Male',
        dob: '2000-01-01',
        age: '22',
        maritalStatus: 'SINGLE',
        email: 'test@example.com',
        password: bcrypt.hashSync('Password12345!', 10),
        nationality:'Rwandan',
        createdAt: moment.utc().format(),
        updatedAt: moment.utc().format(),
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
