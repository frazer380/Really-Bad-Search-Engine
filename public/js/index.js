document.addEventListener('DOMContentLoaded', function() {
    try {
        let app = firebase.app();
        let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
        let db = firebase.firestore();
        let returnDisplay = document.getElementById("returnDisplay");
        var time1;
        var time2;
        let card = document.getElementById("card");
        let cardImg = document.getElementById("card-img");
        let cardTitle = document.getElementById("card-title");
        let cardTag = document.getElementById("card-tag");
        let cardDesc = document.getElementById("card-description");
        let profilePicture = document.getElementById("profilePicture");
        let loggedIn = document.getElementById("loggedIn");
        let createAccount = document.getElementById("createAccount")
        let logoutButton = document.getElementById("logout");
        let notSearched = document.getElementById("notSearched");
        let time = document.getElementById("time");
        let images;
        let imagesButton = document.getElementById("imagesButton")
        let imagesUI = document.getElementById("images");
        let searchBox = document.getElementById("search");

        loggedIn.style.display = "none";
        createAccount.style.display = "none";  
        card.style.display = "none";


        logout.addEventListener("click", function() {
            firebase.auth().signOut().then(function() {
                // Sign-out successful.
              }).catch(function(error) {
                // An error happened.
            });
        });
 
        profilePicture.addEventListener("click", function() {
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                  loggedIn.style.display  = "block";
                } else {
                  createAccount.style.display = "block";
                }
            });
        });
        try {
            var url_string = (window.location.href).toLowerCase();
            var url_instance = new URL(url_string);
            var searchParams = url_instance.searchParams.get("search");
            if(searchParams.length != null) {
                document.body.style.backgroundColor = "#ffff";
                search(searchParams);
                renderCard(searchParams)
            }

        }
        catch(err) {
            try {
                var url_string = (window.location.href).toLowerCase();
                var url_instance = new URL(url_string);
                var imageSearchParams = url_instance.searchParams.get("imgsearch");
                if(imageSearchParams.length != null) {
                    document.body.style.backgroundColor = "#ffff";
                    console.log("here");
                    searchImages(imageSearchParams);
                    renderCard(imageSearchParams)
                }
            } catch(error) {console.log(error)}
            console.log(err);
        }


        function renderCard(input) {
            input = input.toLowerCase()
            if(input == "google") {
                card.style.display = "block";
                cardImg.src = "https://lh3.googleusercontent.com/NGPrjka2ai0w7sfhxkxCwtOSh2wVyEZMdtrVxI4vrA22ebA_fcyl9PSvhTaCYXSWh0A68ZhvXhVZ4U-Nnp3v9IfoXg5o5H1tjjK97cs";
                cardTitle.innerHTML = "Google";
                cardTag.innerHTML = "Technology Company";
                cardDesc.innerHTML = "Google is a vast company mainly known for their search engine and web browser.";
            }
            else if(input == "amazon") {
                card.style.display = "block";
                cardTitle.innerHTML = "Amazon";
                cardTag.innerHTML = "eCommerce Store";
                cardDesc.innerHTML = "Amazon is a company based on eCommerce and cloud computing (AWS).";
            }
            else if(input == "usa" || input == "united states of america") {
                card.style.display = "block";
                cardImg.src = "https://cdn.britannica.com/33/4833-004-297297B9/Flag-United-States-of-America.jpg";
                cardTitle.innerHTML = "United States";
                cardTag.innerHTML = "North American Country";
                cardDesc.innerHTML = "The United States of America has a population of 328.2 million with the current president Donald J. Trump, founded July 4th 1776."
            }
        }
        function search(input) {
            // set input box to input
            document.getElementById("search").value = input;
            // remove main page
            notSearched.style.display = "none";
            // set history
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                  let users = db.collection("users");
                  let ref = users.doc(user.uid);
                  ref.get().then(function(doc) {
                      let history = doc.data().History;
                      history = `${history}, ${input}`
                      ref.set({
                          History: history
                      })
                  })
                }
              });
            

            // actually search
            card.style.display = "none";
            returnDisplay.innerHTML = '<div for="search" class="top"><label id="labelReturn"><a href="index.html">RBSE</a></label><input type="search" id="search"/></div>';
            let searchedSites = [];
            let sites = db.collection("sites");
            let resultsCount = 0;
            let data = sites.orderBy("PageRank", "desc").get().then(snapshot => {
                snapshot.docs.forEach(doc => {
                    let returnData = doc.data();
                    let title = returnData.Title;
                    let description = returnData.Description;
                    let keywords = returnData.Keywords;
                    let url = returnData.URL;
                    url = url.replace("https://", "");
                    url = url.replace("http://", "");
                    input = input.toLowerCase();
                    if(title.toLowerCase().includes(input)) {
                        returnDisplay.innerHTML = returnDisplay.innerHTML + `<div id="content"><p id="urlDisplay">${url}</p><a href="http://${url}" id="titleDisplay">${title}</a>  <p id="descriptionDisplay">${description}</p></div>`;                  
                        searchedSites.push(url);
                    }
                    else if(description.toLowerCase().includes(input)) {
                        returnDisplay.innerHTML = returnDisplay.innerHTML + `<div id="content"><p id="urlDisplay">${url}</p><a href="http://${url}" id="titleDisplay">${title}</a>  <p id="descriptionDisplay">${description}</p></div>`;
                        searchedSites.push(url);
                    }
                    else if(returnData.URL.toLowerCase().includes(input)) {
                        returnDisplay.innerHTML = returnDisplay.innerHTML + `<div id="content"><p id="urlDisplay">${url}</p>  <a href="http://${url}" id="titleDisplay">${title}</a>  <p id="descriptionDisplay">${description}</p></div>`;
                        searchedSites.push(url);
                    }
                })
                if(!returnDisplay.firstChild) {
                    returnDisplay.innerHTML = "<div class='alert alert-danger'>There seem to be no matches to your search</div> <h3 class='alert-secondary'>Try again with different keywords.</h3>";
                }
            })
            time2 = new Date().getMilliseconds();
            let timeToGetData = time2 - time1;
            //time.innerHTML = `${timeToGetData} milliseconds`;
        }
        function searchImages(input) {
            notSearched.style.display = "none";
            returnDisplay.innerHTML = '<div for="search" class="top"><label id="labelReturn"><a href="index.html">RBSE</a></label><input type="search" id="search"/></div>';
            let data = db.collection("sites").orderBy("PageRank", "desc").get().then(snapshot => {
                document.getElementById("returnDisplay").innerHTML = "";
                let value = document.getElementById("search").value;
                let sites = db.collection("sites");
                let data = sites.orderBy("PageRank", "desc").get().then(snapshot => {
                    snapshot.docs.forEach(doc => {
                        let returnData = doc.data();
                        let title = returnData.Title;
                        let description = returnData.Description;
                        let keywords = returnData.Keywords;
                        let url = returnData.URL;
                        title = title.toLowerCase();
                        description = description.toLowerCase();
                        keywords = keywords.toLowerCase();
                        url = url.toLowerCase();
                        input = input.toLowerCase();
                        function displayImages(images) {
                            for(i=0;i<images.length;i++) {
                                returnDisplay.innerHTML = returnDisplay.innerHTML + `<img src="${images[i]}"/>`
                                if(Number.isInteger(i/10)) {
                                    returnDisplay.innerHTML = returnDisplay.innerHTML + "<br>";
                                }
                            }
                        }
                        if(title.includes(input)) {
                            displayImages(returnData.Images);
                        }
                        else if(description.includes(input)) {
                            displayImages(returnData.Images);
                        }
                        else if(keywords.includes(input)) {
                            displayImages(returnData.Images);
                        }
                    });
                });
            });
        }
        imagesButton.addEventListener("click", function() {
            if(!images) {
                imagesButton.innerHTML = "Normal Search";
                imagesUI.innerHTML = "IMAGES";
                images = true;
            } else { images = false; imagesButton.innerHTML = "Images";  imagesUI.innerHTML = "";}
        })
        document.getElementById("search").addEventListener("keyup", function(event) {
            if(event.key === "Enter") {
                time1 = new Date().getMilliseconds();
                if(!images) {
                    let location = "/?search=" + searchBox.value;
                    window.location.href = location;
                } else {
                    let location = "/?imgsearch="  + searchBox.value;
                    window.location.href = location;
                }
            }
        });
        /*document.getElementById("feelingLucky").addEventListener("click", function() {
            let input = document.getElementById("search").value;
            let sites = db.collection("sites");
            let data = sites.orderBy("PageRank", "desc").get().then(snapshot => {
                snapshot.docs.forEach(doc => {
                    let returnData = doc.data();
                    let title = returnData.Title;
                    let description = returnData.Description;
                    let keywords = returnData.Keywords;
                    let url = returnData.URL;
                    title = title.toLowerCase();
                    description = description.toLowerCase();
                    keywords = keywords.toLowerCase();
                    url = url.toLowerCase();
                    input = input.toLowerCase();
                    if(title.includes(input)) {
                        window.location.href = url;
                    }
                    else if(description.includes(input)) {
                        window.location.href = url;
                    }
                    else if(keywords.includes(input)) {
                        window.location.href = url;
                    }
                });
            });
        });*/
    } 
    catch (e) {
        console.error(e);
    }
});