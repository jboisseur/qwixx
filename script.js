// Steps:
// #1 Set up the game: set the score to 0
// #2 Run game loop:
//    2.1 Verify wether the end of game conditions are reached
//        2.1.1 Yes: go to Step 3
//        2.1.2 No: go to Step 2.2
//    2.2 Run a list of actions:
//        2.2.1 Dices
//              2.2.1.1 Roll dices
//              2.2.1.2 Display result
//              2.2.1.3 Calculate all possible sums
//        2.2.2 Elegibility
//              2.2.2.1 Calculte authorized moves
//              2.2.2.2 Display authorized moves
//        2.2.3 Move selection
//              2.2.3.1 Calculate score-to-be
//              2.2.3.2 Display score-to-be
//              2.2.3.3 If move-to-be remaining = 1, run again the Eligibility phase
//        2.2.4 Save progress
//              2.2.4.1 No: unselect all moves and run again the Eligibility phase
//              2.2.4.2 Yes: go to step 2.2.5     
//        2.2.5 End of turn
//              2.2.4.2 Turn "move-to-be" to "move" class
//              2.2.4.2 Calculate score
//              2.2.4.3 Display score
//              2.2.4.4 If need be, update end of game conditions
// #3 End of game
//    3.1 Display final score
//    3.2 Display a play again button which triggers Step 1 when pressed

// #1
let finalScore = 0;

// #2
do... while

function lancerlesdes() {
  min = Math.ceil(1);
  max = Math.floor(6);
  return Math.floor(Math.random() * (max - min +1)) + min; 
}

function afficherde(de) {
    switch (de){
        case 1:
            char = "&#9856;";
            break;
        case 2:
            char = "&#9857;"
            break;
        case 3:
            char = "&#9858;"
            break;
        case 4:
            char = "&#9859;"
            break;
        case 5:
            char = "&#9860;"
            break;
        case 6:
            char = "&#9861;"
            break;
      }
    
      return char;
}

function additionner(de1, de2) {
    return de1 + de2;
}

let DBlanc1 = lancerlesdes();
let DBlanc2 = lancerlesdes();
let DRed = lancerlesdes();
let DYellow = lancerlesdes();
let DGreen = lancerlesdes();
let DBlue = lancerlesdes();

document.getElementById("DBlanc1").innerHTML = afficherde(DBlanc1);
document.getElementById("DBlanc2").innerHTML = afficherde(DBlanc2);
document.getElementById("DRed").innerHTML = afficherde(DRed);
document.getElementById("DYellow").innerHTML = afficherde(DYellow);
document.getElementById("DGreen").innerHTML = afficherde(DGreen);
document.getElementById("DBlue").innerHTML = afficherde(DBlue);

let resDBlancs = additionner(DBlanc1, DBlanc2);
let resDRed1 = additionner(DBlanc1, DRed);
let resDRed2 = additionner(DBlanc2, DRed);
let resDYellow1 = additionner(DBlanc1, DYellow);
let resDYellow2 = additionner(DBlanc2, DYellow);
let resDGreen1 = additionner(DBlanc1, DGreen);
let resDGreen2 = additionner(DBlanc2, DGreen);
let resDBlue1 = additionner(DBlanc1, DBlue);
let resDBlue2 = additionner(DBlanc2, DBlue);

const resDesCouleurs = [resDRed1, resDRed2, resDYellow1, resDYellow2, resDGreen1, resDGreen2, resDBlue1, resDBlue2];

let classesCasesNegatives = []
let classesDBlancs = []
let classesCombinaison = []

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
let touteLaLigneRouge = toutesLesCellulesDuTableau.slice(0, 12);
let touteLaLigneJaune = toutesLesCellulesDuTableau.slice(12, 24);
let touteLaLigneVerte = toutesLesCellulesDuTableau.slice(24, 36);
let touteLaLigneBleue = toutesLesCellulesDuTableau.slice(36, 48);

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

