// Web Server

console.log("\n\nStarting MySmartHome web application...");

////////////////////
/// Dependancies ///
////////////////////

console.log("\nLoading modules...");
const createError = require("http-errors");
const express = require("express");
const logger = require("morgan");
const mysql = require("mysql");
const path = require("path");

//////////////////////
/// Initialization ///
//////////////////////

const port = 8089;
const app = express();
const url = "http://localhost:" + port;

// attach the routes
console.log("Adding routes...");
require("./routes/main")(app);

// provide database credentials
console.log("Connecting to database...");
const db = mysql.createConnection({
    host: "localhost",
    user: "brent",
    password: "rootofBrent",
    database: "mySmartHome",
});

//connect to database
db.connect((err) => {
    if (err) {
        console.log("Database connection error encountered:");
        throw err;
    }
    console.log("Database connected!");
});

// make database available globally
app.locals.db = db;

// setup the ejs template view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

///////////////////
/// middlewares ///
///////////////////

// log events to the console
app.use(logger("dev")); // development mode

// set a folder for serving static files
app.use(express.static(path.join(__dirname, "public")));

// catch 404 error and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only show errors in development mode
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error.ejs");
});

////////////////
/// listener ///
////////////////

// start the listener
app.listen(port, () => console.log(`Listening on port ${port}!`));
