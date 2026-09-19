# Aufgabe 3 — Eigene Agenten und ein eigenes Skill, dann ein Feature damit bauen

| | |
|---|---|
| **Zeitbudget** | ca. 90 Minuten (35 für Teil a, 55 für Teil b) |
| **Level** | alle (Kern), Zusatzaufgaben nach Erfahrung |
| **Voraussetzung** | keine; Aufgaben 1 und 2 sind hilfreich |

Erst baut ihr euer Werkzeug, dann arbeitet ihr damit.

---

## Teil a — Werkzeug schreiben (~35 Min)

Im Projekt liegt ein ausgearbeitetes Beispiel: der Agent
`.claude/agents/reviewer.md` zusammen mit dem Skill
`.claude/skills/module-review/SKILL.md`. Lest beide, bevor ihr anfangt.

Daneben liegen drei Gerüste:

| Datei | Was daraus wird |
|---|---|
| `.claude/agents/architect.md` | plant eine Änderung und schreibt keinen Code |
| `.claude/agents/developer.md` | setzt einen freigegebenen Plan um |
| `.claude/skills/nest-feature-module/SKILL.md` | das Bauwissen, auf das der Developer zurückgreift |

In jedem Gerüst stehen die Leitfragen als Kommentare. Den Inhalt schreibt ihr auf
**Englisch** — er ist Material für das Modell, nicht für euch.

Ihr dürft euch von Claude helfen lassen; das ist ausdrücklich erwünscht. Um einen
brauchbaren Agenten zu bekommen, müsst ihr erklären, was ein guter Architekt oder
Developer tut — und genau diese Erklärung ist der Agent.

