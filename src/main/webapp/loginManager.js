/**
 * Login management
 */


(function() { // avoid variables ending up in the global scope

  document.getElementById("loginbutton").addEventListener('click', (e) => {
    e.preventDefault();
    var form = e.target.closest("form");
    
    if (form.checkValidity()) {
		
		document.getElementById('loginerrormessage').textContent = 'Trying to login...';
     	
     	// AJAX REQUEST!
            console.log("Sending AJAX request");
     	
     	// AJAX REQUEST!
     	makeCall("POST", 'LoginController', e.target.closest("form"),
        	function(x) {
	          if (x.readyState == XMLHttpRequest.DONE) {
				 
				 console.log("AJAX response received"); 
				 
	            var message = x.responseText;
	            switch (x.status) {
	              case 200:
					 document.getElementById("loginerrormessage").textContent = 'Login successful!';
	            	sessionStorage.setItem('username', message);
	                window.location.href = "Home.html";
	                break;
	              case 400: // bad request
	                document.getElementById("loginerrormessage").textContent = message;
	                break;
	              case 401: // unauthorized
	                  document.getElementById("loginerrormessage").textContent = message;
	                  break;
	              case 500: // server error
	            	document.getElementById("loginerrormessage").textContent = message;
	                break;
	            }
	          }
	        }
	      );
    } else {
    	form.reportValidity();
    }
  });
  
})();
