package it.polimi.tiw.frontend.controllers.authentication;

import com.google.gson.Gson;
import com.google.gson.JsonIOException;
import com.google.gson.JsonSyntaxException;
import it.polimi.tiw.backend.beans.User;
import it.polimi.tiw.backend.beans.exceptions.InvalidArgumentException;
import it.polimi.tiw.backend.dao.UserDAO;
import it.polimi.tiw.backend.dao.exceptions.LoginException;
import it.polimi.tiw.backend.utilities.DatabaseConnectionBuilder;
import it.polimi.tiw.backend.utilities.Validators;
import it.polimi.tiw.backend.utilities.exceptions.UnknownErrorCodeException;
import it.polimi.tiw.frontend.messages.inbound.authentication.UserAuthenticationDTO;
import it.polimi.tiw.frontend.messages.outbound.generic.ErrorDTO;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

/**
 * This servlet is used to handle the authentication of a user.
 */
@WebServlet(name = "UserAuthenticationServlet", value = "/api/login")
public class UserAuthenticationServlet extends HttpServlet {
    private Connection servletConnection;

    /**
     * Default constructor, called by the servlet container.
     */
    public UserAuthenticationServlet() {
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
        doPost(req, resp);
    }

    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            // First, parse the JSON object from the request
            Gson gson = new Gson();
            UserAuthenticationDTO userAuthenticationDTO = gson.fromJson(req.getReader(), UserAuthenticationDTO.class);
            if (userAuthenticationDTO == null) {
                throw new JsonSyntaxException("Malformed request. Are you trying to hijack the request?");
            }

            // Then, we use the credentials to create a new User object
            User user = new User(userAuthenticationDTO.getUsername(), userAuthenticationDTO.getPassword());

            // Now, we check if the user is registered in the database
            UserDAO userDAO = new UserDAO(servletConnection);
            User authenticatedUser = userDAO.authenticateUser(user);

            // If the user is registered, we put the user object in the session
            req.getSession().setAttribute("user", authenticatedUser);

            // Reply with a 200 OK status
            resp.setStatus(HttpServletResponse.SC_OK);
        } catch (InvalidArgumentException | LoginException e) {
            try {
                ErrorDTO errorDTO = new ErrorDTO(Validators.retrieveErrorMessageFromErrorCode(e.getErrorCode()));
                sendErrorDTO(resp, errorDTO, HttpServletResponse.SC_BAD_REQUEST);
            } catch (UnknownErrorCodeException ignored) {
                ErrorDTO errorDTO = new ErrorDTO("Unable to register user due to an unknown error.");
                sendErrorDTO(resp, errorDTO, HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }
        } catch (SQLException e) {
            ErrorDTO errorDTO = new ErrorDTO("Unable to register user due to a critical error in the database.");
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