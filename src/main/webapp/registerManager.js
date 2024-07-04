/**
 * Registration Manager
 */
(function() { // avoid variables ending up in the global scope
    document.getElementById("registerbutton").addEventListener('click', (e) => {
   	   e.preventDefault();
   	  
   	  	let form = e.target.closest("form");
    
    	if (form.checkValidity()) {
		   	  const password = document.getElementById('password').value;
		   	  const confirmPassword = document.getElementById('confirmPassword').value;
		   	  
		   	  if (password !== confirmPassword) {
		   	    document.getElementById('registererrormessage').textContent = 'Passwords do not match!';
		   	    return false; // Prevent form submission
		   	  } 

		   	       	
		     	// AJAX REQUEST!
		     	makeCall("POST", 'RegisterController', e.target.closest("form"), function(x) {
			          if (x.readyState == XMLHttpRequest.DONE) {
			            var message = x.responseText;
			            switch (x.status) {
			              case 200:	// OK!
			            	document.getElementById("registererrormessage").textContent = message;
			                break;
			              case 400: // bad request
			                document.getElementById("registererrormessage").textContent = message;
			                break;
			              case 401: // unauthorized
			                  document.getElementById("registererrormessage").textContent = message;
			                  break;
			              case 500: // server error
			            	document.getElementById("registererrormessage").textContent = message;
			                break;
			              default:
							  document.getElementById("registererrormessage").textContent = message;
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