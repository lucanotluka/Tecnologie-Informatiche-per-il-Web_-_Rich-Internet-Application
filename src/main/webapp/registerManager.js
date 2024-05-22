/**
 * Registration Manager
 */
(function() { // avoid variables ending up in the global scope
    document.getElementById("registerbutton").addEventListener('click', (e) => {
   	  
   	  	let form = e.target.closest("form");
    
    	if (form.checkValidity()) {
		   	  const password = document.getElementById('password').value;
		   	  const confirmPassword = document.getElementById('confirmPassword').value;
		   	  
		   	  if (password !== confirmPassword) {
		   	    document.getElementById('registererrormessage').textContent = 'Passwords do not match!';
		   	    return false; // Prevent form submission
		   	  }
		   	  
		   	  
		   	  document.getElementById('registererrormessage').textContent = '';
		   	  
		   	  // TODO the handling of ERROR answers
		   	  
		   	  return true;
	     } else {
	    	 form.reportValidity();
	    }
    });
  })();