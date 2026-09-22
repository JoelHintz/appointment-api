# Aufgabe 3: Workflow bauen und Feature umsetzen

## Ziel

Ihr baut euren eigenen Workflow aus zwei Agenten, ihren Skills und dem Ablauf,
der sie verbindet, und setzt damit das Ticket `APP01` um.

## Teil a: Den Workflow bauen

Zu Beginn bekommt ihr ein ausgearbeitetes `CLAUDE.md` als Datei. Gleicht euer
eigenes damit ab und übernehmt, was euren Agenten fehlen würde; eure Skills
verweisen später darauf, statt es zu wiederholen.

Im Projekt liegt ein ausgearbeitetes Beispiel: der Agent
`.claude/agents/reviewer.md` zusammen mit dem Skill
`.claude/skills/review-feature/SKILL.md`. Lest beide, bevor ihr anfangt. Sie
sind die Schablone für alles, was ihr gleich schreibt.

Daneben liegen fünf Gerüste mit Leitfragen als Kommentare. Füllt sie in dieser
Reihenfolge; die Rollen-Skills `plan-feature` und `implement-feature` dürfen
knapp bleiben.

| Datei | Was daraus wird |
|---|---|
| `.claude/agents/architect.md` | die Rolle: plant, schreibt keinen Code |
| `.claude/agents/developer.md` | die Rolle: setzt einen freigegebenen Plan um |
| `.claude/skills/feature-workflow/SKILL.md` | der Ablauf vom Ticket bis zum Review |
| `.claude/skills/plan-feature/SKILL.md` | wie hier geplant wird, und wie ein Plan aussieht |
| `.claude/skills/implement-feature/SKILL.md` | wie hier gebaut wird, und was zurückgemeldet wird |

**Rolle in die Agenten. Wissen und Ablauf in die Skills. Die Entscheidung bleibt
beim Menschen.** Was wohin gehört:

- **Agent:** wer arbeitet, mit welchen Werkzeugen und in welchen Grenzen. Sein
  Skill steht schon unter `skills:` und ist damit vorgeladen.
- **Skill:** wie die Rolle vorgeht und was sie abliefert.
- **Checkpoints in `feature-workflow`:** was das Modell nicht selbst entscheiden
  darf.
- **`description`:** wann ein Agent oder Skill von selbst dazukommt. Bei
  `feature-workflow` auch, wann es wegbleibt: Ein Ablauf mit drei Subagenten
  soll nicht starten, nur weil jemand „bau mir schnell ein DTO“ getippt hat.

Wiederholt ein Rollen-Skill nur `CLAUDE.md`, hilft **Hinweis A**. `/agents`
zeigt euch, ob `architect` und `developer` erkannt werden, `/skills` zeigt eure
drei Skills.

### Abnahmekriterien

- [ ] Alle fünf Dateien haben eine `description`, an der erkennbar ist, wann sie
      benutzt werden sollen, und die Kommentare sind gelöscht.
- [ ] Beide Agenten haben eine klare Grenze (etwa: Der Architekt schreibt keinen
      Code), und `feature-workflow` nennt an beiden Checkpoints, was ihr dort
      entscheidet.
- [ ] Die Rollen-Skills wiederholen `CLAUDE.md` nicht, sondern verweisen darauf.

## Teil b: Das Feature bauen

Das Ticket **`tickets/APP01-applicants.md`** ist die Eingabe für euren Ablauf:
ein neues Modul `applicants/` und eine Beziehung vom Termin dorthin, nach
demselben Muster, mit dem ein Termin heute am Amt hängt. Lest das Ticket, aber
schreibt daraus keinen Plan, das ist die Arbeit des Architekten. Die beiden
offenen Fragen darin soll euer Architekt melden; ihr entscheidet sie am ersten
Checkpoint.

### Ablauf

1. **Start:** Ruft euren Ablauf mit dem Ticket auf, zum Beispiel
   `Arbeite das Ticket @tickets/APP01-applicants.md ab.`
