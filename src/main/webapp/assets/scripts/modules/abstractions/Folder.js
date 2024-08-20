/**
 * @file Folder.js is the file responsible for the Folder class.
 * This class is responsible for the folder-related actions.
 * It is used to create, delete, and retrieve folders.
 * It uses the Validators and APIInterface classes to perform its actions.
 * It is exported as a module to be used in other scripts.
 */
import Validators from "../utilities/Validators.js";
import APIInterface from "../utilities/APIInterface.js";

/**
 * Class responsible for all folder-related actions.
 * @class
 */
export default class Folder {

    /**
     * Constructor of the Folder class.
     */
    constructor() {
        this.validators = new Validators();
        this.apiInterface = new APIInterface();
    }

    /**
     * Method used to create a new folder.
     * @param {string} folderName The name of the folder.
     * @param {int} parentFolderId The id of the parent folder.
     * @returns {Promise} The promise of action to be executed.
     * @throws {Error} If the folder creation fails for any reason.
     */
    async createFolder(folderName, parentFolderId) {
        // Check the validity of the folder provided data.
        if (!this.validators.validateFolderName(folderName)) {
            throw new Error("The folder name provided is invalid. " +
                "Please provide a valid folder name and try again.");
        }
        if (parentFolderId <= 0) {
            throw new Error("The parent folder id provided is invalid. " +
                "Please provide a valid parent folder id and try again.");
        }

        // Prepare the request body.
        const requestBody = JSON.stringify({
            folderName: folderName,
            parentFolderId: parentFolderId
        });

        // Perform the request to the API.
        return await this.apiInterface.doPOST(
            "folders", requestBody, 201
        );
    }

    /**
     * Method used to retrieve all the folders.
     * @returns {Promise} The promise of action to be executed.
     * @throws {Error} If the folder retrieval fails for any reason.
     */
    async retrieveFolders() {
        return await this.apiInterface.doGET(
            "folders", null, 200
        );
    }

    /**
     * Method used to delete a folder.
     * @param {int} folderId The id of the folder to be deleted.
     * @returns {Promise} The promise of action to be executed.
     * @throws {Error} If the folder deletion fails for any reason.
     */
    async deleteFolder(folderId) {
        // Check the validity of the folder id.
        if (folderId <= 0) {
            throw new Error("The folder id provided is invalid. " +
                "Please provide a valid folder id and try again.");
        }

        // Perform the request to the API.
        return await this.apiInterface.doDELETE(
            `folders/${folderId}`, null, 204
        );
    }

    /**
     * Method used to retrieve the contents of a folder.
     * @param {int} folderId The id of the folder to be updated.
     * @returns {Promise} The promise of action to be executed.
     * @throws {Error} If the folder update fails for any reason.
     */
    async retrieveFolderContents(folderId) {
        // Check the validity of the folder id.
        if (folderId <= 0) {
            throw new Error("The folder id provided is invalid. " +
                "Please provide a valid folder id and try again.");
        }

        // Perform the request to the API.
        return await this.apiInterface.doGET(
            `folders/${folderId}`, null, 200
        );
    }
}