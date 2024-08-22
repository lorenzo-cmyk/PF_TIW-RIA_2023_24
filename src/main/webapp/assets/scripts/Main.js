import Folder from "./modules/abstractions/Folder.js";
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
        })
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
            folderItem.textContent = folder.folderName;

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

    rootFolderForm =
        '<div class="card">\n' +
        '   <form action="#" id="new-root-folder-form">\n' +
        '      <fieldset id="new-root-folder-fieldset">\n' +
        '         <div class="card-content">\n' +
        '            <div class="field">\n' +
        '               <label class="label" for="new-root-folder-form-folder-name">Folder Name</label>\n' +
        '               <div class="control has-icons-left">\n' +
        '                  <input class="input" id="new-root-folder-form-folder-name" maxlength="63" minlength="1"\n' +
        '                     name="new-root-folder-form-folder-name" placeholder="e.g. newRootFolder" required\n' +
        '                     type="text">\n' +
        '                  <span class="icon is-small is-left">\n' +
        '                  <i class="fas fa-text-width"></i>\n' +
        '                  </span>\n' +
        '               </div>\n' +
        '            </div>\n' +
        '         </div>\n' +
        '         <footer class="card-footer">\n' +
        '            <div class="card-footer-item">\n' +
        '               <button class="button card-footer-item" id="new-root-folder-form-button">Create!</button>\n' +
        '            </div>\n' +
        '         </footer>\n' +
        '      </fieldset>\n' +
        '   </form>\n' +
        '</div>';

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

    buildContentManagementForm(actionID, folderID) {
        // Clear the page current content.
        new Orchestrator().clearPageContent();

        // Create the form container.
        const formContainer = document.createElement("div");
        if (actionID === 1) {
            formContainer.innerHTML = this.rootFolderForm;
        }

        // Append the form container to the page content.
        new Orchestrator().getPageContent().appendChild(formContainer);
        this.setNewRootFolderFormButtonAction(folderID);

    }

    setNewRootFolderFormButtonAction(folderId) {
        // Retrieve the "new-root-folder-form-button" element.
        const newRootFolderFormButton = document.getElementById("new-root-folder-form-button");
        // Set the action of the button.
        newRootFolderFormButton.addEventListener("click", (event) => {
            event.preventDefault();
            this.handleNewRootFolderFormButtonClick(folderId);
        });
    }

    handleNewRootFolderFormButtonClick(folderId) {
        // Check the validity of the form.
        const newRootFolderForm = document.getElementById("new-root-folder-form");
        if (!newRootFolderForm.checkValidity()) {
            newRootFolderForm.reportValidity();
            return;
        }
        // Prevent the user from spamming the button or altering the form.
        const newRootFormFieldset = document.getElementById("new-root-folder-fieldset");
        newRootFormFieldset.disabled = true;
        const newRootFolderFormButton = document.getElementById("new-root-folder-form-button");
        newRootFolderFormButton.disabled = true;
        // Extract the folder name from the form.
        const folderName = document.getElementById("new-root-folder-form-folder-name").value;
        // Create the new root folder.
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
                newRootFormFieldset.disabled = false;
                newRootFolderFormButton.disabled = false;
            });
    }


}


// When the window is loaded, create an instance of the Orchestrator class.
window.onload = function () {
    const orchestrator = new Orchestrator();
    orchestrator.init();
};
