# User Session Management API

## Description
user_session_management is an authentication api. IThis api takes care of signup, signin, update account, forgot password, reset password, get users, get user, delete user.

## Installation
Clone the repository and cd into the project directory
Run npm install or yarn add to install all project dependencies
Create .env file and add your database details
Run `npm run develop` or `yarn develop` to start local server which will run on localhost:1337

## Usage
### API Endpoints
- POST `api/auth/login` to login into your account with access token
- POST `api/auth/forgot-password` to request link to chage password
- PUT `api/auth/reset-password` to update account password 
- POST `api/users` to create user's account
- GET `api/users` to get all users
- GET `api/users/:userId` to get a user's data by id
- PUT `api/users/:userId` to update a user's data by id
- DELETE `api/users/:userId` to delete user's account

## Built With
Node/Express - The web framework used
MongoDB - DataBase Management System

## Contributing: 
To contribute, raise an issue and it will be reviewed

## Author
[Odinaka Joy](https://dinakajoy/)

## License
This project is licensed under the MIT License - see the [MIT License](https://opensource.org/licenses/MIT) file for details
