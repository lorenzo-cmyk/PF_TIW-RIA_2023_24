package it.polimi.tiw.frontend.controllers.contentmanagement;

import com.google.gson.Gson;
import com.google.gson.JsonIOException;
import com.google.gson.JsonSyntaxException;
import it.polimi.tiw.backend.beans.Document;
import it.polimi.tiw.backend.beans.User;
import it.polimi.tiw.backend.beans.exceptions.InvalidArgumentException;
import it.polimi.tiw.backend.dao.DocumentDAO;
import it.polimi.tiw.backend.dao.exceptions.DocumentCreationException;
import it.polimi.tiw.backend.dao.exceptions.DuplicateDocumentException;
import it.polimi.tiw.backend.utilities.DatabaseConnectionBuilder;
import it.polimi.tiw.backend.utilities.Validators;
import it.polimi.tiw.backend.utilities.exceptions.UnknownErrorCodeException;
import it.polimi.tiw.frontend.messages.inbound.contentmanagement.DocumentCreationDTO;
import it.polimi.tiw.frontend.messages.outbound.generic.ErrorDTO;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.Connection;
import java.sql.Date;
import java.sql.SQLException;

/**
 * This servlet is used to interact with the documents of the user.
 */
@WebServlet(name = "DocumentsServlet", value = "/api/documents")
public class DocumentsServlet extends HttpServlet {
    private Connection servletConnection;

    /**
     * Default constructor, called by the servlet container.
     */
    public DocumentsServlet() {
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

    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            // First, parse the JSON object from the request
            Gson gson = new Gson();
            DocumentCreationDTO documentCreationDTO = gson.fromJson(req.getReader(), DocumentCreationDTO.class);
            if (documentCreationDTO == null) {
                throw new JsonSyntaxException("Malformed request. Are you trying to hijack the request?");
            }
            // Then, we get the OwnerID from the session
            int ownerID = ((User) req.getSession().getAttribute("user")).getUserID();
            // Create the document object
            Document document = new Document(
                    documentCreationDTO.getDocumentName(),
                    new Date(System.currentTimeMillis()),
                    documentCreationDTO.getType(),
                    documentCreationDTO.getSummary(),
                    ownerID,
                    documentCreationDTO.getFolderID()
            );
            // Create the document in the database
            DocumentDAO documentDAO = new DocumentDAO(servletConnection);
            documentDAO.createDocument(document);
            // If everything went well, we reply with a success message
            resp.setStatus(HttpServletResponse.SC_CREATED);
        } catch (InvalidArgumentException | DocumentCreationException | DuplicateDocumentException e) {
            try {
                ErrorDTO errorDTO = new ErrorDTO(Validators.retrieveErrorMessageFromErrorCode(e.getErrorCode()));
                sendErrorDTO(resp, errorDTO, HttpServletResponse.SC_BAD_REQUEST);
            } catch (UnknownErrorCodeException ignored) {
                ErrorDTO errorDTO = new ErrorDTO("Unable to create the new document due to an unknown error.");
                sendErrorDTO(resp, errorDTO, HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }
        } catch (SQLException e) {
            ErrorDTO errorDTO = new ErrorDTO("Unable to create the new document due " +
                    "to a critical error in the database.");
            sendErrorDTO(resp, errorDTO, HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        } catch (JsonIOException | JsonSyntaxException e) {
            ErrorDTO errorDTO = new ErrorDTO("Malformed request. Are you trying to hijack the request?");
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