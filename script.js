const SHEET_MEMBRES = "Membres";
const SHEET_POINTAGES = "Pointages";
const HEURE_LIMITE = "08:30";

function doGet(e) {
  const action = e.parameter.action;

  if (action === "listeMembres") {
    return listerMembres();
  }
  if (action === "arrivee") {
    return enregistrerArrivee(e.parameter.matricule);
  }
  if (action === "stats") {
    return obtenirStats();
  }

  return ContentService.createTextOutput("Action inconnue");
}

function getSheet(nom) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nom);
}

function listerMembres() {
  const sheet = getSheet(SHEET_MEMBRES);
  const data = sheet.getDataRange().getValues();
  const membres = [];
  for (let i = 1; i < data.length; i++) {
    membres.push({ matricule: data[i][0], nom: data[i][1] });
  }
  return ContentService.createTextOutput(JSON.stringify(membres))
    .setMimeType(ContentService.MimeType.JSON);
}

function trouverNom(matricule) {
  const sheet = getSheet(SHEET_MEMBRES);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === matricule) return data[i][1];
  }
  return "Inconnu";
}

function dateAujourdhui() {
  return Utilities.formatDate(new Date(), "GMT", "dd/MM/yyyy");
}

function normaliserDate(valeur) {
  if (Object.prototype.toString.call(valeur) === "[object Date]") {
    return Utilities.formatDate(valeur, "GMT", "dd/MM/yyyy");
  }
  return valeur;
}

function normaliserHeure(valeur) {
  if (Object.prototype.toString.call(valeur) === "[object Date]") {
    return Utilities.formatDate(valeur, "GMT", "HH:mm:ss");
  }
  return valeur;
}

function enregistrerArrivee(matricule) {
  const sheet = getSheet(SHEET_POINTAGES);
  const data = sheet.getDataRange().getValues();
  const aujourdhui = dateAujourdhui();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === matricule && normaliserDate(data[i][2]) === aujourdhui) {
      return ContentService.createTextOutput("DEJA_POINTE");
    }
  }

  const maintenant = new Date();
  const heureStr = Utilities.formatDate(maintenant, "GMT", "HH:mm:ss");
  const nom = trouverNom(matricule);
  const statut = heureStr > HEURE_LIMITE + ":00" ? "Retard" : "À l'heure";

  sheet.appendRow([matricule, nom, aujourdhui, heureStr, statut]);

  return ContentService.createTextOutput("Présence enregistrée|" + statut + "|" + heureStr);
}

function obtenirStats() {
  const sheet = getSheet(SHEET_POINTAGES);
  const data = sheet.getDataRange().getValues();
  const aujourdhui = dateAujourdhui();

  let presentsAujourdhui = 0;
  let retardsAujourdhui = 0;
  const historique = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const dateLigne = normaliserDate(row[2]);
    const heureLigne = normaliserHeure(row[3]);
    historique.push({
      matricule: row[0],
      nom: row[1],
      date: dateLigne,
      heure: heureLigne,
      statut: row[4]
    });
    if (dateLigne === aujourdhui) {
      presentsAujourdhui++;
      if (row[4] === "Retard") retardsAujourdhui++;
    }
  }

  historique.reverse();

  return ContentService.createTextOutput(JSON.stringify({
    presentsAujourdhui: presentsAujourdhui,
    retardsAujourdhui: retardsAujourdhui,
    historique: historique
  })).setMimeType(ContentService.MimeType.JSON);
}
