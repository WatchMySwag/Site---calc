// ==========================================
// 1. STAN APLIKACJI (Global State)
// ==========================================
let magazynElementow = [];
let licznikR = 1, licznikL = 1, licznikC = 1, licznikZ = 1;
let rozmiar = 2; // Rozmiar macierzy dla sceny Matma

// ==========================================
// 2. NAWIGACJA I UI
// ==========================================
function zmienScene(id) {
    document.getElementById('scena-matma').classList.add('hidden');
    document.getElementById('scena-elektro').classList.add('hidden');
    document.getElementById(id).classList.remove('hidden');
}

// ==========================================
// 3. MODUŁ API (Komunikacja z Java Spring Boot)
// ==========================================

// Obliczanie mocy czynnej/biernej przez Backend
async function obliczMocAPI() {
    const u = document.getElementById('input-u').value.replace(',', '.');
    const i = document.getElementById('input-i-api').value.replace(',', '.');
    const apiDisplay = document.getElementById('wynik-api-box');

    apiDisplay.innerText = "Łączenie z kontenerem Java...";

    try {
        const response = await fetch(`http://localhost:8081/api/power?voltage=${u}&current=${i}`);
        if (!response.ok) throw new Error("Błąd połączenia z API");

        const data = await response.json();
        apiDisplay.innerHTML = `
            <div style="border: 1px solid #bee5eb; padding: 10px; border-radius: 5px; background: #e3f2fd;">
                🚀 Wynik z Backend (Java): ${data.power} ${data.unit}<br>
                <small style="color: #666;">Status: ${data.message}</small>
            </div>
        `;
    } catch (error) {
        apiDisplay.innerHTML = `<span style="color: red;">Błąd API: Upewnij się, że kontener Java działa!</span>`;
        console.error("Szczegóły błędu:", error);
    }
}

