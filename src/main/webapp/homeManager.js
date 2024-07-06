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
								  document.getElementById("invitedUsersBody"),
								  document.getElementById("bin")
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
	          // dependency via module parameter										
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
	  		
	  function GroupDetails(_alert, _groupDetails, _groupDetailsBody, _invitedUsersBody, _bin) {
	    this.alert = _alert;
	    this.groupDetails = _groupDetails;
	    this.groupDetailsBody = _groupDetailsBody;
	    this.invitedUsersBody = _invitedUsersBody;
	    this.bin = _bin;
	    this.minParts = null;
	    this.parts = null;
	    this.groupID = null;
	    

		
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
	              
	              self.groupID = details.group.groupID;
	              self.minParts = details.group.minParts;
	              self.parts = (details.users.length + 1);	// counting invited users and creator
	              
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
	    }

	    
	    this.update = function(group, users) {
					
		  var row, titlecell, creatorcell, datecell, duracell, mincell, maxcell, usercell, draggable;
		  
		  if(sessionStorage.getItem("username") == group.creator){
			  draggable = true;
		  } else {
			  draggable = false;
		  }
	      
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
		        usercell.textContent = user.surname + " " + user.name;
		        usercell.className = 'list-item';
		        
		        if(draggable == true){	// Then I make the things draggable
	                usercell.draggable = true;
	                usercell.id = user.username;        
	                
	                // Store the ID of the item being dragged
	                usercell.addEventListener('dragstart', handleDragStart);
	                
	                // Remove the dragging class once dragging ends
                	usercell.addEventListener('dragend', handleDragEnd);
				}
				else {
					usercell.classList.add('non-draggable');
				}
		        
		        row.appendChild(usercell);
		        self.invitedUsersBody.appendChild(row);
	        });
	        
	        
	        // Then I gotta initialize the eventListeners and set the Bin to visible.
	        if(draggable == true){
	        	self.bin.style.display = 'block';
	        	
	        	// Allow the trash bin to accept the drop
	        	self.bin.addEventListener('dragover', handleDragOver);
	        	
	        	// Highlight the trash bin when an item is dragged over it
	            //self.bin.addEventListener('dragenter', handleDragEnter);
	            
	            // Remove the highlight when the item leaves the trash bin area
	            //self.bin.addEventListener('dragleave', handleDragLeave);
	            
	            // Handle the drop event
	            self.bin.addEventListener('drop', function(e) { handleDrop(e, self); });
	        }
	        else{
				self.bin.style.display = 'none';				
			}
	        
			      
	      
	      	// 	--------------------- END INVITED USERS  --------------------------
	      
	      self.groupDetails.style.visibility = "visible";
	    }
	    
	   
	    // Sets the data transfer and adds a dragging class.
        function handleDragStart(e) {
            e.dataTransfer.setData('text', e.target.id);
            
            console.log('Dragging ' + e.target.id);
            
            setTimeout(() => {
                e.target.classList.add('dragging');
            }, 0);
        }

        // Removes the dragging class.
        function handleDragEnd(e) {
            e.target.classList.remove('dragging');
        }

		// Prevents the default action to allow drop.
        function handleDragOver(e) {
            e.preventDefault();
            console.log('Dragging over ');           
        }

		// Adds a visual cue when the item enters the trash bin.
        function handleDragEnter(e) {
            e.preventDefault();
            e.target.classList.add('over');
        }

		// Removes the visual cue when the item leaves the trash bin.
        function handleDragLeave(e) {
            e.target.classList.remove('over');
        }
        
       

		// Handles the drop by removing the item from the list and displaying a message.
        function handleDrop (e, instance) {
            e.preventDefault();
            e.stopPropagation();

            
            try {
	            // Get the username and its element
	            var username = e.dataTransfer.getData('text');
	            console.log('Dropping ' + username);            
	            
	            var draggableElement = document.getElementById(username);
	            
	            // TO FIX THIS
	            var self = instance;										
				
				// Cannot perform action!
				if(self.parts - 1 < self.minParts){
					instance.alert.textContent = 'Cannot remove ' + username + '! Minimum number of participants reached.';
				} else {
					instance.alert.textContent = 'AJAX CALL';
					
		            e.target.classList.remove('over');
		            draggableElement.parentNode.removeChild(draggableElement);
					
				}
			} catch (err) {
            	console.error('Drop handling failed:', err);
        	}
        };
    
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
