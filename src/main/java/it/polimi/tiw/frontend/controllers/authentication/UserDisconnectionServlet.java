package it.polimi.tiw.frontend.controllers.authentication;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * This servlet is used to handle the disconnection of a user.
 */
@WebServlet(name = "UserDisconnectionServlet", value = "/api/auth/logout")
public class UserDisconnectionServlet extends HttpServlet {
    /**
     * Default constructor, called by the servlet container.
     */
    public UserDisconnectionServlet() {
        super();
    }

    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) {
        // Invalidate the session
        req.getSession().invalidate();
        // Reply with a 200 OK status
        resp.setStatus(HttpServletResponse.SC_OK);
    }
}