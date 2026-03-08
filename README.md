# AC Circuit App - Kalkulator Inżynierski

## O projekcie
Projekt służy do obliczania parametrów obwodów prądu przemiennego. Projekt traktowany trochę jako poligon do nauki dockera, java springboot oraz API.

---

## Technologie
* **Java i Spring Boot**: Obsługa logiki po stronie serwera oraz udostępnianie punktów końcowych API.
* **JavaScript**: Obsługa interfejsu użytkownika i wysyłanie zapytań asynchronicznych do backendu.
* **Docker oraz Docker Compose**: Zamykanie komponentów w izolowanych kontenerach i zarządzanie ich wspólnym uruchamianiem.
* **Nginx**: Serwowanie plików statycznych frontendu.

---

## Wykorzystane wzory matematyczne
Aplikacja wykonuje obliczenia w oparciu o teoretyczne podstawy elektrotechniki i rachunek liczb zespolonych:

### 1. Impedancja zespolona ($Z$)
Dla szeregowego obwodu $RLC$, całkowita impedancja wyrażona jest wzorem:
$$Z = R + j\left(\omega L - \frac{1}{\omega C}\right)$$

### 2. Moduł impedancji i faza
Wartość bezwzględna impedancji oraz przesunięcie fazowe ($\phi$):
$$|Z| = \sqrt{R^2 + (X_L - X_C)^2}$$
$$\phi = \arctan\left(\frac{X_L - X_C}{R}\right)$$

---

## Organizacja plików
| Folder / Plik | Opis |
| :--- | :--- |
| **backend** | Zawiera kod źródłowy Javy, konfigurację Maven (pom.xml) oraz Dockerfile dla serwera aplikacji. |
| **frontend** | Zawiera plik index.html, skrypt script.js oraz Dockerfile dla serwera Nginx. |
| **docker-compose.yml** | Główny plik konfiguracyjny definiujący sposób łączenia i uruchamiania obu usług. |

---

## Instrukcja uruchomienia
Aby uruchomić projekt w środowisku lokalnym, należy posiadać zainstalowane narzędzie **Docker Desktop**:

1. Otwórz terminal w głównym katalogu projektu.
2. Wykonaj polecenie:
```bash
docker-compose up --build


