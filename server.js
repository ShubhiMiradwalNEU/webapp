const http = require('http');
const sequelize = require('./app/config/database');
const fs = require('fs');
const csvParser = require('csv-parser');
const User = require('./app/model/user-model');
const app = require('./app/app.js');
const bcrypt = require('bcrypt');

async function db_main() {
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  await sequelize.query("CREATE SCHEMA IF NOT EXISTS public;");
  await sequelize.sync({ alter: true });

  try {
    fs.createReadStream('users.csv')
      .pipe(csvParser())
      .on('data', async (row) => {
        try {
          const hashedPassword = await bcrypt.hash(String(row.password), 10);
            User.create({
            first_name: row.first_name,
            last_name: row.last_name,
            email: row.email,
            password: hashedPassword
          });
        } catch (error) {
          console.error('Error hashing password:', error);
        }        

      })
      .on('end', () => {
        console.log('Users have been added from users.csv to the database.');
      });
  } catch (error) {
    console.error('Error:', error);
  }
  const healthz = sequelize.define('healthz', {});
  await sequelize.sync({ alter: true });
}

const port = 8080;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is starting at ${port}`);
  db_main()
});

