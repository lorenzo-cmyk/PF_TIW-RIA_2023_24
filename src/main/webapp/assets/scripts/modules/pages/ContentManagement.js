/**
 * @file ContentManagement.js is the file responsible for the ContentManagement class.
 * This class is responsible for the content management page.
 * It is exported as a module to be used in other scripts.
 */
import Folder from "../abstractions/Folder.js";
import Document from "../abstractions/Document.js";
import Orchestrator from "./utilities/Orchestrator.js";
import Homepage from "./Homepage.js";

/**
 * Class responsible for the content management page.
 * @class
 */
export default class ContentManagement {

    newFolderForm =
        '<div class="card">\n' +
        '   <form action="#" id="new-folder-form">\n' +
        '      <fieldset id="new-folder-fieldset">\n' +
        '         <div class="card-content">\n' +
        '            <div class="field">\n' +
        '               <label class="label" for="new-folder-form-folder-name">Folder Name</label>\n' +
        '               <div class="control has-icons-left">\n' +
        '                  <input class="input" id="new-folder-form-folder-name" maxlength="63" minlength="1"\n' +
        '                     name="new-folder-form-folder-name" placeholder="e.g. newFolder" required\n' +
        '                     type="text">\n' +
        '                  <span class="icon is-small is-left">\n' +
        '                  <i class="fas fa-text-width"></i>\n' +
        '                  </span>\n' +
        '               </div>\n' +
        '            </div>\n' +
        '         </div>\n' +
        '         <footer class="card-footer">\n' +
        '            <div class="card-footer-item">\n' +
        '               <button class="button card-footer-item" id="new-folder-form-button">Create!</button>\n' +
        '            </div>\n' +
        '         </footer>\n' +
        '      </fieldset>\n' +
        '   </form>\n' +
        '</div>';

    newDocumentForm =
        '<div class="card">\n' +
        '   <form action="#" id="new-document-form">\n' +
        '      <fieldset id="new-document-fieldset">\n' +
        '         <div class="card-content">\n' +
        '            <div class="field">\n' +
        '               <label class="label" for="new-document-form-documentName">Document Name</label>\n' +
        '               <div class="control has-icons-left">\n' +
        '                  <input class="input" id="new-document-form-documentName" maxlength="63" minlength="1"\n' +
        '                     name="new-document-form-documentName" placeholder="e.g. newDocument" required\n' +
        '                     type="text">\n' +
        '                  <span class="icon is-small is-left">\n' +
        '                  <i class="fas fa-text-width"></i>\n' +
        '                  </span>\n' +
        '               </div>\n' +
        '            </div>\n' +
        '            <div class="field">\n' +
        '               <label class="label" for="new-document-form-documentType">Type</label>\n' +
        '               <div class="control has-icons-left">\n' +
        '                  <input class="input" id="new-document-form-documentType" maxlength="63" minlength="1"\n' +
        '                     name="new-document-form-documentType" placeholder="e.g. PDF" required type="text">\n' +
        '                  <span class="icon is-small is-left">\n' +
        '                  <i class="fas fa-flask"></i>\n' +
        '                  </span>\n' +
        '               </div>\n' +
        '            </div>\n' +
        '            <div class="field">\n' +
        '               <label class="label" for="new-document-form-documentSummary">Summary</label>\n' +
        '               <div class="control has-icons-left">\n' +
        '                  <textarea class="textarea" id="new-document-form-documentSummary" maxlength="255"\n' +
        '                     minlength="1" name="new-document-form-documentSummary"\n' +
        '                     placeholder="e.g. Classified document, do not share!" required\n' +
        '                     ></textarea>\n' +
        '               </div>\n' +
        '            </div>\n' +
        '         </div>\n' +
        '         <footer class="card-footer">\n' +
        '            <div class="card-footer-item">\n' +
        '               <button class="button card-footer-item" id="new-document-form-button">Create!</button>\n' +
        '            </div>\n' +
        '         </footer>\n' +
        '      </fieldset>\n' +
        '   </form>\n' +
        '</div>'

    /**
     * Constructor of the ContentManagement class.
     * This class is a singleton.
     * @constructor
     */
    constructor() {
        if (ContentManagement.instance) {
            return ContentManagement.instance;
        }
        ContentManagement.instance = this;
    }

    /**
     * Method responsible for initializing the content management page.
     * @param {int} actionID The ID of the action to be executed.
     * @param {int} folderID The ID of the folder to be managed.
     */
    initializeContentManagement(actionID = 1, folderID = -1) {
        // Set the title of the page.
        new Orchestrator().setPageTitle("Document Management ➕");
        // Set the title of the tab.
        new Orchestrator().setTabTitle("TIW-DMS - Document Management");
        // Set the message of the page according to the action.
        this.setPageMessageByAction(actionID);
        // Clear the actions list.
        new Orchestrator().clearActionsList();
        // Add the back action to the actions list.
        new Orchestrator().addAction("🔙 Go Back", () => {
            new Homepage().initializeHomepage();
        });
        // Add the home action to the actions list.
        new Orchestrator().addHomeAction();
        // Add the logout action to the actions list.
        new Orchestrator().addLogoutAction();
        // Build the page itself.
        this.buildContentManagementForm(actionID, folderID);
    }

