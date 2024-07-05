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
	      pageOrchestrator.	refresh();
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
	      personalMessage = new PersonalMessage(sessionStorage.getItem('username'), document.getElementById("id_username"));
	      personalMessage.show();



			// Construct the components: myGroupsList, othersGroupsList		
	      groupsLists = new GroupsLists(document.getElementById("id_alert"),
			  					  document.getElementById("myTable"), 
								  document.getElementById("myTableBody"), 
								  document.getElementById("othersTable"), 
								  document.getElementById("othersTableBody")
							  	);


			// Construct the Detail component								TODO
	      //groupDetails = new GroupDetails();
	      //groupDetails.registerEvents(this); 
	      
	      
	      	// Construct the Wizard component								TODO
	      //wizard = new Wizard(document.getElementById("id_createmissionform"), alertContainer);
	      //wizard.registerEvents(this);  
	    
	    };


		//		 2.	Refresh(): show the things while running				TODO
	    this.refresh = function() {     
	      
	      groupsLists.reset();
	      groupsLists.show();
	      
	      // wizard.reset();
	      
	      // groupDetails.reset();
	      	      
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
	              
	              if (myGroups.length == 0 && othersGroups.length == 0)
	                return;
	              
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
	        partscell.textContent = group.participants.length;
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
	  		
	  function MissionDetails(options) {
	    this.alert = options['alert'];
	    this.detailcontainer = options['detailcontainer'];
	    this.expensecontainer = options['expensecontainer'];
	    this.expenseform = options['expenseform'];
	    this.closeform = options['closeform'];
	    this.date = options['date'];
	    this.destination = options['destination'];
	    this.status = options['status'];
	    this.description = options['description'];
	    this.country = options['country'];
	    this.province = options['province'];
	    this.city = options['city'];
	    this.fund = options['fund'];
	    this.food = options['food'];
	    this.accomodation = options['accomodation'];
	    this.travel = options['transportation'];

	    this.registerEvents = function(orchestrator) {
	      this.expenseform.querySelector("input[type='button']").addEventListener('click', (e) => {
	        var form = e.target.closest("form");
	        if (form.checkValidity()) {
	          var self = this,
	            missionToReport = form.querySelector("input[type = 'hidden']").value;
	          makeCall("POST", 'CreateExpensesReport', form,
	            function(req) {
	              if (req.readyState == 4) {
	                var message = req.responseText;
	                if (req.status == 200) {
	                  orchestrator.refresh(missionToReport);
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
	        } else {
	          form.reportValidity();
	        }
	      });

	      this.closeform.querySelector("input[type='button']").addEventListener('click', (event) => {
	        var self = this,
	          form = event.target.closest("form"),
	          missionToClose = form.querySelector("input[type = 'hidden']").value;
	        makeCall("POST", 'CloseMission', form,
	          function(req) {
	            if (req.readyState == 4) {
	              var message = req.responseText;
	              if (req.status == 200) {
	                orchestrator.refresh(missionToClose);
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
	      });
	    }

	    this.show = function(missionid) {
	      var self = this;
	      makeCall("GET", "GetMissionDetailsData?missionid=" + missionid, null,
	        function(req) {
	          if (req.readyState == 4) {
	            var message = req.responseText;
	            if (req.status == 200) {
	              var mission = JSON.parse(req.responseText);
	              self.update(mission); // self is the object on which the function
	              // is applied
	              self.detailcontainer.style.visibility = "visible";
	              switch (mission.status) {
	                case "OPEN":
	                  self.expensecontainer.style.visibility = "hidden";
	                  self.expenseform.style.visibility = "visible";
	                  self.expenseform.missionid.value = mission.id;
	                  self.closeform.style.visibility = "hidden";
	                  break;
	                case "REPORTED":
	                  self.expensecontainer.style.visibility = "visible";
	                  self.expenseform.style.visibility = "hidden";
	                  self.closeform.missionid.value = mission.id;
	                  self.closeform.style.visibility = "visible";
	                  break;
	                case "CLOSED":
	                  self.expensecontainer.style.visibility = "visible";
	                  self.expenseform.style.visibility = "hidden";
	                  self.closeform.style.visibility = "hidden";
	                  break;
	              }
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

	    this.reset = function() {
	      this.detailcontainer.style.visibility = "hidden";
	      this.expensecontainer.style.visibility = "hidden";
	      this.expenseform.style.visibility = "hidden";
	      this.closeform.style.visibility = "hidden";
	    }

	    this.update = function(m) {
	      this.date.textContent = m.startDate;
	      this.destination.textContent = m.destination;
	      this.status.textContent = m.status;
	      this.description.textContent = m.description;
	      this.country.textContent = m.country;
	      this.province.textContent = m.province;
	      this.city.textContent = m.city;
	      this.fund.textContent = m.fund;
	      this.food.textContent = m.expenses.food;
	      this.accomodation.textContent = m.expenses.accomodation;
	      this.travel.textContent = m.expenses.transportation;
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
