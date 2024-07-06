/**
 * 	Main manager of the application: Home Manager
 */
{
		// dichiarazione componenti della pagina HOME.html
	 let groupDetails, groupsLists, wizard,
	    pageOrchestrator = new PageOrchestrator(); // main controller


	  window.addEventListener("load", () => {
	    if (sessionStorage.getItem("username") == null) {
	      window.location.href = "LandingPage.html";
	    } else {
	      pageOrchestrator.start(); // initialize the components
	      pageOrchestrator.refresh();
	    } // display initial content
	  }, false);

	
		function PageOrchestrator() {
	    	    
	   
	   //			 FUNCTIONS OF THE HOMEPAGE Home Manager
	    
	   
	    // 			1. Start(): show the things from the startup			TODO
	    this.start = function() {
			
			
			// Define the Logout event of click the link logout. 
		  document.querySelector("a[href='Logout']").addEventListener('click', () => {
	        window.sessionStorage.removeItem('username');
	      })
			
			// Construct and show() the Welcome message
	      personalMessage = new PersonalMessage(sessionStorage.getItem('username'), 
	      									document.getElementById("id_username"));
	      personalMessage.show();



			// Construct the components: myGroupsList, othersGroupsList		
	      groupsLists = new GroupsLists(document.getElementById("id_alert"),
			  					  document.getElementById("myTable"), 
								  document.getElementById("myTableBody"), 
								  document.getElementById("othersTable"), 
								  document.getElementById("othersTableBody")
							  	);


			// Construct the Details component								
	      groupDetails = new GroupDetails(document.getElementById("id_alert"),
			  					  document.getElementById("groupDetails"), 
								  document.getElementById("groupDetailsBody"),
								  document.getElementById("invitedUsersBody")
								);
	      
	      
	      	// Construct the Wizard component								TODO
	      //wizard = new Wizard(document.getElementById("id_createmissionform"), alertContainer);
	      //wizard.registerEvents(this);  
								  
	    
	    };


		//		 2.	Refresh(): show the things while running				TODO
	    this.refresh = function() {     
	      
	      groupsLists.reset();
	      groupsLists.show();
	      
	      groupDetails.reset();
	      
	      // wizard.reset();
	      	      
	    };
	  }
	  




	  
	  
	  // ----------------- Constructors of view components ---------------------------

	  
	  // 	1. Welcome message
	  // 	2. GroupsLists
	  // 	3. GroupDetails
	  // 	4. Wizard
	  
	  
	  		// --------1. ---------- The Welcome Message -------------------------
	  
	  function PersonalMessage(_username, messagecontainer) {
	    this.username = _username;
	    
	    this.show = function() {
	      messagecontainer.textContent = this.username;
	    }
	  }
	  
	  
	  		// --------2. ------------- The Groups List ---------------------------
	  
	  function GroupsLists(_alert, _myTable, _myTableBody, _othersTable, _othersTableBody){
	    
	    this.alert = _alert;
	    this.myTable = _myTable;
	    this.myTableBody = _myTableBody;	    
	    this.othersTable = _othersTable;
	    this.othersTableBody = _othersTableBody;


	    //   				FUNCTION OF THE COMPONENT LIST!	    
	   
	   this.reset = function() {
	      this.myTable.style.visibility = "hidden";
	      this.othersTable.style.visibility = "hidden";
	    }
	   
	  	this.show = function() {
	      var self = this;
	      makeCall("GET", "GetGroupsData", null,
	        function(req) {
	          if (req.readyState == 4) {
	            var message = req.responseText;
	            
	            // Everything is OK
	            if (req.status == 200) {
					
	              var allGroups = JSON.parse(req.responseText);
	              var myGroups = allGroups.groupList1;
	              var othersGroups = allGroups.groupList2;
	              
	              console.log("ResponseText: ", req.responseText);
	              console.log("Group List 1:", myGroups);
                  console.log("Group List 2:", othersGroups);
	              
	        	              
	              // Now update the actual containers!
	              self.update(myGroups, othersGroups);
	            
	            // NOT LOGGED, REDIRECT. 
	          	} else if (req.status == 403) {
                  window.location.href = req.getResponseHeader("Location");
                  window.sessionStorage.removeItem('username');
                }
                // NOT OK, print error.
                else {
	           		self.alert.textContent = message;
	          	}
	          }
	        }
	      );
	    }
	 
	 	this.update = function(myGroups, othersGroups) {
	      
	      var row, titlecell, datecell, creatorcell, partscell, linkcell, anchor;
	      
	      // empty the tables bodies
	      this.myTableBody.innerHTML = ""; 
	      this.othersTableBody.innerHTML = "";

	      // build updated list
	      var self = this;
	      
	      if(myGroups.length == 0){
			row = document.createElement("tr");
	        cell = document.createElement("td");
	        cell.textContent = "You havent any active group.";
	        row.appendChild(cell);
	        self.myTableBody.appendChild(row);
	        
		  }
		  
		  
		  if(othersGroups.length == 0){
			row = document.createElement("tr");
	        cell = document.createElement("td");
	        cell.textContent = "You havent been invited yet.";
	        row.appendChild(cell);
	        self.othersTableBody.appendChild(row);
	       
		  }
		  
	      
	      myGroups.forEach(function(group) {
	        
	        // Create a new row for the entry
	        row = document.createElement("tr");
	        
	        // Cell for the Title: create, retrieve, append
	        titlecell = document.createElement("td");
	        titlecell.textContent = group.title;
	        row.appendChild(titlecell);
	        
	        // Cell for the startDate
	        datecell = document.createElement("td");
	        datecell.textContent = group.creationDate;
	        row.appendChild(datecell);
	        
	        // Cell for the No. Participants
	        partscell = document.createElement("td");
	        var i = group.participants.length + 1;
	        partscell.textContent = i;
	        row.appendChild(partscell);
	        
	        //  Cell for the link
	       	// Create and collide the anchor
	        linkcell = document.createElement("td");
	        anchor = document.createElement("a");
	        linkcell.appendChild(anchor);
	        
	        linkText = document.createTextNode("Details");
	        anchor.appendChild(linkText);
	        
	        // Make list item clickable
	        anchor.setAttribute('groupID', group.ID); // set a custom HTML attribute
	        anchor.addEventListener("click", (e) => {
	          // dependency via module parameter										TODO
	          groupDetails.show(e.target.getAttribute("groupID")); 
	        }, false);
	        
	        anchor.href = "#";
	        row.appendChild(linkcell);
	        
	        self.myTableBody.appendChild(row);
	      });
	      
	      othersGroups.forEach(function(group) {
	        	        
	        // Create a new row for the entry
	        row = document.createElement("tr");
	        
	        // Cell for the Title: create, retrieve, append
	        titlecell = document.createElement("td");
	        titlecell.textContent = group.title;
	        row.appendChild(titlecell);
	        
	        // Cell for the startDate
	        datecell = document.createElement("td");
	        datecell.textContent = group.creationDate;
	        row.appendChild(datecell);
	        
	        // Cell for the No. Participants
	        creatorcell = document.createElement("td");
	        creatorcell.textContent = group.creator;
	        row.appendChild(creatorcell);
	        
	        //  Cell for the link
	       	// Create and collide the anchor
	        linkcell = document.createElement("td");
	        anchor = document.createElement("a");
	        linkcell.appendChild(anchor);
	        
	        linkText = document.createTextNode("Details");
	        anchor.appendChild(linkText);
	        
	        // Make list item clickable
	        anchor.setAttribute('groupID', group.ID); // set a custom HTML attribute
	        anchor.addEventListener("click", (e) => {
	          // dependency via module parameter										TODO
	          groupDetails.show(e.target.getAttribute("groupID")); 
	        }, false);
	        
	        anchor.href = "#";
	        row.appendChild(linkcell);
	        
	        self.othersTableBody.appendChild(row);
	      });
	      
	      
	      // Make both tables visibile
	      this.myTable.style.visibility = "visible";
	      this.othersTable.style.visibility = "visible";
	    
	    }
	    
	  }
	  
	  
	  		// --------3.  --------- ---- The Group Details ---- ------------------- TODO
	  		
	  function GroupDetails(_alert, _groupDetails, _groupDetailsBody, _invitedUsersBody) {
	    this.alert = _alert;
	    this.groupDetails = _groupDetails;
	    this.groupDetailsBody = _groupDetailsBody;
	    this.invitedUsersBody = _invitedUsersBody;

		
		this.reset = function() {
	      this.groupDetails.style.visibility = "hidden";
	    }


	    this.show = function(groupID) {
	      var self = this;
	      
	      makeCall("GET", "GetGroupDetailsData?groupid=" + groupID, null,
	        function(req) {
	          if (req.readyState == 4) {
	            var message = req.responseText;
	            
	            if (req.status == 200) {
	              
	              var details = JSON.parse(req.responseText);
	              
	              console.log("ResponseText: ", req.responseText);
	              console.log("Group: ", details.group);
	              console.log("Participants: ", details.users);
	              
	              self.update(details.group, details.users); 
	             	             
	            } else if (req.status == 403) {
                  window.location.href = req.getResponseHeader("Location");
                  window.sessionStorage.removeItem('username');
                  }
                  else {
	              self.alert.textContent = message;

	            }
	          }
	        }
	      );
	    };

	    
			
	    this.update = function(group, users) {
			
			/*  private int details.group.ID;
				private String details.group.title;
				private Date details.group.creationDate;
				private int details.group.howManyDays;
				private int details.group.minParts;
				private int details.group.maxParts;
				private String details.group.creator;
				private List<User> details.users;
				Invited Users: users[0] is creator
				
				*/
				
		  var row, titlecell, creatorcell, datecell, duracell, mincell, maxcell, usercell;
	      
	      // empty the tables bodies
	      this.groupDetailsBody.innerHTML = "";
	      this.invitedUsersBody.innerHTML = "";

	      // build updated list
	      var self = this;
	      
	      // 	---------------------  DETAILS TABLE  --------------------------
	      
	      // Create a new row for TITLE
	        row = document.createElement("tr");
	        titlecell = document.createElement("td");
	        titlecell.textContent = "Title";
	        row.appendChild(titlecell);
	        titlecell = document.createElement("td");
	        titlecell.textContent = group.title;
	        row.appendChild(titlecell);
	        self.groupDetailsBody.appendChild(row);
	        
	       // Create a new row for CREATOR
	        row = document.createElement("tr");
	        creatorcell = document.createElement("td");
	        creatorcell.textContent = "Creator";
	        row.appendChild(creatorcell);
	        creatorcell = document.createElement("td");
	        creatorcell.textContent = group.creator;
	        row.appendChild(creatorcell);
	        self.groupDetailsBody.appendChild(row);
	       
	       // Create a new row for DATE
	        row = document.createElement("tr");
	        datecell = document.createElement("td");
	        datecell.textContent = "Start Date";
	        row.appendChild(datecell);
	        datecell = document.createElement("td");
	        datecell.textContent = group.creationDate;
	        row.appendChild(datecell);
	        self.groupDetailsBody.appendChild(row);
	        
	        
	        // Create a new row for DURATION
	        row = document.createElement("tr");
	        duracell = document.createElement("td");
	        duracell.textContent = "Duration";
	        row.appendChild(duracell);
	        duracell = document.createElement("td");
	        duracell.textContent = group.howManyDays;
	        row.appendChild(duracell);
	        self.groupDetailsBody.appendChild(row);
	        
	        // Create a new row for MIN
	        row = document.createElement("tr");
	        mincell = document.createElement("td");
	        mincell.textContent = "Minimum";
	        row.appendChild(mincell);
	        mincell = document.createElement("td");
	        mincell.textContent = group.minParts;
	        row.appendChild(mincell);
	        self.groupDetailsBody.appendChild(row);
	        
	        // Create a new row for MAX
	        row = document.createElement("tr");
	        maxcell = document.createElement("td");
	        maxcell.textContent = "Maximum";
	        row.appendChild(maxcell);
	        maxcell = document.createElement("td");
	        maxcell.textContent = group.maxParts;
	        row.appendChild(maxcell);
	        self.groupDetailsBody.appendChild(row);
	        
	        // 	---------------------  END DETAILS TABLE  -------------------------- 
	       
	       
	        // 	---------------------  INVITED USERS  --------------------------
				
	   
			      // Here, gotta be handled the DragNDrop shaite.
			      // IF CREATOR, THEN:
			      // else do nothing
			      
			users.forEach(function(user) {
				row = document.createElement("tr");
		        usercell = document.createElement("td");
		        usercell.textContent = " - " + user.surname + " " + user.name;
		        row.appendChild(usercell);
		        self.invitedUsersBody.appendChild(row);
	        });
	        
			      
	      
	      	// 	--------------------- END INVITED USERS  --------------------------
	      
	      this.groupDetails.style.visibility = "visible";
	    }
	    
	  }
	  
	  
	  	// ------------4. ------------- The Wizzzzard ------------------------------ TODO
	  
	  function Wizard(wizardId, alert) {
	    // minimum date the user can choose, in this case now and in the future
	    var now = new Date(),
	      formattedDate = now.toISOString().substring(0, 10);
	    this.wizard = wizardId;
	    this.alert = alert;

	    this.wizard.querySelector('input[type="date"]').setAttribute("min", formattedDate);

	    this.registerEvents = function(orchestrator) {
	      // Manage previous and next buttons
	      Array.from(this.wizard.querySelectorAll("input[type='button'].next,  input[type='button'].prev")).forEach(b => {
	        b.addEventListener("click", (e) => { // arrow function preserve the
	          // visibility of this
	          var eventfieldset = e.target.closest("fieldset"),
	            valid = true;
	          if (e.target.className == "next") {
	            for (i = 0; i < eventfieldset.elements.length; i++) {
	              if (!eventfieldset.elements[i].checkValidity()) {
	                eventfieldset.elements[i].reportValidity();
	                valid = false;
	                break;
	              }
	            }
	          }
	          if (valid) {
	            this.changeStep(e.target.parentNode, (e.target.className === "next") ? e.target.parentNode.nextElementSibling : e.target.parentNode.previousElementSibling);
	          }
	        }, false);
	      });

	      // Manage submit button
	      this.wizard.querySelector("input[type='button'].submit").addEventListener('click', (e) => {
	        var eventfieldset = e.target.closest("fieldset"),
	          valid = true;
	        for (i = 0; i < eventfieldset.elements.length; i++) {
	          if (!eventfieldset.elements[i].checkValidity()) {
	            eventfieldset.elements[i].reportValidity();
	            valid = false;
	            break;
	          }
	        }

	        if (valid) {
	          var self = this;
	          makeCall("POST", 'CreateMission', e.target.closest("form"),
	            function(req) {
	              if (req.readyState == XMLHttpRequest.DONE) {
	                var message = req.responseText; // error message or mission id
	                if (req.status == 200) {
	                  orchestrator.refresh(message); // id of the new mission passed
	                } else if (req.status == 403) {
                      window.location.href = req.getResponseHeader("Location");
                      window.sessionStorage.removeItem('username');
                  }
                  else {
	                  self.alert.textContent = message;
	                  self.reset();
	                }
	              }
	            }
	          );
	        }
	      });
	      // Manage cancel button
	      this.wizard.querySelector("input[type='button'].cancel").addEventListener('click', (e) => {
	        e.target.closest('form').reset();
	        this.reset();
	      });
	    };

	    this.reset = function() {
	      var fieldsets = document.querySelectorAll("#" + this.wizard.id + " fieldset");
	      fieldsets[0].hidden = false;
	      fieldsets[1].hidden = true;
	      fieldsets[2].hidden = true;

	    }

	    this.changeStep = function(origin, destination) {
	      origin.hidden = true;
	      destination.hidden = false;
	    }
	  }
	  
};
