package it.polimi.tiw.controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringEscapeUtils;

import javax.servlet.annotation.MultipartConfig;


import it.polimi.tiw.beans.User;
import it.polimi.tiw.dao.*;
import it.polimi.tiw.utils.ConnectionHandler;

@WebServlet("/LoginController")
@MultipartConfig
public class LoginController extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = null;

    public LoginController() {
        super();
    }

	public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());

	}
    
    
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String username = null;
		String password = null;

		System.out.println("Arrived in LoginController");	
		
		try {
			username = StringEscapeUtils.escapeJava(request.getParameter("username"));
			password = StringEscapeUtils.escapeJava(request.getParameter("password"));
			
			if (username == null || password == null || username.isEmpty() || password.isEmpty()) {
				throw new Exception("Missing or empty credential value");
			}
		} catch (Exception e) {
			// for debugging only e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("[LoginController]: Missing credential value");
			return;
		}
        
        
		
        // query the DB for login
        UserDAO userDao = new UserDAO(connection);
        User user = null;
        
		try {
			user = userDao.checkCredentials(username, password);
		} catch (SQLException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("[LoginController]: Not Possible to check credentials");
			return;
		}

		if (user == null) {
			
			// Error messages
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.getWriter().println("[LoginController]: User credentials incorrect");
			return;
		}
		
		// ELSE: EVERYTHING OK!
		request.getSession().setAttribute("username", username);
		response.getWriter().println(username);
		response.setStatus(HttpServletResponse.SC_OK);
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		
	}
	
	
	public void destroy() {
		try {
			ConnectionHandler.closeConnection(connection);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

}
