/**
 * @file ModalWindowsFactory.js is the file responsible for the ModalWindowsFactory class.
 * This class is responsible for the creation of modal windows.
 * It is exported as a module to be used in other scripts.
 */

/**
 * Class responsible for the creation of modal windows.
 * @class
 */
export default class ModalWindowsFactory {

    /**
     * Method used to build a modal window.
     * @param {String} title The title of the modal window.
     * @param {String} content The HTML content of the modal window.
     * @param {Object} buttons The buttons to be added to the modal window.
     * @returns {HTMLElement} The modal window itself.
     */
    buildModalWindow(title, content, buttons) {
        // Create the modal window container
        const modal = document.createElement('div');
        modal.className = 'modal';
        // Create the modal background (add a shadow effect to the page behind the modal)
        const modalBackground = document.createElement('div');
        modalBackground.className = 'modal-background';
        // Create the modal card
        const modalCard = document.createElement('div');
        modalCard.className = 'modal-card';
        // Create the header of the modal card
        const header = document.createElement('header');
        header.className = 'modal-card-head';
        // Create the title of the modal card header
        const titleElement = document.createElement('p');
        titleElement.className = 'modal-card-title';
        titleElement.textContent = title;
        header.appendChild(titleElement); // Add the title to the header
        // Create body of the modal card
        const body = document.createElement('section');
        body.className = 'modal-card-body';
        body.innerHTML = content;
        // Create footer of the modal card
        const footer = document.createElement('footer');
        footer.className = 'modal-card-foot';
        // Create buttons container for the footer
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'buttons';
        // Create the required buttons
        buttons.forEach(buttonConfig => {
            const button = document.createElement('button');
            button.className = `button ${buttonConfig.class || ''}`;
            button.textContent = buttonConfig.text;
            button.onclick = () => {
                buttonConfig.callback();
                modal.remove();
            };
            // Add the button to the buttons container
            buttonsContainer.appendChild(button);
        });
        // Add buttons container to the footer
        footer.appendChild(buttonsContainer);
        // Assemble the modal card
        modalCard.appendChild(header);
        modalCard.appendChild(body);
        modalCard.appendChild(footer);
        // Assemble the modal window
        modal.appendChild(modalBackground);
        modal.appendChild(modalCard);

        return modal;
    }

    /**
     * Method used to spawn a modal window on the screen.
     * @param {String} title The title of the modal window.
     * @param {String} content The HTML content of the modal window.
     * @param {Object} buttons The buttons to be added to the modal window.
     */
    spawnModalWindow(title, content, buttons) {
        const modal = this.buildModalWindow(title, content, buttons);
        modal.classList.add('is-active');
        document.body.appendChild(modal);
    }
}