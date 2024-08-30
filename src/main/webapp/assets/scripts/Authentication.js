import User from "./modules/abstractions/User.js";

/**
 * Class responsible in managing the authentication page.
 * @class
 */
class AuthenticationPage {

    /**
     * Default constructor for the AuthenticationPage class.
     */
    constructor() {
        this.pageStatus = null;
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
     * Method responsible for setting the footer of the page.
     * @param {string} htmlContent The html content of the footer.
     */
    setPageFooter(htmlContent) {
        // Retrieve the "page-footer-text" element
        const footerText = document.getElementById("page-footer-text");
        // Set the html content of the paragraph.
        footerText.innerHTML = htmlContent;
    }

    /**
     * Method responsible for setting the visibility of the login form.
     * @param {boolean} isVisible The visibility of the login form.
     */
    setLoginFormVisibility(isVisible) {
        // Retrieve the "login-form" element
        const loginFormElement = document.getElementById("login-form");
        // Set the visibility of the login-form element.
        loginFormElement.style.display = isVisible ? "block" : "none";
    }

    /**
     * Method responsible for setting the visibility of the registration form.
     * @param {boolean} isVisible The visibility of the registration form.
     */
    setRegistrationFormVisibility(isVisible) {
        // Retrieve the "registration-form" element
        const registrationFormElement = document.getElementById("registration-form");
        // Set the visibility of the registration-form element.
        registrationFormElement.style.display = isVisible ? "block" : "none";
    }

    /**
     * Method responsible for setting the action of the login form button.
     */
    setLoginFormButtonAction() {
        // Retrieve the "login-form-button" element
        const loginFormButton = document.getElementById("login-form-button");
        // Set the action of the button.
        loginFormButton.addEventListener("click", (event) => {
            event.preventDefault();
            this.handleLoginButtonClick();
        });
    }

    /**
     * Method responsible for setting the action of the registration link.
     */
    setRegistrationLinkAction() {
        // Retrieve the "registration-link" element
        const registrationLink = document.getElementById("registration-link");
        // Set the action of the link.
        registrationLink.addEventListener("click", (event) => {
            event.preventDefault();
            this.handleRegistrationLinkClick();
        });
    }

    /**
     * Method responsible for setting the action of the registration form button.
     */
    setRegistrationFormButtonAction() {
        // Retrieve the "registration-form-button" element
        const registrationFormButton = document.getElementById("registration-form-button");
        // Set the action of the button.
        registrationFormButton.addEventListener("click", (event) => {
            event.preventDefault();
            this.handleRegistrationButtonClick();
        });
    }

    /**
     * Method responsible for setting the action of the login link.
     */
    setLoginLinkAction() {
        // Retrieve the "login-link" element
        const loginLink = document.getElementById("login-link");
        // Set the action of the link.
        loginLink.addEventListener("click", (event) => {
            event.preventDefault();
            this.handleLoginLinkClick();
        });
    }

    /**
     * Method used to initialize the login page.
     */
    initializeLoginPage() {
        // Set the pageStatus to "login".
        this.pageStatus = "login";

        this.setTabTitle("TIW-DMS - Authentication");
        this.setPageTitle("Authentication 🔒");
        this.setPageMessage("message", "Please enter your credentials to log in.");
        this.setPageFooter("Don't have an account yet? You can register one <a id=\"registration-link\">here!</a>");
        this.setRegistrationLinkAction();
        this.setLoginFormVisibility(true);
        this.setRegistrationFormVisibility(false);
        this.setLoginFormButtonAction();
    }

    /**
     * Method used to initialize the registration page.
     */
    initializeRegistrationPage() {
        // Set the pageStatus to "registration".
        this.pageStatus = "registration";

        this.setTabTitle("TIW-DMS - Registration");
        this.setPageTitle("Registration 📝");
        this.setPageMessage("message", "Please enter your credentials to register.");
        this.setPageFooter("Do you already have an account? You can log in <a id=\"login-link\">here!</a>");
        this.setLoginLinkAction();
        this.setRegistrationFormVisibility(true);
        this.setLoginFormVisibility(false);
        this.setRegistrationFormButtonAction();
    }

    /**
     * Method to handle the click on the registration link.
     */
    handleRegistrationLinkClick() {
        // Check the current pageStatus and ensure it is "login".
        if (this.pageStatus !== "login") {
            alert("The registration link is only available on the login page.");
            return;
        }
        // Initialize the registration page.
        this.initializeRegistrationPage();
    }

    /**
     * Method to handle the click on the login link.
     */
    handleLoginLinkClick() {
        // Check the current pageStatus and ensure it is "registration".
        if (this.pageStatus !== "registration") {
            alert("The login link is only available on the registration page.");
            return;
        }
        // Initialize the login page.
        this.initializeLoginPage();
    }

    /**
     * Method to handle the click on the registration button.
     */
    handleRegistrationButtonClick() {
        // Check the current pageStatus and ensure it is "registration".
        if (this.pageStatus !== "registration") {
            alert("The registration button is only available on the registration page.");
            return;
        }
        // Check the validity of the registration form before proceeding in the registration process.
        const registrationForm = document.getElementById("registration-form");
        if (!registrationForm.checkValidity()) {
            registrationForm.reportValidity();
            return;
        }
        // Prevent the user from spamming the registration button or altering the form.
        const registrationFormFieldset = document.getElementById("registration-form-fieldset");
        registrationFormFieldset.disabled = true;
        const registrationFormButton = document.getElementById("registration-form-button");
        registrationFormButton.disabled = true;
        // Extract the values from the registration form.
        const username = document.getElementById("registration-form-username").value;
        const email = document.getElementById("registration-form-email").value;
        const password = document.getElementById("registration-form-password").value;
        const passwordConfirmation = document.getElementById("registration-form-confirmPassword").value;
        // Create a new User object and call the createUser method.
        const user = new User();
        user.createUser(username, email, password, passwordConfirmation)
            .then(() => {
                // If the registration is successful, show a success message.
                this.setPageMessage("message is-success", "The registration was successful! " +
                    "You can now log in.");
                // Clear the registration form.
                document.getElementById("registration-form-username").value = "";
                document.getElementById("registration-form-email").value = "";
                document.getElementById("registration-form-password").value = "";
                document.getElementById("registration-form-confirmPassword").value = "";
            })
            .catch((error) => {
                // If the registration fails, show an error message.
                this.setPageMessage("message is-danger", error.message);
            });
        // Re-enable the registration form.
        registrationFormFieldset.disabled = false;
        registrationFormButton.disabled = false;
    }

    /**
     * Method to handle the click on the login button.
     */
    handleLoginButtonClick() {
        // Check the current pageStatus and ensure it is "login".
        if (this.pageStatus !== "login") {
            alert("The login button is only available on the login page.");
            return;
        }
        // Check the validity of the login form before proceeding in the login process.
        const loginForm = document.getElementById("login-form");
        if (!loginForm.checkValidity()) {
            loginForm.reportValidity();
            return;
        }
        // Prevent the user from spamming the login button or altering the form.
        const loginFormFieldset = document.getElementById("login-form-fieldset");
        loginFormFieldset.disabled = true;
        // Extract the values from the login form.
        const username = document.getElementById("login-form-username").value;
        const password = document.getElementById("login-form-password").value;
        // Create a new User object and call the loginUser method.
        const user = new User();
        user.loginUser(username, password)
            .then(() => {
                // If the login is successful, redirect to the index page.
                window.location.href = "index.html";
            })
            .catch((error) => {
                // If the login fails, show an error message.
                this.setPageMessage("message is-danger", error.message);
            })
            .finally(() => {
                // Clear the password field.
                document.getElementById("login-form-password").value = "";
            });
        // Re-enable the login form.
        loginFormFieldset.disabled = false;
    }

    /**
     * Method used to initialize the authentication page.
     */
    initialize() {
        this.initializeLoginPage();
    }
}

window.onload = function () {
    // Check if the user is already authenticated. If so, redirect to the index page.
    const user = new User();
    user.checkAuthentication()
        .then(() => {
            // Redirect to the index page.
            window.location.href = "index.html";
        })
        .catch(() => {
            new AuthenticationPage().initialize();
        });
};