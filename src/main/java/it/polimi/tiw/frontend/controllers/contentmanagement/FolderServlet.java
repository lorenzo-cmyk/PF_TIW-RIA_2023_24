package it.polimi.tiw.frontend.controllers.contentmanagement;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import it.polimi.tiw.backend.beans.Folder;
import it.polimi.tiw.backend.beans.User;
import it.polimi.tiw.backend.dao.FolderDAO;
import it.polimi.tiw.backend.utilities.DatabaseConnectionBuilder;
import it.polimi.tiw.backend.utilities.Validators;
import it.polimi.tiw.backend.utilities.exceptions.FailedInputParsingException;
import it.polimi.tiw.frontend.messages.outbound.contentmanagement.FolderDetailsDTO;
import it.polimi.tiw.frontend.messages.outbound.generic.ErrorDTO;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

/**
 * This servlet is used to retrieve the details of a folder given its ID. It is also used to delete a folder.
 */
@WebServlet(name = "FolderServlet", value = "/api/folders/*")
public class FolderServlet extends HttpServlet {
    private Connection servletConnection;

    /**
     * Default constructor, called by the servlet container.
     */
    public FolderServlet() {
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
        // Get the request URI (the part of the URL after the domain name)
        String requestURI = req.getRequestURI();
        // Get the context path (the part of the URL that represents the app)
        String contextPath = req.getContextPath();
        // Remove everything before the "/api/folders/" part of the URL
        String path = requestURI.substring(contextPath.length() + "/api/folders/".length());
        // Split the path into its parts
        String[] pathParts = path.split("/");

        // Ensure the URL matches the pattern /api/folders/{folderID}
        if (pathParts.length == 1) {
            try {
                // Get the folderID from the pathInfo and store it in a variable
                int folderID = Validators.parseInt(pathParts[0]); // Remove the leading "/"
                // Get the ownerID from the session and store it in a variable
                int ownerID = ((User) req.getSession().getAttribute("user")).getUserID();
                // Ensure that the folder I want to view actually exists and is owned by the user
                FolderDAO folderDAO = new FolderDAO(servletConnection);
                Folder folder = folderDAO.getFolderByID(folderID, ownerID);
                if (folder == null) {
                    ErrorDTO errorDTO = new ErrorDTO("The folder you are asking for does not exist or " +
                            "is not owned by the logged user. Are you trying to hijack the request?");
                    sendErrorDTO(resp, errorDTO, HttpServletResponse.SC_NOT_FOUND);
                    return;
                }
                // Retrieve the folder's details and send them to the client
                FolderDetailsDTO folderDetailsDTO = new FolderDetailsDTO(folder.getFolderID(), folder.getFolderName(),
                        folder.getCreationDate(), folder.getParentFolderID());
                // Sending the JSON response
                Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
                String folderDetailsJson = gson.toJson(folderDetailsDTO);
                resp.setStatus(HttpServletResponse.SC_OK);
                resp.setContentType("application/json");
                resp.setCharacterEncoding("UTF-8");
                resp.getWriter().write(folderDetailsJson);
            } catch (FailedInputParsingException e) {
                ErrorDTO errorDTO = new ErrorDTO("The folder ID is not a valid integer. " +
                        "Are you trying to hijack the request?");
                sendErrorDTO(resp, errorDTO, HttpServletResponse.SC_BAD_REQUEST);
            } catch (SQLException e) {
                ErrorDTO errorDTO = new ErrorDTO("Unable to retrieve the folder content due to " +
                        "a critical error in the database.");
                sendErrorDTO(resp, errorDTO, HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }
        } else {
            ErrorDTO errorDTO = new ErrorDTO("The folder ID is missing from the request. " +
                    "Are you trying to hijack the request?");
            sendErrorDTO(resp, errorDTO, HttpServletResponse.SC_BAD_REQUEST);
        }
    }

    private void sendErrorDTO(HttpServletResponse resp, ErrorDTO errorDTO, int httpStatus) throws IOException {
        resp.setStatus(httpStatus);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().println(new Gson().toJson(errorDTO));
    }

}