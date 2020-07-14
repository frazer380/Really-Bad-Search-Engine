document.addEventListener('DOMContentLoaded', function() {
        
    document.getElementById("alert").style.display = "none";
    let app = firebase.app();
    let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
    let db = firebase.firestore();

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            name = user.displayName;
            email = user.email;
            photoUrl = user.photoURL;
            emailVerified = user.emailVerified;
            uid = user.uid;
            document.getElementById("submit").addEventListener("click", function(){
                document.getElementById("alert").style.display = "none";
                user.updateEmail(document.getElementById("email").value).then(function() {
                    console.log(document.getElementById("email").value)
                }).catch(function(error) {
                    document.getElementById("alert").style.display = "block";
                    document.getElementById("alert").innerHTML = error.message;
                });
                if(document.getElementById("password").value == document.getElementById("confirmPassword").value) {
                    user.updatePassword(document.getElementById("password").value).then(function() {
                        console.log("Success")
                    }).catch(function(error) {
                        document.getElementById("alert").style.display = "block";
                        document.getElementById("alert").innerHTML = error.message;

                    });
                }
            });
        } else {
            // No user is signed in.
        }
    });
});