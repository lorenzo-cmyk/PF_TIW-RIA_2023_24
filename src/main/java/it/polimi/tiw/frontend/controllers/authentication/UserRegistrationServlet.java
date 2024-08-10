package it.polimi.tiw.frontend.controllers.authentication;

import com.google.gson.Gson;
import com.google.gson.JsonIOException;
import com.google.gson.JsonSyntaxException;
import it.polimi.tiw.backend.beans.User;
import it.polimi.tiw.backend.beans.exceptions.InvalidArgumentException;
import it.polimi.tiw.backend.dao.UserDAO;
import it.polimi.tiw.backend.dao.exceptions.RegistrationException;
import it.polimi.tiw.backend.utilities.DatabaseConnectionBuilder;
import it.polimi.tiw.backend.utilities.Validators;
import it.polimi.tiw.backend.utilities.exceptions.PasswordMismatchException;
import it.polimi.tiw.backend.utilities.exceptions.UnknownErrorCodeException;
import it.polimi.tiw.frontend.messages.inbound.authentication.UserRegistrationDTO;
import it.polimi.tiw.frontend.messages.outbound.generic.ErrorDTO;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

/**
 * This servlet is used to handle the registration of a new user.
 */
@WebServlet(name = "UserRegistrationServlet", value = "/api/register")
public class UserRegistrationServlet extends HttpServlet {
    private Connection servletConnection;

    /**
     * Default constructor, called by the servlet container.
     */
    public UserRegistrationServlet() {
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
            // First, leveraging the GSON library, we deserialize the JSON data into a UserRegistrationDTO object
            Gson gson = new Gson();
            UserRegistrationDTO userRegistrationDTO = gson.fromJson(req.getReader(), UserRegistrationDTO.class);
            // It should be the default behavior, thanks GSON :(
            if (userRegistrationDTO == null) {
                throw new JsonSyntaxException("Malformed request. Are you trying to hijack the request?");
            }

            // Then, we validate the password and the password confirmation
            // (PasswordMismatchException is thrown if they do not match)
            Validators.validatePassword(userRegistrationDTO.getPassword(),
                    userRegistrationDTO.getPasswordConfirmation());

            // Now, we can try to create a User object
            // (InvalidArgumentException is thrown if the arguments are not valid)
            User newUser = new User(userRegistrationDTO.getUsername(), userRegistrationDTO.getPassword(),
                    userRegistrationDTO.getEmail());

            // Then, we can try to register the user into the database
            // (RegistrationException is thrown if the registration fails)
            // (SQLException is thrown if an error occurs communicating with the database)
            UserDAO userDAO = new UserDAO(servletConnection);
            userDAO.registerUser(newUser);

            // If everything went well, we reply with a success message
            resp.setStatus(HttpServletResponse.SC_OK);
        } catch (PasswordMismatchException | InvalidArgumentException | RegistrationException e) {
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
