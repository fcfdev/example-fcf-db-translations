# example-fcf-db-translations
How to launch the project:

1) Install FCF

2) To run the example, run the following commands:

$ cd ~

$ git clone https://github.com/fcfdev/example-fcf-db-translations

$ cd example-fcf-db-translations

MYSQL> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root;

$ fcfmngr create-db ./example-fcf-db-translations.js

$ cd example-fcf-db-translations

$ mysql -u root -p example-fcf-db-translations < example-fcf-db-translations.backup.sql

3) Run project

$ fcfnode example-fcf-db-translations.js
