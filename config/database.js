// const path = require('path');

module.exports = ({ env }) => ({
  connection: {
    // client: 'sqlite',
    client: 'postgres',
    connection: {
      // filename: path.join(__dirname, '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      host: env('DATABASE_HOST'),
      port: env.int('DATABASE_PORT'),
      database: env('DATABASE_NAME'),
      user: env('DATABASE_USERNAME'),
      password: env('DATABASE_PASSWORD'),
      ssl: {
        rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false),
      },
    },
    debug: false,
    useNullAsDefault: true,
  },
});
