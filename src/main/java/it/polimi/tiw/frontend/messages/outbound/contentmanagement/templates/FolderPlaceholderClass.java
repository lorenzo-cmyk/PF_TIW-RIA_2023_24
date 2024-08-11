package it.polimi.tiw.frontend.messages.outbound.contentmanagement.templates;

/**
 * A class representing a placeholder for a folder.
 * This class contains the folder ID and folder name.
 */
@SuppressWarnings("ClassCanBeRecord")
public class FolderPlaceholderClass {
    private final int folderID;
    private final String folderName;

    /**
     * Constructs a new FolderPlaceholderClass with the specified folder ID and folder name.
     *
     * @param folderID   the ID of the folder
     * @param folderName the name of the folder
     */
    public FolderPlaceholderClass(int folderID, String folderName) {
        this.folderID = folderID;
        this.folderName = folderName;
    }

    /**
     * Returns the name of the folder.
     *
     * @return the folder name
     */
    @SuppressWarnings("unused")
    public String getFolderName() {
        return folderName;
    }

    /**
     * Returns the ID of the folder.
     *
     * @return the folder ID
     */
    @SuppressWarnings("unused")
    public int getFolderID() {
        return folderID;
    }
}