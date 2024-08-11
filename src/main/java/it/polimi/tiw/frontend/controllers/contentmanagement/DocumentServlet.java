package it.polimi.tiw.frontend.controllers.contentmanagement;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonIOException;
import com.google.gson.JsonSyntaxException;
import it.polimi.tiw.backend.beans.Document;
import it.polimi.tiw.backend.beans.Folder;
import it.polimi.tiw.backend.beans.User;
import it.polimi.tiw.backend.dao.DocumentDAO;
import it.polimi.tiw.backend.dao.FolderDAO;
import it.polimi.tiw.backend.dao.exceptions.DocumentDeletionException;
import it.polimi.tiw.backend.dao.exceptions.DocumentMovingException;
import it.polimi.tiw.backend.dao.exceptions.DuplicateDocumentException;
import it.polimi.tiw.backend.utilities.DatabaseConnectionBuilder;
import it.polimi.tiw.backend.utilities.Validators;
import it.polimi.tiw.backend.utilities.exceptions.FailedInputParsingException;
import it.polimi.tiw.backend.utilities.exceptions.UnknownErrorCodeException;
import it.polimi.tiw.frontend.messages.inbound.contentmanagement.DocumentMoveDTO;
import it.polimi.tiw.frontend.messages.outbound.contentmanagement.DocumentDetailsDTO;
import it.polimi.tiw.frontend.messages.outbound.generic.ErrorDTO;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

/**
 * This servlet is used to retrieve the details of a document given its ID.
 * It also used to delete a document or move it.
 */
@WebServlet(name = "DocumentServlet", value = "/api/documents/*")
public class DocumentServlet extends HttpServlet {
    private Connection servletConnection;

