# Aufgabe 1 — Codebasis erschließen, `CLAUDE.md` schreiben, ersten Bug fixen

| | |
|---|---|
| **Zeitbudget** | ca. 60 Minuten (15 / 25 / 20) |
| **Level** | alle |
| **Voraussetzung** | keine |

Diese Aufgabe hat drei Teile, die aufeinander aufbauen. Ihr lernt die Anwendung
kennen, haltet das Gelernte für Claude fest — und stellt dann fest, dass eine
Prüfung im Code nur halb fertig ist.

---

## Teil a — Die Anwendung kennenlernen (~15 Min)

1. Startet die App (`npm run start:dev`) und öffnet Swagger unter
   `http://localhost:3000/api`. Legt ein paar Termine an, ruft die Listen ab,
   ändert etwas per `PATCH`.
2. Beantwortet danach als Gruppe **ohne** Claude:
   - Wo liegt die Fachlogik — im Controller, im Service oder in den DTOs?
   - Warum gibt der Controller DTOs zurück und nicht die Entity?
   - Welche **drei Regeln** gelten für Termine? (Sie stehen nicht an einer Stelle
     im Code — ihr müsst sie euch zusammensuchen.)
   - Findet etwas, das die API **verspricht und nie einlösen kann**.

Wenn ihr die Fragen beantworten könnt, seid ihr bereit für Teil b.

---

## Teil b — Ein `CLAUDE.md` erzeugen und schärfen (~25 Min)

`CLAUDE.md` ist die Datei, die Claude bei jeder Sitzung in diesem Projekt
automatisch mitliest. Sie ist der wichtigste Hebel, den ihr habt: Alles, was dort
steht, muss man nicht in jedem Prompt wiederholen.

1. Führt `/init` aus. Claude sieht sich das Projekt an und schlägt ein
   `CLAUDE.md` vor.
2. **Lest das Ergebnis, bevor ihr es übernehmt.** Ein generiertes `CLAUDE.md` ist
   ein Entwurf, keine Wahrheit.
3. Bessert es nach. Drei Punkte genügen:

- [ ] **Stimmen die Kommandos?** Gleicht jedes gegen `package.json` ab. Steht
      dabei, dass `npm run lint` ein `eslint --fix` ist und Dateien umschreibt?
- [ ] **Stehen die drei Termin-Regeln aus Teil a drin** — vollständig und in
      eigenen Worten?
- [ ] **Steht drin, was man hier *nicht* tut?** Kein `DELETE`, keine neuen
      Abhängigkeiten, keine Authentifizierung.

> Merksatz für den Rest des Tages: Wenn ihr Claude dreimal dasselbe erklären
> müsst, gehört es ins `CLAUDE.md`.

---

## Teil c — Den ersten Bug fixen (~20 Min)

### Symptom reproduzieren

Legt in Swagger diesen Termin an:

```json
{ "title": "Stunde 25", "officeId": 1, "date": "2026-06-20", "startHour": 25 }
```

Er wird mit `201` angelegt. Schaut euch die Antwort an — insbesondere `endHour`.
Ruft danach `GET /offices/1/availability?date=2026-06-20` auf: Der Termin taucht
dort nirgends auf.

### Die Richtung

Probiert zum Vergleich `"startHour": 9.5`. Das wird mit `400` abgelehnt. Es gibt
also eine Prüfung — sie ist nur nicht vollständig.

Schaut euch an, **wo** `startHour` geprüft wird, und fragt euch, welche Werte die
Prüfung durchlässt, die es als Uhrzeit gar nicht gibt.

### Aufgabe

- Findet die Ursache und benennt sie in einem Satz, bevor ihr etwas ändert.
- Behebt sie so, dass `startHour: 25` mit einem `400` abgelehnt wird und
  `startHour: 9` weiterhin mit `201` durchgeht.
- Fasst die Fachregeln selbst nicht an: Ein-Stunden-Slots zur vollen Stunde
  bleiben, wie sie sind.

### Nachweis

Kein Test nötig — prüft es in Swagger:

| Request | erwartet |
|---|---|
| `POST /appointments` mit `"startHour": 25` | `400` |
| `POST /appointments` mit `"startHour": 9` | `201` |
| `npm test` | grün |

### Zusatzaufgaben, wenn ihr Zeit habt

1. **Test dazu.** Lasst Claude einen fokussierten Test in
   `src/appointments/dto/create-appointment.dto.spec.ts` schreiben — und **lest
   ihn**, bevor ihr ihn übernehmt. Prüft er wirklich das, was ihr gefixt habt?
2. **Öffnungszeiten.** Lehnt auch Termine ab, die außerhalb der Öffnungszeiten
   des Amts liegen. Überlegt dabei: Warum gehört diese Prüfung an eine andere
   Stelle als die aus der Hauptaufgabe?

---

## Abnahmekriterien

- [ ] Jede:r in der Gruppe kann erklären, wo die Fachlogik liegt und warum.
- [ ] Ein `CLAUDE.md` liegt im Projekt, ist von euch nachgebessert und hält der
      Prüfliste aus Teil b stand.
- [ ] Der Bug ist behoben, die Nachweis-Tabelle stimmt, `npm test` läuft grün.
- [ ] Ihr könnt die Ursache in einem Satz benennen.

## Bevor ihr abschließt

- **Erklären:** Kann jede:r die Änderung erklären?
- **Testen:** `npm test` — alles grün?
- **Swagger:** Wird `startHour: 25` jetzt abgelehnt?
- **Diff prüfen:** `git diff` gemeinsam lesen. Etwas Unerwartetes dabei?
      (`npm run lint` nicht beiläufig ausführen — es schreibt Dateien um.)
