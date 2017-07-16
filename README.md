# rjjenda

## Intializing database
````
$ psql postgres

postgres=# CREATE DATABASE rjjenda;
postgres=# CREATE ROLE rjjenda WITH LOGIN;
postgres=# GRANT ALL ON DATABASE "rjjenda" TO rjjenda;
postgres=# \q
````

## Global npm requirements
- `typescript` for compilation

## Initial setup commands
````bash
npm i -g typescript #if not already installed
npm run compile
init-scripts/sync-database.js
init-scripts/import-students-teachers.js csvFile #provide path to users CSV file
init-scripts/set-admin.js username #provide username of initial admin
````

Everything else is easier to accomplish through the admin interface.