#!/bin/bash
sudo apt-get update
sudo apt-get install -y unzip
unzip webapp.zip
cd /home/admin/webapp
sudo apt-get install -y nodejs npm
sudo apt-get install -y postgresql postgresql-contrib
npm install sequelize --save
sudo npm install -g sequelize-cli
npm install express --save
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'shubhi2304';"
sudo -i -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE accounts TO postgres;"
sudo -i -u postgres psql -c "GRANT ALL ON SCHEMA public TO postgres;"
npm init -y
