/**
 * Login management
 */


(function() { // avoid variables ending up in the global scope

  document.getElementById("loginbutton").addEventListener('click', (e) => {
    
    let form = document.getElementById('loginForm');
    
    if (form.checkValidity()) {
		document.getElementById('loginerrormessage').textContent = 'Trying to login...';
     	
     	// AJAX REQUEST!
     	makeCall("POST", 'LoginController', document.getElementById('loginForm'),
        	function(x) {
	          if (x.readyState == XMLHttpRequest.DONE) {
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
    	return false;
    }
  });
  
})();