    /**
     * Method responsible for setting the message of the page according to the action.
     * @param {int} actionID The ID of the action to be executed.
     */
    setPageMessageByAction(actionID) {
        if (actionID === 1) {
            new Orchestrator().setPageMessage("message",
                "Fill in the form to create a new top level folder.");
        } else if (actionID === 2) {
            new Orchestrator().setPageMessage("message",
                "Fill in the form to create the subfolder.");
        } else if (actionID === 3) {
            new Orchestrator().setPageMessage("message",
                "Fill in the form to create a new document.");
        } else {
            new Orchestrator().setPageMessage("message is-danger",
                "Unknown action requested. Please try again.");
        }
    }

    /**
     * Method responsible for building the content management form.
     * @param {int} actionID The ID of the action to be executed.
     * @param {int} folderID The ID of the folder to be managed.
     */
    buildContentManagementForm(actionID, folderID) {
        // Clear the page current content.
        new Orchestrator().clearPageContent();
        // Create the form container.
        const formContainer = document.createElement("div");
        if (actionID === 1 || actionID === 2) {
            formContainer.innerHTML = this.newFolderForm;
            new Orchestrator().getPageContent().appendChild(formContainer);
            this.setNewFolderFormButtonAction(folderID);
        } else if (actionID === 3) {
            formContainer.innerHTML = this.newDocumentForm;
            new Orchestrator().getPageContent().appendChild(formContainer);
            this.setNewDocumentFormButtonAction(folderID);
        } else {
            new Orchestrator().setPageMessage("message is-danger",
                "Unknown action requested. Please try again.");
        }
    }

    /**
     * Method responsible for setting the action of the new folder form button.
     * @param {int} folderId The ID of the folder to be managed.
     */
    setNewFolderFormButtonAction(folderId) {
        // Retrieve the "new-folder-form-button" element.
        const newFolderFormButton = document.getElementById("new-folder-form-button");
        // Set the action of the button.
        newFolderFormButton.addEventListener("click", (event) => {
            event.preventDefault();
            this.handleNewFolderFormButtonClick(folderId);
        });
    }

    /**
     * Method responsible for handling the new folder form button click
     * @param {int} folderId The ID of the folder to be managed.
     */
    handleNewFolderFormButtonClick(folderId) {
        // Check the validity of the form.
        const newFolderForm = document.getElementById("new-folder-form");
        if (!newFolderForm.checkValidity()) {
            newFolderForm.reportValidity();
            return;
        }
        // Prevent the user from spamming the button or altering the form.
        const newFormFieldset = document.getElementById("new-folder-fieldset");
        newFormFieldset.disabled = true;
        const newFolderFormButton = document.getElementById("new-folder-form-button");
        newFolderFormButton.disabled = true;
        // Extract the folder name from the form.
        const folderName = document.getElementById("new-folder-form-folder-name").value;
        // Create the new folder.
        new Folder().createFolder(folderName, folderId)
            .then(() => {
                // If the folder was created successfully, go back to the homepage
                new Homepage().initializeHomepage();
                new Orchestrator().setPageMessage("message is-success",
                    "The folder was created successfully.");
            })
            .catch((error) => {
                // If the folder creation failed, show the error message
                new Orchestrator().setPageMessage("message is-danger", error.message);
                // Re-enable the form and button
                newFormFieldset.disabled = false;
                newFolderFormButton.disabled = false;
            });
    }

    /**
     * Method responsible for setting the action of the new document form button.
     * @param {int} folderId The ID of the folder where the document should be added to.
     */
    setNewDocumentFormButtonAction(folderId) {
        // Retrieve the "new-document-form-button" element.
        const newDocumentFormButton = document.getElementById("new-document-form-button");
        // Set the action of the button.
        newDocumentFormButton.addEventListener("click", (event) => {
            event.preventDefault();
            this.handleNewDocumentFormButtonClick(folderId);
        });
    }

    /**
     * Method responsible for handling the new document form button click.
     * @param {int} folderId The ID of the folder where the document should be added to.
     */
    handleNewDocumentFormButtonClick(folderId) {
        // Check the validity of the form.
        const newDocumentForm = document.getElementById("new-document-form");
        if (!newDocumentForm.checkValidity()) {
            newDocumentForm.reportValidity();
            return;
        }
        // Prevent the user from spamming the button or altering the form.
        const newDocumentFieldset = document.getElementById("new-document-fieldset");
        newDocumentFieldset.disabled = true;
        const newDocumentFormButton = document.getElementById("new-document-form-button");
        newDocumentFormButton.disabled = true;
        // Extract the folder name from the form.
        const documentName = document.getElementById("new-document-form-documentName").value;
        const documentType = document.getElementById("new-document-form-documentType").value;
        const documentSummary = document.getElementById("new-document-form-documentSummary").value;
        // Create the new document.
        new Document().createDocument(documentName, documentType, documentSummary, folderId)
            .then(() => {
                // If the document was created successfully, go back to the homepage
                new Homepage().initializeHomepage();
                new Orchestrator().setPageMessage("message is-success",
                    "The document was created successfully.");
            })
            .catch((error) => {
                // If the folder creation failed, show the error message
                new Orchestrator().setPageMessage("message is-danger", error.message);
                // Re-enable the form and button
                newDocumentFieldset.disabled = false;
                newDocumentFormButton.disabled = false;
            });
    }
}
