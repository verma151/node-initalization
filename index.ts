import express from 'express';
const app = express();
import bodyParser from 'body-parser';
import cors from 'cors';
import logger from 'morgan';
import fileUpload from 'express-fileupload';
const db = require('./db-init/dbConn');
const user = require('./routes/user');
app.use(bodyParser.json());
app.use(cors());
app.disable('etag');
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(logger('common'));
app.use(fileUpload());

app.use('/api/user', user);

const port = process.env.PORT || 5000;

db.connect()
  .then((obj) => {
    obj.done(); // success, release connection;
    if (process.env.NODE_ENV !== 'test')
      app.listen(port, () =>
        console.log(`Server is listening at http://localhost:${port}`)
      );
  })
  .catch((error) => {
    console.log('ERROR:', error.message);
  });

module.exports = app;
