/**
 * Login management
 */

(function() { // avoid variables ending up in the global scope

  document.getElementById("loginbutton").addEventListener('click', (e) => {
    
    let form = e.target.closest("form");
    
    if (form.checkValidity()) {
		document.getElementById('loginerrormessage').textContent = 'Trying to login...';
		
		// TODO the handling of view change and ERROR answers
		
		return true;
    } else {
    	form.reportValidity();
    	return false;
    }
  });

})();