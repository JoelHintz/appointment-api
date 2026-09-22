# Workshop-Aufgaben: Appointment API

## Worum es geht

Dieses Projekt ist eine kleine **NestJS**-Termin-API im Behördenkontext. Sie
verwaltet bereits **Ämter** (`offices`) und **Termine** (`appointments`).

Fachliche Grundregeln:

- Ein Termin gehört zu genau einem Amt.
- Ein Termin beginnt zur vollen Stunde und dauert genau eine Stunde.
- Ein Amt darf keine zwei Termine am selben Tag zur selben Stunde haben.

## Die Aufgaben

| | Aufgabe | Inhalt |
|---|---|---|
| 1 | [Codebasis erschließen, `CLAUDE.md` schreiben, ersten Bug fixen](tasks/task-1-explore-and-bugfix.md) | Eine fremde Codebasis mit Claude erschließen, Projektkontext festhalten, die API einem Härtetest unterziehen |
| 2 | [Feature für freie Termin-Slots eines Amts](tasks/task-2-office-availability.md) | Neuer Endpunkt im bestehenden Stil |
| 3 | [Workflow bauen und Feature umsetzen](tasks/task-3-applicants.md) | Zwei Agenten, ihre Skills und den Ablauf schreiben, dann damit ein Ticket umsetzen |

## Arbeitsweise

> **Modell: durchgehend Sonnet.** Stellt eure Sitzung zu Beginn mit
> `/model sonnet` um und lasst sie den ganzen Tag dort; das hält den
> Kostenrahmen des Workshops. Die Agenten, die ihr in Aufgabe 3 schreibt, tragen
> `model: sonnet` bereits im Frontmatter; **lasst diese Zeile stehen.**
> Beginnt jede Aufgabe und Teil b von Aufgabe 3 mit `/clear`: Ein langer
> Verlauf wird mit jeder Nachricht erneut bezahlt.

- Arbeitet in Gruppen von **2–3 Personen**. Ein eingerichteter Rechner pro Gruppe
  genügt.
- **Eigener Branch, Commit nach jedem Teil.** Legt zu Beginn einen Branch mit
  eurer Gruppennummer an, etwa `git switch -c gruppe-1`, und committet nach
  jedem abgeschlossenen Teil einer Aufgabe. Der Reviewer in Aufgabe 3 prüft, was
  seit dem letzten Commit geändert wurde.
- Wenn ihr NestJS oder TypeORM nicht kennt: lasst euch von Claude zuerst **einen**
  bestehenden Endpunkt erklären, zum Beispiel `@src/offices`.
- Bevor Claude etwas am Code ändert: erst einen **kurzen Plan** anfordern, etwa im Plan-Modus
  (wie man ihn einschaltet, findet ihr selbst heraus), ihn lesen, dann
  schrittweise umsetzen lassen. **Prüft jeden Diff.**
- Schreibt eure eigenen kurzen Prompts. Kopiert nicht ganze Aufgabendateien in
  Claude. In Aufgabe 1 zeigt ein Beispielprompt, woran man einen brauchbaren
  Prompt erkennt; danach formuliert ihr selbst. Fertige Prompts bekommt ihr
  bewusst nicht, das Formulieren ist Teil der Aufgabe.

## Nützliche Befehle

```bash
npm run start:dev   # Anwendung starten, Swagger unter http://localhost:3000/api
npm test            # Unit-Tests
npm run build       # Kompilieren
git diff            # Änderungen prüfen
```

`npm run lint` führt `eslint --fix` aus und schreibt Dateien um, also nicht beiläufig
ausführen. Wenn die Datenbank klemmt: `data/appointments.db` löschen, sie wird
beim nächsten Start neu angelegt.

Wollt ihr eure Lösung behalten, pusht euren Branch am Ende im eigenen Terminal;
für Claude ist `git push` gesperrt.
