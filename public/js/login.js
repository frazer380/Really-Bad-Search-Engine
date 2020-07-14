document.addEventListener('DOMContentLoaded', function() {
    let app = firebase.app();
    let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
    let db = firebase.firestore();
    let alert = document.getElementById("incorrect");
    alert.style.display = "none";
    function logSubmit(event) {
        alert.style.display = "none";
        let email = document.getElementById("exampleInputEmail1").value;
        let password = document.getElementById("exampleInputPassword1").value;
        firebase.auth().signInWithEmailAndPassword(email, password).then(() => {window.location.href = "/index.html";}).catch(function(error) {
            alert.style.display = "block";
            alert.innerHTML = `${error.message}`;
        });
        event.preventDefault();
    }

    const form = document.getElementById('form');
    form.addEventListener('submit', logSubmit);
});