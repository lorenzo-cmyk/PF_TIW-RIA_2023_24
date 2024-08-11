package it.polimi.tiw.frontend.messages.inbound.contentmanagement;

import it.polimi.tiw.backend.utilities.Validators;
import it.polimi.tiw.backend.utilities.exceptions.FailedInputParsingException;

/**
 * Data Transfer Object (DTO) for folder creation.
 * This class is used to encapsulate the data required for creating a folder.
 */
public class FolderCreationDTO {
    private final String folderName;
    private final int parentFolderId;

    /**
     * Constructs a new FolderCreationDTO with the specified details.
     *
     * @param folderName     the name of the folder
     * @param parentFolderId the ID of the parent folder
     * @throws FailedInputParsingException if the folder name is invalid
     */
    public FolderCreationDTO(String folderName, int parentFolderId) throws FailedInputParsingException {
        this.folderName = Validators.parseString(folderName);
        // The Gson library just set a default value of 0 if the field is missing!
        if (parentFolderId <= 0) {
            throw new FailedInputParsingException();
        }
        this.parentFolderId = parentFolderId;
    }

    /**
     * Gets the name of the folder.
     *
     * @return the folder name
     */
    public String getFolderName() {
        return folderName;
    }

    /**
     * Gets the ID of the parent folder.
     *
     * @return the parent folder ID
     */
    public int getParentFolderId() {
        return parentFolderId;
    }
}