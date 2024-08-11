package it.polimi.tiw.frontend.messages.outbound.contentmanagement;

import java.util.Date;

/**
 * Data Transfer Object (DTO) for folder details.
 * This class is used to encapsulate the data required for representing folder details.
 */
@SuppressWarnings("ClassCanBeRecord")
public class FolderDetailsDTO {
    private final int folderID;
    private final String folderName;
    private final Date creationDate;
    private final int parentFolderID;

    /**
     * Constructs a new FolderDetailsDTO with the specified details.
     *
     * @param folderID       the ID of the folder
     * @param folderName     the name of the folder
     * @param creationDate   the creation date of the folder
     * @param parentFolderID the ID of the parent folder
     */
    public FolderDetailsDTO(int folderID, String folderName, Date creationDate, int parentFolderID) {
        this.folderID = folderID;
        this.folderName = folderName;
        this.creationDate = creationDate;
        this.parentFolderID = parentFolderID;
    }

    /**
     * Gets the ID of the folder.
     *
     * @return the folder ID
     */
    @SuppressWarnings("unused")
    public int getFolderID() {
        return folderID;
    }

    /**
     * Gets the name of the folder.
     *
     * @return the folder name
     */
    @SuppressWarnings("unused")
    public String getFolderName() {
        return folderName;
    }

    /**
     * Gets the creation date of the folder.
     *
     * @return the creation date
     */
    @SuppressWarnings("unused")
    public Date getCreationDate() {
        return creationDate;
    }

    /**
     * Gets the ID of the parent folder.
     *
     * @return the parent folder ID
     */
    @SuppressWarnings("unused")
    public int getParentFolderID() {
        return parentFolderID;
    }
}