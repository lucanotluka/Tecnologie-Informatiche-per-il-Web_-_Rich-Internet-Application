package it.polimi.tiw.controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.Date;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringEscapeUtils;

import it.polimi.tiw.beans.User;
import it.polimi.tiw.dao.GroupDAO;
import it.polimi.tiw.utils.ConnectionHandler;


@WebServlet("/CreateGroup")
public class CreateGroup extends HttpServlet {
	private static final long serialVersionUID = 1L;

	private Connection connection = null;

    public CreateGroup() {
        super();
    }

	@Override
	public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());

	}

	private Date getMeYesterday() {
		return new Date(System.currentTimeMillis() - 24 * 60 * 60 * 1000);
	}

	@Override
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
    	User user = (User) session.getAttribute("user");
    	// End of Session persistency check


    	
    	// Get and parse all parameters from request
    	boolean isBadRequest = false;
		String title = null;
		Date startDate = null;
		Integer duration = null;
		Integer minParts = null;
		Integer maxParts = null;
		String creator = user.getUsername();
    	List<String> alreadyInvitedUsers = null;


		try {
			duration = Integer.parseInt(request.getParameter("duration"));
			title = StringEscapeUtils.escapeJava(request.getParameter("title"));
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			java.util.Date utilDate = sdf.parse(request.getParameter("date"));
			startDate = new java.sql.Date(utilDate.getTime());
			minParts = Integer.parseInt(request.getParameter("minParts"));
			maxParts = Integer.parseInt(request.getParameter("maxParts"));
			alreadyInvitedUsers = Arrays.asList(request.getParameterValues("selectedUsernames"));

			System.out.println(title);
			System.out.println(startDate);
			System.out.println(duration);
			System.out.println(creator);
			System.out.println(alreadyInvitedUsers);
			
			isBadRequest = duration == null || minParts == null || maxParts == null
					|| duration <= 0 || maxParts < minParts || minParts <= 0
					|| title == null || title.isEmpty()
					|| getMeYesterday().after(startDate);
		} catch (NumberFormatException | NullPointerException | ParseException e) {
			isBadRequest = true;
			e.printStackTrace();
		}
		if (isBadRequest) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("Incorrect param values");
			return;
		}


		// ACTUALLY CONSTRUCT THE DAOs AND SAVE into DB!
    	GroupDAO groupDAO = new GroupDAO(connection);
    		   // (the groups info are above!)

    	try {
			groupDAO.createGroup(title, startDate, duration, minParts, maxParts, creator, alreadyInvitedUsers);

    	} catch (SQLException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Not possible to register the Group");
			return;
		}
    	

		response.setStatus(HttpServletResponse.SC_OK);
    	response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
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