    /**
     * Default constructor, called by the servlet container.
     */
    public DocumentServlet() {
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
        // Remove everything before the "/api/documents/" part of the URL
        String path = requestURI.substring(contextPath.length() + "/api/documents/".length());
        // Split the path into its parts
        String[] pathParts = path.split("/");

        // Ensure the URL matches the pattern /api/documents/{documentID}
        if (pathParts.length == 1) {
            try {
                // Get the documentID from the pathInfo and store it in a variable
                int documentID = Validators.parseInt(pathParts[0]); // Remove the leading "/"
                // Get the ownerID from the session and store it in a variable
                int ownerID = ((User) req.getSession().getAttribute("user")).getUserID();
                // Ensure that the document I want to view actually exists and is owned by the user
                DocumentDAO documentDAO = new DocumentDAO(servletConnection);
                Document document = documentDAO.getDocumentByID(documentID, ownerID);
                if (document == null) {
                    ErrorDTO errorDTO = new ErrorDTO("The document you are asking for does not exist or " +
                            "is not owned by the logged user. Are you trying to hijack the request?");
                    sendErrorDTO(resp, errorDTO, HttpServletResponse.SC_NOT_FOUND);
                    return;
                }
                // Send the information retrieved to the client
                DocumentDetailsDTO documentDetailsDTO = new DocumentDetailsDTO(
                        document.getDocumentID(),
                        document.getDocumentName(),
                        document.getCreationDate(),
                        document.getType(),
                        document.getSummary(),
                        document.getFolderID()
                );
                // Sending the JSON response
                Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
                String folderDetailsJson = gson.toJson(documentDetailsDTO);
                resp.setStatus(HttpServletResponse.SC_OK);
                resp.setContentType("application/json");
                resp.setCharacterEncoding("UTF-8");
                resp.getWriter().write(folderDetailsJson);
            } catch (FailedInputParsingException e) {
                ErrorDTO errorDTO = new ErrorDTO("The document ID provided is not a valid integer. " +
                        "Are you trying to hijack the request?");
                sendErrorDTO(resp, errorDTO, HttpServletResponse.SC_BAD_REQUEST);
            } catch (SQLException e) {
                ErrorDTO errorDTO = new ErrorDTO("Unable to retrieve the document due to " +
                        "a critical error in the database.");
                sendErrorDTO(resp, errorDTO, HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }
        } else {
            ErrorDTO errorDTO = new ErrorDTO("Malformed request. Check the API endpoint. " +
                    "Are you trying to hijack the request?");
            sendErrorDTO(resp, errorDTO, HttpServletResponse.SC_BAD_REQUEST);
        }
    }

    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        // Get the request URI (the part of the URL after the domain name)
        String requestURI = req.getRequestURI();
        // Get the context path (the part of the URL that represents the app)
        String contextPath = req.getContextPath();
        // Remove everything before the "/api/documents/" part of the URL
        String path = requestURI.substring(contextPath.length() + "/api/documents/".length());
        // Split the path into its parts
        String[] pathParts = path.split("/");

        // Ensure the URL matches the pattern /api/documents/{documentID}
        if (pathParts.length == 1) {
            try {
                // Get the documentID from the pathInfo and store it in a variable
                int documentID = Validators.parseInt(pathParts[0]); // Remove the leading "/"
                // Get the ownerID from the session and store it in a variable
                int ownerID = ((User) req.getSession().getAttribute("user")).getUserID();
                // Ensure that the document I want to delete actually exists and is owned by the user
                DocumentDAO documentDAO = new DocumentDAO(servletConnection);
                Document document = documentDAO.getDocumentByID(documentID, ownerID);
                if (document == null) {
                    ErrorDTO errorDTO = new ErrorDTO("The document you are asking to delete does not exist or " +
                            "is not owned by the logged user. Are you trying to hijack the request?");
                    sendErrorDTO(resp, errorDTO, HttpServletResponse.SC_NOT_FOUND);
                    return;
                }
                // The document actually exists and is owned by the user, so I can proceed
                documentDAO.deleteDocument(documentID, ownerID);
                // If everything went well, we reply with a success message
                resp.setStatus(HttpServletResponse.SC_OK);
            } catch (FailedInputParsingException | DocumentDeletionException e) {
                try {
                    ErrorDTO errorDTO = new ErrorDTO(Validators.retrieveErrorMessageFromErrorCode(e.getErrorCode()));
                    sendErrorDTO(resp, errorDTO, HttpServletResponse.SC_BAD_REQUEST);
                } catch (UnknownErrorCodeException ignored) {
                    ErrorDTO errorDTO = new ErrorDTO("Unable to delete the document due to an unknown error.");
                    sendErrorDTO(resp, errorDTO, HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                }
            } catch (SQLException e) {
                ErrorDTO errorDTO = new ErrorDTO("Unable to delete the document content due to " +
                        "a critical error in the database.");
                sendErrorDTO(resp, errorDTO, HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }
        } else {
            ErrorDTO errorDTO = new ErrorDTO("Malformed request. Check the API endpoint. " +
                    "Are you trying to hijack the request?");
            sendErrorDTO(resp, errorDTO, HttpServletResponse.SC_BAD_REQUEST);
        }
    }

    // N.B: I'm using POST instead of PATCH because Postman is having issues with PATCH requests
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        // Get the request URI (the part of the URL after the domain name)
        String requestURI = req.getRequestURI();
        // Get the context path (the part of the URL that represents the app)
        String contextPath = req.getContextPath();
        // Remove everything before the "/api/documents/" part of the URL
        String path = requestURI.substring(contextPath.length() + "/api/documents/".length());
        // Split the path into its parts
        String[] pathParts = path.split("/");

        // Ensure the URL matches the pattern /api/documents/{documentID}/move
        if (pathParts.length == 2 && pathParts[1].equals("move")) {
            try {
                // Get the documentID from the pathInfo and store it in a variable
                int documentID = Validators.parseInt(pathParts[0]); // Remove the leading "/"
                // Get the ownerID from the session and store it in a variable
                int ownerID = ((User) req.getSession().getAttribute("user")).getUserID();
                // Get the new folder ID from the request body
                DocumentMoveDTO documentMoveDTO = new Gson().fromJson(req.getReader(), DocumentMoveDTO.class);
                if (documentMoveDTO == null) {
                    throw new JsonSyntaxException("Malformed request. Are you trying to hijack the request?");
                }
                // Verify that documentID and folderID are valid
                FolderDAO folderDAO = new FolderDAO(servletConnection);
                DocumentDAO documentDAO = new DocumentDAO(servletConnection);
                Folder folder = folderDAO.getFolderByID(documentMoveDTO.getNewFolderID(), ownerID);
                Document document = documentDAO.getDocumentByID(documentID, ownerID);
                if (folder == null || document == null) {
                    ErrorDTO errorDTO = new ErrorDTO("The document or the folder you are asking to move the " +
                            "document to does not exist or is not owned by the logged user. " +
                            "Are you trying to hijack the request?");
                    sendErrorDTO(resp, errorDTO, HttpServletResponse.SC_NOT_FOUND);
                    return;
                }
                // Both the document and the folder are owner by the user and exist, so I can proceed
                documentDAO.moveDocument(documentID, ownerID, documentMoveDTO.getNewFolderID());
                // If everything went well, we reply with a success message
                resp.setStatus(HttpServletResponse.SC_OK);
            } catch (FailedInputParsingException e) {
                ErrorDTO errorDTO = new ErrorDTO("The document ID provided is not a valid integer. " +
                        "Are you trying to hijack the request?");
                sendErrorDTO(resp, errorDTO, HttpServletResponse.SC_BAD_REQUEST);
            } catch (SQLException e) {
                ErrorDTO errorDTO = new ErrorDTO("Unable to move the document due to " +
                        "a critical error in the database.");
                sendErrorDTO(resp, errorDTO, HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            } catch (DocumentMovingException | DuplicateDocumentException e) {
                try {
                    ErrorDTO errorDTO = new ErrorDTO(Validators.retrieveErrorMessageFromErrorCode(e.getErrorCode()));
                    sendErrorDTO(resp, errorDTO, HttpServletResponse.SC_BAD_REQUEST);
                } catch (UnknownErrorCodeException ignored) {
                    ErrorDTO errorDTO = new ErrorDTO("Unable to move the document due to an unknown error.");
                    sendErrorDTO(resp, errorDTO, HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                }
            } catch (JsonIOException | JsonSyntaxException e) {
                ErrorDTO errorDTO = new ErrorDTO("Malformed request. Are you trying to hijack the request?");
                sendErrorDTO(resp, errorDTO, HttpServletResponse.SC_BAD_REQUEST);
            }
        } else {
            ErrorDTO errorDTO = new ErrorDTO("Malformed request. Check the API endpoint. " +
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