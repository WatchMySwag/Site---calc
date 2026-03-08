AC Circuit App - Kalkulator Inżynierski
O projekcie
Projekt służy do obliczania parametrów obwodów prądu przemiennego. Został zbudowany w architekturze rozproszonej, aby oddzielić warstwę prezentacji od skomplikowanych obliczeń inżynierskich wykonywanych po stronie serwera.

Technologie
Java i Spring Boot: Obsługa logiki po stronie serwera oraz udostępnianie punktów końcowych API.

JavaScript: Obsługa interfejsu użytkownika i wysyłanie zapytań asynchronicznych do backendu.

Docker oraz Docker Compose: Zamykanie komponentów w izolowanych kontenerach i zarządzanie ich wspólnym uruchamianiem.

Nginx: Serwowanie plików statycznych frontendu.

Organizacja plików
backend: Zawiera kod źródłowy Javy, konfigurację Maven (pom.xml) oraz Dockerfile dla serwera aplikacji.

frontend: Zawiera plik index.html, skrypt script.js oraz Dockerfile dla serwera Nginx.

docker-compose.yml: Główny plik konfiguracyjny definiujący sposób łączenia i uruchamiania obu usług.

Instrukcja uruchomienia
Aby uruchomić projekt w środowisku lokalnym, należy posiadać zainstalowane narzędzie Docker Desktop:

Otwórz terminal w głównym katalogu projektu.

Wykonaj polecenie: docker-compose up --build

Po poprawnym uruchomieniu kontenerów aplikacja będzie dostępna w przeglądarce pod adresem: http://localhost:8080

Zdobyta wiedza
Komunikacja API: Praktyczne wykorzystanie formatu JSON do przesyłania złożonych struktur danych między Javą a JavaScriptem.

Modułowość kodu: Rozdzielenie odpowiedzialności między pliki HTML, JS i kod backendowy, co ułatwia zarządzanie projektem powyżej 500 linii kodu.

Konteneryzacja: Zarządzanie obrazami, mapowanie portów oraz konfiguracja sieci wewnętrznej między kontenerami.

Projekt traktowany trochę jako poligon do nauki
