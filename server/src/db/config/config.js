const dotenv = require('dotenv');

dotenv.config();

const config = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_PORT,
    dialect: 'postgres',
    operatorsAliases: false,
  },
  test: {
    username: process.env.TEST_DB_USERNAME,
    password: process.env.TEST_DB_PASSWORD,
    database: 'companyz_test',
    host: '127.0.0.1',
    dialect: 'postgres',
    operatorsAliases: false,
  },
  production: {
    username: process.env.DB_USERNAME_PRO,
    password: process.env.DB_PASSWORD_PRO,
    database: process.env.DB_NAME_PRO,
    host: process.env.DB_HOST_PRO,
    dialect: 'postgres',
    operatorsAliases: false,
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
      },
    },
  },
};
module.exports = config;