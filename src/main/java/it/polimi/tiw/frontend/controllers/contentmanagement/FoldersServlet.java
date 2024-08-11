package it.polimi.tiw.frontend.controllers.contentmanagement;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;
import it.polimi.tiw.backend.beans.Folder;
import it.polimi.tiw.backend.beans.User;
import it.polimi.tiw.backend.beans.exceptions.InvalidArgumentException;
import it.polimi.tiw.backend.dao.FolderDAO;
import it.polimi.tiw.backend.dao.exceptions.DuplicateFolderException;
import it.polimi.tiw.backend.dao.exceptions.FolderCreationException;
import it.polimi.tiw.backend.utilities.DatabaseConnectionBuilder;
import it.polimi.tiw.backend.utilities.Validators;
import it.polimi.tiw.backend.utilities.exceptions.UnknownErrorCodeException;
import it.polimi.tiw.backend.utilities.templates.TreeNode;
import it.polimi.tiw.frontend.messages.inbound.contentmanagement.FolderCreationDTO;
import it.polimi.tiw.frontend.messages.outbound.generic.ErrorDTO;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

/**
 * This servlet is used to interact with the directory structure of the user.
 */
@WebServlet(name = "FoldersServlet", value = "/api/folders")
public class FoldersServlet extends HttpServlet {
    private Connection servletConnection;

    /**
     * Default constructor, called by the servlet container.
     */
    public FoldersServlet() {
        super();
    }

    /**
     * This method is called by the servlet container when the servlet is initialized.
     * It initializes the servletConnection and the templateEngine objects.
     */
    public void init() {
        servletConnection = DatabaseConnectionBuilder.getConnectionFromServlet(this);
    }

    /**
     * This method is called by the servlet container when the servlet is destroyed.
     * It closes the connection to the database.
     */
    public void destroy() {
        DatabaseConnectionBuilder.closeConnection(servletConnection);
    }

    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            // Retrieving the user object from the session
            User user = (User) req.getSession().getAttribute("user");
            // Building a FolderDAO object and using it to retrieve the client's folders tree
            FolderDAO folderDAO = new FolderDAO(servletConnection);
            TreeNode<Folder> foldersTree = folderDAO.buildFolderTree(-1, user.getUserID());
            // Converting the tree into a JSON and change the GSON date format to the one used by the frontend
            Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
            // FIXME: Improve the JSON structure to make it more readable
            String foldersTreeJson = gson.toJson(foldersTree);
            // Sending the JSON response
            resp.setStatus(HttpServletResponse.SC_OK);
            resp.setContentType("application/json");
            resp.setCharacterEncoding("UTF-8");
            resp.getWriter().write(foldersTreeJson);
        } catch (SQLException e) {
            ErrorDTO errorDTO = new ErrorDTO("Unable to retrieve the user's folders due " +
                    "to a critical error in the database.");
            sendErrorDTO(resp, errorDTO, HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            // First, parse the JSON object from the request
            Gson gson = new Gson();
            FolderCreationDTO folderCreationDTO = gson.fromJson(req.getReader(), FolderCreationDTO.class);
            if (folderCreationDTO == null) {
                throw new JsonSyntaxException("Malformed request. Are you trying to hijack the request?");
            }
            // Then, we get the OwnerID from the session
            int ownerID = ((User) req.getSession().getAttribute("user")).getUserID();
            // Create the folder object
            Folder folder = new Folder(folderCreationDTO.getFolderName(), ownerID, folderCreationDTO.getParentFolderId());
            // Create the folder in the database
            FolderDAO folderDAO = new FolderDAO(servletConnection);
            folderDAO.createFolder(folder);
            // If everything went well, we reply with a success message
            resp.setStatus(HttpServletResponse.SC_CREATED);
        } catch (SQLException e) {
            ErrorDTO errorDTO = new ErrorDTO("Unable to create the new folder due " +
                    "to a critical error in the database.");
            sendErrorDTO(resp, errorDTO, HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        } catch (DuplicateFolderException | InvalidArgumentException | FolderCreationException e) {
            try {
                ErrorDTO errorDTO = new ErrorDTO(Validators.retrieveErrorMessageFromErrorCode(e.getErrorCode()));
                sendErrorDTO(resp, errorDTO, HttpServletResponse.SC_BAD_REQUEST);
            } catch (UnknownErrorCodeException ignored) {
                ErrorDTO errorDTO = new ErrorDTO("Unable to create the new folder due to an unknown error.");
                sendErrorDTO(resp, errorDTO, HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }
        }
    }

    private void sendErrorDTO(HttpServletResponse resp, ErrorDTO errorDTO, int httpStatus) throws IOException {
        resp.setStatus(httpStatus);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().println(new Gson().toJson(errorDTO));
    }
}