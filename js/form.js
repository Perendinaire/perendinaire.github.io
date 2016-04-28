//Anthony Meehan
//lots of code uses document.theForm, so shorten it
var f = document.theForm;

//setup validation for controls
setValidBirthDate(f.birthDate);
setValidExpiry(f.passportExpiry);
setValidExpiry(f.cardExpiry);

//setup form visual elements
$("#noteYesAdvice").hide();
$("#divOTitle").hide();
$("#setOAddress").hide();
$("#setOCreditCard").hide();
$("#setSwitchCard").hide();

//counter to help the server keep track of each contact's information
var contactCount = 0;
//counter to keep track of employment period information
var employCount = 0;

/**
 * displays an error message next to an element
 * @param {Element} theElement
 * @param {String} errorMessage
 */
function displayError(theElement, errorMessage) {
	//don't add an error if one is already there
	if(theElement.nextSibling.tagName == "SPAN" && theElement.nextSibling.textContent.trim == errorMessage.trim)
		return;
	//build an error message and place it next to the element
	var messageElement = document.createElement("span");
	messageElement.textContent = errorMessage;
	messageElement.className = "highlight";
	theElement.parentNode.insertBefore(messageElement, theElement.nextSibling);
	theElement.className = "errorBox";
	//quickly animate the error
	$(messageElement).hide();
	$(messageElement).slideDown(80);
}
/**
 * removes an error from an element
 * @param {Element} theElement
 */
function clearError(theElement) {
	//remove any error styling
	theElement.className = null;
	if(theElement.nextSibling.tagName == "SPAN")
		theElement.parentNode.removeChild(theElement.nextSibling);
}
/**
 * removes an error from the gender radio controls
 */
function clearErrorGender() {
	clearError(document.getElementById("radioMale"));
}
/**
 * removes an error from the "recieved advice" radio controls
 */
function clearErrorAdvice() {
	clearError(document.getElementById("radioYesAdvice"));
}
/**
 * removes an error from the "communication address" radio controls
 */
function clearErrorCommAddress() {
	clearError(document.getElementById("radioSameAddress"));
}
/**
 * removes an error from the "communicate on behalf" radio controls
 */
function clearErrorOnBehalf() {
	clearError(document.getElementById("radioYesOnBehalf"));
}
/**
 * removes an error from the "payment type" radio controls
 */
function clearErrorPayment() {
	clearError(document.getElementById("radioBankCheque"));
}
/**
 * removes an error from the "card type" radio controls
 */
function clearErrorCard() {
	clearError(document.getElementById("radioMastercard"));
}
/**
 * Checks whether an element's input matches some regex,
 * returns true if it is valid
 * @param {Input} inputElement
 * @param {String} errorMessage
 * @param {RegExp} theRegex
 */
function checkRegex(inputElement, errorMessage, theRegex) {
	if(theRegex.test(inputElement.value)) {
		clearError(inputElement);
		return true;
	}
	else {
		displayError(inputElement, errorMessage);
		return false;
	}
}
/**
 * checks whether an element is empty,
 * returns true if the input is valid
 * @param {Input} inputElement
 * @param {String} errorMessage
 */
function checkEmpty(inputElement, errorMessage) {
	var theRegex = /./;
	return checkRegex(inputElement, errorMessage, /./);
}
/**
 * checks whether an input is alphanumeric,
 * returns true if the input is valid
 * @param {Input} inputElement
 * @param {String} errorMessage
 */
function checkAlphaNumeric(inputElement, errorMessage) {
	var theRegex = /^[a-z0-9]+$/i;
	return checkRegex(inputElement, errorMessage, theRegex);
}
/**
 * checks whether an input contains ONLY numeric characters
 * returns true if the input is valid
 * @param {Input} inputElement
 * @param {String} errorMessage
 */
function checkNumeric(inputElement, errorMessage) {
	var theRegex = /^\d+$/;
	return checkRegex(inputElement, errorMessage, theRegex);
}
/**
 * checks whether an input is a possible 3-digit code
 * returns true if the input is valid
 * @param {Input} inputElement
 * @param {String} errorMessage
 */