// Połączenie równoległe wielu elementów przez POST JSON
async function polaczRownolegleMultiAPI() {
    let idxs = pobierzWybrane();
    if (idxs.length < 2) return alert("Zaznacz min. 2 elementy!");

    const payload = idxs.map(i => ({
        re: magazynElementow[i].re,
        im: magazynElementow[i].im
    }));

    try {
        const response = await fetch('http://localhost:8081/api/parallel-multi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Błąd API");
        const data = await response.json();

        aktualizujMagazynPoPolaczeniu(idxs, "Z_row_multi", data);
    } catch (error) {
        alert("Błąd: " + error.message);
    }
}

// Połączenie szeregowe przez POST JSON
async function polaczSzeregowoAPI() {
    let idxs = pobierzWybrane();
    if (idxs.length < 2) return alert("Zaznacz min. 2 elementy!");

    const payload = idxs.map(i => ({
        re: magazynElementow[i].re,
        im: magazynElementow[i].im
    }));

    try {
        const response = await fetch('http://localhost:8081/api/series', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Błąd Backend");
        const data = await response.json();

        aktualizujMagazynPoPolaczeniu(idxs, "Z_sz_API", data);
    } catch (error) {
        alert("Błąd połączenia: " + error.message);
    }
}

// ==========================================
// 4. ZARZĄDZANIE MAGAZYNEM (Logistyka)
// ==========================================

function dodajDoMagazynu(nazwa, re, im) {
    magazynElementow.push({ nazwa, re, im });
    renderujTabele();
}

function aktualizujMagazynPoPolaczeniu(idxs, prefix, data) {
    let nowaNazwa = prefix + "_" + licznikZ++ + "(" + idxs.length + " el.)";
    idxs.sort((a, b) => b - a).forEach(i => magazynElementow.splice(i, 1));
    magazynElementow.push({
        nazwa: nowaNazwa,
        re: data.re,
        im: data.im
    });
    renderujTabele();
}

function renderujTabele() {
    let tbody = document.getElementById('magazyn-body');
    let infoMoc = document.getElementById('info-moc');
    if (!tbody) return;

    tbody.innerHTML = "";
    magazynElementow.forEach((el, index) => {
        let czyOstatni = (index === magazynElementow.length - 1);
        let stylOstatni = czyOstatni ? 'style="background-color: #e8f5e9; font-weight: bold; color: #2e7d32;"' : '';

        tbody.innerHTML += `
            <tr ${stylOstatni}>
                <td><input type="checkbox" class="element-checkbox" data-index="${index}"></td>
                <td>${el.nazwa} ${czyOstatni ? " ⚡" : ""}</td>
                <td>${el.re.toFixed(2)} ${el.im >= 0 ? "+" : ""} ${el.im.toFixed(2)}j Ω</td>
                <td><button onclick="usunElement(${index})">Usuń</button></td>
            </tr>`;
    });

    if (infoMoc) {
        infoMoc.innerText = magazynElementow.length > 0 
            ? "Moc zostanie policzona dla: " + magazynElementow[magazynElementow.length - 1].nazwa 
            : "Dodaj elementy, aby liczyć moc";
    }
}

function usunElement(idx) {
    magazynElementow.splice(idx, 1);
    renderujTabele();
}

function wyczyscMagazyn() {
    if (confirm("Wyczyścić całą listę?")) {
        magazynElementow = [];
        renderujTabele();
        document.getElementById('raport-wynik').innerText = "";
    }
}

function pobierzWybrane() {
    const wybrane = document.querySelectorAll('.element-checkbox:checked');
    return Array.from(wybrane).map(cb => parseInt(cb.getAttribute('data-index')));
}

// ==========================================
// 5. OBLICZENIA LOKALNE (Elektrotechnika)
// ==========================================

function obliczR() {
    let val = document.getElementById('input-r').value.replace(',', '.');
    let mult = parseFloat(document.getElementById('unit-r').value);
    let R = parseFloat(val) * mult;
    if (isNaN(R)) return alert("Wpisz poprawną wartość!");

    let wpisanaNazwa = document.getElementById('nazwa-r').value.trim();
    let nazwaFinalna = wpisanaNazwa !== "" ? wpisanaNazwa : "Rezystor " + licznikR++;
    document.getElementById('wynik-r').innerText = R.toFixed(2) + " Ω";
    dodajDoMagazynu(nazwaFinalna, R, 0);
}

function obliczL() {
    // 1. Pobieramy wartości pól, które ISTNIEJĄ w Twoim nowym HTML
    const valInput = document.getElementById('input-l');
    const fInput = document.getElementById('input-f-l');
    const unitLSelect = document.getElementById('unit-l');

    const L = parseFloat(valInput.value.replace(',', '.')) * parseFloat(unitLSelect.value);
    const f = parseFloat(fInput.value.replace(',', '.')); // Tu usunąłem mnożnik jednostki f!

    if (isNaN(L) || isNaN(f)) return alert("Błędne dane dla cewki!");

    const xl = 2 * Math.PI * f * L;
    const wpisanaNazwa = document.getElementById('nazwa-l').value.trim();
    
    // Dodajemy do tabeli
    dodajDoMagazynu(wpisanaNazwa || "Cewka " + licznikL++, 0, xl);
    document.getElementById('wynik-l').innerText = "j" + xl.toFixed(2) + " Ω";
}

function obliczC() {
    const valInput = document.getElementById('input-c');
    const fInput = document.getElementById('input-f-c');
    const unitCSelect = document.getElementById('unit-c');

    const C = parseFloat(valInput.value.replace(',', '.')) * parseFloat(unitCSelect.value);
    const f = parseFloat(fInput.value.replace(',', '.')); // Tu usunąłem mnożnik jednostki f!

    if (isNaN(C) || isNaN(f) || f === 0) return alert("Błędne dane dla kondensatora!");

    const xc = -1 / (2 * Math.PI * f * C);
    const wpisanaNazwa = document.getElementById('nazwa-c').value.trim();

    // Dodajemy do tabeli
    dodajDoMagazynu(wpisanaNazwa || "Kondensator " + licznikC++, 0, xc);
    document.getElementById('wynik-c').innerText = xc.toFixed(2) + "j Ω";
}
function obliczRezonansManual() {
    let L = parseFloat(document.getElementById('res-l').value.replace(',', '.')) * parseFloat(document.getElementById('res-unit-l').value);
    let C = parseFloat(document.getElementById('res-c').value.replace(',', '.')) * parseFloat(document.getElementById('res-unit-c').value);

    if (isNaN(L) || isNaN(C) || L <= 0 || C <= 0) return alert("Wpisz dodatnie wartości!");
    let f0 = 1 / (2 * Math.PI * Math.sqrt(L * C));
    
    let res = f0 > 1000000 ? (f0/1000000).toFixed(3) + " MHz" : (f0 > 1000 ? (f0/1000).toFixed(3) + " kHz" : f0.toFixed(2) + " Hz");
    document.getElementById('wynik-rezonans-manual').innerText = "Wynik f0: " + res;
}

// ==========================================
// 6. MODUŁ MATEMATYCZNY (Macierze i Wyrażenia)
// ==========================================

function obliczTo() {
    let wyrazenie = document.getElementById('input-wyrazenie').value;
    let miejsceNaWynik = document.getElementById('wynik-tekst');
    try {
        let wynik = math.evaluate(wyrazenie.replace(/j/g, 'i'));
        let modul = math.abs(wynik);
        let katDeg = math.arg(wynik) * (180 / Math.PI);
        miejsceNaWynik.innerHTML = `Postać prostokątna: ${math.format(wynik, { fraction: 'fraction' })}<br>Polarna: ${modul.toFixed(2)} ∠ ${katDeg.toFixed(2)}°`;
    } catch (e) { miejsceNaWynik.innerText = "Błąd w zapisie!"; }
}

function generujPola() {
    let div = document.getElementById('kontener-macierzy');
    let tabela = "<table>";
    for (let i = 0; i < rozmiar; i++) {
        tabela += "<tr>";
        for (let j = 0; j < rozmiar; j++) tabela += `<td><input type="text" id="a_${i}_${j}" style="width: 50px;"></td>`;
        tabela += `<td> = </td><td><input type="text" id="b_${i}" style="width: 50px;"></td></tr>`;
    }
    div.innerHTML = tabela + "</table>";
}

function rozwiazUklad() {
    try {
        let A = [], B = [];
        for (let i = 0; i < rozmiar; i++) {
            let wiersz = [];
            for (let j = 0; j < rozmiar; j++) wiersz.push(math.evaluate(document.getElementById(`a_${i}_${j}`).value.replace(/j/g, 'i') || "0"));
            A.push(wiersz);
            B.push([math.evaluate(document.getElementById(`b_${i}`).value.replace(/j/g, 'i') || "0")]);
        }
        let X = math.lusolve(A, B);
        document.getElementById('wynik-macierz-tekst').innerHTML = X.map((x, i) => `x${i+1} = ${x[0].toString()}`).join("<br>");
    } catch (e) { alert("Błąd w macierzy!"); }
}

function przelaczRozmiar() {
    rozmiar = (rozmiar === 2) ? 3 : 2;
    document.getElementById('btn-rozmiar').innerText = (rozmiar === 2) ? "Zmień na 3x3" : "Wróć do 2x2";
    generujPola();
}

// Inicjalizacja macierzy na starcie
window.onload = generujPola;