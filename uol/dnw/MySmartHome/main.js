// MySmart Home
// Routing

////////////////////
/// Dependancies ///
////////////////////

const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const { body, validationResult, Result } = require("express-validator");

//////////////
/// routes ///
//////////////

module.exports = (app) => {
    /** GET home page
     *
     * Accepts: none
     * Returns: public/home.html */
    app.get("/", (req, res, next) => {
        console.log("GET '/'");
        res.sendFile("public/home.html", { root: "." });
    });

    /** GET about page
     *
     * Accepts: none
     * Returns: public/about.html */
    app.get("/about", (req, res, next) => {
        console.log("GET '/about'");
        res.sendFile("public/about.html", { root: "." });
    });

    /** GET add device page - Once a deviceType is selected by the user,
     *  parameters are sent to configure the form fields. If no deviceType has
     *  been selected, a default "LIGHT" type is used.
     *
     * Accepts: deviceadd.ejs (devType)
     * Returns: deviceadd.ejs (selectedType, stateControl, percentControl,
     *          tempControl) */
    app.get("/deviceadd", (req, res, next) => {
        console.log("GET '/deviceadd'");

        // if no device type then set default
        if (!req.query.devType) {
            req.query.devType = "LIGHT";
        }

        // customize device parameters for various device types
        var percentControl = { show: true };
        var stateControl = { show: true, onLabel: "ON", offLabel: "OFF" };
        var tempControl = { show: false };
        switch (req.query.devType) {
            case "LIGHT":
                percentControl.label = "Brightness: ";
                break;
            case "WINDOW COVERING":
                stateControl.show = false;
                percentControl.label = "Percent Closed: ";
                break;
            case "AV EQUIPMENT":
                percentControl.label = "Volume: ";
                break;
            case "SECURITY SENSOR":
                percentControl.show = false;
                stateControl.onLabel = "Armed";
                stateControl.offLabel = "Disarmed";
                break;
            case "HVAC":
                percentControl.show = false;
                tempControl.show = true;
                tempControl.min = 0;
                tempControl.max = 50;
                break;
            case "APPLIANCE":
                percentControl.show = false;
                tempControl.show = true;
                tempControl.min = -50;
                tempControl.max = 500;
                break;
            default:
                // devType is not in the ENUM list
                const error = {
                    message: "Data Validation Error",
                    status: "Invalid devType",
                    stack: "devType value: " + req.query.devType,
                };
                console.log(error);
                res.render("error.ejs", { error });
                return;
        }

        // Send device parameters to webform
        res.render("deviceadd.ejs", {
            selectedType: req.query.devType,
            stateControl: stateControl,
            percentControl: percentControl,
            tempControl: tempControl,
        });
    });

    /** POST add device button - Validate form data received, create SQL
     *  query to add new device to database.
     *
     * Accepts: deviceadd.ejs (devType, devName, devState, devPercent,
     *          devTemp)
     * Returns: success.ejs or error.ejs */
    app.post(
        "/deviceadd",
        urlencodedParser,
        body("devType")
            .exists({ checkFalsy: true })
            .withMessage("Device Type not received."),
        body("devName")
            .exists({ checkFalsy: true })
            .withMessage("Device Name not received.")
            .isLength({ min: 4, max: 25 })
            .withMessage("Device Name must be between 4 and 25 characters.")
            .isAlphanumeric(undefined, { ignore: "-:()'?!&., " })
            .withMessage(
                "Device Name must contain only alphanumeric characters, - : ( ) ' ? ! &, period, coma, and spaces."
            ),
        body("devState")
            .exists({ checkFalsy: true })
            .withMessage("Device State not received.")
            .isBoolean()
            .withMessage("Device State is not a boolean value"),
        body("devPercent")
            .exists({ checkFalsy: true })
            .withMessage("Device Percent not received.")
            .isInt({ min: 0, max: 100 })
            .withMessage("Device Percent out of range (0 to 100)."),
        body("devTemp")
            .exists({ checkFalsy: true })
            .withMessage("devTemp not received.")
            .isInt({ min: -50, max: 500 })
            .withMessage("Device Temperature out of range (-50 to 500)."),
        (req, res, next) => {
            console.log("POST '/deviceadd'");

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors);
                const err = {
                    message: "Data Validation Error",
                    status: errors.array()[0].msg,
                    stack: "value: " + errors.array()[0].value,
                };
                res.render("error.ejs", { error: err });
                return;
            }

            // data sanitation before query
            let deviceData = {
                devType: app.locals.db.escape(req.body.devType),
                devName: app.locals.db.escape(req.body.devName),
                devState: app.locals.db.escape(req.body.devState),
                devPercent: app.locals.db.escape(req.body.devPercent),
                devTemp: app.locals.db.escape(req.body.devTemp),
            };

            // set NULL values according to device type
            switch (deviceData.devType) {
                case "'LIGHT'":
                    deviceData.devTemp = "NULL";
                    break;
                case "'WINDOW COVERING'":
                    deviceData.devState = "NULL";
                    deviceData.devTemp = "NULL";
                    break;
                case "'AV EQUIPMENT'":
                    deviceData.devTemp = "NULL";
                    break;
                case "'SECURITY SENSOR'":
                    deviceData.devPercent = "NULL";
                    deviceData.devTemp = "NULL";
                    break;
                case "'HVAC'":
                    deviceData.devPercent = "NULL";
                    break;
                case "'APPLIANCE'":
                    deviceData.devPercent = "NULL";
                    break;
                default:
                    // devType is not in the ENUM list
                    const error = {
                        message: "Data Validation Error",
                        status: "Invalid devType",
                        stack: "devType value: " + deviceData.devType,
                    };
                    console.log(error);
                    res.render("error.ejs", { error });
                    return;
            }

            /** Add new device to devices table
             * Accepts: deviceData object
             * Returns: none */
            const sqlCommand = `INSERT INTO devices (devType, devName, devState, devPercent, devTemp) VALUES (${deviceData.devType}, ${deviceData.devName}, ${deviceData.devState}, ${deviceData.devPercent}, ${deviceData.devTemp})`;

            console.log(sqlCommand);

            app.locals.db.query(sqlCommand, (err, result) => {
                if (err) {
                    console.error(err);
                    res.render("error.ejs", { error: err });
                } else {
                    console.log(result);
                    res.render("success.ejs");
                }
            });
        }
    );

    /** GET device status page - Database is queried for a list of all
     *  devices and result is sent to the user to select a device. Parameters
     *  are sent to configure the form fields for the selected device.  If no
     *  device has been selected, a default device is selected.
     *
     * Accepts: devicestatus.ejs (devSelect)
     * Returns: devicestatus.ejs (devArray, selectedDevice, stateControl,
     *          percentControl, tempControl) */
    app.get("/devicestatus", (req, res, next) => {
        console.log("GET '/devicestatus'");

        /** Get list of all devices from devices table
         * Accepts: none
         * Returns: arrayResult */
        const sqlCommand = `SELECT * FROM devices ORDER BY devType ASC, devName ASC`;

        app.locals.db.query(sqlCommand, (err, arrayResult) => {
            if (err) {
                console.error(err);
                res.render("error.ejs");
            } else {
                // is the result array empty
                if (arrayResult == "") {
                    const error = { message: "No devices in database" };
                    console.log(error.message);
                    res.render("error.ejs", { error });
                    return;
                }

                // if no device was passed in then set a default device
                let selectedDevice = 0;
                if (req.query.devSelect) {
                    selectedDevice = req.query.devSelect;
                }

                // does devSelect point to a valid database entry
                let deviceType = "";
                try {
                    deviceType = arrayResult[selectedDevice].devType;
                } catch (error) {
                    console.error(error);
                    error.message = "DevSelect index is out of range";
                    res.render("error.ejs", { error });
                    return;
                }

                // customize device parameters for different device types
                var percentControl = { show: true };
                var stateControl = {
                    show: true,
                    onLabel: "ON",
                    offLabel: "OFF",
                };
                var tempControl = { show: false };
                switch (deviceType) {
                    case "LIGHT":
                        percentControl.label = "Brightness: ";
                        break;
                    case "WINDOW COVERING":
                        stateControl.show = false;
                        percentControl.label = "Percent Closed: ";
                        break;
                    case "AV EQUIPMENT":
                        percentControl.label = "Volume: ";
                        break;
                    case "SECURITY SENSOR":
                        percentControl.show = false;
                        stateControl.onLabel = "Armed";
                        stateControl.offLabel = "Disarmed";
                        break;
                    case "HVAC":
                        percentControl.show = false;
                        tempControl.show = true;
                        tempControl.min = 0;
                        tempControl.max = 50;
                        break;
                    case "APPLIANCE":
                        percentControl.show = false;
                        tempControl.show = true;
                        tempControl.min = -50;
                        tempControl.max = 500;
                        break;
                    default:
                        // devType is not in the ENUM list
                        const error = {
                            message: "Data Validation Error",
                            status: "Invalid devType",
                            stack: "devType value: " + deviceType,
                        };
                        console.log(error);
                        res.render("error.ejs", { error });
                        return;
                }

                // Send array of devices and device type parameters to webform
                res.render("devicestatus.ejs", {
                    devArray: arrayResult,
                    selectedDevice: selectedDevice,
                    stateControl: stateControl,
                    percentControl: percentControl,
                    tempControl: tempControl,
                });
            }
        });
    });

    /** GET all devices status page - Database is queried for a list of all
     *  devices and result is sent to display a table of all devices.
     *
     * Accepts: none
     * Returns: alldevices.ejs (devArray) */
    app.get("/alldevices", (req, res, next) => {
        console.log("GET '/alldevices'");

        /** Get list of all devices from devices table
         * Accepts: none
         * Returns: arrayResult */
        const sqlCommand = `SELECT * FROM devices ORDER BY devType ASC, devName ASC`;

        app.locals.db.query(sqlCommand, (err, arrayResult) => {
            if (err) {
                console.error(err);
                res.render("error.ejs");
            } else {
                // is the result array empty
                if (arrayResult == "") {
                    const error = { message: "No devices in database" };
                    console.log(error.message);
                    res.render("error.ejs", { error });
                    return;
                }

                // Send arrayResult
                res.render("alldevices.ejs", {
                    devArray: arrayResult,
                });
            }
        });
    });

    /** GET control device page - Database is queried for a list of all
     *  devices and result is sent to the user to select a device. Parameters
     *  are sent to configure the form fields for the selected device type.
     *  If no device has been selected, a default device is displayed.
     *
     * Accepts: devicecontrol.ejs (devSelect)
     * Returns: devicecontrol.ejs (devArray, selectedDevice, stateControl,
     *          percentControl, tempControl) */
    app.get("/devicecontrol", (req, res, next) => {
        console.log("GET '/devicecontrol'");

        /** Get list of all devices from devices table
         * Accepts: none
         * Returns: arrayResult */
        const sqlCommand = `SELECT * FROM devices ORDER BY devType ASC, devName ASC`;

        app.locals.db.query(sqlCommand, (err, arrayResult) => {
            if (err) {
                console.error(err);
                res.render("error.ejs");
            } else {
                // is the result array empty
                if (arrayResult == "") {
                    const error = { message: "No devices in database" };
                    console.log(error.message);
                    res.render("error.ejs", { error });
                    return;
                }

                // if no device was passed in then set a default device
                let selectedDevice = 0;
                if (req.query.devSelect) {
                    selectedDevice = req.query.devSelect;
                }

                // does devSelect point to a valid database entry
                let deviceType = "";
                try {
                    deviceType = arrayResult[selectedDevice].devType;
                } catch (error) {
                    console.error(error);
                    error.message = "DevSelect index is out of range";
                    res.render("error.ejs", { error });
                    return;
                }

                // customize device parameters for different device types
                var percentControl = { show: true };
                var stateControl = {
                    show: true,
                    onLabel: "ON",
                    offLabel: "OFF",
                };
                var tempControl = { show: false };
                switch (deviceType) {
                    case "LIGHT":
                        percentControl.label = "Brightness: ";
                        break;
                    case "WINDOW COVERING":
                        stateControl.show = false;
                        percentControl.label = "Percent Closed: ";
                        break;
                    case "AV EQUIPMENT":
                        percentControl.label = "Volume: ";
                        break;
                    case "SECURITY SENSOR":
                        percentControl.show = false;
                        stateControl.onLabel = "Armed";
                        stateControl.offLabel = "Disarmed";
                        break;
                    case "HVAC":
                        percentControl.show = false;
                        tempControl.show = true;
                        tempControl.min = 0;
                        tempControl.max = 50;
                        break;
                    case "APPLIANCE":
                        percentControl.show = false;
                        tempControl.show = true;
                        tempControl.min = -50;
                        tempControl.max = 500;
                        break;
                    default:
                        // devType is not in the ENUM list
                        const error = {
                            message: "Data Validation Error",
                            status: "Invalid devType",
                            stack: "devType value: " + deviceType,
                        };
                        console.log(error);
                        res.render("error.ejs", { error });
                        return;
                }

                // Send array of devices and device type parameters to webform
                res.render("devicecontrol.ejs", {
                    devArray: arrayResult,
                    selectedDevice: selectedDevice,
                    stateControl: stateControl,
                    percentControl: percentControl,
                    tempControl: tempControl,
                });
            }
        });
    });

    /** POST control device button - Validate form data received, create SQL
     *  query to change existing record in database to new values.
     *
     * Accepts: devicecontrol.ejs (devID, devType, devName, devState,
     *          devPercent, devTemp)
     * Returns: success.ejs or error.ejs */
    app.post(
        "/devicecontrol",
        urlencodedParser,
        body("devID")
            .exists({ checkFalsy: true })
            .withMessage("Device ID not received.")
            .isInt({ min: 0 })
            .withMessage("Device ID must be an integer."),
        body("devType")
            .exists({ checkFalsy: true })
            .withMessage("Device Type not received."),
        body("devName")
            .exists({ checkFalsy: true })
            .withMessage("Device Name not received.")
            .isLength({ min: 4, max: 25 })
            .withMessage("Device Name must be between 4 and 25 characters.")
            .isAlphanumeric(undefined, { ignore: "-:()'?!&., " })
            .withMessage(
                "Device Name must contain only alphanumeric characters, - : ( ) ' ? ! &, period, coma, and spaces."
            ),
        body("devState")
            .exists({ checkFalsy: true })
            .withMessage("Device State not received.")
            .isBoolean()
            .withMessage("Device State is not a boolean value"),
        body("devPercent")
            .exists({ checkFalsy: true })
            .withMessage("Device Percent not received.")
            .isInt({ min: 0, max: 100 })
            .withMessage("Device Percent out of range (0 to 100)."),
        body("devTemp")
            .exists({ checkFalsy: true })
            .withMessage("devTemp not received.")
            .isInt({ min: -50, max: 500 })
            .withMessage("Device Temperature out of range (-50 to 500)."),
        (req, res, next) => {
            console.log("POST '/devicecontrol'");

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors);
                const err = {
                    message: "Data Validation Error",
                    status: errors.array()[0].msg,
                    stack: "value: " + errors.array()[0].value,
                };
                res.render("error.ejs", { error: err });
                return;
            }

            // data sanitation before query
            let deviceData = {
                devID: app.locals.db.escape(req.body.devID),
                devType: app.locals.db.escape(req.body.devType),
                devName: app.locals.db.escape(req.body.devName),
                devState: app.locals.db.escape(req.body.devState),
                devPercent: app.locals.db.escape(req.body.devPercent),
                devTemp: app.locals.db.escape(req.body.devTemp),
            };

            // set NULL values according to device type
            switch (deviceData.devType) {
                case "'LIGHT'":
                    deviceData.devTemp = "NULL";
                    break;
                case "'WINDOW COVERING'":
                    deviceData.devState = "NULL";
                    deviceData.devTemp = "NULL";
                    break;
                case "'AV EQUIPMENT'":
                    deviceData.devTemp = "NULL";
                    break;
                case "'SECURITY SENSOR'":
                    deviceData.devPercent = "NULL";
                    deviceData.devTemp = "NULL";
                    break;
                case "'HVAC'":
                    deviceData.devPercent = "NULL";
                    break;
                case "'APPLIANCE'":
                    deviceData.devPercent = "NULL";
                    break;
                default:
                    // devType is not in the ENUM list
                    const error = {
                        message: "Data Validation Error",
                        status: "Invalid Device Type",
                        stack: "devType value: " + deviceData.devType,
                    };
                    console.log(error);
                    res.render("error.ejs", { error });
                    return;
            }

            /** Change values of existing record in devices table
             * Accepts: deviceData object
             * Returns: none */
            const sqlCommand = `UPDATE devices SET devName=${deviceData.devName}, devState=${deviceData.devState}, devPercent=${deviceData.devPercent}, devTemp=${deviceData.devTemp} WHERE devID=${deviceData.devID}`;

            console.log(sqlCommand);

            app.locals.db.query(sqlCommand, (err, result) => {
                if (err) {
                    console.error(err);
                    res.render("error.ejs", { error: err });
                } else {
                    console.log(result);
                    res.render("success.ejs");
                }
            });
        }
    );

    /** GET delete device page - Database is queried for a list of all
     *  devices and result is sent to the user to select a device. Parameters
     *  are sent to configure the form fields for the selected device type.
     *  If no device has been selected, a default device is displayed.
     *
     * Accepts: devicedelete.ejs (devSelect)
     * Returns: devicedelete.ejs (devArray, selectedDevice, stateControl,
     *          percentControl, tempControl) */
    app.get("/devicedelete", (req, res, next) => {
        console.log("GET '/devicedelete'");

        /** Get list of all devices from devices table
         * Accepts: none
         * Returns: arrayResult */
        const sqlCommand = `SELECT * FROM devices ORDER BY devType ASC, devName ASC`;

        app.locals.db.query(sqlCommand, (err, arrayResult) => {
            if (err) {
                console.error(err);
                res.render("error.ejs");
            } else {
                // is the result array empty
                if (arrayResult == "") {
                    const error = { message: "No devices in database" };
                    console.log(error.message);
                    res.render("error.ejs", { error });
                    return;
                }

                // if no device was passed in then set a default device
                let selectedDevice = 0;
                if (req.query.devSelect) {
                    selectedDevice = req.query.devSelect;
                }

                // does devSelect point to a valid database entry
                let deviceType = "";
                try {
                    deviceType = arrayResult[selectedDevice].devType;
                } catch (error) {
                    console.error(error);
                    error.message = "DevSelect index is out of range";
                    res.render("error.ejs", { error });
                    return;
                }

                // customize device parameters for different device types
                var percentControl = { show: true };
                var stateControl = {
                    show: true,
                    onLabel: "ON",
                    offLabel: "OFF",
                };
                var tempControl = { show: false };
                switch (deviceType) {
                    case "LIGHT":
                        percentControl.label = "Brightness: ";
                        break;
                    case "WINDOW COVERING":
                        stateControl.show = false;
                        percentControl.label = "Percent Closed: ";
                        break;
                    case "AV EQUIPMENT":
                        percentControl.label = "Volume: ";
                        break;
                    case "SECURITY SENSOR":
                        percentControl.show = false;
                        stateControl.onLabel = "Armed";
                        stateControl.offLabel = "Disarmed";
                        break;
                    case "HVAC":
                        percentControl.show = false;
                        tempControl.show = true;
                        tempControl.min = 0;
                        tempControl.max = 50;
                        break;
                    case "APPLIANCE":
                        percentControl.show = false;
                        tempControl.show = true;
                        tempControl.min = -50;
                        tempControl.max = 500;
                        break;
                    default:
                        // devType is not in the ENUM list
                        const error = {
                            message: "Data Validation Error",
                            status: "Invalid devType",
                            stack: "devType value: " + deviceType,
                        };
                        console.log(error);
                        res.render("error.ejs", { error });
                        return;
                }

                // Send array of devices and device type parameters to webform
                res.render("devicedelete.ejs", {
                    devArray: arrayResult,
                    selectedDevice: selectedDevice,
                    stateControl: stateControl,
                    percentControl: percentControl,
                    tempControl: tempControl,
                });
            }
        });
    });

    /** POST delete device button - Create SQL query to delete device record
     *  matching the device ID.
     *
     * Accepts: devicedelete.ejs (devID)
     * Returns: success.ejs or error.ejs */
    app.post(
        "/devicedelete",
        urlencodedParser,
        body("devID")
            .exists({ checkFalsy: true })
            .withMessage("Device ID not received.")
            .isInt({ min: 0 })
            .withMessage("Device ID must be an integer."),
        (req, res, next) => {
            console.log("POST '/devicedelete'");

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors);
                const err = {
                    message: "Data Validation Error",
                    status: errors.array()[0].msg,
                    stack: "value: " + errors.array()[0].value,
                };
                res.render("error.ejs", { error: err });
                return;
            }
            console.log(req.body);

            // data sanitation before query
            const deviceData = {
                devID: app.locals.db.escape(req.body.devID),
            };

            /** Delete record in devices table where devID matches devID
             * Accepts: devID
             * Returns: none */
            const sqlCommand = `DELETE FROM devices WHERE devID=${deviceData.devID}`;

            console.log(sqlCommand);

            app.locals.db.query(sqlCommand, (err, result) => {
                if (err) {
                    console.error(err);
                    res.render("error.ejs", { error: err });
                } else {
                    console.log(result);
                    res.render("success.ejs");
                }
            });
        }
    );
};

console.log("Routes added.");
