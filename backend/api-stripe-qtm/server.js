const express = require("express");
const server = express()
const routerImported = require("./routes")
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const checkAuthorization = require("./middlewares/checkAuthentication");

//firebase initialize
    admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://app-qtm-25e27-default-rtdb.firebaseio.com"
});

//body parser: json
    server.use(express.urlencoded({extended: true, limit: '10mb'}));
    server.use(express.json({limit: '10mb'}));

//authorization
    //  server.use(checkAuthorization)

//router integration
    server.use(routerImported);


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on the port ${PORT}`);
});