function checkCreditCode(inputElement, errorMessage) {
	//check for length 3, and is alphabetic
	var theRegex = /^\d{3}$/;
	return checkRegex(inputElement, errorMessage, theRegex);
}
/**
 * checks whether an input is a possible 4-digit credit card segment
 * returns true if the input is valid
 * @param {Input} inputElement
 * @param {String} errorMessage
 */
function checkCreditSegment(inputElement, errorMessage) {
	//check for length 3, and is alphabetic
	var theRegex = /^\d{4}$/;
	return checkRegex(inputElement, errorMessage, theRegex);
}
/**
 * checks whether an input is a possible currency code
 * returns true if the input is valid
 * @param {Input} inputElement
 * @param {String} errorMessage
 */
function checkCurrencyCode(inputElement, errorMessage) {
	//check for length 3, and is alphabetic
	var theRegex = /^[A-Z]{3}$/i;
	return checkRegex(inputElement, errorMessage, theRegex);
}
/**
 * checks whether an input is a valid personal name,
 * returns true if the input is valid
 * @param {Input} inputElement
 * @param {String} errorMessage
 */
function checkName(inputElement, errorMessage) {
	//check for alphabet
	var theRegex = /^[A-Z]+$/i;
	return checkRegex(inputElement, errorMessage, theRegex);
}
/**
 * checks whether an input is a valid full name (including spaces),
 * returns true if the input is valid
 * @param {Input} inputElement
 * @param {String} errorMessage
 */
function checkFullName(inputElement, errorMessage) {
	//check for alphabet + spaces
	var theRegex = /^[A-Z ]+$/i;
	return checkRegex(inputElement, errorMessage, theRegex);
}
/**
 * checks whether an input matches a phone number syntax,
 * returns true if the input is valid
 * @param {Input} inputElement
 * @param {String} errorMessage
 */
