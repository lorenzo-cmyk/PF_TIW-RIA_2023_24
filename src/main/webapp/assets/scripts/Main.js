import Folder from "./modules/abstractions/Folder.js";
import Document from "./modules/abstractions/Document.js";
import User from "./modules/abstractions/User.js";

class Orchestrator {

    /**
     * Constructor of the Orchestrator class.
     * This class is a singleton.
     * @constructor
     */
    constructor() {
        if (Orchestrator.instance) {
            return Orchestrator.instance;
        }
        Orchestrator.instance = this;
    }

    /**
     * Method responsible for setting the title of the page.
     * @param {string} newTitle The new title of the page.
     */
    setPageTitle(newTitle) {
        // Retrieve the "page-title" element.
        const titleElement = document.getElementById("page-title");
        // Set the title of the page.
        titleElement.textContent = newTitle;
    }

    /**
     * Method responsible for setting the title of the tab.
     * @param {string} newTitle The new title of the tab.
     */
    setTabTitle(newTitle) {
        // Set the title of the tab.
        document.title = newTitle;
    }

    /**
     * Method responsible for setting a message on the page.
     * @param {string} messageType The type of the message.
     * @param {string} message The message to be displayed.
     */
    setPageMessage(messageType, message) {
        // Retrieve the "page-message" element
        const messageElement = document.getElementById("page-message");
        // Set the class of the message element to the messageType.
        messageElement.className = messageType;
        // Retrieve the "page-message-text" element
        const messageTextElement = document.getElementById("page-message-text");
        // Set the text of the message.
        messageTextElement.innerHTML = message;
    }

    /**
     * Method used to clear the actions list.
     */
    clearActionsList() {
        // Retrieve the "page-actions-list" element.
        const actionsListElement = document.getElementById("page-actions-list");
        // Clear the actions list.
        actionsListElement.innerHTML = "";
    }

    /**
     * Method responsible for adding an action to the actions list.
     * @param {string} actionName The name of the action.
     * @param {Function} actionFunction The function to be executed when the action is clicked.
     */
    addAction(actionName, actionFunction) {
        // Retrieve the "page-actions-list" element.
        const actionsListElement = document.getElementById("page-actions-list");
        // Create a new "li" element.
        const newActionElement = document.createElement("li");
        // Add an event listener to the new action element.
        newActionElement.addEventListener("click", (event) => {
            event.preventDefault();
            actionFunction();
        });
        // Create a new "a" element.
        const newActionLinkElement = document.createElement("a");
        // Set the text of the new action link element.
        newActionLinkElement.textContent = actionName;
        // Append the new action link element to the new action element.
        newActionElement.appendChild(newActionLinkElement);
        // Append the new action element to the actions list.
        actionsListElement.appendChild(newActionElement);
    }

    /**
     * Method responsible for clearing the page content.
     */
    clearPageContent() {
        // Retrieve the "page-content" element.
        const pageContentElement = document.getElementById("page-content");
        // Clear the page canvas.
        pageContentElement.innerHTML = "";
    }

    /**
     * Method responsible for getting the page content.
     * @returns {HTMLElement} The page content element.
     */
    getPageContent() {
        // Retrieve the "page-content" element.
        return document.getElementById("page-content");
    }

    /**
     * Method responsible for adding a logout action to the actions list.
     */
    addLogoutAction() {
        this.addAction("🚪 Logout", () => {
            new User().logoutUser()
                .then(() => {
                    window.location.href = "authentication.html";
                })
                .catch((error) => {
                    this.setPageMessage("message is-danger", error.message);
                });
        });
    }

    /**
     * Method responsible for adding a "home" action to the actions list.
     */
    addHomeAction() {
        this.addAction("🏠 Home", () => {
            new Homepage().initializeHomepage();
        });
    }

    init() {
        new Homepage().initializeHomepage();
    }
}

class Homepage {

    /**
     * Constructor of the Homepage class.
     * This class is a singleton.
     * @constructor
     */
    constructor() {
        if (Homepage.instance) {
            return Homepage.instance;
        }
        Homepage.instance = this;
    }

