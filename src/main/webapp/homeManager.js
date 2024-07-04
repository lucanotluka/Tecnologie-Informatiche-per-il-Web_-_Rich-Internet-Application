/**
 * 	Main manager of the application: Home Manager
 */
{
		// dichiarazione componenti della pagina HOME.html
	 let missionDetails, missionsList, wizard,
	    pageOrchestrator = new PageOrchestrator(); // main controller



		// PRIMISSIMA COSA DA GESTIRE E FARE AAAAAAAAAAAAAAAAAAAA	 								1.
	  window.addEventListener("load", () => {
	    if (sessionStorage.getItem("username") == null) {
	      window.location.href = "LandingPage.html";
	    } else {
	      pageOrchestrator.start(); // initialize the components
	      pageOrchestrator.refresh();
	    } // display initial content
	  }, false);







	   // la funzione DEFINITIVA TOTALE SUPREMA AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
	  function PageOrchestrator() {
	    
	    var alertContainer = document.getElementById("id_alert");
	    
	    
	    // FUNCTIONS OF THE HOMEPAGE Home Manager
	    
	    this.start = function() {
	      personalMessage = new PersonalMessage(sessionStorage.getItem('username'),
	        document.getElementById("id_username"));
	      personalMessage.show();

	      missionsList = new MissionsList(
	        alertContainer,
	        document.getElementById("id_listcontainer"),
	        document.getElementById("id_listcontainerbody"));

	      missionDetails = new MissionDetails({ // many parameters, wrap them in an
	        // object
	        alert: alertContainer,
	        detailcontainer: document.getElementById("id_detailcontainer"),
	        expensecontainer: document.getElementById("id_expensecontainer"),
	        expenseform: document.getElementById("id_expenseform"),
	        closeform: document.getElementById("id_closeform"),
	        date: document.getElementById("id_date"),
	        destination: document.getElementById("id_destination"),
	        status: document.getElementById("id_status"),
	        description: document.getElementById("id_description"),
	        country: document.getElementById("id_country"),
	        province: document.getElementById("id_province"),
	        city: document.getElementById("id_city"),
	        fund: document.getElementById("id_fund"),
	        food: document.getElementById("id_food"),
	        accomodation: document.getElementById("id_accomodation"),
	        transportation: document.getElementById("id_transportation")
	      });
	      missionDetails.registerEvents(this); // the orchestrator passes itself --this-- so that the wizard can call its refresh function after updating a mission

	      wizard = new Wizard(document.getElementById("id_createmissionform"), alertContainer);
	      wizard.registerEvents(this);  // the orchestrator passes itself --this-- so that the wizard can call its refresh function after creating a mission

	      document.querySelector("a[href='Logout']").addEventListener('click', () => {
	        window.sessionStorage.removeItem('username');
	      })
	    };

	    this.refresh = function(currentMission) { // currentMission initially null at start
	      alertContainer.textContent = "";        // not null after creation of status change
	      missionsList.reset();
	      missionDetails.reset();
	      missionsList.show(function() {
	        missionsList.autoclick(currentMission); 
	      }); // closure preserves visibility of this
	      wizard.reset();
	    };
	  }
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  
	  // ----------------- Constructors of view components ---------------------------
	  
	  function PersonalMessage(_username, messagecontainer) {
	    this.username = _username;
	    
	    this.show = function() {
	      messagecontainer.textContent = this.username;
	    }
	  }
	  
	  function MissionsList(_alert, _listcontainer, _listcontainerbody) {
	    
	    this.alert = _alert;
	    this.listcontainer = _listcontainer;
	    this.listcontainerbody = _listcontainerbody;

	    //   FUNCTION OF THE COMPONENT LIST!
	    
	    this.reset = function() {
	      this.listcontainer.style.visibility = "hidden";
	    }
	   
	  	this.show = function(next) {
	      var self = this;
	      makeCall("GET", "GetMissionsData", null,
	        function(req) {
	          if (req.readyState == 4) {
	            var message = req.responseText;
	            if (req.status == 200) {
	              var missionsToShow = JSON.parse(req.responseText);
	              if (missionsToShow.length == 0) {
	                self.alert.textContent = "No missions yet!";
	                return;
	              }
	              self.update(missionsToShow); // self visible by closure
	              if (next) next(); // show the default element of the list if present
	            
	          } else if (req.status == 403) {
                  window.location.href = req.getResponseHeader("Location");
                  window.sessionStorage.removeItem('username');
                  }
                  else {
	            self.alert.textContent = message;
	          }}
	        }
	      );
	    }
	 
	 	this.update = function(arrayMissions) {
	      var elem, i, row, destcell, datecell, linkcell, anchor;
	      this.listcontainerbody.innerHTML = ""; // empty the table body
	      // build updated list
	      var self = this;
	      arrayMissions.forEach(function(mission) { // self visible here, not this
	        row = document.createElement("tr");
	        destcell = document.createElement("td");
	        destcell.textContent = mission.destination;
	        row.appendChild(destcell);
	        datecell = document.createElement("td");
	        datecell.textContent = mission.startDate;
	        row.appendChild(datecell);
	        linkcell = document.createElement("td");
	        anchor = document.createElement("a");
	        linkcell.appendChild(anchor);
	        linkText = document.createTextNode("Show");
	        anchor.appendChild(linkText);
	        //anchor.missionid = mission.id; // make list item clickable
	        anchor.setAttribute('missionid', mission.id); // set a custom HTML attribute
	        anchor.addEventListener("click", (e) => {
	          // dependency via module parameter
	          missionDetails.show(e.target.getAttribute("missionid")); // the list must know the details container
	        }, false);
	        anchor.href = "#";
	        row.appendChild(linkcell);
	        self.listcontainerbody.appendChild(row);
	      });
	      this.listcontainer.style.visibility = "visible";

	    }

	    this.autoclick = function(missionId) {
	      var e = new Event("click");
	      var selector = "a[missionid='" + missionId + "']";
	      var anchorToClick =  // the first mission or the mission with id = missionId
	        (missionId) ? document.querySelector(selector) : this.listcontainerbody.querySelectorAll("a")[0];
	      if (anchorToClick) anchorToClick.dispatchEvent(e);
	    }

	  }
	  
};