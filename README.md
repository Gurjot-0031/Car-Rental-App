# soen6461 - Car Rental System for SOEN6461 Fall 2019

## Team Members
1. Richard Grand'Maison - 26145965 - rich.grandmaison@gmail.com
1. Pargol Poshtareh - 26428126 - pargol.poshtareh@gmail.com
1. Gurjot Singh - 40091208 - gurjot5076@gmail.com
1. Adrien Dat - 40072965 - ad_dat@encs.concordia.com (for Gdrive purposes, use dridri.dat@gmail.com)
1. Ravneet Singh Brar - 40078628 - rippybrar1994@gmail.com


## Resources

### Important links
* Software Design Methodologies: https://users.encs.concordia.ca/~cc/soen6461/
* Project Description: https://users.encs.concordia.ca/~cc/soen6461/project/description.pdf
* Gdrive of our group: https://drive.google.com/drive/u/0/folders/1tbhtx3UYi-rjlkWTxQqiZU4-PEraVbvF?hl=fr


### Git Flow Process

https://datasift.github.io/gitflow/IntroducingGitFlow.html

### Bootstraping Information

Inspired from: https://www.baeldung.com/spring-boot-angular-web

* NodeJS: https://nodejs.org/en/
* Angular CLI: https://cli.angular.io/
* Java 11 JDK: https://www.oracle.com/java/technologies/javase-jdk11-downloads.html
* Spring Initialzr: https://start.spring.io/

### Database Management

The database is a MySQL. It is managed by 1 main library and a few scripts.

flyway (https://flywaydb.org/) - Provides a sort of version control for our database. Allows us to build our database from incremental changes. This works by creating successive sql scripts labelled V001__<name>.sql, V002__<name>.sql and so forth. When updating the DB, flyway will only apply the incremental changes. flyway is configured in backend.gradle.

The flyway scripts are located in backend/src/main/resources/db/migration, and must be labelled Vxxx_<name>.sql Unless it is really early in development DO NOT MODIFY flyway scripts that have been pushed to the develop branch!

For the database, use the shell scripts in script to create/destroy/update the database. For example to refresh the database to it's initial state:

`script/destroy-db.sh; script/create-db.sh; script/update-db.sh;`

The `update-db.sh` script runs flyway commands to bring the database up to date and regenerate the jooq objects. Note that when the application starts it runs flyway to ensure the db is up to date.

If you use Windows and Git Bash, the MySQL might hang. Try this to solve it: https://stackoverflow.com/questions/32620670/git-bash-mysql-blank

 ###  Running the application

1. Copy the `application.properties` file and create a file called `application-local.properties` located in the same place. Here, you must enter your mysql username and password.
1. Create a run configuration for Spring that accepts "local" as the profile.
1. cd to the /client folder, and run `npm install`
1. From your IDE, you should be able to create a Spring Boot run configuration. Set RentalApplication as the main class and Run.
1. Open a terminal, and cd to the /client folder. Once there, run `ng serve` to build and serve the front end.
1. Open a browser and head to localhost:4200 !

### Useful links

* Running queries using JDBC - https://www.baeldung.com/spring-jdbc-jdbctemplate


