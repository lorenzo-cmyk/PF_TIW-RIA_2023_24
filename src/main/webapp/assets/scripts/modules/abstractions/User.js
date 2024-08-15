/**
 * @file User.js is the file responsible for the User class.
 * This class is responsible for the user-related actions.
 * It is used to create, log in, and log out a user.
 * It uses the Validators and APIInterface classes to perform its actions.
 * It is exported as a module to be used in other scripts.
 */
import Validators from "../utilities/Validators.js";
import APIInterface from "../utilities/APIInterface.js";

/**
 * Class responsible for all the user-related actions.
 * @class
 */
export default class User {

    /**
     * Constructor of the User class.
     **/
    constructor() {
        this.validators = new Validators();
        this.apiInterface = new APIInterface();
    }

    /**
     * Method used to create a new user.
     * @param {string} username The username of the user.
     * @param {string} email The email of the user.
     * @param {string} password The password of the user.
     * @param {string} passwordConfirmation The password confirmation of the user.
     * @returns {Promise} The promise of action to be executed.
     * @throws {Error} If the user creation fails for any reason.
     */
    async createUser(username, email, password, passwordConfirmation) {
        // Check the validity of the user provided data.
        if (!this.validators.validateUsername(username)) {
            throw new Error("The username provided is invalid. Please provide a valid username and try again.");
        }
        if (!this.validators.validateEmail(email)) {
            throw new Error("The email provided is invalid. Please provide a valid email and try again.");
        }
        if (!this.validators.validatePassword(password)) {
            throw new Error("The password provided is invalid. Please provide a valid password and try again.");
        }
        if (!this.validators.validatePasswordConfirmation(password, passwordConfirmation)) {
            throw new Error("The password and the password confirmation do not match. " +
                "Please provide matching passwords and try again.");
        }

        // Prepare the request body.
        const requestBody = JSON.stringify({
            username: username,
            password: password,
            passwordConfirmation: passwordConfirmation,
            email: email
        });

        // Perform the request to the API.
        return await this.apiInterface.doPOST("auth/register", requestBody, 201);
    }

    /**
     * Method used to log in a user.
     * @param {string} username The email of the user.
     * @param {string} password The password of the user.
     * @returns {Promise} The promise of action to be executed.
     * @throws {Error} If the login fails for any reason.
     */
    async loginUser(username, password) {
        // Check the validity of the user provided data.
        if (!this.validators.validateUsername(username)) {
            throw new Error("The username provided is invalid. Please provide a valid username and try again.");
        }
        if (!this.validators.validatePassword(password)) {
            throw new Error("The password provided is invalid. Please provide a valid password and try again.");
        }

        // Prepare the request body.
        const requestBody = JSON.stringify({
            username: username,
            password: password
        });

        // Perform the request to the API.
        return await this.apiInterface.doPOST("auth/login", requestBody, 200);
    }

    /**
     * Method used to log out a user.
     * @returns {Promise} The promise of action to be executed.
     * @throws {Error} If the logout fails for any reason.
     */
    async logoutUser() {
        return await this.apiInterface.doGET("auth/logout", null, 200);
    }
}