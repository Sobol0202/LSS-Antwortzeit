// ==UserScript==
// @name         LSS Antwortzeit
// @namespace    www.leitstellenspiel.de
// @version      0.4
// @description  Zeigt die Serverantwortzeit an
// @author       MissSobol
// @match        https://www.leitstellenspiel.de/
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    // Finde das HTML-Element mit der ID "content"
    const contentElement = document.getElementById('content');

    // Überprüfe, ob das Element gefunden wurde
    if (!contentElement) {
        console.error('Element mit der ID "content" wurde nicht gefunden');
        return;
    }

    // Erstelle ein Inline-Element für die Anzeige der Antwortzeit
    const responseDisplay = document.createElement('span');
    responseDisplay.style.display = 'inline-block';
    contentElement.appendChild(responseDisplay);

    // Erstelle ein Inline-Element für die Anzeige des Countdowns
    const countdownDisplay = document.createElement('span');
    countdownDisplay.style.display = 'inline-block';
    countdownDisplay.style.marginLeft = '10px';
    contentElement.appendChild(countdownDisplay);

    // Funktion zum Senden einer Anfrage und Aktualisierung der Antwortzeit-Anzeige
    function sendRequest() {
        const startTime = new Date().getTime();

        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://www.leitstellenspiel.de/profile/1',
            onload: function(response) {
                const endTime = new Date().getTime();
                const responseTime = endTime - startTime;
                responseDisplay.textContent = `Antwortzeit: ${responseTime} ms`;
            },
            onerror: function(error) {
                console.error('Fehler:', error);
                responseDisplay.textContent = 'Fehler beim Abrufen der Daten';
            }
        });
    }

    // Funktion zum Aktualisieren der Countdown-Anzeige
    function updateCountdown(seconds) {
        countdownDisplay.textContent = `Nächste Messung in: ${seconds} Sekunden`;
    }

    // Funktion zum Starten des Countdowns
    function startCountdown(seconds) {
        let remainingSeconds = seconds;
        updateCountdown(remainingSeconds);

        // Intervall für den Countdown
        const countdownInterval = setInterval(function() {
            remainingSeconds--;
            updateCountdown(remainingSeconds);

            // Wenn der Countdown abgelaufen ist, sende eine Anfrage und starte den Countdown erneut
            if (remainingSeconds <= 0) {
                clearInterval(countdownInterval);
                sendRequest();
                startCountdown(seconds);
            }
        }, 1000);
    }

    // Initialisierung: Sende eine Anfrage und starte den Countdown
    sendRequest();
    startCountdown(300); // 5 Minuten

})();
