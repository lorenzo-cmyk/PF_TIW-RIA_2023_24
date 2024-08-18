/**
 * @file Validators.js is the file responsible for the Validators class.
 * This class is responsible for the validation of user input.
 * It is exported as a module to be used in other scripts.
 */

/**
 * Class responsible for all the user input validation.
 * @class
 */
export default class Validators {

    /**
     * Method to validate the username provided by the user.
     * Requirements:
     * - The username must be at least 1 character long.
     * - The username must be under 64 characters long.
     * - The username must be alphanumeric only.
     * @param {string} username The username to be validated.
     * @returns {boolean} True if the username is valid, false otherwise.
     */
    validateUsername(username) {
        const usernameRegex = /^[a-zA-Z0-9]{1,64}$/;
        return usernameRegex.test(username);
    }

    /**
     * Method to validate the email provided by the user.
     * Requirements:
     * - The email must be syntactically correct.
     * - The email must be under 64 characters long.
     * @param {string} email The email to be validated.
     * @returns {boolean} True if the email is valid, false otherwise.
     */
    validateEmail(email) {
        // https://stackoverflow.com/questions/201323/how-can-i-validate-an-email-address-using-a-regular-expression
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    /**
     * Method to validate the password provided by the user.
     * Requirements:
     * - The username must be at least 1 character long.
     * - The username must be under 128 characters long.
     * @param {string} password The password to be validated.
     * @returns {boolean} True if the password is valid, false otherwise.
     */
    validatePassword(password) {
        const passwordRegex = /^.{1,128}$/;
        return passwordRegex.test(password);
    }

    /**
     * Method to check that the password and the password confirmation match.
     * @param {string} password The password provided by the user.
     * @param {string} passwordConfirmation The password confirmation provided by the user.
     * @returns {boolean} True if the passwords match, false otherwise.
     */
    validatePasswordConfirmation(password, passwordConfirmation) {
        return password === passwordConfirmation;
    }

    /**
     * Method to validate the folder name provided by the user.
     * Requirements:
     * - The folder name must be at least 1 character long.
     * - The folder name must be under 64 characters long.
     * @param {string} folderName The folder name to be validated.
     * @returns {boolean} True if the folder name is valid, false otherwise.
     */
    validateFolderName(folderName) {
        const folderNameRegex = /^.{1,64}$/;
        return folderNameRegex.test(folderName);
    }
}