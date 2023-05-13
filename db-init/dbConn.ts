var options = {
  error: (error, e) => {
    if (e.cn) {
      // A connection-related error;
      console.log('CN:', e.cn);
      console.log('EVENT:', error.message);
    }
  },
};
const pg = require('pg-promise')(options);
const config = require('config');
const postgresURL = config.get('postgresURL');
const db = pg(postgresURL);

module.exports = db;
