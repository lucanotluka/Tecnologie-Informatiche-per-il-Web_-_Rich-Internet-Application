package it.polimi.tiw.controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.Date;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.WebContext;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ServletContextTemplateResolver;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import it.polimi.tiw.beans.User;
import it.polimi.tiw.dao.GroupDAO;
import it.polimi.tiw.dao.UserDAO;
import it.polimi.tiw.utils.ConnectionHandler;


@WebServlet("/GetAnagraficaData")
public class GetAnagraficaData extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = null;
	private TemplateEngine templateEngine;

    public GetAnagraficaData() {
        super();
    }


    @Override
	public void init() throws ServletException {
			connection = ConnectionHandler.getConnection(getServletContext());
	}


	@Override
	@SuppressWarnings("unchecked")
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		// ---------------------- SESSION CHECK ------------------------
    	// If the user is not logged in (not present in session) redirect to the login
    	String loginpath = getServletContext().getContextPath() + "/LandingPage.html";
    	HttpSession session = request.getSession();
    	if (session.isNew() || session.getAttribute("user") == null) {
    		response.setStatus(403);
    		response.setHeader("Location", loginpath);
    		return;
    	}
    	// End of Session persistency check


  	
    	
		// get and check params
		String creator = null;
		try {
			creator = request.getParameter("creator");
		} catch (NumberFormatException | NullPointerException e) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("Incorrect param values");
			return;
		}



		// List of All Users for Anagrafica page: will be used by Thymeleaf!
		UserDAO userDAO = new UserDAO(connection);
		List<User> users = null;
		try {
			users = userDAO.findAllUsersExcept(creator);
		} catch (SQLException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Not possible to recover Users");
			return;
		}



    	// Convert into JSON Data and send!
    	Gson gson = new GsonBuilder().setDateFormat("yyyy MMM dd").create();
		String json = gson.toJson(users);
    	

    	response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(json);
		
    	return;
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
