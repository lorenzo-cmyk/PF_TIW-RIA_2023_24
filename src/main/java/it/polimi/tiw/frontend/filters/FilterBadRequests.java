package it.polimi.tiw.frontend.filters;

import com.google.gson.Gson;
import it.polimi.tiw.frontend.messages.outbound.generic.ErrorDTO;
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;

/**
 * FilterBadRequests is a servlet filter that intercepts all incoming HTTP requests
 * and performs validation checks such as endpoint existence and user authentication.
 */
@WebFilter(urlPatterns = {"/*"})
public class FilterBadRequests implements Filter {

    /**
     * Filters incoming requests and performs validation checks.
     *
     * @param servletRequest  the ServletRequest object
     * @param servletResponse the ServletResponse object
     * @param filterChain     the FilterChain object
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException      if an I/O error occurs
     */
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
            throws ServletException, IOException {
        // Force the servlet container to treat the request and response as HTTP
        HttpServletResponse httpResponse = (HttpServletResponse) servletResponse;
        HttpServletRequest httpRequest = (HttpServletRequest) servletRequest;

        // Retrieve the requested URL and the HTTP method from the request
        String requestedURL = httpRequest.getRequestURI().substring(httpRequest.getContextPath().length());
        String HTTPMethod = httpRequest.getMethod();

        // Retrieve the endpoint enumeration corresponding to the requested URL
        EndpointEnumeration retrievedEndpoint = EndpointEnumeration.retrieveEndpoint(requestedURL, HTTPMethod);

        // If the endpoint is not found, return a 404 error
        if (retrievedEndpoint == null) {
            ErrorDTO errorDTO = new ErrorDTO("The requested endpoint does not exist. " +
                    "Please check the URL and try again.");
            sendErrorDTO(httpResponse, errorDTO, HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        // If the endpoint requires authentication and the user is not authenticated, return a 401 error
        if (retrievedEndpoint.needsAuthentication() && !isUserAuthenticated(httpRequest)) {
            ErrorDTO errorDTO = new ErrorDTO("You must be authenticated to access this endpoint. " +
                    "Please log in and try again.");
            sendErrorDTO(httpResponse, errorDTO, HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // If the endpoint does not require authentication and the user is authenticated, return a 403 error
        if (!retrievedEndpoint.needsAuthentication() && isUserAuthenticated(httpRequest)) {
            ErrorDTO errorDTO = new ErrorDTO("You are already authenticated. " +
                    "Please log out and try again.");
            sendErrorDTO(httpResponse, errorDTO, HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        // Continue with the filter chain
        filterChain.doFilter(servletRequest, servletResponse);
    }

    /**
     * Sends an error response in JSON format.
     *
     * @param resp       the HttpServletResponse object
     * @param errorDTO   the ErrorDTO object containing the error message
     * @param httpStatus the HTTP status code to be set in the response
     * @throws IOException if an I/O error occurs
     */
    private void sendErrorDTO(HttpServletResponse resp, ErrorDTO errorDTO, int httpStatus) throws IOException {
        resp.setStatus(httpStatus);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().println(new Gson().toJson(errorDTO));
    }

    /**
     * Checks if the user is authenticated.
     *
     * @param httpServletRequest the HttpServletRequest object
     * @return true if the user is authenticated, false otherwise
     */
    private boolean isUserAuthenticated(HttpServletRequest httpServletRequest) {
        HttpSession httpSession = httpServletRequest.getSession();
        return !httpSession.isNew() && httpSession.getAttribute("user") != null;
    }
}