**Der Unterschied, um den es geht:** Ein **Agent** ist eine Rolle — wer arbeitet,
mit welchen Werkzeugen, in welchen Grenzen. Ein **Skill** ist Wissen — was in
diesem Projekt gilt, unabhängig davon, wer es gerade nachschlägt. `CLAUDE.md`
steht daneben: immer geladen, projektweit, knapp. Ein Skill wird nur bei Bedarf
geholt und darf deshalb ausführlicher sein. Ein Skill, das statt Wissen eine
Aufrufreihenfolge enthält („erst den Architekten, dann den Developer"), ist keins.

**Fertig ist Teil a, wenn:**

- [ ] Alle drei Dateien haben eine `description`, an der erkennbar ist, wann sie
      benutzt werden sollen.
- [ ] Beide Agenten haben eine bewusst gewählte `tools`-Liste, und ihr könnt
      begründen, warum der Architekt weniger Werkzeuge braucht als der Developer.
- [ ] In jeder Agent-Datei steht mindestens eine klare Grenze („darf nicht …").
- [ ] Das Skill enthält Wissen, das über eine Wiederholung von `CLAUDE.md`
      hinausgeht, und der Developer verweist darauf.
- [ ] Die Kommentare sind gelöscht.

---

## Teil b — Das Feature bauen (~55 Min)

### Ausgangslage

Ein Termin kennt heute ein Datum, eine Startstunde, das Amt und einen
Freitext-`title`. **Die API weiß nicht, wer kommt.** Damit gibt es keine
Terminbestätigung, keinen Abgleich am Schalter und nichts, was jemanden daran
hindert, sich zehn Slots zu reservieren.

Ihr ergänzt die buchende Person: ein neues Modul `applicants/` und eine Beziehung
vom Termin dorthin — dasselbe Muster, mit dem ein Termin heute schon an einem Amt
hängt.

### Ablauf

1. Das Feature in zwei bis drei Sätzen fassen.
2. **Architekt** liefert einen kurzen Plan, ohne Code.
3. **Checkpoint Mensch** — Plan lesen, offene Fragen klären, Überflüssiges
   streichen. Den freigegebenen Plan legt eure Hauptsitzung in `plan.md` ab. Der
   Architekt kann das nicht selbst, weil er kein Schreibwerkzeug hat; gebt ihm
   auch keines, sonst ist die Grenze aus Teil a wieder weg.
4. **Developer** setzt um. Die Übergabe ist ein Satz: „Setze den freigegebenen
   Plan aus `@plan.md` um." Seine Rolle steht in seiner Agent-Datei, die Aufgabe
   im Plan.
5. **Reviewer** prüft den Diff und liefert Findings nach Schweregrad. Grenzt ihn
   auf `src/` und `test/` ein — sonst reviewt er eure Agent-Dateien aus Teil a mit.
6. **Checkpoint Mensch** — Findings sichten, entscheiden, was behoben wird,
   zurück an den Developer, danach erneut reviewen.

Es geht nicht um Tempo. Der Wert liegt in den beiden Checkpoints: Ihr lest Plan
und Findings und entscheidet darüber. Ein durchgewinkter Plan ist eine nicht
bestandene Aufgabe.

### Umfang

**Entität `Applicant`:**

| Feld | Typ | Anmerkung |
|---|---|---|
| `id` | number | |
| `firstName` | string | |
| `lastName` | string | |
| `email` | string | muss eine gültige E-Mail sein |
| `birthDate` | string | Kalenderdatum |

**Endpunkte** im bestehenden REST-Stil: `POST /applicants`, `GET /applicants`,
`GET /applicants/:id`. Kein `PATCH`, kein `DELETE`.

**Am Termin:** `applicantId` kommt beim Anlegen dazu, **vorerst optional** —
bestehende Termine haben keine Person, und ein Pflichtfeld würde sie ungültig
machen. Die Terminantwort zeigt die Person so, wie sie heute das Amt zeigt.

**Fachregeln — die gehören in den Service, nicht ins DTO:**

1. Eine unbekannte `applicantId` wird mit `404` abgelehnt.
2. **Eine Person hat pro Amt und Tag höchstens einen Termin.** Eine zweite
   Buchung wird mit `400` und einer verständlichen Meldung abgelehnt.

> Regel 2 ist der Kern der Aufgabe. Ein DTO sieht nur den Request. Ob diese
> Person an diesem Tag in diesem Amt bereits einen Termin hat, weiß nur, wer den
> gespeicherten Bestand kennt — genau deshalb liegt Fachlogik im Service.

Dazu DTOs, Validierung, Swagger-Dekoratoren und Mapping wie in den bestehenden
Modulen, plus fokussierte Unit-Tests. Orientiert euch an `src/offices` und
`src/appointments`; das neue Modul soll daneben fast langweilig wirken. Seeding
braucht ihr nicht.

### Empfohlene Tests

- `POST /applicants` legt an, `GET /applicants/:id` liefert `404` bei unbekannter `id`
- Buchen mit unbekannter `applicantId` → `404`
- Zweiter Termin derselben Person am selben Tag im selben Amt → `400`
- Buchen ohne `applicantId` funktioniert weiterhin

### Zusatzaufgaben (nur mit Puffer)

1. **`applicantId` verpflichtend machen.** So führt man ein Pflichtfeld
   tatsächlich ein: erst abwärtskompatibel ausliefern, dann verschärfen.
   Verpflichtend wird nur das DTO — die Entitätsspalte bleibt `nullable`, sonst
   scheitert `synchronize: true` an vorhandenen Terminen ohne Person. Achtung:
   Der Compiler bricht danach in `test/testdata.factory.ts` und in den
   Appointment-Tests, und das ist die eigentliche Lehre — eine
   Kontraktänderung kostet den Bestand. Nichts für die letzten zehn Minuten.
2. Die E-Mail eindeutig machen. Prüft, was `@Column({ unique: true })` allein
   zurückgibt, wenn die Adresse schon existiert.
3. `GET /applicants/:id/appointments` — die Termine einer Person.
4. **Erweitert das Skill `module-review`** um Prüfpunkte für euer Modul und lasst
   den Reviewer erneut laufen.

Wer alles durch hat: `tasks/optional-contact-requests.md` ist ein zweites,
unabhängiges Modul mit einem anderen Regeltyp.

## Abnahmekriterien

- [ ] `npm test` und `npm run build` laufen durch.
- [ ] Die Endpunkte funktionieren in Swagger, inklusive der abgelehnten
      Doppelbuchung.
- [ ] Das neue Modul liest sich wie `offices/` und `appointments/`.
- [ ] Ihr könnt erklären, **warum** Regel 2 nicht im DTO stehen kann.
- [ ] Ihr könnt **einen Fehler benennen, den ein Agent gemacht hat und den ein
      Mensch gefangen hat**.

## Für die Abschlusspräsentation (3 Minuten, hart getaktet)

1. **Demo** in Swagger: eine Person anlegen, einen Termin für sie buchen, die
   zweite Buchung am selben Tag abgelehnt bekommen.
2. **Ein Test**, kurz erklärt: was sichert er ab?
3. **Ein Satz:** Was hat ein Agent falsch gemacht, und wie habt ihr es gemerkt?
