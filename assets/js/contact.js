$(document).ready(function(){
  // h3 animation
  setTimeout(function(){$("#in-out").attr("class", "animated tada");}, 1000);

  onPageLoad();
});

$("#contactSub").on("click", function(event) {
	event.preventDefault();

	var name = $("#name-input").val();
	var email = $("#email-input").val();
	var message = $("#message-input").val();
	console.log(name + email + message);

	var emailBool = email.includes("@");

	if (name.length > 1) {
		console.log("name, true")
	}else {
		console.log("name, false")
		$("#name-input").val("");
		$("#name-input").attr("placeholder", "Enter a real name!")
	}

	if (emailBool == true) {
		console.log("email, true")
	}else {
		console.log("email, false")
		$("#email-input").val("");
		$("#email-input").attr("placeholder", "Enter a real email!")
	}
	if (message.length < 2) {
		console.log("message, too short")
		$("#message-input").val("");
		$("#message-input").attr("placeholder", "Enter a real message!")
	}

})