import Folder from "../abstractions/Folder.js";
import Orchestrator from "./utilities/Orchestrator.js";
import ModalWindowsFactory from "./utilities/ModalWindowsFactory.js";
import ViewFolderContent from "./ViewFolderContent.js";
import Document from "../abstractions/Document.js";

export default class MoveDocumentModal {

    moveDocumentModal = null;

    /**
     * Constructor of the MoveDocumentModal class.
     * Singleton.
     */
    constructor() {
        if (!MoveDocumentModal.instance) {
            MoveDocumentModal.instance = this;
        }
        return MoveDocumentModal.instance;
    }

    /**
     * Method used to build a modal window for moving a document.
     * The modal window will be saved in the instance variable moveDocumentModal.
     * @param {HTMLElement} content The content of the modal window.
     */
    buildModalWindow(content) {
        // Create the modal window container
        const modal = document.createElement('div');
        modal.className = 'modal';
        // Create the modal background (add a shadow effect to the page behind the modal)
        const modalBackground = document.createElement('div');
        modalBackground.className = 'modal-background';
        // Create the modal container
        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal-content';
        // Create body of the modal card (it's a box!)
        const body = document.createElement('div');
        body.className = 'box';
        body.appendChild(content);
        // Assemble the modal container
        modalContainer.appendChild(body);
        // Assemble the modal window
        modal.appendChild(modalBackground);
        modal.appendChild(modalContainer);

        // Disable pointer events on the modal window
        modal.style.pointerEvents = 'none';

        this.moveDocumentModal = modal;
    }

    /**
     * Method used to append the modal window to the page.
     */
    appendModalWindowToPage() {
        document.body.appendChild(this.moveDocumentModal);
    }

    /**
     * Method used to show the modal window.
     */
    showModalWindow() {
        this.moveDocumentModal.classList.add('is-active');
    }

    /**
     * Method used to remove the modal window from the page.
     */
    removeModalWindow() {
        this.moveDocumentModal.remove();
    }

    /**
     * Method used to spawn the modal window.
     * @param {int} currentFolderID The ID of the folder where the document is currently located.
     */
    spawnModal(currentFolderID) {
        this.buildModalWindow(this.buildDirectoryStructure(currentFolderID));
        this.appendModalWindowToPage();
        this.showModalWindow();
    }

    /**
     * Method used to build the directory structure of the folders.
     * @param {int} parentFolderID The ID of the folder where the document is currently located.
     * @returns {HTMLDivElement} The container of the folder structure.
     */
    buildDirectoryStructure(parentFolderID) {
        const folderStructureContainer = document.createElement('div');
        const title = document.createElement('h1');
        title.innerHTML = "↩️ Drag the document on the folder where you want to move it.";
        title.className = "subtitle is-5";
        const horizontalLine = document.createElement('hr');
        folderStructureContainer.appendChild(title);
        folderStructureContainer.appendChild(horizontalLine);
        new Folder().retrieveFolders()
            .then((folders) => {
                // Create the directory structure from the response.
                const folderStructure = this.buildFolderStructure(folders, true, parentFolderID);
                folderStructure.className = "content";
                folderStructureContainer.appendChild(folderStructure);
                // Create the trash bin.
                const trashBin = this.createTrashBin(parentFolderID);
                folderStructureContainer.appendChild(trashBin);
            })
            .catch((error) => {
                // Set the message of the page.
                new Orchestrator().setPageMessage("message is-danger", error.message);
                // Remove the modal window.
                this.removeModalWindow();
            });
        return folderStructureContainer;
    }

