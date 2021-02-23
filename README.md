# Capstone Product management with CI/CD pipeline



# Functionality of the application

This application will allow creating/removing/updating/fetching a product 

the projet have a CI/CD pipepeline based on Aws code pipeline, codebuild and github webhook

the frontend is deployed on S3 bucket static hosting

The frontend use serveless framework

For authentification the project use AUhtO with custom authorizer lambda

The starter code comes with a configured [Winston](https://github.com/winstonjs/winston) logger that creates [JSON formatted](https://stackify.com/what-is-structured-logging-and-why-developers-need-it/) log statements. You can use it to write log messages like this:


# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```


