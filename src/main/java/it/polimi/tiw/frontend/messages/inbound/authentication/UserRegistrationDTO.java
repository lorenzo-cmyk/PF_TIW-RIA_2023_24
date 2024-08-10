package it.polimi.tiw.frontend.messages.inbound.authentication;

import it.polimi.tiw.backend.utilities.Validators;
import it.polimi.tiw.backend.utilities.exceptions.FailedInputParsingException;

/**
 * Data Transfer Object (DTO) for user registration.
 * This class is used to encapsulate the data required for user registration.
 */
public class UserRegistrationDTO {
    private final String username;
    private final String password;
    private final String passwordConfirmation;
    private final String email;

    /**
     * Constructs a new UserRegistrationDTO with the specified details.
     *
     * @param username             the username of the user
     * @param password             the password of the user
     * @param passwordConfirmation the password confirmation
     * @param email                the email address of the user
     * @throws FailedInputParsingException if any of the input strings are invalid
     */
    public UserRegistrationDTO(String username, String password, String passwordConfirmation, String email) throws FailedInputParsingException {
        this.username = Validators.parseString(username);
        this.password = Validators.parseString(password);
        this.passwordConfirmation = Validators.parseString(passwordConfirmation);
        this.email = Validators.parseString(email);
    }

    /**
     * Gets the username of the user.
     *
     * @return the username
     */
    public String getUsername() {
        return username;
    }

    /**
     * Gets the password of the user.
     *
     * @return the password
     */
    public String getPassword() {
        return password;
    }

    /**
     * Gets the password confirmation.
     *
     * @return the password confirmation
     */
    public String getPasswordConfirmation() {
        return passwordConfirmation;
    }

    /**
     * Gets the email address of the user.
     *
     * @return the email address
     */
    public String getEmail() {
        return email;
    }
}