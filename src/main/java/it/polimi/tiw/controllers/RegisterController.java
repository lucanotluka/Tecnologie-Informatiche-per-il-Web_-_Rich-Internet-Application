package it.polimi.tiw.controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringEscapeUtils;
import it.polimi.tiw.beans.User;
import it.polimi.tiw.dao.UserDAO;
import it.polimi.tiw.utils.ConnectionHandler;

@WebServlet("/RegisterController")
@MultipartConfig
public class RegisterController extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = null;


    public RegisterController() {
        super();
    }


	@Override
	public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		String username = null;
        String email = null;
    	String name = null;
    	String surname = null;
        String password = null;
        String confirmPassword = null;

		try {
	         name = request.getParameter("name");
	         surname = request.getParameter("surname");
	         username = request.getParameter("username");
	         email = request.getParameter("email");
	         password = request.getParameter("password");
	         confirmPassword = request.getParameter("confirmPassword");

	        System.out.println("name: " + name);
	        System.out.println("surname: " + surname);
	        System.out.println("username: " + username);
	        System.out.println("email: " + email);
	        System.out.println("password: " + password);
	        System.out.println("confirmPassword: " + confirmPassword);
        
        
			if (username == null || name == null || surname == null || email == null || password == null || confirmPassword == null
					|| username.isEmpty() || name.isEmpty() || surname.isEmpty() || email.isEmpty() || password.isEmpty() || confirmPassword.isEmpty()) {
				throw new Exception("Missing or empty credential value A1");
			} else if(!password.equals(confirmPassword)){
				throw new Exception("Non-matching passwords A2");
			}
		} catch (Exception e) {
			// for debugging only e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println( "Missing or incorrect credential value A");
			return;
		}
		
		


		// query the DB for checking that username and email are Unique
        UserDAO userDao = new UserDAO(connection);
        boolean isUnique;
        try {
        	isUnique = userDao.usernameEmailUnique(username, email);
        	if(!isUnique)
        		throw new Exception("Non-unique username or password");
        } catch (SQLException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Not Possible to check unicity of username and email B");
			return;
		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("Non-unique username or password C");
			return;
		}

        // insert into the DB the new User!
        User user = null;
        boolean success;
        try {
    		user = new User(username, name, surname, email, password);
   			success = userDao.registerSuccess(user);

    		if(success) {
    			// REGISTRATION SUCCESS message
    			response.setStatus(HttpServletResponse.SC_OK);
    			response.setContentType("application/json");
    			response.setCharacterEncoding("UTF-8");
    			response.getWriter().println("Registration correctly done!");
    		}
    		else { // if not successful, throws sql exception
    			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
    			response.getWriter().println("Not Possible to register User D");
    			return;
    		}

   		} catch (SQLException e) {
   			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
   			response.getWriter().println("Not Possible to register User");
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
