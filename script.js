// On cherche les dés dans le DOM puis on fait appel à la fonction de lancer pour remplacer la valeur initiale par le résultat du lancer
function lancerlesdes() {
  min = Math.ceil(1);
  max = Math.floor(6);
  return Math.floor(Math.random() * (max - min +1)) + min;
}

let DBlanc1 = document.getElementById("DBlanc1").textContent = lancerlesdes();
let DBlanc2 = document.getElementById("DBlanc2").textContent = lancerlesdes();
let DRed = document.getElementById("DRed").textContent = lancerlesdes();
let DYellow = document.getElementById("DYellow").textContent = lancerlesdes();
let DGreen = document.getElementById("DGreen").textContent = lancerlesdes();
let DBlue = document.getElementById("DBlue").textContent = lancerlesdes();

// On affiche temporairement le résultat des additions de dés
// Il suffira d'enlever la partie "= document.getElementById("ID").textContent"
function additionner(de1, de2) {
    return de1 + de2;
}

let resDBlancs = document.getElementById("DBlanc1+DBlanc2").textContent = additionner(DBlanc1, DBlanc2);
let resDRed1 = document.getElementById("DBlanc1+DRed").textContent = additionner(DBlanc1, DRed);
let resDRed2 = document.getElementById("DBlanc2+DRed").textContent = additionner(DBlanc2, DRed);
let resDYellow1 = document.getElementById("DBlanc1+DYellow").textContent = additionner(DBlanc1, DYellow);
let resDYellow2 = document.getElementById("DBlanc2+DYellow").textContent = additionner(DBlanc2, DYellow);
let resDGreen1 = document.getElementById("DBlanc1+DGreen").textContent = additionner(DBlanc1, DGreen);
let resDGreen2 = document.getElementById("DBlanc2+DGreen").textContent = additionner(DBlanc2, DGreen);
let resDBlue1 = document.getElementById("DBlanc1+DBlue").textContent = additionner(DBlanc1, DBlue);
let resDBlue2 = document.getElementById("DBlanc2+DBlue").textContent = additionner(DBlanc2, DBlue);

const resDesCouleurs = [resDRed1, resDRed2, resDYellow1, resDYellow2, resDGreen1, resDGreen2, resDBlue1, resDBlue2];

// Calcul d'éligibilité

// Pour les cases négatives : est éligible la première sans classe
let casesNegatives = Array.from(document.querySelectorAll("#moins5 td")).slice(1, 5);

for (let i = 0; i < 4; i++){
    
    let celluleFocus =
casesNegatives[i];
    let cellClass =
casesNegatives[i].className;

    if (cellClass == ""){
       celluleFocus.classList.add("casenegative");
        i = 5;
       }

        else {
            celluleFocus = celluleFocus.nextElementSibling;            
            }
}

// On crée un tableau avec toutes les cellules de la feuille de marque
let toutesLesCellulesDuTableau = Array.from(document.querySelectorAll("#feuille td")).slice(0, 48);

// On crée des tableaux pour chaque ligne
let touteLaLigneRouge = toutesLesCellulesDuTableau.slice(0, 11);
let touteLaLigneJaune = toutesLesCellulesDuTableau.slice(12, 23);
let touteLaLigneVerte = toutesLesCellulesDuTableau.slice(24, 35);
let touteLaLigneBleue = toutesLesCellulesDuTableau.slice(36, 47);

// Contrôle de l'éligibilité des dernières cases : il faut que 5 cases au moins soient cochées dans la ligne

// Calcul du nombre de cases cochées par ligne
function nombreCasesCocheesParLigne(ligne){
    let nbcasescochee = 0;
    
    for (let i = 0; i < 10; i++){

    let celluleFocus =
ligne[i];        
    let cellClass =
ligne[i].className;
    
    if (cellClass == "casecochee"){
        nbcasescochee++;
        }

        else {
            celluleFocus = celluleFocus.nextElementSibling;
            }
    };
    
    return nbcasescochee;
};

nbcaselignerouge = nombreCasesCocheesParLigne(touteLaLigneRouge);
nbcaselignejaune = nombreCasesCocheesParLigne(touteLaLigneJaune);
nbcaseligneverte = nombreCasesCocheesParLigne(touteLaLigneVerte);
nbcaselignebleue = nombreCasesCocheesParLigne(touteLaLigneBleue);

// Pour les dés blancs : on vérifie tout le tableau moins les dernières cases et on marque les cellules éligibles. 
// Condition : pas de classe sur la cellule vérifiée
function controleEligibiliteDesBlancs(ligne, nbcase){
    for (let i = 0; i < 11; i++){

        let celluleFocus =
    ligne[i];
        let cellClass =
    ligne[i].className;

        if(cellClass == "" && ligne[i].innerText == resDBlancs){
            if (i < 10){
                celluleFocus.classList.add("casepossibleDBlancs")
        }
        
            if (i == 10 && nbcase >= 5){  celluleFocus.classList.add("casepossibleDBlancs");
               }    
       }
        
            else {
                celluleFocus = celluleFocus.nextElementSibling;            
                }
}}

controleEligibiliteDesBlancs(touteLaLigneRouge, nbcaselignerouge);
controleEligibiliteDesBlancs(touteLaLigneJaune, nbcaselignejaune);
controleEligibiliteDesBlancs(touteLaLigneVerte, nbcaseligneverte);
controleEligibiliteDesBlancs(touteLaLigneBleue, nbcaselignebleue);


// Pour les combinaisons : on vérifie par ligne moins les dernières cases et on marque les cellules éligibles.
// Conditions : résultat combinaison > résultat dés blancs && pas de classe sur la cellule vérifiée
function controleEligibiliteLigneCouleur(ligne, couleurDe){

    for (let i = 0; i < 11; i++){

    let celluleFocus =
ligne[i];        
    let cellClass =
ligne[i].className;
    
    if (cellClass == ""){
        if (ligne[i].innerText == resDesCouleurs[couleurDe] || ligne[i].innerText == resDesCouleurs[couleurDe+1])
        {
            if (i < 10){celluleFocus.classList.add("casepossibleDCouleur")};
            if (i == 10 && nbcase >= 5){celluleFocus.classList.add("casepossibleDCouleur")};
        }

        else {
            celluleFocus = celluleFocus.nextElementSibling;
        }
    }
}};

controleEligibiliteLigneCouleur(touteLaLigneRouge, 0);
controleEligibiliteLigneCouleur(touteLaLigneJaune, 2);
controleEligibiliteLigneCouleur(touteLaLigneVerte, 4);
controleEligibiliteLigneCouleur(touteLaLigneBleue, 6);

//document.querySelectorAll("#feuille tr.lignerouge td").addEventListener('click', selectionner() { });