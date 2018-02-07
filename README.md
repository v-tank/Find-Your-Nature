# Find-Your-Nature: Project 1 - Group 4
_This project was developed by: Frank Valdez, Julie Nguyen, Konstantin Tikhonov, Vaibhav Tank, & Yvette Tran_

## Description ##

Find Your Nature is a web app written in HTML, CSS, and JavaScript to assist users in finding national attractions (i.e. parks, monuments, trails, etc.) in the US. Data is pulled from the National Park Service API to provide general information regarding the national attraction. Users also have access to weather data, air quality, park alerts, as well as reviews from other users.


## Demo ##

To experience a demo of Find Your Nature, click the following link: [https://v-tank.github.io/Find-Your-Nature/](https://v-tank.github.io/Find-Your-Nature/)


## How-To ## 

If you want to load the app onto your computer, please clone the repo using this link: [git@github.com:v-tank/Find-Your-Nature.git](git@github.com:v-tank/Find-Your-Nature.git)

In order to access the user comments database, you will need to create your own [Firebase account](https://firebase.google.com/). In the HTML and *review.js* files, replace the `initialize firebase` code with your own. To generate your own API keys, use the links in the "APIs Used" section below to sign up for a key.
![](https://github.com/v-tank/Find-Your-Nature/blob/readme/readme-images/firebase.jpg "Firebase code snippet")


#### Getting Started: ####

![](https://github.com/v-tank/Find-Your-Nature/blob/readme/readme-images/Slide1.png "Select a State")
![](https://github.com/v-tank/Find-Your-Nature/blob/readme/readme-images/Slide2.png "Select a Park")
![](https://github.com/v-tank/Find-Your-Nature/blob/readme/readme-images/Slide3.png "Park Detailed Info")
![](https://github.com/v-tank/Find-Your-Nature/blob/readme/readme-images/Slide4.png "Reviews Modal")


## Technologies Used ##

* Firebase - To store user reviews and ratings for each park in the database
* Moment.js - To log and convert the built-in timestamp from unix to month/date/year, hours:minutes 
* HTML, CSS, Bootstrap 4, Google Fonts, Font Awesome, and Animate.css - To create the UI/UX


## APIs Used ## 

_All the APIs below are free for public use:_
1. [National Park Service Data API](https://www.nps.gov/subjects/digital/nps-data-api.htm)
2. [Google Maps API](https://developers.google.com/maps/)
3. [Dark Sky API](https://darksky.net/dev)
4. [Air Quality Open Data Platform](http://aqicn.org/data-platform/token/#/)


## Future Development ##

Features:
* Add in recommended activities of attraction based on popularity (e.g biking, camping, etc…)
* Display whether the places are dog-friendly
* Add information about entrance fees
* Display events in a park near you
* Park Contact Information
* Add places nearby (e.g hotel, restaurants, etc..)
* Adding images slideshow
* Add a 'Near-Me' feature to geo-locate the user and find the closest attractions within a given radius

Improvements:
* Decrease the load time of maps
* Detailed card info to show the average ratings for each attraction


