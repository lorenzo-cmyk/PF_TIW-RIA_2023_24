package it.polimi.tiw.frontend.messages.inbound.authentication;

import it.polimi.tiw.backend.utilities.Validators;
import it.polimi.tiw.backend.utilities.exceptions.FailedInputParsingException;

/**
 * Data Transfer Object (DTO) for user authentication.
 * This class is used to encapsulate the data required for user authentication.
 */
public class UserAuthenticationDTO {
    private final String username;
    private final String password;

    /**
     * Constructs a new UserAuthenticationDTO with the specified details.
     *
     * @param username the username of the user
     * @param password the password of the user
     * @throws FailedInputParsingException if any of the input strings are invalid
     */
    public UserAuthenticationDTO(String username, String password) throws FailedInputParsingException {
        this.username = Validators.parseString(username);
        this.password = Validators.parseString(password);
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
}