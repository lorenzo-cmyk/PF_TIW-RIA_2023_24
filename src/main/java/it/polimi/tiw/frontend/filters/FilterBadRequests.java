package it.polimi.tiw.frontend.filters;

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
     * @throws IOException      if an I/O error occurs
     * @throws ServletException if a servlet-specific error occurs
     */
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
            throws IOException, ServletException {
        // Force the servlet container to treat the request and response as HTTP
        HttpServletResponse httpResponse = (HttpServletResponse) servletResponse;
        HttpServletRequest httpRequest = (HttpServletRequest) servletRequest;

        // Retrieve the requested URL and the HTTP method from the request
        String requestedURL = httpRequest.getRequestURI().substring(httpRequest.getContextPath().length());
        String HTTPMethod = httpRequest.getMethod();

        // If the client tries to access static resources, let the request pass through the filter chain.
        if (requestedURL.startsWith("/assets") || requestedURL.startsWith("/webjars")) {
            filterChain.doFilter(servletRequest, servletResponse);
            return;
        }

        // If the client tries to access an API endpoint, let the request pass through the filter chain.
        if (requestedURL.startsWith("/api")) {
            filterChain.doFilter(servletRequest, servletResponse);
            return;
        }

        // If the client tries to access the login page, check the authentication status.
        if (requestedURL.equals("/authentication.html")) {
            if (isUserAuthenticated(httpRequest)) {
                httpResponse.sendRedirect(httpRequest.getContextPath() + "/index.html");
            } else {
                filterChain.doFilter(servletRequest, servletResponse);
            }
            return;
        }

        // If the client tries to access the index page, check the authentication status.
        if (requestedURL.equals("/index.html")) {
            if (isUserAuthenticated(httpRequest)) {
                filterChain.doFilter(servletRequest, servletResponse);
            } else {
                httpResponse.sendRedirect(httpRequest.getContextPath() + "/authentication.html");
            }
            return;
        }

        // If the client tries to access any other page, redirect to the index page.
        httpResponse.sendRedirect(httpRequest.getContextPath() + "/index.html");
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
