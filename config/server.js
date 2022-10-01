module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
});


// module.exports = ({ env }) => ({
//   proxy: true,
//   url: env('APP_URL'), // replaces `host` and `port` properties in the development environment
//   host: env('HOST', '0.0.0.0'),
//   port: env.int('PORT', 1337),
//   app: {
//     keys: env.array('APP_KEYS')
//   },
// });