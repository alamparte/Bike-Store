'use strict';
//////////////////// ELEMENTE IM HTML ERSTELLEN//////////////////////

// INPUT daten erstellen
let datenInput = function () {
  // das Vater Element kreieren
  let div = document.createElement('div');
  div.classList.add('dat');

  div.innerHTML += ` <label>Abholdatum</label>
                     <input type="date" name="start" id="start" class="datum"/>
                     <label>Rückgabedatum</label>
                     <input type="date" id="end" name="end" class="datum"/> `;
  // Element im HTML verbinden
  document.getElementById('daten').append(div);
};
//Array von Artikel und Preise
const infoOptions = [
  ['E-Tourenbike', '45'],
  ['E-Roadbike', '39'],
  ['E-Mountainbike', '51'],
  ['E-Mountainbike Kinder', '30'],
  ['Tourenbike', '16'],
];
// SELECT options erstellen
let options = function () {
  // das Vater Element kreieren
  let select = document.createElement('select');
  select.setAttribute('name', 'bikes');

  select.innerHTML +=
    // die erste 'disabled' Option erstellen
    '<option value="0" class="opt" data-price="0" disabled selected>Wähle dein Bike</option>';
  // die restlichen Optionen mit einer Schleife erstellen
  for (let i = 0; i < infoOptions.length; i++) {
    select.innerHTML += ` <option value="${infoOptions[i][0]}" data-price="${infoOptions[i][1]}">${infoOptions[i][0]}</option> `;
  }
  // Element im HTML verbinden
  document.getElementById('bikes').append(select);
};
//Array von Zubehör Element und Preise
const checkInfo = [
  ['Rad Versicherung', 9, 'vs', './img/Versicherung.jpg', 'Rad Versicherung (9€ pro Tag)'],
  ['GPS Garmin', 8, 'gps', './img/gps.jpg', 'GPS Garmin (8€ pro Tag)'],
  ['Reparatur Kit', 3, 'rkit', './img/ReparaturKit..jpg', 'Reparatur Kit (3€ pro Tag)'],
  ['Helm', 11, 'helm', './img/helm.jpg', 'Helm (11€ pro Tag)'],
];
// INPUT checkbox erstellen
let inputCheckbox = function () {
  // DIV Vater von checkboxes erstellen
  let div = document.createElement('div');
  div.classList.add('checkCards');
  // jede input und label mit einer Schleife erstellen
  for (let i = 0; i < checkInfo.length; i++) {
    div.innerHTML += `  <div class="checkCard">
                          <input type="checkbox" name="extra" value="${checkInfo[i][1]}" data-name="${checkInfo[i][0]}" data-price="${checkInfo[i][1]}" id="${checkInfo[i][2]}" />
                          <img src="${checkInfo[i][3]}" alt="${checkInfo[i][0]}" />
                          <label for="${checkInfo[i][2]}">${checkInfo[i][4]}</label>
                        </div> `;
  }
  // Element im HTML verbinden
  document.getElementById('add').append(div);
};
//Aufruf der Funktionen
datenInput();
options();
inputCheckbox();


///////////////////RECHNEN DIE GESAMTSUMME//////////////////////

//input daten Elemente erfassen
const start = document.bikestore.start;
const end = document.bikestore.end;
//min today date
let today = new Date().toISOString().substring(0, 10);
document.getElementById('start').value = today;
document.getElementById('start').min = today;
//min tomorrow date
let tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow = tomorrow.toISOString().substring(0, 10);
document.getElementById('end').min = tomorrow;

// select Element erfassen
const select = document.bikestore.bikes;
// input checkbox Elemente erfassen
const checkBoxes = document.querySelectorAll('input[type="checkbox"]');
// aside Elemente erfassen
// Tage Differenz
const spanDiffDay = document.querySelector('#diffDay');
const spanTagName = document.querySelector('#tag');
// ausgewähltes Rad + Preis
const spanbikeName = document.querySelector('#bikeName');
const spanbikePreis = document.querySelector('#bikePreis');
// ausgewähltes Zubehör + Preis
const section = document.querySelector('#zubehoer');
// Rabatt info
const rabattText = document.querySelector('#rabattText');
const rabatt = document.querySelector('#rabatt');
// GesamtSumme info
const summeText = document.querySelector('#summeText');
const totalInfo = document.querySelector('#gesamtSumme');

