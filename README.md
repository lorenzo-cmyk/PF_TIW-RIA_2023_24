# Progetto per Tecnologie Informatiche per il Web (Versione RIA) - A.A. 2023/2024

- Scadenza: 2024-09-01
- Voto: 30/30

# Descrizione

Questa applicazione è il corrispettivo RIA del software [PF_TIW-HTML_2023_24](https://github.com/lorenzo-cmyk/PF_TIW-HTML_2023_24).

La webapp è implementata come single-page application, eliminando il ricaricamento completo della pagina e gestendo le interazioni tramite chiamate asincrone. Sono stati aggiunti pulsanti per la creazione di sottocartelle e documenti direttamente dalla Home Page e una cartella "Cestino" per eliminare file e cartelle tramite drag and drop con conferma. Lo spostamento dei documenti avviene anch'esso tramite drag and drop, con una finestra modale che consente la selezione della cartella di destinazione.

# Compilazione

Il progetto è gestito tramite Maven; per compilare il file WAR è sufficiente eseguire:

```bash
mvn clean package
```

Per eseguire l'intero stack applicativo è possibile sfruttare Docker:

```bash
docker-compose up
```

Per compilare in formato PDF la documentazione:

```bash
cd docs
pdflatex -shell-escape main.tex
```
