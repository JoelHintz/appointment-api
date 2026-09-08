# Aufgabe 1 — Codebasis erschließen, `CLAUDE.md` schreiben, ersten Bug fixen

| | |
|---|---|
| **Zeitbudget** | ca. 85 Minuten (25 / 30 / 30) |
| **Level** | alle |
| **Voraussetzung** | keine |

Diese Aufgabe hat drei Teile, die aufeinander aufbauen. Ihr lernt die Anwendung
kennen, haltet das Gelernte für Claude fest — und stellt dann fest, dass der Code
eine der Regeln, die ihr gerade aufgeschrieben habt, nicht einhält.

---

## Teil a — Die Anwendung kennenlernen (~25 Min)

1. Startet die App (`npm run start:dev`) und öffnet Swagger unter
   `http://localhost:3000/api`. Legt ein paar Termine an, ruft die Listen ab,
   ändert etwas per `PATCH`. Verschafft euch ein Gefühl dafür, was die API kann.
2. Lasst euch von Claude **einen** Endpunkt vollständig erklären, zum Beispiel:

   > Erkläre mir `@src/offices` von außen nach innen: Controller, Service, DTOs,
   > Entity und den zugehörigen Test. Was macht jede Schicht, und warum?

3. Beantwortet danach als Gruppe **ohne** Claude:
   - Wo liegt die Fachlogik — im Controller, im Service oder in den DTOs?
   - Warum gibt der Controller DTOs zurück und nicht die Entity?
   - Welche **drei Regeln** gelten für Termine? (Sie stehen nicht an einer Stelle
     im Code — ihr müsst sie euch zusammensuchen.)

Wenn ihr Frage 3 beantworten könnt, seid ihr bereit für Teil b.

---

## Teil b — Ein `CLAUDE.md` erzeugen und schärfen (~30 Min)

`CLAUDE.md` ist die Datei, die Claude bei jeder Sitzung in diesem Projekt
automatisch mitliest. Sie ist der wichtigste Hebel, den ihr habt: Alles, was dort
steht, muss man nicht in jedem Prompt wiederholen.

1. Führt `/init` aus. Claude sieht sich das Projekt an und schlägt ein
   `CLAUDE.md` vor.
2. **Lest das Ergebnis, bevor ihr es übernehmt.** Ein generiertes `CLAUDE.md` ist
   ein Entwurf, keine Wahrheit.
3. Bessert es nach. Diese Prüfliste hilft:

- [ ] **Stimmen die Kommandos?** Gleicht jedes gegen `package.json` ab. Steht
      dabei, dass `npm run lint` ein `eslint --fix` ist und Dateien umschreibt?
- [ ] **Stehen die drei Termin-Regeln aus Teil a drin** — vollständig und in
      eigenen Worten?
- [ ] **Ist die Architektur in drei bis fünf Sätzen beschrieben?** Wo sitzt die
      `ValidationPipe`, wo liegt Swagger, warum werden DTOs statt Entities
      zurückgegeben?
- [ ] **Steht drin, was man hier *nicht* tut?** Kein `DELETE`, keine neuen
      Abhängigkeiten, keine Authentifizierung.
- [ ] **Ist es kürzer als eine Bildschirmseite?** Alles, was das Verhalten von
      Claude nicht ändert, ist Ballast und verwässert den Rest.

> Merksatz für den Rest des Tages: Wenn ihr Claude dreimal dasselbe erklären
> müsst, gehört es ins `CLAUDE.md`.

---

## Teil c — Den ersten Bug fixen (~30 Min)

Eine der Regeln, die ihr gerade aufgeschrieben habt, lautet sinngemäß: **Ein Amt
darf keine zwei Termine zur selben Startzeit haben.** Der Code hält sie nicht ein.

### Symptom reproduzieren

Legt in Swagger zwei Termine für **dasselbe Amt** an:

```jsonc
// 1. Termin
{ "title": "Erster",  "officeId": 1, "startsAt": "2026-06-20T09:00:00+02:00" }

// 2. Termin
{ "title": "Zweiter", "officeId": 1, "startsAt": "2026-06-20T07:00:00.000Z" }
```

Beide werden angelegt. Ruft danach `GET /appointments` auf und schaut euch die
zwei Einträge nebeneinander an.

### Die Richtung

`2026-06-20T09:00:00+02:00` und `2026-06-20T07:00:00.000Z` bezeichnen **denselben
Zeitpunkt** — 09:00 Uhr in Mitteleuropa im Sommer ist 07:00 Uhr UTC. Das Amt hat
also zweimal dieselbe Stunde vergeben.

Der Hinweis liegt in der **Form, in der die Zeit gespeichert wird**. Vergleicht in
der Antwort das `startsAt` beider Termine mit ihrem `endsAt`. Fällt euch etwas
auf?

Schaut euch danach an, **wie** die Überschneidungsprüfung in
`src/appointments/appointments.service.ts` vergleicht.

### Aufgabe

- Findet die Ursache und benennt sie in einem Satz, bevor ihr etwas ändert.
- Behebt sie so, dass der zweite Termin mit einem `400` abgelehnt wird.
- Ergänzt mindestens einen fokussierten Unit-Test, der genau diesen Fall abdeckt.
- Fasst die Fachregeln selbst nicht an: Ein-Stunden-Slots zur vollen Stunde
  bleiben, wie sie sind.

### Wenn euch die Zeit davonläuft

Nehmt stattdessen diesen kleineren Bug — er ist in etwa 15 Minuten zu schaffen:

`POST /appointments` prüft das Feld `officeId` nicht richtig. Probiert
`officeId: "abc"`, `officeId: 0` und `officeId: -1`. Ihr bekommt einen
irreführenden `404` statt eines Validierungsfehlers. Validiert `officeId` als
positive Ganzzahl, im selben Stil wie das Feld `limit` in
`src/appointments/dto/find-appointments.dto.ts`, und korrigiert nebenbei das
falsche Swagger-Beispiel.

---

## Abnahmekriterien

- [ ] Jede:r in der Gruppe kann erklären, wo die Fachlogik liegt und warum.
- [ ] Ein `CLAUDE.md` liegt im Projekt, ist von euch nachgebessert und hält der
      Prüfliste aus Teil b stand.
- [ ] Der Bug ist behoben, `npm test` läuft grün, euer neuer Test deckt den Fall ab.
- [ ] Ihr könnt die Ursache in einem Satz benennen.

## Bevor ihr abschließt

- **Erklären:** Kann jede:r die Änderung erklären?
- **Testen:** `npm test` — alles grün?
- **Swagger:** Der doppelte Termin wird jetzt abgelehnt?
- **Diff prüfen:** `git diff` gemeinsam lesen. Etwas Unerwartetes dabei?
      (`npm run lint` nicht beiläufig ausführen — es schreibt Dateien um.)
