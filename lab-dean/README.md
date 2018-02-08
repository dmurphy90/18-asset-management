# 16 Basic Auth

## Installation
To install this app fork then clone the repo down to your own machine. Navigate to the directory named ```lab-dean``` and type ```npm install``` to get all of the NPM packages needed for the app. It is recommended to download either ```HTTPie``` or ```Postman``` to run the functions of the app, along with ```MongoDB```.

## Functionality
To get started first create a user by typing something like this into your command line:

```http POST http://localhost:3000/api/v1/signup username=tim password=dog email='tim@tim.com'```

This is using the POST HTTP method to create a new user object, with a safely encrypted password for user verification. 

If you want to sign in using the user object you created, type something like this into the command line:

```http -a tim:dog :3000/api/v1/signin```