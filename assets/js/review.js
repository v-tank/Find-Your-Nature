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
		// console.log(reviewName);
		// console.log(reviewMessage);
		// debugger;

		var newReview = {
			name: reviewName,
			date: reviewDate,
			review: reviewMessage
		};
		database.ref("/" + parkName).push(newReview);

		console.log("Review added!");

		$("#review-name").val("");
		$("#review-message").val("");
	});

	// Dynamically appends reviews
	database.ref("/" + parkName).on("child_added", function(childSnapshot){
		var reviewName = childSnapshot.val().name;
		var reviewMessage = childSnapshot.val().review;
		var reviewDate = moment(childSnapshot.val().date).format("MMM Do YYYY, h:mm:ss a");

		$("#reviews-div").append('<br><div class="row justify-content-center"><div class="col-8"><div class="row"><strong>'+reviewName+'</strong></div><div class="row"><p style="color: #999;" class="mb-2">'+reviewDate+'</p></div><div class="row"><p>'+reviewMessage+'</p></div></div></div>');

		// $("#reviews-div").append("<br><p class='border border-dark rounded w-50'><strong>Name:</strong> " + reviewName + "<br><strong>Date Posted:</strong> " + reviewDate + "<br>" + reviewMessage + "</p>");
	}, function(errorObject){
		console.log("Error: " + errorObject.code);});
});


