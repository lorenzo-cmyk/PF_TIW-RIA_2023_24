import Folder from "./modules/abstractions/Folder.js";

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

    init() {
        // Set the title of the page.
        this.setPageTitle("Home");
        // Set the title of the tab.
        this.setTabTitle("Home");
        // Set the message of the page.
        this.setPageMessage("message", "Welcome to the Home page!");
        // Clear the actions list.
        this.clearActionsList();
        // Add an action to the actions list.
        this.addAction("😂 Hihi", () => {
        });
        // Clear the actions list.
        this.clearActionsList();
        // Add an action to the actions list.
        this.addAction("😂 Hihi", () => {
        });
        this.addAction("😂 Hihi", () => {
        });
        this.addAction("😂 Hihi", () => {
        });

        new Homepage().buildDirectoryStructure();

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

// When the window is loaded, create an instance of the Orchestrator class.
window.onload = function () {
    const orchestrator = new Orchestrator();
    orchestrator.init();
};
