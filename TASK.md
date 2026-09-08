# Workshop-Aufgaben: Appointment API

## Worum es geht

Dieses Projekt ist eine kleine **NestJS**-Termin-API im Behördenkontext. Sie
verwaltet bereits **Ämter** (`offices`) und **Termine** (`appointments`).

Fachliche Grundregeln:

- Ein Termin gehört zu genau einem Amt.
- Ein Termin beginnt zur vollen Stunde und dauert genau eine Stunde.
- Ein Amt darf keine zwei Termine zur selben Startzeit haben.

## Die Aufgaben

| | Aufgabe | Zeit | Inhalt |
|---|---|---|---|
| 1 | [Codebasis erschließen, `CLAUDE.md`, erster Bugfix](tasks/task-1-explore-and-bugfix.md) | ~85 Min | App verstehen, Projektkontext festhalten, einen echten Bug finden |
| 2 | [Feature: freie Termin-Slots](tasks/task-2-office-availability.md) | ~60 Min | Neuer Endpunkt im bestehenden Stil |
| 3 | [Eigene Agenten bauen und ein neues Modul erzeugen](tasks/task-3-contact-requests.md) | ~95 Min | Erst das Werkzeug schreiben, dann damit ein Modul bauen |

Die Aufgaben 1 und 2 sind unabhängig voneinander.

In Aufgabe 3 schreibt ihr **eure eigenen Agenten**. Unter `.claude/` liegt dafür
ein vollständiges Beispiel — der Agent `reviewer` mit seinem Skill
`module-review` — und daneben zwei leere Gerüste, die ihr ausfüllt.

## Arbeitsweise

- Arbeitet in Gruppen von **2–3 Personen**. Ein eingerichteter Rechner pro Gruppe
  genügt.
- Wenn ihr NestJS oder TypeORM nicht kennt: lasst euch von Claude zuerst **einen**
  bestehenden Endpunkt erklären, zum Beispiel `@src/offices`.
- Für jede Aufgabe: erst einen **kurzen Plan** anfordern, ihn lesen, dann
  schrittweise umsetzen lassen. **Prüft jeden Diff.**
- Schreibt eure eigenen kurzen Prompts. Kopiert nicht ganze Aufgabendateien in
  Claude. Ihr bekommt bewusst keine fertigen Prompts — das Formulieren ist Teil
  der Übung.

## Nützliche Befehle

```bash
npm run start:dev   # Anwendung starten, Swagger unter http://localhost:3000/api
npm test            # Unit-Tests
npm run build       # Kompilieren
git diff            # Änderungen prüfen
```

`npm run lint` führt `eslint --fix` aus und schreibt Dateien um — nicht beiläufig
ausführen. Wenn die Datenbank klemmt: `data/appointments.db` löschen, sie wird
beim nächsten Start neu angelegt.

Ihr könnt eure Lösung am Ende auf einen eigenen Branch pushen, wenn ihr sie
behalten möchtet.
