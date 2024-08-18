package it.polimi.tiw.frontend.controllers.authentication;

import it.polimi.tiw.backend.beans.User;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class CheckAuthenticationServlet
 * This servlet checks if a user is authenticated by verifying the presence of a user attribute in the session.
 */
@WebServlet(name = "CheckAuthenticationServlet", value = "/api/auth/check")
public class CheckAuthenticationServlet extends HttpServlet {

    /**
     * Default constructor.
     */
    public CheckAuthenticationServlet() {
        super();
    }

    protected void doGet(HttpServletRequest req, HttpServletResponse resp) {
        User user = (User) req.getSession().getAttribute("user");
        if (user == null) {
            // Redundant since this case would be handled by the FilterBadRequests.
            // Keeping it here for clarity.
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        } else {
            resp.setStatus(HttpServletResponse.SC_OK);
        }
    }
}