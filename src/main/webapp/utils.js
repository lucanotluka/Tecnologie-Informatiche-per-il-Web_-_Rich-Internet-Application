/**
 * AJAX call manager
 */

function makeCall(method, url, formElement, cback, reset = true) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        cback(req);
    }; // closure
    req.open(method, url);

    if (formElement == null) {
        req.send();
    } else {
        var formData = new FormData(formElement);
        for (var pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]);
        }
        req.send(formData);
    }

    if (formElement !== null && reset === true) {
        formElement.reset();
    }
}

function makeJSONCall(method, url, data, cback, reset = true) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (req.readyState === XMLHttpRequest.DONE) {
            cback(req);
        }
    };

    req.open(method, url);

	 if (typeof data === 'string') {
        req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        req.send(data);
    } else {
        req.send();
    }
}