// Pour les dés blancs : on vérifie tout le tableau 
function controleEligibiliteDesBlancs(ligne, nbcase){
    for (let i = 0; i <= 11; i++){

        let celluleFocus =
    ligne[i];
        let cellClass =
    ligne[i].className;

        if(cellClass == "" && ligne[i].innerText == resDBlancs){
            if (i < 10){
                celluleFocus.classList.add("casepossibleDBlancs")
            }
        
            if (i == 10 && nbcase >= 5){  
                celluleFocus.classList.add("casepossibleDBlancs");
                celluleFocus.nextElementSibling.classList.add("casepossibleDBlancs");
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
let casesDBlancs = Array.from(document.getElementsByClassName("casepossibleDBlancs"));

// Pour les combinaisons : on vérifie par ligne
function controleEligibiliteLigneCouleur(ligne, couleurDe, nbcase){

    for (let i = 0; i <= 11; i++){

    let celluleFocus =
ligne[i];        
    let cellClass =
ligne[i].className;
    
    if (cellClass == ""){
        if (ligne[i].innerText == resDesCouleurs[couleurDe] || ligne[i].innerText == resDesCouleurs[couleurDe+1])
        {
            if (i < 10){celluleFocus.classList.add("casepossibleDCouleur")};
            if (i == 10 && nbcase >= 5){
                celluleFocus.classList.add("casepossibleDCouleur")
                celluleFocus.nextElementSibling.classList.add("casepossibleDCouleur");};
        }

        else {
            celluleFocus = celluleFocus.nextElementSibling;
        }
    }
}};

controleEligibiliteLigneCouleur(touteLaLigneRouge, 0, nbcaselignerouge);
controleEligibiliteLigneCouleur(touteLaLigneJaune, 2, nbcaselignejaune);
controleEligibiliteLigneCouleur(touteLaLigneVerte, 4, nbcaseligneverte);
controleEligibiliteLigneCouleur(touteLaLigneBleue, 6, nbcaselignebleue);
let casesCombinaison = Array.from(document.getElementsByClassName("casepossibleDCouleur"));

// On fait une photo des cases éligibles au cas où le bouton "Changer d'avis" est cliqué
let casesEligibles = Array.from(document.querySelectorAll(".casenegative, .casepossibleDBlancs, .casepossibleDCouleur"));
let classesCasesEligible = []

// parcourir le tableau casesEligibles pour récupérer les classes et les push il faut faire un tableau avec toutes les classes AS
for (let i of casesEligibles) {
    classesCasesEligible.push(i.className);
    };

let casesEligiblesNS = casesEligibles;


// Fonction qui autorise le clic le bouton de validation et d'annulation
let bouttons = document.getElementsByTagName("input");
function ValiderOuAnnuler(){    
    for (let i of bouttons) {
            i.disabled = false;
            };
    };

// Fonction qui interdit le clic sur le bouton de validation et d'annulation
function desactiverValiderOuAnnuler(){    
    for (let i of bouttons) {
            i.disabled = true;
            };
    };

// Fonction qui vérifie si une case peut être sélectionnée
function caseSelectionnable(element){
    if(classesCasesNegatives.includes("caseselectionnee")){
        return false
    }

    if(classesDBlancs.includes("caseselectionnee") && classesCombinaison.includes("caseselectionnee")){
        return false
    }

    if(classesDBlancs.includes("caseselectionnee")){

        if (element.className == "casepossibleDBlancs" || element.className == "casenegative"){
            return false
        }

        if (element.className == "casepossibleDCouleur"){

            let toutesLesCasesDeLaLigne = element.parentNode.children;
            let indiceCaseSelectionnee = element.cellIndex;

            for (let i = 0; i < 11; i++){
                if (toutesLesCasesDeLaLigne.item(i).attributes.class != undefined) {                         
                    if (toutesLesCasesDeLaLigne.item(i).attributes.class.value == "caseselectionnee"){
                        if(indiceCaseSelectionnee < i){
                            return false
                        }                        
                    }
                }
            }
            }
        }

    if(classesCombinaison.includes("caseselectionnee")){
        if (element.className == "casepossibleDCouleur" | element.className == "casenegative"){
            return false
        }

        if (element.className == "casepossibleDBlancs"){
            toutesLesCasesDeLaLigne = element.parentNode.children;
            indiceCaseSelectionnee = element.cellIndex;

            for (let i = 0; i < 11; i++){
                if (toutesLesCasesDeLaLigne.item(i).attributes.class != undefined) {  
                    if (toutesLesCasesDeLaLigne.item(i).attributes.class.value == "caseselectionnee"){
                            if (indiceCaseSelectionnee > i){
                            return false
                        }                                     
                    }

                    else{
                        return true
                    }
                }
            }
        }
    }

   else{
        return true
    }
    };

// Fonction qui sélectionne une case et qui permet le clic sur les boutons de validation ou d'annulation
function selectionnerUneCase(element, ancienneclasse){
        if(caseSelectionnable(element) == true){
            element.classList.remove();
            element.classList.replace(ancienneclasse, "caseselectionnee");
            // si l'élément est le dernier de la liste, on coche aussi le NextElementSibling (= cadenas)
            if(element.cellIndex == 10){
                element.classList.remove();
                element.nextElementSibling.classList.replace(ancienneclasse, "caseselectionnee");
            }            

            // On construit 1 par 1 les arrays de classes après calcul d'éligibilité, mais ça pourrait être une fonction à part...
            for (let i of casesNegatives) {
                classesCasesNegatives.push(i.className);
                };
            
            for (let i of casesDBlancs) {
                classesDBlancs.push(i.className);
                };
            
            for (let i of casesCombinaison) {
                classesCombinaison.push(i.className);
                };                     

            ValiderOuAnnuler();      
            }
        };

// Boucle pour écouter les événements sur chacune des cases éligibles
for (let i of casesEligiblesNS){    
        let cellClass = i.className;
        i.addEventListener("click", function(){
        selectionnerUneCase(i, cellClass);
                })
        };

// Fonction qui permet de remettre l'array à l'état initial
function retourArriere(element, nouvelleclasse){
    element.classList.replace("caseselectionnee", nouvelleclasse);
    desactiverValiderOuAnnuler()
};

bouttons[1].addEventListener("click", function(){
    let j = 0;
    classesCasesNegatives = [];
    classesDBlancs = [];
    classesCombinaison = [];
    for (let i of casesEligibles) {
        let cellClass = classesCasesEligible[j];
        retourArriere(i, cellClass);
        j++
        }
    });