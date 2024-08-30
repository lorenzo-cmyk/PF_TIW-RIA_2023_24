/**
 * @file Homepage.js is the file responsible for the Homepage class.
 * This class is responsible for the homepage of the application.
 * It is exported as a module to be used in other scripts.
 */
import Folder from "../abstractions/Folder.js";
import ModalWindowsFactory from "./utilities/ModalWindowsFactory.js";
import Orchestrator from "./utilities/Orchestrator.js";
import ContentManagement from "./ContentManagement.js";
import ViewFolderContent from "./ViewFolderContent.js";

/**
 * Class responsible for the homepage of the application.
 * @class
 */
export default class Homepage {

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
                // Create the trash bin and append it to the page content.
                new Orchestrator().getPageContent().appendChild(this.createTrashBin());
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
            // Encapsulate the folder ID in the data attribute
            folderLink.addEventListener('dragstart', (event) => {
                // 1. Set the drag data
                event.dataTransfer.setData("folder/id", folder.folderID);
                // 2. Set the drag feedback image
                // 2.1. Create a folder icon from the emoji
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = 30;
                canvas.height = 30;
                context.font = '20px serif';
                context.fillText('📂', 0, 20);
                const dragImage = new Image();
                dragImage.src = canvas.toDataURL();
                // 2.2. Set the drag image
                event.dataTransfer.setDragImage(dragImage, 0, 0);
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
            addSubfolderLink.draggable = false; // By default, links are draggable!

            // Create a link for adding a document
            const addDocumentLink = document.createElement('a');
            addDocumentLink.textContent = "Add Document";
            addDocumentLink.href = "#";
            addDocumentLink.addEventListener('click', (event) => {
                event.preventDefault();
                new ContentManagement().initializeContentManagement(3, folder.folderID);
            });
            addDocumentLink.draggable = false; // By default, links are draggable!

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

    /**
     * Method responsible for creating the trash bin.
     * @returns {HTMLElement} The HTML element representing the trash bin.
     */
    createTrashBin() {
        // Create the trash bin container
        const trashBinContainer = document.createElement('div');
        // Create a horizontal rule for separation
        const separator = document.createElement('hr');
        trashBinContainer.appendChild(separator);
        // Create a div for right-aligned content
        const rightAlignedDiv = document.createElement('div');
        rightAlignedDiv.className = "has-text-right";
        // Create the trash bin label
        const trashBinLabel = document.createElement('a');
        trashBinLabel.className = "subtitle has-text-weight-medium is-6";
        trashBinLabel.textContent = "Trash here → ";
        trashBinLabel.draggable = false; // By default, links are draggable!
        // Create the trash bin icon
        const trashBinIcon = document.createElement('span');
        trashBinIcon.className = "subtitle is-3";
        trashBinIcon.innerHTML = "🗑️";
        // Assemble the components
        trashBinLabel.appendChild(trashBinIcon);
        rightAlignedDiv.appendChild(trashBinLabel);
        trashBinContainer.appendChild(rightAlignedDiv);

        // Add "click" event listener to the trash bin label
        trashBinLabel.addEventListener('click', (event) => {
            event.preventDefault();
            new ModalWindowsFactory().spawnModalWindow(
                '🗑️ Trash Bin',
                '<div class="has-text-centered">Drag and drop a folder or document here to delete it!</div>',
                [
                    {
                        text: 'Ok',
                        class: '',
                        callback: () => {
                        }
                    }
                ]
            );
        });
        // Add "dragover" event listener to the trash bin label
        trashBinLabel.addEventListener("dragover", (event) => {
            const isValidData = event.dataTransfer.types.includes("folder/id") ||
                event.dataTransfer.types.includes("document/id");
            if (isValidData) {
                event.preventDefault();
            }
        });
        // Add "drop" event listener to the trash bin label
        trashBinLabel.addEventListener("drop", (event) => {
            const isFolder = event.dataTransfer.types.includes("folder/id");
            const isDocument = event.dataTransfer.types.includes("document/id");
            if ((isDocument && isFolder) || (!isDocument && !isFolder)) {
                // Prevent inconsistent state.
                return;
            }
            if (isFolder) {
                new Folder().deleteFolder(event.dataTransfer.getData("folder/id"))
                    .then(() => {
                        new Homepage().initializeHomepage();
                        new Orchestrator().setPageMessage("message is-success",
                            "The folder was deleted successfully.");
                    })
                    .catch((error) => {
                        new Orchestrator().setPageMessage("message is-danger", error.message);
                    });
            }
        });

        return trashBinContainer;
    }
}
