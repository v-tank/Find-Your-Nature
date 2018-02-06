// Firebase
var config = {
    apiKey: "AIzaSyC9lq8l9sXlpUwQrGAWUda2qw_-faJUbiA",
    authDomain: "commentform-807d4.firebaseapp.com",
    databaseURL: "https://commentform-807d4.firebaseio.com",
    projectId: "commentform-807d4",
    storageBucket: "",
    messagingSenderId: "184726345923"
  };
firebase.initializeApp(config);

var database = firebase.database();

$(document).ready(function(){
	// Slices the last 4 letters of url (the parkcode) and stores into parkName
	var parkUrl = window.location.href;
	var parkCode = parkUrl.slice(parkUrl.length - 4);
	var parkName = parkCode;

	// Creates a review
	$("#review-submit").on("click", function(event){
		// debugger;
		event.preventDefault();

		var reviewName = $("#review-name").val().trim();
		var reviewMessage = $("#review-message").val().trim();
		var reviewDate = Date.now();
		var starRating = $("input[name='rating']:checked").val();
		// console.log(reviewName);
		// console.log(reviewMessage);
		// debugger;

		var newReview = {
			name: reviewName,
			date: reviewDate,
			review: reviewMessage,
			rating: starRating
		};
		database.ref("/" + parkName).push(newReview);

		console.log("Review added!");

		// CLOSE MODAL UPON SUBMIT!
		$("#review-name").val("");
		$("#review-message").val("");
	});

	// Dynamically appends reviews
	database.ref("/" + parkName).on("child_added", function(childSnapshot){
		var reviewName = childSnapshot.val().name;
		var reviewMessage = childSnapshot.val().review;
		var reviewDate = moment(childSnapshot.val().date).format("MMM Do YYYY, h:mm:ss a");
		var starRating = childSnapshot.val().rating;


		var housingDiv = $('<div class="row">');
		var colDiv = $("<div class='col-12'>");

		var stars = $("<div>");
		for (var i = 1; i <= starRating; i++){
			stars.append('<i class="active fa fa-star" aria-hidden="true"></i>');
		}

		colDiv.append(stars);
		colDiv.append('<div><strong>'+reviewName+'</strong></div>');
		colDiv.append('<div><p style="color: #999;" class="mb-2">'+reviewDate+'</p></div>');
		colDiv.append('<p>'+reviewMessage+'</p></div><br>');
		housingDiv.append(colDiv);

		$("#reviews-div").prepend(housingDiv);


		// $("#reviews-div").append("<br><p class='border border-dark rounded w-50'><strong>Name:</strong> " + reviewName + "<br><strong>Date Posted:</strong> " + reviewDate + "<br>" + reviewMessage + "</p>");
	}, function(errorObject){
		console.log("Error: " + errorObject.code);});
});


