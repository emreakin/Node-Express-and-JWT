const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Create a secret key
const secretOrPrivateKey = "secret_key";

app.get('/stat', (req, res) => {
    return res.status(200).send("OK");
});

app.post('/authenticate', (req, res) => {
    const userName = req.body.username;
    const password = req.body.password;

    if (!userName || !password) {
        return res.status(404).send({
            message: 'Email and password can not be empty!',
        });
    } else if(authenticateUser(userName, password)){
        // You'll fill real user data from database
        const payload = {
            email: "user_email",
            uuid: "user_uuid"
        };

        // This token will expire in 2 hours
        const options = {
            expiresIn :"2h"
        };

        const token = jwt.sign(payload, secretOrPrivateKey, options);

        return res.status(200).send({ message: 'success', token: token});
    } else {
        return res.status(404).send({
            message: 'User not found. Authentication failed.',
        });
    }

});

app.get('/requestParamExample/:parameterName', async (req, res) => {

    if(authorizeRequest(req)) {
        const parameter = req.params.parameterName;
        console.log("This is request parameter value -->", parameter);
        res.send(parameter);
        return res.status(200).send(parameter);
    } else {
        return res.status(401).send({
            message: 'Auth failed'
        });
    }

});

// We implemented dummy authenticate function.
// You'll use real user database for authentication in this function
const authenticateUser = function(userName, password) {
    return true;
};

const authorizeRequest = function(request) {
    try {
        /*JWT is send with request header!
        Format of it: Authorization : Bearer <token>
        */
        const token = request.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, 'secret_key');
        console.log("Decoded Token -->", decodedToken);

        return true;
    }catch(error) {
        return false;
    }
};



const PORT = process.env.PORT || 8088;
app.listen(PORT, () => {
    console.log("Server listening on port " + PORT + "...");
});
