/**
 * @file Document.js is the file responsible for the Document class.
 * This class is responsible for the document-related actions.
 * It is used to create, delete and retrieve documents.
 * It uses the Validators and APIInterface classes to perform its actions.
 * It is exported as a module to be used in other scripts.
 */
import Validators from "../utilities/Validators.js";
import APIInterface from "../utilities/APIInterface.js";


/**
 * Class responsible for all document-related actions.
 * @class
 */
export default class Document {

    /**
     * Constructor of the Document class.
     */
    constructor() {
        this.validators = new Validators();
        this.apiInterface = new APIInterface();
    }

    /**
     * Method used to create a new document.
     * @param {String} documentName The name of the document.
     * @param {String} documentType The type of the document.
     * @param {String} documentSummary The summary of the document.
     * @param {int} parentFolderId The id of the folder where the document will be stored.
     * @returns {Promise} The promise of action to be executed.
     */
    async createDocument(documentName, documentType, documentSummary, parentFolderId) {
        // Check the validity of the document provided data.
        if (!this.validators.validateDocumentName(documentName)) {
            throw new Error("The document name provided is invalid. " +
                "Please provide a valid document name and try again.");
        }
        if (!this.validators.validateDocumentType(documentType)) {
            throw new Error("The document type provided is invalid. " +
                "Please provide a valid document type and try again.");
        }
        if (!this.validators.validateDocumentSummary(documentSummary)) {
            throw new Error("The document summary provided is invalid. " +
                "Please provide a valid document summary and try again.");
        }
        if (parentFolderId < -1) {
            throw new Error("The parent folder id provided is invalid. " +
                "Please provide a valid parent folder id and try again.");
        }

        // Prepare the request body.
        const requestBody = JSON.stringify({
            documentName: documentName,
            type: documentType,
            summary: documentSummary,
            folderID: parentFolderId
        });

        // Perform the request to the API.
        return await this.apiInterface.doPOST(
            "documents", requestBody, 201
        );
    }
}