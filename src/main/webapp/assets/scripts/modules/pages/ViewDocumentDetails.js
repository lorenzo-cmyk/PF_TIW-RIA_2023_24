/**
 * @file ViewDocumentDetails.js is the file responsible for the ViewDocumentDetails class.
 * This class is responsible for the visualization of the details of a document.
 * It is exported as a module to be used in other scripts.
 */
import Document from "../abstractions/Document.js";
import Orchestrator from "./utilities/Orchestrator.js";
import ViewFolderContent from "./ViewFolderContent.js";

/**
 * Class responsible for the visualization of the details of a document.
 * @class
 */
export default class ViewDocumentDetails {

    documentDetailsFieldset =
        '<fieldset disabled id="view-document-details-fieldset">\n' +
        '   <div class="field">\n' +
        '      <label class="label" for="view-document-details-documentName">Name</label>\n' +
        '      <div class="control has-icons-left">\n' +
        '         <input class="input" id="view-document-details-documentName" placeholder="e.g. myAwesomeFile"\n' +
        '            type="text" value="myAwesomeFile">\n' +
        '         <span class="icon is-small is-left">\n' +
        '         <i class="fas fa-align-left"></i>\n' +
        '         </span>\n' +
        '      </div>\n' +
        '   </div>\n' +
        '   <div class="field">\n' +
        '      <label class="label" for="view-document-details-type">Type</label>\n' +
        '      <div class="control has-icons-left">\n' +
        '         <input class="input" id="view-document-details-type" placeholder="e.g. PDF"\n' +
        '            type="text" value="PDF">\n' +
        '         <span class="icon is-small is-left">\n' +
        '         <i class="fas fa-file"></i>\n' +
        '         </span>\n' +
        '      </div>\n' +
        '   </div>\n' +
        '   <div class="field">\n' +
        '      <label class="label" for="view-document-details-creationDate">Creation Date</label>\n' +
        '      <div class="control has-icons-left">\n' +
        '         <input class="input" id="view-document-details-creationDate" placeholder="e.g. 25/07/2024"\n' +
        '            type="text" value="25/07/2024">\n' +
        '         <span class="icon is-small is-left">\n' +
        '         <i class="fas fa-calendar"></i>\n' +
        '         </span>\n' +
        '      </div>\n' +
        '   </div>\n' +
        '   <div class="field">\n' +
        '      <label class="label" for="view-document-details-summary">Summary</label>\n' +
        '      <div class="control">\n' +
        '         <textarea class="input" id="view-document-details-summary"\n' +
        '            placeholder="e.g. Classified Information, do not share!">\n' +
        '         </textarea>\n' +
        '      </div>\n' +
        '   </div>\n' +
        '</fieldset>';

    /**
     * Constructor of the ViewDocumentDetails class.
     * This class is a singleton.
     */
    constructor() {
        if (ViewDocumentDetails.instance) {
            return ViewDocumentDetails.instance;
        }
        ViewDocumentDetails.instance = this;
    }

    /**
     * Method responsible for initializing the view document details page.
     * @param {int} documentID The ID of the document to be viewed.
     */
    initializeViewDocumentDetails(documentID) {
        // Set the title of the page.
        new Orchestrator().setPageTitle("Document Details 📄");
        // Set the title of the tab.
        new Orchestrator().setTabTitle("TIW-DMS - Document Details");
        // Retrieve the document details from the API and build the document details on the page.
        new Document().retrieveDocument(documentID)
            .then((documentDetails) => {
                // Set the message of the page.
                new Orchestrator().setPageMessage("message", "You are viewing the details of the " +
                    "document " + documentDetails.documentName + ".");
                // Clear the actions list.
                new Orchestrator().clearActionsList();
                // Add a "Go Back" action to the actions list.
                new Orchestrator().addAction("🔙 Go Back", () => {
                    new ViewFolderContent().initializeViewFolderContent(documentDetails.folderID);
                });
                // Clear the page content.
                new Orchestrator().clearPageContent();
                // Build the page itself.
                this.buildDocumentDetailsFieldset(documentDetails);
            })
            .catch((error) => {
                // Set the message of the page.
                new Orchestrator().setPageMessage("message is-danger", error.message);
                // Clear the actions list.
                new Orchestrator().clearActionsList();
            })
            .finally(() => {
                // Add the home action to the actions list.
                new Orchestrator().addHomeAction();
                // Add the logout action to the actions list.
                new Orchestrator().addLogoutAction();
            });
    }

    /**
     * Method responsible for building the document details fieldset.
     * @param {Object} documentDetails The JSON object representing the document details.
     */
    buildDocumentDetailsFieldset(documentDetails) {
        // Add the fieldset to the page content.
        new Orchestrator().getPageContent().innerHTML = this.documentDetailsFieldset;
        // Set the document details in the fieldset.
        document.getElementById("view-document-details-documentName").value = documentDetails.documentName;
        document.getElementById("view-document-details-type").value = documentDetails.type;
        document.getElementById("view-document-details-creationDate").value = documentDetails.creationDate;
        document.getElementById("view-document-details-summary").value = documentDetails.summary;
    }
}
