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
npm init -y
