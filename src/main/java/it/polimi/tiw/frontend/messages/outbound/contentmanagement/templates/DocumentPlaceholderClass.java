package it.polimi.tiw.frontend.messages.outbound.contentmanagement.templates;

/**
 * A class representing a placeholder for a document.
 * This class contains the document ID and document name.
 */
@SuppressWarnings("ClassCanBeRecord")
public class DocumentPlaceholderClass {
    private final int documentID;
    private final String documentName;

    /**
     * Constructs a new DocumentPlaceholderClass with the specified document ID and document name.
     *
     * @param documentID   the ID of the document
     * @param documentName the name of the document
     */
    public DocumentPlaceholderClass(int documentID, String documentName) {
        this.documentID = documentID;
        this.documentName = documentName;
    }

    /**
     * Returns the name of the document.
     *
     * @return the document name
     */
    @SuppressWarnings("unused")
    public String getDocumentName() {
        return documentName;
    }

    /**
     * Returns the ID of the document.
     *
     * @return the document ID
     */
    @SuppressWarnings("unused")
    public int getDocumentID() {
        return documentID;
    }
}