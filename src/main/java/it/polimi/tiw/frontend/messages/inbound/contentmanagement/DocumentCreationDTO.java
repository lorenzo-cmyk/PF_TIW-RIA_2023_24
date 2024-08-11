package it.polimi.tiw.frontend.messages.inbound.contentmanagement;

import it.polimi.tiw.backend.utilities.Validators;
import it.polimi.tiw.backend.utilities.exceptions.FailedInputParsingException;

/**
 * Data Transfer Object for creating a document.
 */
public class DocumentCreationDTO {
    private final String documentName;
    private final String type;
    private final String summary;
    private final int folderID;

    /**
     * Constructs a new DocumentCreationDTO.
     *
     * @param documentName the name of the document
     * @param type         the type of the document
     * @param summary      a brief summary of the document
     * @param folderID     the ID of the folder where the document is stored
     * @throws FailedInputParsingException if any of the input parameters are invalid
     */
    public DocumentCreationDTO(String documentName, String type, String summary, int folderID)
            throws FailedInputParsingException {
        this.documentName = Validators.parseString(documentName);
        this.type = Validators.parseString(type);
        this.summary = Validators.parseString(summary);
        if (folderID <= 0) {
            throw new FailedInputParsingException();
        }
        this.folderID = folderID;
    }

    /**
     * Gets the name of the document.
     *
     * @return the document name
     */
    public String getDocumentName() {
        return documentName;
    }

    /**
     * Gets the type of the document.
     *
     * @return the document type
     */
    public String getType() {
        return type;
    }

    /**
     * Gets the summary of the document.
     *
     * @return the document summary
     */
    public String getSummary() {
        return summary;
    }

    /**
     * Gets the ID of the folder where the document is stored.
     *
     * @return the folder ID
     */
    public int getFolderID() {
        return folderID;
    }
}