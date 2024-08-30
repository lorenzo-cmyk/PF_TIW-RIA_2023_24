/**
 * @file Orchestrator.js is the file responsible for the Orchestrator class.
 * This class is responsible for orchestrating the page.
 * It is exported as a module to be used in other scripts.
 */
import User from "../../abstractions/User.js";
import Homepage from "../Homepage.js";

/**
 * Class responsible for orchestrating the pages of the application.
 * @class
 */
export default class Orchestrator {

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
        // Prevent the default dragging behavior.
        newActionLinkElement.draggable = false;
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
