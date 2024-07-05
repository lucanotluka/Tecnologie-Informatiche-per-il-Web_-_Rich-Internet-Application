package it.polimi.tiw.controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.Date;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
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
import it.polimi.tiw.dao.GroupDAO;
import it.polimi.tiw.utils.ConnectionHandler;


@WebServlet("/GetGroupsData")
public class GetGroupsData extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = null;


    public GetGroupsData() {
        super();
    }

	@Override
	public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}

	private Date getMeYesterday() {
		return new Date(System.currentTimeMillis() - 24 * 60 * 60 * 1000);
	}

	private Date getGroupEndDate(Date creation, Integer duration) {
		return new Date(creation.getTime() + duration * 24 * 60 * 60 * 1000);
	}

    @Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

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



    	GroupDAO groupDAO = new GroupDAO(connection);
    	List<Group> myGroups = new ArrayList<>();
    	List<Group> othersGroups = new ArrayList<>();

    	// Retrieve the list of MyGroups from the DB!
    	try {
			myGroups = groupDAO.findMyGroups(user.getUsername());
		} catch (SQLException e) {
			e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Not possible to recover myGroups");
			return;
		}


    	// Retrieve the list of OthersGroups from the DB!
    	try {
			othersGroups = groupDAO.findOthersGroup(user.getUsername());
		} catch (SQLException e) {
			e.printStackTrace();
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Not possible to recover othersGroups");
			return;
		}


    	//    	 Filtering for active groups only
    	Iterator<Group> myGroupsIterator = myGroups.iterator();
    	while (myGroupsIterator.hasNext()) {
    	    Group group = myGroupsIterator.next();
    	    if (getGroupEndDate(group.getCreationDate(), group.getHowManyDays())
    	            .compareTo(getMeYesterday()) <= 0) {
    	        myGroupsIterator.remove();
    	    }
    	}
    	
    	Iterator<Group> othersGroupsIterator = othersGroups.iterator();
    	while (othersGroupsIterator.hasNext()) {
    	    Group group = othersGroupsIterator.next();
    	    if (getGroupEndDate(group.getCreationDate(), group.getHowManyDays())
    	            .compareTo(getMeYesterday()) <= 0) {
    	        othersGroupsIterator.remove();
    	    }
    	}

    	
    	// Create a container for both lists
        ListsContainer listsContainer = new ListsContainer(myGroups, othersGroups);
    	
    	// Convert into JSON Data and send!
    	Gson gson = new GsonBuilder().setDateFormat("yyyy MMM dd").create();
		String json = gson.toJson(listsContainer);
    	
		System.out.println("The listContainer is: "+ listsContainer);
		
    	response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(json);
    	return;
    }


	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

	@Override
	public void destroy() {
		try {
			ConnectionHandler.closeConnection(connection);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	
    class ListsContainer {
        private List<Group> groupList1;
        private List<Group> groupList2;

        public ListsContainer(List<Group> groupList1, List<Group> groupList2) {
            this.groupList1 = groupList1;
            this.groupList2 = groupList2;
        }
    }

}