2. **Architekt, dann Checkpoint Mensch.** Der Ablauf hält nach dem Plan an. Plan
   lesen, offene Fragen beantworten, Überflüssiges streichen, `plan.md` bei
   Bedarf selbst ändern, dann freigeben.
3. **Developer, dann Reviewer.** Der Developer setzt um, der Reviewer liefert
   Findings nach Schweregrad. Während der Developer arbeitet, legt euch die
   Requests zurecht, mit denen ihr das Feature in Swagger ausprobiert. Die
   Buchungsregeln dort zu prüfen ist freiwillig (**Hinweis C**).
4. **Checkpoint Mensch.** Findings sichten und entscheiden, was behoben wird.
   Der Developer behebt, der Reviewer prüft erneut.

Läuft euer Ablauf durch, ohne anzuhalten, ist das ein Befund über euer Skill.
Notiert ihn, holt den übersprungenen Checkpoint von Hand nach und bessert das
Skill danach aus (**Hinweis B**).

Nach einer Änderung an einem Skill startet ihr den Ablauf erneut und brecht ab,
sobald klar ist, ob er nach dem Plan anhält. Den ganzen Ablauf fahrt ihr erst
danach, denn Umsetzung und Review kosten ein Vielfaches eines Plans.

### Abnahmekriterien

- [ ] In Swagger lässt sich eine Person anlegen und beim Buchen angeben, und
      der Termin zeigt sie; `npm test` und `npm run build` laufen durch.
- [ ] Das neue Modul liest sich wie `offices/` und `appointments/`, mit DTOs,
      Swagger-Dekoratoren und fokussierten Unit-Tests.
- [ ] Ihr könnt sagen, was ihr am Plan geändert oder welches Finding ihr
      abgelehnt habt, und warum.

## Zusatzaufgaben

1. **Erweitert das Skill `review-feature`** um Prüfpunkte für euer Modul und
   lasst den Reviewer eure nächste Änderung vor dem Commit prüfen.
2. **`applicantId` verpflichtend machen**, ein zurückgestellter Punkt aus dem
   Ticket. Pflicht wird es nur im DTO; die Spalte in der Entität bleibt
   `nullable`, weil bestehende Termine keine Person haben. Was danach nicht mehr
   kompiliert, gehört zur Aufgabe.

---

## Anhang: Hinweise

**A: Teil a, wenn ein Rollen-Skill nur `CLAUDE.md` wiederholt.** `CLAUDE.md`
ist in jeder Sitzung geladen. Fragt euch: Was sagt euer Skill, das dort nicht
steht? Meist ist es das Vorgehen, also in welcher Reihenfolge die Rolle
arbeitet, und die Ausgabe, also die Form, in der sie abliefert.

**B: Teil b, wenn der Ablauf nicht anhält.** Ein „STOP“ im Skill ist für das
Modell nur eine Bitte; es liest weiter und ruft den nächsten Agenten auf.
Schreibt an beide Checkpoints, dass die Antwort mit der Frage an euch endet und
der Ablauf erst weitergeht, wenn ihr in einer neuen Nachricht geantwortet habt.

**C: Teil b, wenn ihr nicht wisst, wie ihr die Regel „eine Buchung pro Person,
Amt und Tag“ prüft.** Legt eine Person an und bucht für sie einen Termin, mit
der `id` aus der Antwort als `applicantId`:

```json
{ "title": "Passport", "officeId": 1, "date": "2027-06-22", "startHour": 9, "applicantId": 1 }
```

Schickt denselben Body danach noch zweimal, jeweils mit einer Änderung:

- `"startHour": 11` wird abgelehnt: selbe Person, selbes Amt, selber Tag.
- `"officeId": 2` wird angelegt: anderes Amt.

Nehmt für die Ablehnung bewusst eine andere Stunde. Bei derselben Stunde lehnt
schon die bestehende Regel „ein Termin pro Amt und Slot“ ab, und ihr seht nicht,
ob eure neue Regel greift.
