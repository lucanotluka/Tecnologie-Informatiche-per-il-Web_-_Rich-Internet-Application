package it.polimi.tiw.controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import it.polimi.tiw.beans.Group;
import it.polimi.tiw.dao.GroupDAO;
import it.polimi.tiw.utils.ConnectionHandler;


@WebServlet("/RemoveInvitedUser")
public class RemoveInvitedUser extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = null;
	
    public RemoveInvitedUser() {
        super();
    }
    
    @Override
	public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}


	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    	// ---------------------- SESSION CHECK ------------------------
    	// If the user is not logged in (not present in session) redirect to the login
    	String loginpath = getServletContext().getContextPath() + "/LandingPage.html";
    	HttpSession session = request.getSession();
    	if (session.isNew() || session.getAttribute("user") == null) {
    		response.setStatus(403);
    		response.setHeader("Location", loginpath);
    		return;
    	}
		
    	
		// get and check params
		Integer groupID = null;
		String username = null;
		try {
			groupID = Integer.parseInt(request.getParameter("groupid"));
			username = request.getParameter("username");
			
			System.out.println("Trying to remove "+username +" from group " + groupID);
			
			
			
			if (username == null || groupID == null || username.isEmpty() ) {
				throw new Exception("Missing or empty credential value");
			}
		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("Incorrect param values");
			return;
		}
		
		
		// OPEN DAO AND INTERACT, WITH SUCCESS OR ERROR ANSWER TO CLIENT.
		GroupDAO groupDAO = new GroupDAO(connection);
		boolean success;
		
		try {
			success = groupDAO.removeInvitedUser(groupID, username);
			System.out.println("User removal is "+ success);
			
			
			if(success) {
				System.out.println("Removed "+username +" from group " + groupID);
				response.setStatus(HttpServletResponse.SC_OK);
    			response.getWriter().println(username +" removed correctly!");
				return;
			}
			else {
				response.setStatus(HttpServletResponse.SC_NOT_FOUND);
				response.getWriter().println("Group/User not found in DataBases");
				return;
			}
		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Not possible to remove selected user");
			return;
		}
    	
	}

	
	@Override
	public void destroy() {
		try {
			ConnectionHandler.closeConnection(connection);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
}
