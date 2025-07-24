const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config({ path: './server/Config.env' });

const app = require('./app');

const port = process.env.PORT || 3000;

const server = app.listen(port, () =>
  console.log(`Server running on port ${port}`)
);
