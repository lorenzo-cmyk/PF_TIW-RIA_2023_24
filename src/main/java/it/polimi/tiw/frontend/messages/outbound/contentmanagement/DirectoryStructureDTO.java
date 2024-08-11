package it.polimi.tiw.frontend.messages.outbound.contentmanagement;

import java.util.List;

/**
 * Data Transfer Object (DTO) for representing the structure of a directory.
 * This class is used to encapsulate the data required for representing a directory and its subdirectories.
 */
@SuppressWarnings("ClassCanBeRecord")
public class DirectoryStructureDTO {
    private final String folderName;
    private final int folderID;
    private final List<DirectoryStructureDTO> subfolders;

    /**
     * Constructs a new DirectoryStructureDTO with the specified details.
     *
     * @param folderName the name of the folder
     * @param folderID   the ID of the folder
     * @param subfolders the list of subfolders within this folder
     */
    public DirectoryStructureDTO(String folderName, int folderID, List<DirectoryStructureDTO> subfolders) {
        this.folderName = folderName;
        this.folderID = folderID;
        this.subfolders = subfolders;
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
     * Gets the ID of the folder.
     *
     * @return the folder ID
     */
    @SuppressWarnings("unused")
    public int getFolderID() {
        return folderID;
    }

    /**
     * Gets the list of subfolders within this folder.
     *
     * @return the list of subfolders
     */
    @SuppressWarnings("unused")
    public List<DirectoryStructureDTO> getSubfolders() {
        return subfolders;
    }
}