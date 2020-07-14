document.addEventListener('DOMContentLoaded', function() {
    let app = firebase.app();
    let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
    let db = firebase.firestore();
    let alert = document.getElementById("incorrect");
    const form = document.getElementById('form');
    const box = document.getElementById("box");
    alert.style.display = "none";
    function logSubmit(event) {
        alert.style.display = "none";
        let email = document.getElementById("exampleInputEmail1").value;
        let password = document.getElementById("exampleInputPassword1").value;
        let confirmPassword = document.getElementsByClassName("confirmPassword")[0].value;
        if(password == confirmPassword) {
            firebase.auth().createUserWithEmailAndPassword(email, password).then(() => {
                firebase.auth().onAuthStateChanged(function(user) {
                    if (user) {
                        let userDoc = db.collection("users").doc(user.uid);
                        userDoc.set({
                            History: ""
                        });
                    }
                });
                form.style.display = "none";
                alert.style.display = "none";
                box.innerHTML = "<h1>You may now return to the search site.</h1> <a href='index.html'><button>Go Back</button></a>";
            }).catch(function(error) {
                alert.style.display = "block";
                alert.innerHTML = `${error.message}`;
            });
        } 
        else {
            alert.style.display = "block";
            alert.innerHTML = "Passwords don't match!";
        }
        event.preventDefault();
    }
    //                 window.location.href = "/index.html";

    form.addEventListener('submit', logSubmit);

    
});