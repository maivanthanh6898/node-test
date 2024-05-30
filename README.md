```- How to run and test project```
* node version: v16.14.2 ( with nvm you can run command `nvm use`)
* Db using: `mysql`
1. Change env in .env file into your local config
2. open mysql and create database `user_profiles`
3. Open terminal and cd to project and run command `npm install`
4. Then run command `npm run dev` to start project
5. Import test.postman_collection.json into postman and test

```- Project information``` 
 * this project is processing basic action (CRUD) with user information
 * Project provide 5 api: 
   * Do register account (POST)
   * Get account information (GET)
   * Do delete account (DELETE)
   * Do lock account (PUT)
   * Do login (POST)
 * Project using jwt to authenticate and aes cbc 256 to encrypt data between server and client to protect data

```- design decisions ```  
 * project using express js and middleware layer to validate and log request information to control request from client.
 * we're using a connection pool from mysql and sequelize to communicate with sql server
 * 