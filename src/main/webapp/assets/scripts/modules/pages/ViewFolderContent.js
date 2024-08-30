/**
 * @file ViewFolderContent.js is the file responsible for the ViewFolderContent class.
 * This class is responsible for the visualization of the content of a folder.
 * It is exported as a module to be used in other scripts.
 */
import Folder from "../abstractions/Folder.js";
import Orchestrator from "./utilities/Orchestrator.js";
import Homepage from "./Homepage.js";
import ViewDocumentDetails from "./ViewDocumentDetails.js";

/**
 * Class responsible for the visualization of the content of a folder.
 * @class
 */
export default class ViewFolderContent {

    /**
     * Constructor of the ViewFolderContent class.
     * This class is a singleton.
     */
    constructor() {
        if (ViewFolderContent.instance) {
            return ViewFolderContent.instance;
        }
        ViewFolderContent.instance = this;
    }

    /**
     * Method responsible for initializing the view folder content page.
     * @param {int} folderID The ID of the folder to be viewed.
     */
    initializeViewFolderContent(folderID) {
        // Set the title of the page.
        new Orchestrator().setPageTitle("Folder Content 📂");
        // Set the title of the tab.
        new Orchestrator().setTabTitle("TIW-DMS - Folder Content");
        // Retrieve the folder content from the API and build the folder content on the page.
        new Folder().retrieveFolderContents(folderID)
            .then((folderContent) => {
                // Set the message of the page.
                new Orchestrator().setPageMessage("message", "You are viewing the content of the " +
                    "folder " + folderContent.folderName + ".");
                // Clear the actions list.
                new Orchestrator().clearActionsList();
                // Add a "Go Back" action to the actions list.
                if (folderContent.parentFolderID !== -1) {
                    new Orchestrator().addAction("🔙 Go Back", () => {
                        new ViewFolderContent().initializeViewFolderContent(folderContent.parentFolderID);
                    });
                } else {
                    new Orchestrator().addAction("🔙 Go Back", () => {
                        new Homepage().initializeHomepage();
                    });
                }
                // Clear the page content.
                new Orchestrator().clearPageContent();
                // Build the page itself.
                new Orchestrator().getPageContent().appendChild(this.JSONtoSubfolders(folderContent));
                new Orchestrator().getPageContent().appendChild(this.JSONtoDocuments(folderContent));
                new Orchestrator().getPageContent().appendChild(this.JSONtoFolderCreateDate(folderContent));
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
     * Method responsible for building the subfolders' subpage.
     * @param {Object} folderContent The JSON object representing the folder content.
     * @returns {HTMLElement} The HTML element representing the subfolders.
     */
    JSONtoSubfolders(folderContent) {
        // Create the container div
        const subfoldersContainer = document.createElement('div');
        subfoldersContainer.className = "content";
        subfoldersContainer.id = "subfolders-container";

        // Create the h3 title element
        const subfoldersTitle = document.createElement('h3');
        subfoldersTitle.className = "title is-5";
        subfoldersTitle.textContent = "🗂️ Subfolders";

        // Create the ul element
        const subfoldersList = document.createElement('ul');

        // Iterate through the subfolders and create the list items
        folderContent.subfolders.forEach(subfolder => {
            // Create the li element for the subfolder
            const subfolderItem = document.createElement('li');

            // Create a link for the subfolder name
            const subfolderLink = document.createElement('a');
            subfolderLink.textContent = subfolder.folderName;
            subfolderLink.href = "#";
            subfolderLink.addEventListener('click', (event) => {
                event.preventDefault();
                new ViewFolderContent().initializeViewFolderContent(subfolder.folderID);
            });

            // Append the subfolder name link to the li element
            subfolderItem.appendChild(subfolderLink);

            // Append the subfolder item to the list
            subfoldersList.appendChild(subfolderItem);
        });

        // Append the title and list to the container
        subfoldersContainer.appendChild(subfoldersTitle);
        subfoldersContainer.appendChild(subfoldersList);

        return subfoldersContainer;
    }

    /**
     * Method responsible for building the documents' subpage.
     * @param folderContent The JSON object representing the folder content.
     * @returns {HTMLElement} The HTML element representing the documents.
     */
    JSONtoDocuments(folderContent) {
        // Create the container div
        const documentsContainer = document.createElement('div');
        documentsContainer.className = "content";
        documentsContainer.id = "documents-container";

        // Create the h3 title element
        const documentsTitle = document.createElement('h3');
        documentsTitle.className = "title is-5";
        documentsTitle.textContent = "📑 Documents";

        // Create the ul element
        const documentsList = document.createElement('ul');

        // Iterate through the documents and create the list items
        folderContent.documents.forEach(doc => {
            // Create the li element for the document
            const documentItem = document.createElement('li');

            // Create a link for the document name
            const documentLink = document.createElement('a');
            documentLink.textContent = doc.documentName;
            documentLink.href = "#";
            documentLink.addEventListener('click', (event) => {
                event.preventDefault();
                new ViewDocumentDetails().initializeViewDocumentDetails(doc.documentID);
            });

            // Append the document name link to the li element
            documentItem.appendChild(documentLink);

            // Append the document item to the list
            documentsList.appendChild(documentItem);
        });

        // Append the title and list to the container
        documentsContainer.appendChild(documentsTitle);
        documentsContainer.appendChild(documentsList);

        return documentsContainer;
    }

    /**
     * Method responsible for building the folder creation date subpage.
     * @param {Object} folderContent The JSON object representing the folder content.
     * @returns {HTMLElement} The HTML element representing the folder creation date.
     */
    JSONtoFolderCreateDate(folderContent) {
        // Create the h3 element
        const creationDateH3 = document.createElement('h3');
        creationDateH3.className = 'subtitle is-6 has-text-right';
        creationDateH3.textContent = "Folder's creation date: ";

        // Create the span element for the creation date
        const creationDateSpan = document.createElement('span');
        creationDateSpan.textContent = folderContent.creationDate;

        // Append the span element to the h3 element
        creationDateH3.appendChild(creationDateSpan);

        return creationDateH3;
    }
}
