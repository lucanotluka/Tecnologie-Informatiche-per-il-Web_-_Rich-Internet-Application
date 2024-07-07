package it.polimi.tiw.controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
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

import it.polimi.tiw.beans.Group;
import it.polimi.tiw.beans.User;
import it.polimi.tiw.controllers.GetGroupsData.ListsContainer;
import it.polimi.tiw.dao.GroupDAO;
import it.polimi.tiw.dao.UserDAO;
import it.polimi.tiw.utils.ConnectionHandler;

@WebServlet("/GetGroupDetailsData")
public class GetGroupDetailsData extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = null;


    public GetGroupDetailsData() {
        super();
    }

	@Override
	public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}


	@Override
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
    	User user = (User) session.getAttribute("user");
    	// End of Session persistency check


		// get and check params
		Integer groupID = null;
		try {
			groupID = Integer.parseInt(request.getParameter("groupid"));
		} catch (NumberFormatException | NullPointerException e) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("Incorrect param values");
			return;
		}

		// Retrieve all the infos given GroupID
		GroupDAO groupDAO = new GroupDAO(connection);
		Group myGroup = null;
		List<User> invitedUsers = new ArrayList<>();

		try {
			myGroup = groupDAO.getGroupByID(groupID);
			
			if(myGroup == null) {
				response.setStatus(HttpServletResponse.SC_NOT_FOUND);
				response.getWriter().println("Resource not found");
				return;
			}
		} catch (SQLException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Not possible to recover Group");
			return;
		} 
		
		
		if(myGroup.getParticipants().size() > 0) {
			try {
				UserDAO userDAO = new UserDAO(connection);
				User user1 = null;

				for(String username : myGroup.getParticipants()) {
					user1 = userDAO.getUserByUsername(username);
					invitedUsers.add(user1);
				}


			}catch (SQLException e) {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				response.getWriter().println("Not possible to recover Group");
				return;
			}
		}


    	// Create a container for both lists
        Container container = new Container(myGroup, invitedUsers);
    	
    	// Convert into JSON Data and send!
    	Gson gson = new GsonBuilder().setDateFormat("yyyy MMM dd").create();
		String json = gson.toJson(container);
    	

    	response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(json);
    	return;
		
	}
	
	
    class Container {
        private Group group;
        private List<User> users;

        public Container(Group group, List<User> users) {
            this.group = group;
            this.users = users;
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
