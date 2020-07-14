document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("alert").style.display = "none";
    let app = firebase.app();
    let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
    let db = firebase.firestore();

    
    function deleteAccount() {
        firebase.auth().onAuthStateChanged(function(user) {
            db.collection("users").doc(user.uid).delete().then(() => {
                user.delete().then(function() {
                    document.getElementById("jumbotron").innerHTML = "<h1>Account Deleted!</h1>";
                }).catch(function(error) {
                    document.getElementById("jumbotron").innerHTML = `<h1>${error.message}</h1>`;
                });
                }).catch(error => {
                    console.log(error);
            })

        });
    }

    document.getElementById("delete").addEventListener("click", deleteAccount());
})