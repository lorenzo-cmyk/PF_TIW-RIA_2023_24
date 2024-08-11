package it.polimi.tiw.frontend.messages.outbound.contentmanagement;

import java.util.Date;

/**
 * Data Transfer Object for document details.
 */
@SuppressWarnings("ClassCanBeRecord")
public class DocumentDetailsDTO {
    private final int documentID;
    private final String documentName;
    private final Date creationDate;
    private final String type;
    private final String summary;
    private final int folderID;

    /**
     * Constructs a new DocumentDetailsDTO.
     *
     * @param documentID   the ID of the document
     * @param documentName the name of the document
     * @param creationDate the creation date of the document
     * @param type         the type of the document
     * @param summary      a brief summary of the document
     * @param folderID     the ID of the folder where the document is stored
     */
    public DocumentDetailsDTO(int documentID, String documentName,
                              Date creationDate, String type, String summary, int folderID) {
        this.documentID = documentID;
        this.documentName = documentName;
        this.creationDate = creationDate;
        this.type = type;
        this.summary = summary;
        this.folderID = folderID;
    }

    /**
     * Gets the ID of the document.
     *
     * @return the document ID
     */
    @SuppressWarnings("unused")
    public int getDocumentID() {
        return documentID;
    }

    /**
     * Gets the name of the document.
     *
     * @return the document name
     */
    @SuppressWarnings("unused")
    public String getDocumentName() {
        return documentName;
    }

    /**
     * Gets the creation date of the document.
     *
     * @return the creation date
     */
    @SuppressWarnings("unused")
    public Date getCreationDate() {
        return creationDate;
    }

    /**
     * Gets the type of the document.
     *
     * @return the document type
     */
    @SuppressWarnings("unused")
    public String getType() {
        return type;
    }

    /**
     * Gets the summary of the document.
     *
     * @return the document summary
     */
    @SuppressWarnings("unused")
    public String getSummary() {
        return summary;
    }

    /**
     * Gets the ID of the folder where the document is stored.
     *
     * @return the folder ID
     */
    @SuppressWarnings("unused")
    public int getFolderID() {
        return folderID;
    }
}