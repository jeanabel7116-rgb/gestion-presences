function enregistrerPresence() {

    let matricule = document.getElementById("matricule").value;

    if (matricule === "") {
        document.getElementById("message").textContent =
            "Veuillez entrer votre matricule.";

        return;
    }

    let maintenant = new Date();

    let heure = maintenant.toLocaleTimeString("fr-FR");

    document.getElementById("message").textContent =
        "Présence enregistrée à " + heure;

}