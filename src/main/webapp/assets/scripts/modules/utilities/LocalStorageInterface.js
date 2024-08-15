/**
 * @file LocalStorageInterface.js is the file responsible for the LocalStorageInterface class.
 * This class is responsible for the local storage-related actions.
 * It is used to interact with the local storage.
 * It is exported as a module to be used in other scripts.
 */

/**
 * Class to interact with the local storage.
 * @class
 */
export default class LocalStorageInterface {

    /**
     * Method to store the authentication status of the user in the local storage.
     * @param {boolean} isAuthenticated The authentication status of the user.
     */
    storeAuthenticationStatus(isAuthenticated) {
        localStorage.setItem("authenticationStatus", isAuthenticated);
    }

    /**
     * Method to retrieve the authentication status of the user from the local storage.
     * @returns {boolean} The authentication status of the user.
     */
    getAuthenticationStatus() {
        return localStorage.getItem("authenticationStatus");
    }
}