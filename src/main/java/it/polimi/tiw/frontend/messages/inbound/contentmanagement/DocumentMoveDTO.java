package it.polimi.tiw.frontend.messages.inbound.contentmanagement;

import it.polimi.tiw.backend.utilities.exceptions.FailedInputParsingException;

/**
 * Data Transfer Object for moving a document to a new folder.
 */
public class DocumentMoveDTO {
    private final int newFolderID;

    /**
     * Constructs a new DocumentMoveDTO.
     *
     * @param newFolderID the ID of the new folder where the document will be moved
     * @throws FailedInputParsingException if the new folder ID is invalid
     */
    public DocumentMoveDTO(int newFolderID) throws FailedInputParsingException {
        if (newFolderID <= 0) {
            throw new FailedInputParsingException();
        }
        this.newFolderID = newFolderID;
    }

    /**
     * Gets the ID of the new folder where the document will be moved.
     *
     * @return the new folder ID
     */
    public int getNewFolderID() {
        return newFolderID;
    }
}