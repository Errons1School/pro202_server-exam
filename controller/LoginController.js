/** #======================================================#
 *  #    Program or program file : LoginController.js
 *  #    Description: Receives API call for Login
 *  #    Author: Bjarte
 *  #    Date: Unknown
 *  #    Version 1.0
 *  #======================================================#
 * */


import * as Services from "../services/LoginService.js";

/**
 * @description takes a cookie for approval and adds it to the requests (for the next task in line)
 * @param       req - The whole received HTTP message with headers and body
 * @param       res - The whole responding HTTP message with headers and body
 * @param       next - "function" call to the next step in Router.js
 * @return      async return with http response */
export async function requestUser(req, res, next) {
    console.log("requestUser()");

    const {email} = req.signedCookies;
    let rows;

    try {
        rows = await Services.requestUser(email);
    } catch (error) {
        console.log("SQL error: ", error);
        res.sendStatus(500);
    }

    if (rows.length > 0) {
        req.user = {email: rows[0].email, role: rows[0].role};
    }

    next();
}

/** @description methode to check login for user, will sign a secure cookie
 * @param       req - The whole received HTTP message with headers and body
 * @param       res - The whole responding HTTP message with headers and body
 * @return      async return with http response */
export async function login(req, res) {
    console.log("login()");

    const {email, password} = req.body;

    if (email === "" || password === "") {
        // 400 bad request
        return res.sendStatus(400);
    }

    try {
        // Check user to database
        const {rows} = await Services.loginUser(email, password);

        if (rows.length < 1) {
            // 400 Bad Request
            return res.sendStatus(400);

        } else {
            // Successful login
            res.cookie("email", rows[0].email, {signed: true});
            res.cookie("role", rows[0].role, {signed: true});
            return res.sendStatus(200);
        }

    } catch (error) {
        console.log("SQL error: ", error);
        return res.sendStatus(500);
    }
}