    /**
     * Method used to build the folder structure from the folders JSON object.
     * @param {Object} folders The JSON object representing the folders.
     * @param {Boolean} isRoot A boolean indicating if the folder is the root folder.
     * @param {int} parentFolderID The ID of the folder where the document is currently located.
     * @returns {HTMLDivElement} The container of the folder structure.
     */
    buildFolderStructure(folders, isRoot = false, parentFolderID) {
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
            // Add the correct event listener to the folder link
            this.applyEffects(folder, folderLink, parentFolderID);

            // Append the folder name link and actions span to the <li> element
            folderItem.appendChild(folderLink);

            // If the folder has subfolders, recursively generate the subfolder tree
            if (folder.subfolders.length > 0) {
                const subfolderTree = this.buildFolderStructure(folder.subfolders, false, parentFolderID);
                folderItem.appendChild(subfolderTree);
            }

            // Append the folder item to the top-level element
            folderTree.appendChild(isRoot ? folderItem : folderItem);
        });

        return folderTree;
    }

    /**
     * Method used to apply the effects to the folder link.
     * @param {Object} folder The folder object.
     * @param {HTMLElement} folderLink The link element of the folder.
     * @param {int} parentFolderID The ID of the folder where the document is currently located.
     */
    applyEffects(folder, folderLink, parentFolderID) {
        // These links are not draggable as they are not meant to be dragged.
        folderLink.draggable = false;
        // If the folder is the folder that contains the document, change its style and will not be a valid drop target.
        if (folder.folderID === parentFolderID) {
            folderLink.style.textDecoration = "line-through"
            folderLink.style.color = "red";
            return;
        }
        // Reset the pointer events to the default value.
        folderLink.style.pointerEvents = 'auto';
        // Make the link a valid drop target.
        folderLink.addEventListener("dragover", (event) => {
            const isValidData = event.dataTransfer.types.includes("document/id");
            if (isValidData) {
                event.preventDefault();
            }
        });
        folderLink.addEventListener("drop", (event) => {
            const isValidData = event.dataTransfer.types.includes("document/id");
            if (isValidData) {
                event.preventDefault();
                const documentID = event.dataTransfer.getData("document/id");
                const folderID = folder.folderID;
                this.removeModalWindow();
                this.handleDrop(documentID, folderID);
            }
        });
    }

    /**
     * Method used to handle the drop event.
     * @param {int} documentID The ID of the document to be moved.
     * @param {int} folderID The ID of the folder where the document will be moved.
     */
    handleDrop(documentID, folderID) {
        // Remove the modal window containing the folder structure.
        this.removeModalWindow();
        // Ask the user if he is sure about moving the document.
        new ModalWindowsFactory().spawnModalWindow(
            '↩️ Move Document',
            '<div class="has-text-centered">Are you sure you want to move this document?</div>',
            [
                {
                    text: 'Yes',
                    class: 'is-warning',
                    callback: () => {
                        new Document().moveDocument(documentID, folderID)
                            .then(() => {
                                new ViewFolderContent().initializeViewFolderContent(folderID);
                                // Set the message of the page.
                                new Orchestrator().setPageMessage("message is-success",
                                    "The document was successfully moved.");
                            })
                            .catch((error) => {
                                // Set the message of the page.
                                new Orchestrator().setPageMessage("message is-danger", error.message);
                            });

                    }
                },
                {
                    text: 'No',
                    class: '',
                    callback: () => {
                    }
                }
            ]
        )
    }

    /**
     * Method responsible for creating the trash bin.
     * @param {int} parentFolderID The ID of the folder where the document is currently located.
     * @returns {HTMLElement} The HTML element representing the trash bin.
     */
    createTrashBin(parentFolderID) {
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
        // Restore the pointer events to the default value.
        trashBinLabel.style.pointerEvents = 'auto';

        // Add "dragover" event listener to the trash bin label
        trashBinLabel.addEventListener("dragover", (event) => {
            const isValidData = event.dataTransfer.types.includes("document/id")
            if (isValidData) {
                event.preventDefault();
            }
        });

        // Add "drop" event listener to the trash bin label
        trashBinLabel.addEventListener("drop", (event) => {
            const isValidData = event.dataTransfer.types.includes("document/id");
            if (isValidData) {
                event.preventDefault();
                const documentID = event.dataTransfer.getData("document/id");
                this.askForDeleteConfirmation(documentID, parentFolderID);
            }
        });

        return trashBinContainer;
    }

    /**
     * Method responsible for asking the user for a delete confirmation
     * @param documentID The ID of the document to be deleted.
     * @param parentFolderID The ID of the folder where the document is currently located.
     */
    askForDeleteConfirmation(documentID, parentFolderID) {
        new ModalWindowsFactory().spawnModalWindow(
            '🗑️ Delete Document',
            '<div class="has-text-centered">Are you sure you want to delete this document?</div>',
            [
                {
                    text: 'Yes',
                    class: 'is-danger',
                    callback: () => {
                        new Document().deleteDocument(documentID)
                            .then(() => {
                                new Orchestrator().setPageMessage("message is-success",
                                    "The document was successfully deleted.");
                                new ViewFolderContent().initializeViewFolderContent(parentFolderID);
                            })
                            .catch((error) => {
                                new Orchestrator().setPageMessage("message is-danger", error.message);
                            });
                    }
                },
                {
                    text: 'No',
                    class: '',
                    callback: () => {
                    }
                }
            ]
        );
    }
}
