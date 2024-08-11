package it.polimi.tiw.frontend.filters;

import java.util.regex.Pattern;

/**
 * Enumeration of API endpoints with their corresponding HTTP methods and authentication requirements.
 */
public enum EndpointEnumeration {
    /**
     * Used to allow the user to login.
     */
    AUTHENTICATION_LOGIN("/api/auth/login", "POST", false),
    /**
     * Used to allow the user to logout.
     */
    AUTHENTICATION_LOGOUT("/api/auth/logout", "DELETE", true),
    /**
     * Used to allow the user to register.
     */
    AUTHENTICATION_REGISTER("/api/auth/register", "POST", false),
    /**
     * Used to get the user's directory structure.
     */
    CONTENTMANAGEMENT_GETFOLDERS("/api/folders", "GET", true),
    /**
     * Used to create a new folder.
     */
    CONTENTMANAGEMENT_CREATEFOLDER("/api/folders", "POST", true),
    /**
     * Used to create a new document.
     */
    CONTENTMANAGEMENT_CREATEDOCUMENT("/api/documents", "POST", true),
    /**
     * Used to get the content of a specific folder.
     */
    CONTENTMANAGEMENT_GETFOLDERCONTENT("/api/folders/\\d+", "GET", true),
    /**
     * Used to delete a specific folder.
     */
    CONTENTMANAGEMENT_DELETEFOLDER("/api/folders/\\d+", "DELETE", true),
    /**
     * Used to get a specific document.
     */
    CONTENTMANAGEMENT_GETDOCUMENT("/api/documents/\\d+", "GET", true),
    /**
     * Used to delete a specific document.
     */
    CONTENTMANAGEMENT_DELETEDOCUMENT("/api/documents/\\d+", "DELETE", true),
    /**
     * Used to move a document to a new location.
     */
    CONTENTMANAGEMENT_MOVEDOCUMENT("/api/documents/\\d+/move", "POST", true);

    private final Pattern URLPattern;
    private final String HTTPMethod;
    private final Boolean needsAuthentication;

    /**
     * Constructs an EndpointEnumeration.
     *
     * @param URLPattern          the URL pattern of the endpoint
     * @param HTTPMethod          the HTTP method of the endpoint
     * @param needsAuthentication whether the endpoint requires authentication
     */
    EndpointEnumeration(String URLPattern, String HTTPMethod, Boolean needsAuthentication) {
        this.URLPattern = Pattern.compile("^" + URLPattern + "$");
        this.HTTPMethod = HTTPMethod;
        this.needsAuthentication = needsAuthentication;
    }

    /**
     * Checks if the endpoint requires authentication.
     *
     * @return true if the endpoint requires authentication, false otherwise
     */
    public Boolean needsAuthentication() {
        return needsAuthentication;
    }

    /**
     * Retrieves the corresponding EndpointEnumeration based on the provided URL and HTTP method.
     *
     * @param URL        the URL of the endpoint
     * @param HTTPMethod the HTTP method of the endpoint
     * @return the matching EndpointEnumeration, or null if no match is found
     */
    public EndpointEnumeration retrieveEndpoint(String URL, String HTTPMethod) {
        for (EndpointEnumeration endpoint : EndpointEnumeration.values()) {
            if (endpoint.URLPattern.matcher(URL).matches() && endpoint.HTTPMethod.equals(HTTPMethod)) {
                return endpoint;
            }
        }
        return null;
    }
}