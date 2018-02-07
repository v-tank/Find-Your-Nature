# Find-Your-Nature: Project 1 - Group 4
_This project was developed by: Frank Valdez, Julie Nguyen, Konstantin Tikhonov, Vaibhav Tank, & Yvette Tran_

__Description__

Find Your Nature is an online tool written in html, css, and javascript that assists users in finding national attractions (i.e. parks, monuments, trails, etc.) in the US. Data is pulled from the National Park Service API to provide general information regarding the national attraction. Users also have access to weather and air quality of the area.


__How To__

If you want to load the app onto your computer, please clone it by using this link: git@github.com:v-tank/Find-Your-Nature.git

In order to access the user comments database, you will need to create your own [firebase account](https://firebase.google.com/). In the html files and review.js file, replace the initialize firebase code with your own. If you wish to use your own API keys, use the links in the "APIs Used" section below to sign up for a key.

[Find-Your-Nature/readme-images/firebase.jpg]


__Demo__

To see demo of Find Your Nature, click the following link: [https://v-tank.github.io/Find-Your-Nature/]

Getting Started:
(https://github.com/v-tank/Find-Your-Nature/blob/readme/readme-images/Slide1.png)

[Find-Your-Nature/readme-images/Slide2.png]

[Find-Your-Nature/readme-images/Slide3.png]

[Find-Your-Nature/readme-images/Slide4.png]


__Technologies Used__

Firebase was used as a database to store user reviews and ratings for each park. Moment.js was used to convert the firebase build in timestamp from unix to month/date/year, hours:minutes. Styling of the site was done by CSS, Bootstrap 4, Google Fonts, Font Awesome, and Animate.css.


__APIs Used__

_All the APIs below are free for public use_
+[National Park Service Data API](https://www.nps.gov/subjects/digital/nps-data-api.htm)
+[Google Maps API](https://developers.google.com/maps/)
+[Dark Sky API](https://darksky.net/dev)
+[Air Quality Open Data Platform](http://aqicn.org/data-platform/token/#/)


__Future Development__

Features:
+Add in recommended activities of attraction based on popularity
+Display if place is dog friendly
+Add information about entrance fees
+Add things to do (e.g biking, camping, etc…)
+Display events in a park near you
+Park Contact Information
+Add places nearby (e.g hotel, restaurants, etc..)
+Adding images slideshow

Improvements:
+Decrease the load time of maps


