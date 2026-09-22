---
name: review-feature
description: Prüft eine Änderung an der Appointment API (einen Bugfix, einen neuen Endpunkt oder ein neues Feature-Modul) gegen die Projektkonventionen in CLAUDE.md und die Fachregeln. Benutze es, wenn der aktuelle Diff geprüft, der Arbeitsbaum vor dem Commit kontrolliert oder Code des Developers begutachtet werden soll. Liefert eine Liste von Findings nach Schweregrad.
---

# Ein Feature prüfen

Die Regeln, die dieses Review anwendet, stehen in `CLAUDE.md`. Dieses Skill
enthält das **Vorgehen** und das **Ausgabeformat**, dazu die wenigen Prüfungen,
die `CLAUDE.md` nicht abdeckt.

## Vorgehen

### 1. Die Änderung ansehen

```bash
git status
git diff
npm test
npm run build
```

Scheitern die Tests oder der Build, ist das das erste Finding. Notiere es und
mach weiter.

Prüfe nur die Änderung an der Anwendung: `src/`, `test/` und Projektdateien wie
`package.json`. Ignoriere `.claude/`: Agent- und Skill-Definitionen sind das
Werkzeug, mit dem die Änderung entstanden ist, kein Code unter Review.

### 2. Den Kontext lesen

Öffne jede geänderte Datei vollständig, dann das Nachbarmodul, dem sie ähneln
sollte (`src/offices/*` oder `src/appointments/*`). Ein neues Modul sollte neben
den bestehenden fast langweilig wirken. Alles *Interessante* ist ein Finding,
bis das Gegenteil bewiesen ist.

### 3. Gegen `CLAUDE.md` prüfen

Geh `CLAUDE.md` Abschnitt für Abschnitt durch und vergleiche die Änderung mit
jeder Regel. Überspring keine Regel, nur weil der Code auf den ersten Blick gut
aussieht; in dieser Codebasis brechen gerade die Regeln, bei denen alles gut
aussieht.

### 4. Prüfen, was `CLAUDE.md` nicht abdeckt

- [ ] Numerische Query- und Body-Felder tragen `@Type(() => Number)` neben
      `@IsInt()`. Ohne das kommt ein Query-Parameter wie `?limit=5` als String
      an und scheitert an der Validierung.
- [ ] Tests prüfen Verhalten, nicht `toBeDefined()`. Mindestens ein Erfolgsfall
      und ein Fall, der abgelehnt wird oder nicht gefunden wird.
- [ ] Der Diff enthält keine Massen-Umformatierung. Wenn doch, hat jemand
      `npm run lint` ausgeführt, und die eigentliche Änderung ist darin
      vergraben; das ist schon für sich ein Finding.

## Ausgabe

1. Ein Urteil in einer Zeile: `IN ORDNUNG` / `IN ORDNUNG MIT KLEINIGKEITEN` /
   `ÄNDERUNGEN NÖTIG`.
2. Findings in vier Gruppen:
   - **Blocker:** muss vor dem Commit behoben werden.
   - **Sollte behoben werden:** echte Probleme, die den Commit nicht blockieren.
   - **Wäre schön:** Stil, Benennung, zusätzliche Tests.
   - **Gut:** ein, zwei Dinge, die gelungen sind.

Jedes Finding in einer Zeile: `datei:zeile: Problem → Vorschlag`.

## Leitlinien

- **Sei konkret.** Ein Finding ohne Datei und Zeile ist eine Meinung.
- **Sag, wenn es passt.** Gibt es keine Blocker, sag das klar, statt Findings zu
  erfinden, um gründlich zu wirken.