function checkPhone(inputElement, errorMessage) {
	var theNumber = inputElement.value;
	//check for roughly valid phone formatting
	var theRegex = /^\+?\(?(\d+[\-\(\)\./ ]?)+$/;
	if(theRegex.test(theNumber)) {
		//check that the number of digits is reasonable - say 5-20
		//strip digits then count length
		theNumber = theNumber.replace(/\D/g,'');
		if(theNumber.length >= 5 && theNumber.length <= 20) {
			clearError(inputElement);
			return true;
		}
	}
	//if either test failed, display error
	displayError(inputElement, errorMessage);
	return false;
}
/**
 * checks whether an input matches an email syntax,
 * returns true if the input is valid
 * @param {Input} inputElement
 * @param {String} errorMessage
 */
function checkEmail(inputElement, errorMessage) {
	//email regex from course slides
	var theRegex = /^\w+@[a-z]+(\.[a-z]+)+$/;
	return checkRegex(inputElement, errorMessage, theRegex);
}
/**
 * adds another text field of a given name,
 * returns a div holding the field, which is hidden
 * @param {String} fieldName
 * @param {String} fieldLabel
 * @param {String} fieldType
 */
function addNewField(fieldName, fieldLabel, fieldType) {
	//greate input, line break and label elements as with a normal field
	var newTextBox = document.createElement("input");
	newTextBox.type = fieldType;
	newTextBox.name = fieldName;
	
	var newLabel = document.createElement("label");
	newLabel.innerHTML = fieldLabel;
	
	var fieldContainer = document.createElement("div");
	fieldContainer.appendChild(newLabel);
	fieldContainer.appendChild(newTextBox);
	fieldContainer.appendChild(document.createElement("br"));
	return fieldContainer;
}
/**
 * Helper function that adds a single text field directly into the page
 * @param {Input} theElement
 * @param {String} fieldName
 * @param {String} fieldLabel
 */
function addSingleTextField(theElement, theName, theLabel) {
	var fieldContainer = addNewField(theName, theLabel, "text");
	theElement.parentNode.insertBefore(fieldContainer, theElement);
	$(fieldContainer).hide();
	$(fieldContainer).slideDown(150);
}
/**
 * adds an "other name" field before some element ID
 * @param {String} elementID
 */
function addOtherName(elementID) {
	var theElement = document.getElementById(elementID);
	//server side app will need need to keep track of multiple other names
	addSingleTextField(theElement, "otherName", "Other name: ");
}
/**
 * adds an "other citizenship" field before some element ID
 * @param {String} elementID
 */
function addOtherCitizenship(elementID) {
	var theElement = document.getElementById(elementID);
	//server side app will need need to keep track of multiple citizenships
	addSingleTextField(theElement, "otherCitizenship", "Other Citizenship: ");
}
/**
 * adds a "freind, relative or contact" field set before some element ID
 * @param {String} elementID
 */
function addContact(elementID) {
	//use the counter to help keep track of each contact's information
	contactCount++;
	var theFieldset = document.createElement("fieldset");
	var theLegend = document.createElement("legend");
	var theText = document.createTextNode("Contact " + contactCount);
	theLegend.appendChild(theText);
	
	var nameField = 		addNewField(contactCount + "contactName", 	 "Name: ", 	  "text");
	var addressField = 		addNewField(contactCount + "contactAddress", "Address: ", "text");
	var relationshipField = addNewField(contactCount + "contactRelationship", "Relationship: ", "text");
	var birthDayField = 	addNewField(contactCount + "contactBirthDay", "Date of birth (if known): ", "date");
	
	theFieldset.appendChild(theLegend);
	theFieldset.appendChild(nameField);
	theFieldset.appendChild(addressField);
	theFieldset.appendChild(relationshipField);
	theFieldset.appendChild(birthDayField);
	
	var theElement = document.getElementById(elementID);
	theElement.parentNode.insertBefore(theFieldset, theElement);
	$(theFieldset).hide();
	$(theFieldset).slideDown(250);
	
	//apply field validation, need to extract from divs first
	setValidBirthDate(birthDayField.getElementsByTagName("INPUT")[0]);
}
/**
 * adds a "period of employment" field set before some element ID
 * @param {String} elementID
 */
function addEmployment(elementID) {
	//use the counter to help keep track of each contact's information
	employCount++;
	var theFieldset = document.createElement("fieldset");
	var theLegend = document.createElement("legend");
	var theText = document.createTextNode("Employment period " + employCount);
	theLegend.appendChild(theText);
	
	var dateFromField = addNewField(employCount + "employFromDate", "Date from: ",		  "date");
	var dateToField = 	addNewField(employCount + "employToDate", 	"Date to: ", 	      "date");
	var employerField = addNewField(employCount + "employerName", 	"Name of employer: ", "text");
	var locationField = addNewField(employCount + "employLocation", "Location: ",   	  "text");
	var typeField = 	addNewField(employCount + "employType", "Work type, title or occupation: ", "text");
	
	theFieldset.appendChild(theLegend);
	theFieldset.appendChild(dateFromField);
	theFieldset.appendChild(dateToField);
	theFieldset.appendChild(employerField);
	theFieldset.appendChild(locationField);
	theFieldset.appendChild(typeField);
	
	var theElement = document.getElementById(elementID);
	theElement.parentNode.insertBefore(theFieldset, theElement);
	$(theFieldset).hide();
	$(theFieldset).slideDown(250);
	
	//apply field validation, need to extract from divs first
	setValidBirthDate(dateFromField.getElementsByTagName("INPUT")[0]);
	setValidBirthDate(dateToField.getElementsByTagName("INPUT")[0]);
	
	//validation here causes a false-positive when jquery slides the fields down -- can only validate upon submission?
	/*
	var field = employerField.getElementsByTagName("INPUT")[0];
	field.addEventListener("blur", checkFullName(field, 'Invalid employer name'));
	
	field = locationField.getElementsByTagName("INPUT")[0];
	field.addEventListener("blur", checkEmpty(field, 'Should include a location'));
	
	field = typeField.getElementsByTagName("INPUT")[0];
	field.addEventListener("blur", checkEmpty(field, 'Should include a type of work'));
	*/
}
/**
 * Adds an "other" option if "other" personal title selected
 * @param {Input} theElement
 */
function switchTitle(theElement) {
	if(theElement.value == "other" && $("#divOTitle").is(":hidden"))
		$("#divOTitle").slideDown(250);
	else if(theElement.value != "other")
		$("#divOTitle").slideUp(250);
}
/**
 * Slides in a notice if "yes" is selected for immigration advice 
 */
function switchAdvice() {
	if(f.recievedAdvice.value == "yes")
		$("#noteYesAdvice").slideDown(150);
	else
		$("#noteYesAdvice").slideUp(150);
}
/**
 * Slides in the "communication address" field set when "other address" is chosen
 */
function switchCommAddress() {
	if(f.choiceCommAddress.value == "other")
		$("#setOAddress").slideDown(250);
	else
		$("#setOAddress").slideUp(250);
}
/**
 * Slides in the "credit card" field set when "credit card" is chosen
 */
function switchPayment() {
	if(f.choicePayment.value == "creditCard")
		$("#setOCreditCard").slideDown(250);
	else
		$("#setOCreditCard").slideUp(250);
}
/**
 * Slides in the "credit card" field set when "credit card" is chosen
 */
function switchCard() {
	if(f.choiceCard.value == "switch")
		$("#setSwitchCard").slideDown(150);
	else
		$("#setSwitchCard").slideUp(150);
}
/**
 * Shifts over to the next field after one field is of a certain size
 * @param {Integer} theLength
 * @param {Input} thisElement
 * @param {Input} nextElement
 */
function shiftToNext(theLength, thisElement, nextElement) {
	if(thisElement.value.length >= theLength) {
		nextElement.focus();
	}
}
/**
 * Sets the valid min and max birth dates for a date control
 * @param {Input} inputDate
 */
function setValidBirthDate(inputDate) {
	inputDate.max = getTodayFormatted();
	inputDate.min = "1890-01-01";
}
/**
 * Sets the valid min date for a passport expiry
 * @param {Input} inputDate
 */
function setValidExpiry(inputDate) {
	inputDate.min = getTodayFormatted();
}
/**
 * gets today's date formatted such that it can be applied to a Date control
 */
function getTodayFormatted() {
	var todaysDate = new Date();
	var day = todaysDate.getDate();
	//Months returned here are 0-11, must offset by 1
	var month = todaysDate.getMonth() +1;
	var year = todaysDate.getFullYear();
	
	//pad a 0 if the month or day is one-digit
	if(day < 10)
		day = "0" + day;
	if(month < 10)
		month = "0" + month;
	
	return year + "-" + month + "-" + day;
}
/**
 * Validates all inputs before submission 
 */
function isFormValid() {
	//form becomes invalid if we move through all inputs, and at least one is invalid
	var formValid = true;
	//anything & false evaluates to false
	//don't want to use &&, as we want to validate all inputs
	formValid &= checkEmpty(f.photo, 'Must upload a photo');
	formValid &= checkName(f.fName, 'Must have a first name');
	formValid &= checkName(f.lName, 'Must have a last name');
	formValid &= checkEmpty(f.personTitle, 'Must select a title');
	//test "gender" radio validity here
	if(f.gender.value == "") {
		displayError(document.getElementById("radioMale"), "Must choose a legal gender");
		formValid = false;
	}
	
	formValid &= checkEmpty(f.birthDate, 'Must select a birth date');
	formValid &= checkEmpty(f.birthCity, 'Must include a city');
	formValid &= checkEmpty(f.birthCountry, 'Must include a country');
	
	formValid &= checkAlphaNumeric(f.passportNum, 'Invalid passport number');
	formValid &= checkEmpty(f.passportCountry, 'Must include a country');
	formValid &= checkEmpty(f.passportExpiry, 'Must select an expiry date');
	
	formValid &= checkEmpty(f.partnership, 'Must select a status');
	
	formValid &= checkEmpty(f.currAddress1, 'Must inclide an address');
	formValid &= checkPhone(f.landline, 'Invalid phone number');
	formValid &= checkPhone(f.mobile, 'Invalid phone number');
	formValid &= checkEmail(f.email, 'Invalid email address');
	
	//test "communication address" radio validiy
	if(f.choiceCommAddress.value == "") {
		displayError(document.getElementById("radioSameAddress"), "Must choose an option");
		formValid = false;
	}
	//validate communication address field only if "other address" was chosen
	else if(f.choiceCommAddress.value == "other") {
		formValid &= checkEmpty(f.commAddress1, 'Must inclide an address');
		formValid &= checkPhone(f.commDaytime, 'Invalid phone number');
		formValid &= checkPhone(f.commEvening, 'Invalid phone number');
		formValid &= checkEmail(f.commEmail, 'Invalid email address');
		if(f.actOnBehalf.value == "") {
			displayError(document.getElementById("radioYesOnBehalf"), "Must choose an option");
			formValid = false;
		}
	}
	
	//test "recieved advice" radio validity
	if(f.recievedAdvice.value == "") {
		displayError(document.getElementById("radioYesAdvice"), "Must choose an option");
		formValid = false;
	}
	
	formValid &= checkCurrencyCode(f.currencyCode, 'Invalid currency code');
	//browser handles more complex number validation
	formValid &= checkEmpty(f.amount, 'Must enter an amount of money');
	//assuming that the application number requires some non-empty string of digits, and is required
	formValid &= checkNumeric(f.appNumber, 'Invalid application number');
	
	//test "payment type" radio validity
	if(f.choicePayment.value ==  "") {
		displayError(document.getElementById("radioBankCheque"), "Must choose an option");
		formValid = false;
	}
	else if(f.choicePayment.value ==  "creditCard") {
		//test "card type" radio validity
		if(f.choiceCard.value ==  "") {
			displayError(document.getElementById("radioMastercard"), "Must choose an option");
			formValid = false;
		}
		else if(f.choiceCard.value ==  "switch") {
			formValid &= checkCreditCode(f.switchNumber, 'Invalid issue number');
		}
		formValid &= checkFullName(f.cardName, 'Invalid cardholder name');
		formValid &= checkCreditSegment(f.cardNumber1, '');
		formValid &= checkCreditSegment(f.cardNumber2, '');
		formValid &= checkCreditSegment(f.cardNumber3, '');
		formValid &= checkCreditSegment(f.cardNumber4, 'Invalid card number');
		formValid &= checkCreditCode(f.cardCode, 'Invalid CVC/CCV number');
		formValid &= checkEmpty(f.cardExpiry, 'Must select an expiry date');
	}
	
	//test dynamic "contact" fields for validity
	for(var i=1; i <= contactCount; i++) {
		var contactElement = document.getElementsByName(i + "contactName")[0];
		formValid &= checkFullName(contactElement, 'Must have a name');
		
		contactElement = document.getElementsByName(i + "contactAddress")[0];
		formValid &= checkEmpty(contactElement, 'Must have an address');
		
		contactElement = document.getElementsByName(i + "contactRelationship")[0];
		formValid &= checkEmpty(contactElement, 'Must have some relationship');
	}
	
	//test dynamic "employment" fields for validity
	for(var i=1; i <= employCount; i++) {
		var employElement = document.getElementsByName(i + "employFromDate")[0];
		formValid &= checkEmpty(employElement, 'Must have a from date');
		
		employElement = document.getElementsByName(i + "employToDate")[0];
		formValid &= checkEmpty(employElement, 'Must have a to date');
		
		employElement = document.getElementsByName(i + "employerName")[0];
		formValid &= checkFullName(employElement, 'Invalid employer name');
		
		employElement = document.getElementsByName(i + "employLocation")[0];
		formValid &= checkEmpty(employElement, 'Must include a location');
		
		employElement = document.getElementsByName(i + "employType")[0];
		formValid &= checkEmpty(employElement, 'Must include a type of work');
	}
	
	//bitwise operations turn booleans into integers. Must convert back
	formValid = Boolean(formValid);
	//window.alert(formValid);
	if(!formValid) 
		displayError(document.getElementById("buttonSubmit"),
		"Form was not filled out correctly. Please check over the form then submit again.");
	return formValid;
}
/**
 * Resets any error messages on the form 
 */
function resetForm() {
	location.reload();
	//the following clears errors, but doesn't remove dynamically added controls
	/*
	var theElements = f.elements;
	for(var i=0; i < theElements.length; i++) {
		if(theElements[i].tagName == "INPUT" || theElements[i].tagName == "SELECT")
			clearError(theElements[i]);
	}
	*/
}
