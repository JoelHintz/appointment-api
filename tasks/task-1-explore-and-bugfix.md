# Aufgabe 1: Codebasis erschließen, `CLAUDE.md` schreiben, ersten Bug fixen

## Ziel

Ihr erschließt eine fremde Anwendung mit Claude Code, haltet das Ergebnis in
einem `CLAUDE.md` fest und behebt damit einen Fehler in der Validierung.

## Teil a: Die Anwendung erschließen

### 1. Verhalten, ohne Claude

Startet die Anwendung mit `npm run start:dev` und öffnet Swagger unter
`http://localhost:3000/api`. Legt Termine an, ruft die Listen ab, ändert einen
per `PATCH`, bucht denselben Slot zweimal. Lest noch nichts im Code nach.

### 2. Code, mit Claude

Erkundet mit Claude, wie das Projekt gebaut ist. Am wichtigsten sind diese drei
Fragen:

- **Module:** Woraus besteht ein Feature-Modul, und wie erfährt die Anwendung
  davon?
- **Validierung:** Wo wird eine eingehende Anfrage geprüft? Was prüft das DTO,
  was der Service?
- **Transportobjekte:** Warum gibt der Controller ein DTO zurück und nicht die
  Entity? Wo wird umgewandelt?

Danach, soweit die Zeit reicht: Wie heißen neue Dateien, und wo liegen sie? Wie
hängen `Appointment` und `Office` zusammen? Woher kommen die drei Ämter, und
warum sind sie nach einem Neustart nicht doppelt da? Was ist getestet, was
nicht?

**Beispielprompt.**

> In diesem NestJS-Projekt kenne ich mich noch nicht aus. Sieh dir
> `@src/appointments/` an und erkläre mir in wenigen Sätzen, welchen Weg eine
> eingehende `POST /appointments`-Anfrage nimmt, und nenne zu jedem Schritt die
> Datei. Ändere nichts.

Brauchbar machen ihn die `@`-Referenz, eine konkrete Frage statt „erklär mir
alles“, die Bitte um die Datei und „ändere nichts“.

### 3. Zum Abschluss, ohne Claude

- Wo liegt die Fachlogik: im Controller, im Service oder in den DTOs?
- Wo im Code wird jede der drei Regeln aus `TASK.md` durchgesetzt?

## Teil b: Euer `CLAUDE.md`

`CLAUDE.md` liest Claude in diesem Projekt bei jeder Sitzung automatisch mit.
Was dort steht, muss man nicht in jedem Prompt wiederholen.

### 1. Erste Fassung, von euch

Legt `CLAUDE.md` im Wurzelverzeichnis an, mit diesen sechs Überschriften:

- **Projekt**
- **Architektur**: 3–5 Sätze
- **Fachregeln**: die drei Termin-Regeln in euren Worten
- **Konventionen**
- **Kommandos**: gegen `package.json` abgeglichen, mit dem Hinweis, dass
  `npm run lint` Dateien umschreibt
- **Was hier nicht getan wird**: kein `DELETE`, keine neuen Abhängigkeiten,
  keine Authentifizierung

Eine Bildschirmseite genügt. Schreibt den Text selbst, auch wenn sich so eine
Datei erzeugen ließe: Was ihr in Teil a über das Verhalten der Anwendung gelernt
habt, steht in keinem generierten Text. Wenn ihr nicht weiterkommt, hilft **Hinweis A** im Anhang.

### 2. Claude als Prüfer

Formuliert einen Prompt, der sinngemäß fragt:

> Lies mein `CLAUDE.md` und danach den Code. Was darin stimmt nicht mit dem
> Projekt überein? Was fehlt dir, wenn du gleich etwas an den Terminen ändern
> sollst?

Prüft jeden Vorschlag, bevor ihr ihn in euer `CLAUDE.md` übernehmt.

Faustregel für den Rest des Tages: Was ihr Claude dreimal erklärt, gehört ins
`CLAUDE.md`.

## Teil c: Härtetest

### 1. Funde sammeln, Claude nur lesend

Sucht in Swagger nach Eingaben, die die API **annimmt, obwohl es sie fachlich
nicht gibt**. Claude darf beim Suchen helfen.

Haltet die Funde stichwortartig fest:

| Request | erwartet | tatsächlich |
|---|---|---|
| | | |

Es gibt mindestens vier. Wenn ihr nicht weiterkommt: **Hinweis B** im Anhang,
danach **Hinweis C**.

### 2. Fix

Wählt unter euren Funden den mit der unangenehmsten Auswirkung. Benennt seine
Ursache in einem Satz, bevor ihr etwas ändert, und behebt sie an der Stelle, an
der diese Art Regel hingehört (siehe Teil a).

## Abnahmekriterien

- [ ] Euer selbst geschriebenes `CLAUDE.md` hat die sechs Abschnitte aus
      Teil b.
- [ ] Einer eurer Funde ist behoben und in Swagger nachgeprüft, der `git diff`
      ist gemeinsam gelesen.
- [ ] Jede:r kann die Ursache in einem Satz benennen und sagen, wo die Fachlogik
      liegt.

## Zusatzaufgaben

1. **Test:** einen Test zu eurem Fix schreiben lassen und lesen. Schlägt er
   fehl, wenn ihr den Fix zurücknehmt?
2. **`CLAUDE.md` erproben:** frische Sitzung (`/clear`), dann eine Frage, die
   nur mit Projektwissen richtig zu beantworten ist, etwa: „Gehört eine neue
   Fachregel ins DTO oder in den Service, und warum?“ Passt die Antwort zu
   eurem `CLAUDE.md`?
3. **Zweiter Fix:** einen weiteren Fund aus eurer Tabelle beheben. Entscheidet
   vorher: DTO oder Service? Greift euer Fix auch bei `PATCH`?

---

## Anhang: Hinweise

**A: Teil b, wenn die erste Fassung nicht zustande kommt.** `/init` klopft das
Projekt ab und schlägt ein `CLAUDE.md` vor. Sichert eine angefangene Fassung
vorher, denn `/init` überarbeitet eine vorhandene Datei, und lest das Ergebnis
Zeile für Zeile: Es ist ein Entwurf und kennt nichts aus Teil a.

**B: Teil c, wenn die Tabelle leer bleibt.** Was die API annimmt, legen die
DTOs fest, hier vor allem `src/appointments/dto/`. Nehmt ein Feld nach dem
anderen und fragt: Welche Werte lässt die Prüfung durch, die es fachlich nicht
gibt? Probiert die Kandidaten in Swagger aus.

**C: Teil c, wenn ihr danach immer noch keinen Fund habt.** Legt
`{ "title": "Stunde 25", "officeId": 1, "date": "2027-06-20", "startHour": 25 }`
an: Das ergibt `201`. Schaut auf `endHour` in der Antwort und überlegt, welche
Uhrzeit das sein soll. Schickt denselben Request danach ein zweites Mal: Er
wird als Doppelbuchung abgelehnt, die Stunde 25 ist also wirklich belegt. Zum
Vergleich wird `"startHour": 9.5` mit `400` abgelehnt: Es gibt eine Prüfung, sie
ist nur nicht vollständig.
