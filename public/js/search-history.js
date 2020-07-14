document.addEventListener('DOMContentLoaded', function() {
    try {
        let app = firebase.app();
        let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
        let db = firebase.firestore();
        firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                let users = db.collection("users");
                let ref = users.doc(user.uid);
                ref.get().then(function(doc) {
                    let history = doc.data().History;
                    history = history.split(",");
                    let historyDisplay =  document.getElementById("history");
                    for(i=0;i<history.length;i++) {
                        historyDisplay.innerHTML = `${historyDisplay.innerHTML} <li>${history[i]}</li>`;
                    }
                })
                } else {
                // Do nothing
                }
        });
    }
    catch(err) {
        console.log(err);
    }
});