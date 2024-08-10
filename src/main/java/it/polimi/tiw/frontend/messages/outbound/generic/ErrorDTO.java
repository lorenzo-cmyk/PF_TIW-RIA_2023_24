package it.polimi.tiw.frontend.messages.outbound.generic;

/**
 * Data Transfer Object (DTO) for error messages.
 * This class is used to encapsulate error messages to be sent in responses.
 */
@SuppressWarnings("ClassCanBeRecord")
public class ErrorDTO {
    private final String error;

    /**
     * Constructs a new ErrorDTO with the specified error message.
     *
     * @param error the error message
     */
    public ErrorDTO(String error) {
        this.error = error;
    }

    /**
     * Gets the error message.
     *
     * @return the error message
     */
    public String getError() {
        return error;
    }
}