//gesamtsumme Funktion
let getTotal = function () {
  let differenceDays = 0;
  let checkBoxValue = 0;
  let selectValue = 0;

  //Tage Differenz rechnen
  let getdifferenceDays = function () {
    const startDate = new Date(start.value);
    const endDate = new Date(end.value);
    //endDate nachprüfen
    if (endDate > startDate) {
      let timediff = Math.abs(endDate - startDate);
      // Ergebnis in Variable speichern
      differenceDays = Math.round(timediff / (1000 * 3600 * 24));
      // Tage Differenz auf dem Aside Element zeigen
      spanDiffDay.textContent = differenceDays;
      spanTagName.textContent = `${differenceDays == 1 ? ' Tag' : ' Tage'}`;
      //warning Text erstellen
      start.parentElement.parentElement.nextElementSibling.textContent = '';
    } else {
      //warning Text erstellen
      start.parentElement.parentElement.nextElementSibling.textContent =
        '*das Rückgabedatum darf nicht vor oder gleich dem Abholdatum liegen';
      // Tage Differenz zeigen auf dem Aside Element
      spanDiffDay.textContent = 0;
      spanTagName.textContent = 'Tag';
    }
  };
  //selected Option value erfassen
  let getSelectValue = function () {
      // Ergebnis in Variable speichern
    select.options[select.selectedIndex]
      ? (selectValue += parseInt(
          select.options[select.selectedIndex].getAttribute('data-price')
        ))
      : 0;
    // das ausgewählte Element auf dem Aside Element zeigen
    if (select.value == 0) {
      spanbikeName.textContent = 'kein Rad ausgewählt';
    } else {
      spanbikeName.textContent = select.options[select.selectedIndex].value;
      spanbikePreis.textContent = `
        ${select.options[select.selectedIndex].getAttribute('data-price')} €`;
    }
  };
  //checkbox value erfassen
  let getCheckBoxValue = function () {
    // Variable für das ausgewählte Name/Preis Element
    let showNamePreis = '';

    for (let i = 0; i < checkBoxes.length; i++) {
      if (checkBoxes[i].checked) {
      // Ergebnis in Variable speichern
        checkBoxValue += parseInt(checkBoxes[i].value);

        // in der Variable speichern
        showNamePreis += ` 
                            <span>${checkBoxes[i].getAttribute(
                              'data-name'
                            )}</span> 
                            <span>${checkBoxes[i].value} €</span> 
                          `;
      }
    }
    // das ausgewählte Element auf dem Aside Element zeigen
    section.innerHTML = showNamePreis;
  };
  // Aufruf der Fuktionen
  getdifferenceDays();
  getSelectValue();
  getCheckBoxValue();

  // Gesamtsumme ausrechnen
  let totalPrice = differenceDays * (selectValue + checkBoxValue);

  // Ermäßigung ausrechnen
  if (differenceDays >= 5) {
    let desc = parseFloat(totalPrice * 0.1).toFixed(2);
    let descReform = desc.replace('.', ',');
    // Rabatt auf dem Aside Element zeigen
    rabattText.textContent = 'Rabatt:';
    rabatt.textContent = `${descReform} €`;
    // Gesamtsumme auf dem Aside Element zeigen
    summeText.textContent = 'Gesamtsumme:';
    let priseMitDesc = parseFloat(totalPrice - desc).toFixed(2);
    let totalReform = priseMitDesc.replace('.', ',');
    totalInfo.textContent = `${totalReform} €`;
  } else {
    // Rabatt auf dem Aside Element zeigen
    rabattText.textContent = 'Rabatt:';
    rabatt.textContent = `${0} €`;
    // Gesamtsumme auf dem Aside Element zeigen
    summeText.textContent = 'Gesamtsumme:';
    totalInfo.textContent = `${totalPrice} €`;
  }
};

//Event
start.addEventListener('change', getTotal);
end.addEventListener('change', getTotal);
select.addEventListener('change', getTotal);
checkBoxes.forEach(e => {
  e.addEventListener('click', getTotal);
});