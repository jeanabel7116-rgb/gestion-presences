function enregistrerPresence() {

    let matricule = document.getElementById("matricule").value.trim();
    let message = document.getElementById("message");

    if (matricule === "") {
        message.textContent = "Veuillez entrer votre matricule.";
        return;
    }

    message.textContent = "Enregistrement en cours...";

    let url = "https://script.google.com/macros/s/AKfycbzxWlsBEDujEp9qhZ7eyP9cToSbPTSGoeV2pqd_zgL0sEH1dyn8bbqlXdAJjte4-KnE/exec";

    fetch(url + "?matricule=" + encodeURIComponent(matricule))
        .then(response => response.text())
        .then(resultat => {

            if (resultat === "Présence enregistrée") {
                let maintenant = new Date();
                let heure = maintenant.toLocaleTimeString("fr-FR");

                message.textContent =
                    "✅ Présence enregistrée à " + heure;
            } else {
                message.textContent =
                    "❌ Une erreur est survenue.";
            }

        })
        .catch(erreur => {

            message.textContent =
                "❌ Impossible d'enregistrer la présence.";

            console.error(erreur);
        });
}
