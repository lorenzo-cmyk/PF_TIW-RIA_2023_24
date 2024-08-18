/**
 * @file APIInterface.js is the file responsible for the APIInterface class.
 * This class is responsible for the API-related actions.
 * It is used to interact with the API server.
 * It is exported as a module to be used in other scripts.
 */

/**
 * Class responsible for all the API-related interactions with the server.
 * @class
 */
export default class APIInterface {

    /**
     * Constructor of the APIInterface class.
     */
    constructor() {
        this.apiURL = "http://localhost:8080/PF_TIW_RIA_2023_24_war_exploded/api";
    }

    /**
     * Method to invoke a generic request to the API server.
     * @param {string} apiEndpoint The endpoint of the API to be called.
     * @param {string} requestMethod The HTTP method to be used in the request.
     * @param {Object} requestBody The body of the request (if present must be a JSON string).
     * @param {number} expectedStatus The expected status code of the response.
     * @returns {Promise} The promise of action to be executed.
     * @throws {Error} If the request fails for any reason.
     */
    async invokeRequest(apiEndpoint, requestMethod, requestBody, expectedStatus) {
        // Thanks Javascript for using the backticks... For when I have to copy-paste them again REF. "BACKTICKS".
        const requestURL = `${this.apiURL}/${apiEndpoint}`;

        // Let's perform the request.
        const APIResponse = await fetch(requestURL, {
            method: requestMethod,
            // All the requests to the API are in JSON format. Adding the header.
            // Disable Access-Control-Allow-Origin since it's a local server.
            headers: {
                'Content-Type': 'application/json'
            },
            body: requestBody
        });

        // Check the outcome of the request.
        // Extract the error message - if any - from the JSON response and the status code.
        if (APIResponse.status !== expectedStatus) {
            const errorMessage = await APIResponse.json();
            throw new Error(`${errorMessage.error}`);
        }

        // If everything went well, return the response.
        if (APIResponse.body == null) {
            return await APIResponse.json();
        } else {
            return null;
        }
    }

    /**
     * Method to perform a GET request to the API server.
     * @param {string} apiEndpoint The endpoint of the API to be called.
     * @param {string} requestBody The body of the request (if present must be a JSON string).
     * @param {number} expectedStatus The expected status code of the response.
     * @returns {Promise} The promise of action to be executed.
     * @throws {Error} If the request fails for any reason.
     */
    async doGET(apiEndpoint, requestBody, expectedStatus) {
        return await this.invokeRequest(apiEndpoint, "GET", requestBody, expectedStatus);
    }

    /**
     * Method to perform a POST request to the API server.
     * @param {string} apiEndpoint The endpoint of the API to be called.
     * @param {string} requestBody The body of the request (if present must be a JSON string).
     * @param {number} expectedStatus The expected status code of the response.
     * @returns {Promise} The promise of action to be executed.
     * @throws {Error} If the request fails for any reason.
     */
    async doPOST(apiEndpoint, requestBody, expectedStatus) {
        return await this.invokeRequest(apiEndpoint, "POST", requestBody, expectedStatus);
    }

    /**
     * Method to perform a DELETE request to the API server.
     * @param {string} apiEndpoint The endpoint of the API to be called.
     * @param {string} requestBody The body of the request (if present must be a JSON string).
     * @param {number} expectedStatus The expected status code of the response.
     * @returns {Promise} The promise of action to be executed.
     * @throws {Error} If the request fails for any reason.
     */
    async doDELETE(apiEndpoint, requestBody, expectedStatus) {
        return await this.invokeRequest(apiEndpoint, "DELETE", requestBody, expectedStatus);
    }
}