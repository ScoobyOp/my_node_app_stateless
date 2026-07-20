<!-- Project Explanation -->
Authentication and Authorization 
---------------------------------
In the authentication there are two types of authentication.

1. // stateful authentication, where server will have control over the user session, he can logout the user 
<!-- it is already explained in the other project Express_App_Statful_Authentication -->

2. Stateless authentication - where user details are hashed and stored in the token, this token is not stored in db / server. it will be given to the user. server dont have control over it

It uses, the JWT method, JSON WEB TOKEN instead of Session ID. 
-------------------------------------------------------------------
This type of authentication is commonly is used in Sass based application where authentication is not much sensitive, when ever the application is hacked , this token can be tampered to see user details, but the hacked user cannot login the application with this tampered token, because the secrete key is not shared with him. which he don't have access to it

this token is generated along the secrete key, this key is used by server to encrypt and decrypt the token. Also we can set the expiry to the token. once it is expired, the user will be logged out and he need to relog in again to generate the fresh token.

Even Stateless authentication follow's the three process.

It involves three, process
1, sign up
2. login 
3. to authentication who u are? server will follow this below process

1.Signup
---------
The process of sign up is common in both the stateless(db not involved much) and Stateful (db not involved most of the time) authentication 

2.Login 
--------
But in login, instead of creating session id, here we are creating the token using jwt and sharing the token back to the user.
here token consist of user details + secret , this token is exchanged with the server on every request by client.
Note: we are not storing the token in the db

3, to authentication who u are? server will follow this below process
------------------------------------------------------------------------
Here server receives the token in the authorization header and it decodes the token to get Ur information , on the every request.
It is uses the secret key to decode the token , it never interacts with db, so db calls are reduced.

Important note: when ever we pass token in the header, we need to add the bearer in the token , basically Bearer <token> like this , because library recommends it. if bearer is not added, it will not work and it becomes invalid token

Advantage's
Now the DB call's are reduced completely , latency has been improved from the server, basically it is optimized.

Disadvantage
Server will not have control over the created token, has it shared with the user.


# Express Stateless Authentication
## Below are docker command
## Run Development 

docker compose -f docker-compose.dev.yml up --build

## Run Production

docker compose -f docker-compose.prod.yml up --build