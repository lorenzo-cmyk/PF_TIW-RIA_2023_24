/**
 * @file Main.js is the JavaScript entry point for the index.html page.
 */
import User from "./modules/abstractions/User.js";
import Orchestrator from "./modules/pages/utilities/Orchestrator.js";

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
