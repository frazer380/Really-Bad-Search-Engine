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

        card.style.display = "none";

        function renderCard(input) {
            input = input.toLowerCase()
            if(input == "google") {
                card.style.display = "block";
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
            let time = document.getElementById("time");
            card.style.display = "none";
            renderCard(input);
            returnDisplay.innerHTML = "";
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
                    title = title.toLowerCase();
                    description = description.toLowerCase();
                    keywords = keywords.toLowerCase();
                    url = url.toLowerCase();
                    input = input.toLowerCase();
                    if(title.includes(input)) {
                        let returnData = doc.data();
                        let title = returnData.Title;
                        let description = returnData.Description;
                        let keywords = returnData.Keywords;
                        let url = returnData.URL;
                        returnDisplay.innerHTML = returnDisplay.innerHTML + `<div id="content"><p id="urlDisplay">${url}</p> <br> <a href="${url}" id="titleDisplay">${title}</a> <br> <p id="descriptionDisplay">${description}</p></div>`;                  
                        searchedSites.push(url);
                    }
                    else if(description.includes(input)) {
                        let returnData = doc.data();
                        let title = returnData.Title;
                        let description = returnData.Description;
                        let keywords = returnData.Keywords;
                        let url = returnData.URL;
                        returnDisplay.innerHTML = returnDisplay.innerHTML + `<div id="content"><p id="urlDisplay">${url}</p> <br> <a href="${url}" id="titleDisplay">${title}</a> <br> <p id="descriptionDisplay">${description}</p></div>`;
                        searchedSites.push(url);
                    }
                    else if(url.includes(input)) {
                        let returnData = doc.data();
                        let title = returnData.Title;
                        let description = returnData.Description;
                        let keywords = returnData.Keywords;
                        let url = returnData.URL;
                        returnDisplay.innerHTML = returnDisplay.innerHTML + `<div id="content"><p id="urlDisplay">${url}</p> <br> <a href="${url}" id="titleDisplay">${title}</a> <br> <p id="descriptionDisplay">${description}</p></div>`;
                        searchedSites.push(url);
                    }
                })
                if(!returnDisplay.firstChild) {
                    returnDisplay.innerHTML = "<br><div class='alert alert-danger'>There seem to be no matches to your search</div> <h3 class='alert-secondary'>Try again with different keywords.</h3>";
                }
            })
            time2 = new Date().getMilliseconds();
            let timeToGetData = time2 - time1;
            time.innerHTML = `${timeToGetData} milliseconds`;
        }
        



        function searchImages(input) {
            
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
                                document.getElementById("returnDisplay").innerHTML = document.getElementById("returnDisplay").innerHTML + `<img src="${images[i]}"/>`
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

        document.getElementById("imagesButton").addEventListener("click", function() {
            searchImages(document.getElementById("search").value);
        })

        document.getElementById("search").addEventListener("keyup", function(event) {
            if(event.key === "Enter") {
                time1 = new Date().getMilliseconds();
                search(document.getElementById("search").value);
            }
        });

        document.getElementById("feelingLucky").addEventListener("click", function() {
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
        });
    } 
    catch (e) {
        console.error(e);
    }
});