    /**
     * Method responsible for initializing the Homepage.
     */
    initializeHomepage() {
        // Set the title of the page.
        new Orchestrator().setPageTitle("Homepage 🏠");
        // Set the title of the tab.
        new Orchestrator().setTabTitle("TIW-DMS - Homepage");
        // Set the message of the page.
        new Orchestrator().setPageMessage("message", "Hi, welcome to the DMS!");
        // Clear the actions list.
        new Orchestrator().clearActionsList();
        // Add an action to the actions list.
        new Orchestrator().addAction("➕ Add New Folder", () => {
            new ContentManagement().initializeContentManagement();
        });
        // Add the logout action to the actions list.
        new Orchestrator().addLogoutAction();
        // Build the page itself.
        this.buildDirectoryStructure();
    }

    /**
     * Method responsible for getting the user's folder.
     */
    buildDirectoryStructure() {
        // Clear the page current content.
        new Orchestrator().clearPageContent();

        // Build the page subtitle.
        const pageSubtitle = document.createElement("h1");
        pageSubtitle.className = "title is-4";
        pageSubtitle.innerHTML = "Directory Structure 🗂️";

        // Retrieve the user's folder from the API and build the directory structure on the page.
        new Folder().retrieveFolders()
            .then((folders) => {
                // Convert the JSON object to an HTML element.
                const folderTree = this.convertJSONtoHTMLElement(folders, true);
                new Orchestrator().getPageContent().appendChild(pageSubtitle);
                // Append the directory structure container to the page content.
                new Orchestrator().getPageContent().appendChild(folderTree);
            })
            .catch((error) => {
                // Set the message of the page.
                new Orchestrator().setPageMessage("message is-danger", error.message);
            });
    }

    /**
     * Method responsible for converting a JSON object to an HTML element.
     * @param {JSON} folders The JSON object representing the folders.
     * @param {Boolean} isRoot A boolean indicating if the folder is the root folder.
     * @returns {HTMLDivElement|HTMLUListElement} The HTML element representing the folder.
     */
    convertJSONtoHTMLElement(folders, isRoot = false) {
        // Create the top-level element
        const folderTree =
            isRoot ? document.createElement('div') : document.createElement('ul');

        // Iterate through the folders and create the list items
        folders.forEach(folder => {
            // Create the <li> element for the folder
            const folderItem = document.createElement('li');

            // Create a link for the folder name
            const folderLink = document.createElement('a');
            folderLink.textContent = folder.folderName;
            folderLink.style.textDecoration = "underline";
            folderLink.href = "#";
            folderLink.addEventListener('click', (event) => {
                event.preventDefault();
                new ViewFolderContent().initializeViewFolderContent(folder.folderID);
            });

            // Create a span to wrap the "Add Subfolder / Add Document" links
            const actionsSpan = document.createElement('span');
            actionsSpan.style.fontSize = "smaller"; // Apply smaller font size

            // Create a link for adding a subfolder
            const addSubfolderLink = document.createElement('a');
            addSubfolderLink.textContent = "Add Subfolder";
            addSubfolderLink.href = "#";
            addSubfolderLink.addEventListener('click', (event) => {
                event.preventDefault();
                // Function to handle adding a subfolder
                new ContentManagement().initializeContentManagement(2, folder.folderID);
            });

            // Create a link for adding a document
            const addDocumentLink = document.createElement('a');
            addDocumentLink.textContent = "Add Document";
            addDocumentLink.href = "#";
            addDocumentLink.addEventListener('click', (event) => {
                event.preventDefault();
                new ContentManagement().initializeContentManagement(3, folder.folderID);
            });

            // Append the links to the span element
            actionsSpan.appendChild(document.createTextNode(" -> "));
            actionsSpan.appendChild(addSubfolderLink);
            actionsSpan.appendChild(document.createTextNode(" / "));
            actionsSpan.appendChild(addDocumentLink);
            // Append the folder name link and actions span to the <li> element
            folderItem.appendChild(folderLink);
            folderItem.appendChild(actionsSpan);

            // If the folder has subfolders, recursively generate the subfolder tree
            if (folder.subfolders.length > 0) {
                const subfolderTree = this.convertJSONtoHTMLElement(folder.subfolders);
                folderItem.appendChild(subfolderTree);
            }

            // Append the folder item to the top-level element
            folderTree.appendChild(isRoot ? folderItem : folderItem);
        });

        return folderTree;
    }
}

class ContentManagement {

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

class ViewFolderContent {

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

class ViewDocumentDetails {

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

// When the window is loaded, create an instance of the Orchestrator class.
window.onload = function () {
    new User().checkAuthentication()
        .then(() => {
            new Orchestrator().init();
        })
        .catch(() => {
            window.location.href = "authentication.html";
        });
};
