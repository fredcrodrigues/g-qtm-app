const express = require("express");
const server = express();
const path = require("path");
require("dotenv").config()

//config template engine
    server.set("view engine", "ejs");

//set static files
    server.use(express.static(path.join(__dirname, "public")));

//routes
    //redirect to continue register
    server.get("/redirect-to-register", (req, res) => {
        res.render("redirectToRegister", {
            deepLink: process.env.DEEP_LINK_REGISTER,
            playStoreLink: process.env.PLAY_STORE_LINK,
            appleStoreLink: process.env.APPLE_STORE_LINK
        });
    });

    //redirect to finished register
    server.get("/redirect-to-finished-register", (req, res) => {
        res.render("redirectFinishedRegister", {
            deepLink: process.env.DEEP_LINK_FINISHED,
            playStoreLink: process.env.PLAY_STORE_LINK,
            appleStoreLink: process.env.APPLE_STORE_LINK
        });
    });

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on the ${PORT} port`));