# Trainer-Guide: Ganztags-Workshop „Agentisches Coding"

Zielgruppe: Informatik-Studierende aller Level (Anfang Bachelor bis Ende Master),
gemischte Gruppen. Dauer: ein Tag, 9:00–17:00. Werkzeug: Claude Code in VS Code.
Codebasis: dieses Repository (`appointment-api`), eine kleine NestJS/TypeScript-API.

Dieser Guide ist **nur für Trainer:innen**. Studierende bekommen `README.md` und
`SETUP.md` (vorab) sowie `TASK.md`, `tasks/` und `.claude/` (im Workshop).
Fertige Prompt-Dateien bekommen sie bewusst **nicht** — das Formulieren ist Teil
der Übung. Fallback-Prompts liegen für dich in `workshop/prompts/`.

---

## 1. Lernziele

Am Ende des Tages können die Teilnehmenden:

1. eine fremde Codebasis mit einem Agenten erschließen und ein `CLAUDE.md`
   erzeugen und **kritisch verbessern**;
2. einen kleinen Bug mit dem „Plan → Review → Umsetzen"-Zyklus beheben;
3. ein Feature im bestehenden Projektstil ergänzen;
4. **eigene Subagenten schreiben** und mit ihnen einen Workflow (Architekt →
   Developer → Reviewer) fahren, dessen Ergebnisse sie bewerten statt blind zu
   übernehmen;
5. benennen, wo AI-Assistenz hilft und wo menschliches Review unverzichtbar ist.

Die durchgehende Botschaft: **Der Mensch bleibt verantwortlich. Kontext (CLAUDE.md,
Skills, klare Prompts) ist die eigentliche Arbeit; Code-Erzeugung ist der leichte
Teil.**

---

## 2. Zeitplan (9:00–17:00)

| Zeit | Block | Inhalt | Ergebnis |
|---|---|---|---|
| 09:00–09:20 | Ankommen & Setup-**Rettung** | Zugänge einrichten, `npm test` stichprobenartig prüfen, Ersatzgeräte verteilen | Jede Gruppe lauffähig |
| 09:20–10:20 | **Vortrag**: Prinzipien agentischen Codings | siehe Abschnitt 4; `/init` einmal live vorführen | Mentales Modell |
| 10:20–10:35 | Pause | | |
| 10:35–12:00 | **Block 1**: App + `CLAUDE.md` + Aufgabe 1 | **a)** App erkunden, Endpunkt erklären lassen, Regeln benennen. **b)** `/init` + `CLAUDE.md` schärfen. **c)** Zeitzonen-Bug fixen | Codebasis verstanden, eigenes `CLAUDE.md`, erster Fix |
| 12:00–13:00 | Mittagspause | | |
| 13:00–13:15 | Mini-Input | Referenz-`CLAUDE.md` zeigen & vergleichen; Lösung zu Aufgabe 1 auflösen | „Was ist ein gutes `CLAUDE.md`" |
| 13:15–14:20 | **Block 2**: Aufgabe 2 (Feature) | Availability-Endpunkt: Plan anfordern, reviewen, schrittweise umsetzen, testen | Feature im Projektstil |
| 14:20–14:50 | **Input**: Agenten & Skills | Wie ein Subagent aufgebaut ist; `reviewer` + `module-review` vorführen; Faustregel „Agent = Rolle, Skill = Wissen" an zwei Skill-Beispielen; die zwei Gerüste zeigen | Wissen, was in Teil a zu tun ist |
| 14:50–16:25 | **Block 3**: Aufgabe 3 | **a)** ~25 Min: eigene `architect`- und `developer`-Agenten schreiben. **b)** ~70 Min: damit `contact-requests/` bauen. Kurze Pause nach Bedarf | Eigene Agenten + reviewtes Modul |
| 16:25–16:30 | Umbau | | |
| 16:30–16:55 | **Abschlusspräsentationen** | **3 Min./Gruppe, hart getaktet**: Demo + 1 Test + „was hat der Agent falsch gemacht" | Teilen & Reflexion |
| 16:55–17:00 | Abschluss & Feedback | | |

Netto an Aufgaben: ~4 h. Block 3 bleibt der engste Timebox — plane die
Minimalvariante fest ein (Abschnitt 7).

**Setup ist Hausaufgabe.** `SETUP.md` geht mit ausreichend Vorlauf raus und
verlangt ausdrücklich, dass die Gruppen `npm ci`, `npm run start:dev` und
`npm test` vorher einmal ausgeführt haben. Die 20 Minuten am Morgen sind für
Zugänge und Havarien reserviert, nicht für Erstinstallationen. Weise in der
Ankündigung darauf hin, dass eine Gruppe ohne fertiges Setup den Vormittag
verliert.

---

## 3. Vor dem Workshop

### 3.1 Branch-Strategie

`main` ist **der aktuelle Teilnehmerstand**: Aufgaben, Beispiel-Agenten,
Basis-Code — keine Lösungen. Wer klont, landet damit richtig, weshalb `SETUP.md`
keinen Branch nennen muss.

Entwickelt wird auf `workshop-solution-dev`, wo Aufgaben und Lösungen zusammen
liegen. Zwischen beiden gilt eine Regel: **`src/` und `test/` wandern nie zum
`main`.** Die Lösungen zu Aufgabe 1 und 2 stecken mitten in Dateien, die es auf
`main` ohnehin gibt — man kann sie nicht durch Löschen entfernen, nur dadurch,
dass man sie gar nicht erst hinüberlässt.

`main` hat **absichtlich kein `CLAUDE.md`** — `/init` ist Übung. Das bleibt so.
`workshop/` geht ebenfalls nie mit.

Vollständige Branch-Landkarte, Inventar, Rezepte und Verifikationsliste stehen in
**`workshop/RELEASE_TO_MAIN.md`**. Dort ist auch festgehalten, dass das kurze
Format (Vortrags-Ergänzung, Englisch) eine eigene Linie hat, die das
Ganztagsmaterial nicht anfasst.

> Das Inventar in `RELEASE_TO_MAIN.md` ist zu pflegen, sobald eine Aufgabe oder
> eine Lösung dazukommt. Solange Lösungen ausschließlich in `src/` und `test/`
> liegen, bleibt das Rezept unverändert.

### 3.2 Was unter `.claude/` liegt — und was bewusst fehlt

**Die Teilnehmenden bauen ihr Werkzeug selbst.** Wer fertige Agenten nur abfeuert,
lernt Bedienung; wer sie schreibt, muss erst formulieren, was ein guter Architekt
oder Developer tun soll — und genau das ist der Lerninhalt. Deshalb ist `.claude/`
absichtlich dünn:

| Datei | Zustand |
|---|---|
| `agents/reviewer.md` | **vollständig** — das eine ausgearbeitete Vorbild |
| `skills/module-review/SKILL.md` | **vollständig** — die zugehörige Checkliste |
| `agents/architect.md` | **Gerüst** — Frontmatter und Abschnitte leer, Leitfragen als Kommentare |
| `agents/developer.md` | **Gerüst** |
| `settings.json` | Permission-Allowlist |

Ein Skill, das den Ablauf orchestriert, gibt es bewusst **nicht** — weder für die
Gruppen noch als Referenz. Begründung in §3.4.

Zur `settings.json`: Ohne sie klicken sich sechs Gruppen den ganzen Tag durch
Permission-Rückfragen — und gewöhnen sich reflexhaftes Bestätigen an, also genau
das Gegenteil der Workshop-Botschaft.

Auf `deny` stehen `npm run lint`, `git push` sowie **`git checkout`, `git restore`,
`git reset` und `git clean`**. Die vier letzten sind die Befehle, mit denen sich
eine Gruppe in Sekunden die eigene Arbeit überschreibt — und die Muster sind
absichtlich weit gefasst, weil eine eng formulierte Regel genau die Variante
durchlässt, die dann zuschlägt. Konsequenz für dich: **Trainer-Tätigkeiten, die
diese Befehle brauchen** (das Release nach `main`, das Zurücksetzen der Gerüste
nach einem Testlauf) **laufen im normalen Terminal, nicht über Claude.**

Der Architekten-Plan landet in `plan.md` im Wurzelverzeichnis. Der Pfad ist
gitignored, damit er nicht im `git diff` auftaucht, den die Gruppen prüfen.

### 3.3 `workshop/reference/`

| Datei | Entspricht | Wofür |
|---|---|---|
| `agent-architect.md` | `.claude/agents/architect.md` | Maßstab beim Herumgehen, Rettungsanker |
| `agent-developer.md` | `.claude/agents/developer.md` | dito |
| `skill-nest-feature-module.md` | — (bei den Gruppen nicht vorhanden) | Demo-Artefakt für den Input-Block um 14:20 |

Rettungsanker sparsam einsetzen — das Schreiben ist die Übung.

> **Testlauf vor dem Workshop.** Die Gerüste sind nicht lauffähig, also
> vorübergehend überschreiben — **im normalen Terminal**, `git checkout` ist über
> Claude gesperrt:
>
> ```bash
> cp workshop/reference/agent-architect.md  .claude/agents/architect.md
> cp workshop/reference/agent-developer.md  .claude/agents/developer.md
>
> # Kette mit workshop/prompts/task-3-contact-requests.prompt.md durchlaufen
>
> git checkout .claude/agents/     # Gerüste wiederherstellen — nicht vergessen
> ```
>
> Prüfe: Findet Claude die Agenten? Läuft Plan → Umsetzung → Review sauber durch?
> Bleibt `npm test` grün? Und vor allem: **wie lange dauert Teil b?** Das
> 70-Minuten-Budget ist geschätzt, nicht gemessen.

### 3.4 Warum es kein Orchestrierungs-Skill gibt

Ein Skill, das Architekt → Checkpoint → Developer → Reviewer abfährt, wäre
naheliegend und ist trotzdem die falsche Form:

1. **Ein Skill kann den Stopp nicht erzwingen.** Die zwei menschlichen Checkpoints
   sind der gesamte Sinn von Aufgabe 3. Ein Skill ist eine Anweisung an das
   Modell — „STOP" ist eine Bitte, kein Mechanismus.
2. **Der Inhalt wäre eine Aufrufreihenfolge, kein Wissen.** Die Substanz steckt in
   den Agent-Definitionen; das Skill wäre nur eine Hülle darum.
3. **Auto-Triggern wäre unerwünscht.** Es würde im Normalbetrieb feuern, wenn
   jemand schnell ein Modul will und gerade nicht drei Subagenten plus zwei
   Checkpoints.
4. **Es verdeckt genau das, was gelehrt wird.** Wer es startet und zusieht, lernt
   Bedienung statt Orchestrierung.

Daraus fällt die Faustregel für den Input-Block ab:

> **Agent = Rolle. Skill = Wissen. Ablauf = Command oder Handarbeit.**

`skills/module-review` und `reference/skill-nest-feature-module.md` sind die zwei
Belege dafür: eine Prüf-Checkliste und eine Konventionssammlung — beides Wissen,
beides unabhängig davon nützlich, wer es gerade aufruft. Zeig beide im
Input-Block nebeneinander.

### 3.5 Ersatzgeräte

`better-sqlite3` ist ein nativer Build und schlägt auf manchen Laptops fehl. Halte
1–2 fertig eingerichtete Rechner oder einen Cloud-Editor bereit. Weitere
Setup-Fallstricke stehen in `SETUP.md`, Abschnitt 7.

---

## 4. Vortrag: Prinzipien agentischen Codings (60 Min.)

> Dieser Abschnitt richtet sich an die Person, die den Vortrag hält — er ist so
> geschrieben, dass er ohne den Rest des Guides funktioniert.

Roter Faden — nicht mehr als diese Punkte:

1. **Was ein Coding-Agent ist:** LLM + Tools (Dateien lesen/schreiben, Shell,
   Suche) in einer Schleife. Er sieht nur, was im Kontext steht.
2. **Kontext-Engineering ist die Arbeit.** `CLAUDE.md` = projektweiter Kontext.
   `@datei`-Referenzen = punktueller Kontext. Skills = wiederverwendbare
   Prozeduren. Subagents = abgegrenzte Rollen mit eigenem Kontextfenster.
3. **Plan vor Code.** Erst einen kurzen Plan anfordern, lesen, korrigieren, dann
   umsetzen lassen. Große Prompts ohne Plan → große, schwer prüfbare Diffs.
4. **Review-Pflicht.** `git diff` ist nicht optional. Jede Zeile verantwortet der
   Mensch. Tests sind das Sicherheitsnetz.
5. **Kleine, reviewbare Schritte** schlagen einen Riesen-Wurf.
6. **Grenzen:** Agenten halluzinieren APIs, überdehnen den Auftrag, „reparieren"
   Nebensächliches, schreiben grün-aussehende, sinnlose Tests. Genau dafür ist
   der Reviewer da — und der Mensch dahinter.

Danach **`/init` live vorführen** (auf einer Wegwerf-Kopie): zeigen, wie der
Agent die Codebasis abklopft und ein `CLAUDE.md` vorschlägt, und laut über eine
schwache Stelle im Ergebnis nachdenken.

---

## 5. Block 1 — App, `CLAUDE.md` und Aufgabe 1 (85 Min.)

Aufgabe: `tasks/task-1-explore-and-bugfix.md`. Sie deckt den ganzen Block ab und
hat drei aufeinander aufbauende Teile:

| Teil | ~Zeit | Inhalt |
|---|---|---|
| a | 25 Min | App in Swagger erkunden, Claude einen Endpunkt erklären lassen, die drei Termin-Regeln selbst benennen |
| b | 30 Min | `/init`, Ergebnis kritisch nachbessern gegen eine Prüfliste |
| c | 30 Min | Den Zeitzonen-Bug finden und beheben |

**Die drei Teile sind absichtlich verzahnt.** In Teil a arbeiten die Gruppen die
Regel „ein Amt darf keine zwei Termine zur selben Startzeit haben" heraus, in
Teil b schreiben sie sie in ihr `CLAUDE.md` — und in Teil c stellen sie fest, dass
der Code sie nicht einhält. Genau diese Pointe trägt den Block; wenn du beim
Herumgehen merkst, dass eine Gruppe Teil a überspringt, hol sie zurück.

### Trainer-Notizen

- Erstsemester brauchen in Teil a länger — das ist in Ordnung, das ist der
  Lernkern. Teil c hat eine dokumentierte kleinere Ausweichoption.
- Die drei Fragen am Ende von Teil a sollen sie **ohne** Claude beantworten. Wer
  sie nicht beantworten kann, hat gelesen statt verstanden.
- **Nach der Mittagspause** (13:00–13:15): ein Referenz-`CLAUDE.md` zeigen und
  gemeinsam gegen ein Gruppen-Ergebnis halten. Frage: Was fehlt? Was ist zu vage?
  Was ist zu viel?

> **Achtung, Spoiler.** Nimm dafür **nicht** das `CLAUDE.md` des Trainer-Branchs.
> Es beschreibt die Availability-Implementierung *und* die
> `@IsISO8601()`-Falle — also die Lösung von Aufgabe 2, die um 13:15 startet.
> Nötig ist eine gekürzte, spoilerfreie Fassung als Handout (steht noch aus).
> Alternative, falls die Fassung nicht rechtzeitig fertig wird: den Vergleich
> ans Ende von Block 2 schieben.

### „Woran erkennt man ein gutes `CLAUDE.md`" (Rubrik)

- **Kommandos stimmen und sind vollständig** (`npm test`, ein einzelner Test,
  `build`, `start:dev`, Hinweis dass `lint` Dateien umschreibt).
- **Domänenregeln explizit**: 1-Stunden-Slots auf voller Stunde (UTC),
  keine Überschneidung pro Amt, `endsAt = startsAt + 60min` abgeleitet.
- **Architektur in 3–5 Sätzen**: zwei Feature-Module, `ValidationPipe` global in
  `main.ts`, Swagger unter `/api`, DTOs statt Entities, Mapping-Stelle.
- **Konventionen**: Feature-first, plural Ordner/Routen, singular Entity/DTO,
  kein `DELETE`.
- **Fallen benannt**, v. a. dass `@IsISO8601()`/`@IsDateString()` auch Datetimes
  akzeptieren.
- **Kein Roman.** Eine Bildschirmseite reicht. Alles, was nicht das Verhalten des
  Agenten ändert, ist Ballast.

### Teil c — der Zeitzonen-Bug, zum Auflösen um 13:00

Referenzlösung auf dem Trainer-Branch: `normalizeStartsAt` in
`src/appointments/appointments.service.ts` plus zwei Tests in
`appointments.service.spec.ts`.

**Was passiert.** Verifiziert mit zwei `POST` aufs selbe Amt:

```
gespeicherte startsAt: ["2026-06-20T09:00:00+02:00", "2026-06-20T07:00:00.000Z"]
gespeicherte endsAt  : ["2026-06-20T08:00:00.000Z", "2026-06-20T08:00:00.000Z"]
gleicher Zeitpunkt? true   |   gleicher String? false
```

`@IsISO8601()` akzeptiert den Offset. Die Prüfung auf die volle Stunde rechnet in
UTC und geht durch. Gespeichert wird dann aber der **rohe String**, während
`endsAt` über `new Date(...).toISOString()` berechnet wird — daher die zwei
identischen `endsAt` bei verschiedenen `startsAt`. Die Überschneidungsprüfung
vergleicht per SQL-Stringgleichheit (`appointment.startsAt = :startsAt`) und
findet folglich keinen Konflikt.

**Der Fix:** `startsAt` an der Systemgrenze normalisieren, also
`new Date(startsAt).toISOString()` zurückgeben und diesen Wert sowohl speichern
als auch vergleichen. Danach kollidieren beide Schreibweisen korrekt.

**Drei Punkte fürs Auflösen:**

1. **String-Gleichheit ist nicht Zeitpunkt-Gleichheit.** Der Kern in einem Satz.
2. **Normalisieren gehört an den Rand**, nicht an jede Vergleichsstelle. Frag:
   „Wie viele Stellen müsstet ihr anfassen, wenn ihr stattdessen jeden Vergleich
   reparieren würdet?"
3. **Die Verzahnung sichtbar machen.** Lass eine Gruppe ihre Regel aus dem
   `CLAUDE.md` vorlesen und daneben das Ergebnis der zwei `POST` zeigen. Eine
   dokumentierte Invariante, die der Code nicht hält — das ist der Moment, für den
   der Block gebaut ist.

Der Fix macht nebenbei zwei weitere Dinge heil, die du erwähnen kannst: In
`update()` wurde `endsAt` bisher **vor** der Validierung berechnet, und Aufgabe 2
vergleicht später gebuchte Slots ebenfalls über Strings — mit normalisierten
Werten wird das erst verlässlich.

### Ausweichoption und Zusatzfunde

Die Aufgabe nennt für langsame Gruppen die **`officeId`-Validierung**: nur
`@IsNotEmpty()`, deshalb überlebt `"abc"` die Validierung und kommt als
**404 „Office with id abc was not found"** zurück statt als 400. Referenzlösung
liegt ebenfalls auf dem Trainer-Branch (`create-appointment.dto.ts` + `…dto.spec.ts`).
Zwei Beobachtungen dazu, beide verifiziert: Das Swagger-Beispiel zeigt den String
`'1'`, der nur wegen SQLite-Typkonvertierung funktioniert und die Lücke damit
verdeckt; und weil `UpdateAppointmentDto` über `PartialType` die Validatoren erbt,
repariert der Fix automatisch auch `PATCH`.

Für sehr schnelle Gruppen als dritter Fund: `GET /appointments?status=irgendwas`
wird **nicht** geprüft — `@IsEnum` fehlt in `find-appointments.dto.ts`,
`@IsOptional()` allein reicht, um die `whitelist` zu überleben. Der Müllwert geht
bis in die Abfrage und liefert stillschweigend `[]`, also eine falsche Antwort
statt eines Fehlers. Verifiziert.

---

## 6. Block 2 — Aufgabe 2: Availability-Endpunkt (65 Min.)

Aufgabe: `tasks/task-2-office-availability.md`, Start-Prompt:
`prompts/task-2-availability.prompt.md`.

### Trainer-Notizen

- Referenzlösung liegt auf dem Trainer-Branch (`GET /offices/:id/availability`,
  `OfficeAvailabilityQueryDto`, `OfficeAvailabilitySlotDto`,
  `OfficesService.findAvailability`, Tests in `offices.service.spec.ts`). Nur zum
  Abgleich, nicht ausgeben.
- **Häufigster Fehler:** `@IsDateString()` auf `date` belassen. Dann bringt
  `?date=2026-06-30T12:00:00Z` den Endpunkt mit **500** zum Absturz. Verifiziert:
  das DTO lässt den Wert durch, danach wirft der Service
  `RangeError: Invalid time value` (`date.split('-')` → `NaN` → `Invalid Date` →
  `toISOString()`). Die beste Stelle des Tages für „valide DTO ≠ verwendbarer
  Wert". Fix: `@Matches(/^\d{4}-\d{2}-\d{2}$/)`.
- **Zweiter Klassiker:** Zeitzonen. `opensAt`/`closesAt` sind `"HH:MM"`-Strings
  und werden hier bewusst als **UTC**-Stunden behandelt. Wer „richtige"
  Zeitzonen-Behandlung anfängt, verliert sich — auf die Vereinfachung hinweisen.
- Slot-Ende `hour < closeHour` (nicht `<=`): der Slot, der um `closesAt` beginnen
  würde, entfällt.
- Tests, auf die du achten solltest: keine Buchungen → alle Slots; belegter Slot
  ausgeschlossen; angrenzende Slots erlaubt; leeres Ergebnis; ungültiges Datum
  → 400.

### Stretch für starke Gruppen

Vergangene Daten ablehnen; „Amt an dem Wochentag geschlossen".

---

## 7. Block 3 — Aufgabe 3: eigene Agenten + `contact-requests/` (95 Min.)

Aufgabe in `tasks/task-3-contact-requests.md`. Zwei Teile: **erst das Werkzeug
bauen, dann damit arbeiten.**

### Teil a — Agenten schreiben (~25 Min.)

Die Gruppen füllen die Gerüste `.claude/agents/architect.md` und
`.claude/agents/developer.md` aus. Vorbild ist `agents/reviewer.md` plus
`skills/module-review/SKILL.md`.

Sie dürfen sich dabei von Claude helfen lassen — das ist gewollt: Um einen guten
Agenten zu bekommen, müssen sie Claude erklären, was ein guter Architekt tun soll,
und genau diese Erklärung *ist* der Agent.

Worauf du beim Herumgehen achtest:

- **Wurde eine `tools`-Liste bewusst gewählt?** Die Frage „warum braucht der
  Architekt kein `Write`?" ist die beste Einzelfrage des Blocks. Wer sie
  beantworten kann, hat Subagenten verstanden.
- **Steht in jeder Datei eine echte Grenze?** Ohne „schreibt keinen Code" plant
  der Architekt nicht, sondern implementiert einfach.
- **Ist die `description` brauchbar?** Sie entscheidet, ob der Agent überhaupt
  gefunden wird.
- Häufigster Fehler: die Gerüste werden mit schönen Sätzen gefüllt, aber ohne
  Ausgabeformat. Ein Plan ohne festes Format ist nicht in zwei Minuten prüfbar.

Referenzfassungen zum Abgleich: `workshop/reference/`. Sparsam ausgeben.

### Teil b — Modul bauen (~70 Min.)

Ablauf: Feature fassen → **Architekt** → *Checkpoint Mensch* → **Developer** →
**Reviewer** → *Checkpoint Mensch* → Fixes → erneutes Review.

Kern: Entität `ContactRequest` (`name`, `email`, `subject`, `message`, `status`
als Enum, `submittedAt`), `POST` / `GET` (+ `?status=`) / `GET /:id` / `PATCH`,
kein `DELETE`, kein Seeding. Struktur wie `offices/` und `appointments/`.

Die drei Fachregeln, auf die es ankommt:

1. `submittedAt` setzt der Server, nicht der Client.
2. Neue Anfragen starten immer auf `new`.
3. **Nur `new → in_progress` und `in_progress → answered` sind erlaubt.**

> **Regel 3 ist der didaktische Kern des Tages.** Ein DTO kann prüfen, ob `status`
> ein *gültiger Wert* ist. Ob dieser Übergang aus dem *aktuellen* Zustand erlaubt
> ist, weiß nur der Service — er müsste dafür den gespeicherten Datensatz kennen.
> Wenn eine Gruppe die Übergangslogik ins DTO schreiben will, lass sie es
> versuchen und frag dann: „Woher weiß dein DTO, welchen Status der Datensatz
> gerade hat?" Das sitzt besser als jede Erklärung.

Erweiterungen (nur mit Puffer): vierter Status `rejected`; automatisches
`answeredAt`; Suche `?q=`; **`module-review` um Prüfpunkte für das eigene Modul
erweitern**.

Die letzte Erweiterung ist die wertvollste: Sie schärft ein Skill, das die Gruppe
selbst gerade benutzt hat, und übt die Faustregel aus §3.4 ein — ein Skill
enthält Wissen. Wer stattdessen fragt „soll ich ein Skill schreiben, das die drei
Agenten nacheinander aufruft?", bekommt die Gegenfrage: Was von deinem Wissen
stünde darin?

### Trainer-Notizen

- **Zeitgefahr.** Teil a hart auf 25 Minuten deckeln. Wer dort 45 Minuten
  verbrennt, erlebt den eigentlichen Workflow nicht mehr. Bei Überziehung:
  Referenzfassung geben und weitermachen.
- **Der Wert steckt in den Checkpoints.** Gruppen, die Plan und Findings
  durchwinken, machen die Übung falsch. Frag: „Was habt ihr am Plan geändert?
  Welches Finding habt ihr abgelehnt und warum?"
- Master-lastige Gruppen bekommen den expliziten Auftrag, die Agenten-Outputs zu
  **kritisieren** und eine Erweiterung anzugehen — idealerweise `module-review`.
- Typische Agenten-Fehler hier: `DELETE`-Endpunkt ungefragt; Entität aus dem
  Controller zurückgeben; `status` und `submittedAt` im Create-DTO zulassen;
  Übergangsprüfung im DTO statt im Service; `?status=`-Filter ohne `@IsEnum`;
  Tests, die nur `toBeDefined()` prüfen.
- **`npm run lint` nicht laufen lassen** — schreibt Dateien um, zerlegt den Diff.
  Steht in `settings.json` auf `deny`; erinnere die Gruppen trotzdem.
- DB zurücksetzen bei Schema-Ärger: `data/appointments.db` löschen (gitignored,
  wird per `synchronize: true` neu erzeugt).

---

## 8. Abschlusspräsentationen (25 Min., 4–7 Gruppen)

Format, **hart getaktet: 3 Minuten pro Gruppe**, ein Rechner am Beamer.

Damit das trägt, drei organisatorische Bedingungen:

- **Reihenfolge vorab aushängen**, spätestens beim Umbau um 16:25.
- **Ein Rechner, ein Kabel.** Nicht sechsmal umstöpseln — die Gruppen loggen sich
  nacheinander an derselben Maschine ein oder du sammelst die Repos vorher ein.
  Realistischer: Jede Gruppe zeigt vom eigenen Laptop, aber der Wechsel ist
  vorbereitet und zählt nicht zu den 3 Minuten.
- **Sichtbarer Timer.** Bei 3 Minuten ist Schluss, auch mitten im Satz. Das ist
  fair, wenn es vorher angesagt und bei der ersten Gruppe konsequent durchgezogen
  wird.

Jede Gruppe zeigt:

1. **Demo** in Swagger: eine Anfrage einreichen, den Status weiterschalten, einen
   **unerlaubten Übergang abgelehnt** bekommen.
2. **Ein Test**, kurz erklärt: was sichert er ab?
3. **Ein Satz Reflexion:** „Was hat ein Agent falsch gemacht und wie habt ihr es
   gemerkt?"

Keine Folien. Kein `git log`-Vorlesen. Kein Code-Durchscrollen.

Bei sieben Gruppen wird es eng (21 Min. plus Wechsel). Wenn du merkst, dass es
kippt: Punkt 2 streichen und nur Demo plus Reflexionssatz zeigen lassen — der
Reflexionssatz ist der wertvollste Teil und darf als letzter fallen.

---

## 9. Differenzierung nach Level

- **Gruppen mischen.** Nicht alle Erstsemester in eine Gruppe.
- Jede Aufgabe hat **Core + Stretch**. Core ist für alle Pflicht, Stretch fängt
  die Schnellen.
- Anfänger:innen: On-Ramp „lass dir erst einen Endpoint erklären". Fokus auf
  Lesen, Verstehen, `git diff`.
- Fortgeschrittene: Fokus auf Prompt-/Kontext-Qualität, Kritik an Plan und
  Review, Erweiterungen in Aufgabe 3.
- Wenn eine Gruppe früh fertig ist: `CLAUDE.md` weiter schärfen, oder den
  Reviewer-Agenten auf den eigenen Code loslassen und die Findings abarbeiten,
  oder eine Stretch-Variante aus Aufgabe 2.

---

## 10. Risiken & Gegenmittel

| Risiko | Gegenmittel |
|---|---|
| Gruppe kommt ohne fertiges Setup | **grösstes Zeitrisiko**, weil nur 20 Min. eingeplant sind: `SETUP.md` mit Vorlauf verschicken, Erledigung ankündigen, Ersatzgeräte bereithalten |
| `npm ci` / nativer `better-sqlite3`-Build scheitert | Ersatzgeräte, Cloud-Editor; `SETUP.md` §7 |
| Schwaches `CLAUDE.md`, niemand merkt es | Referenz-Vergleich nach Mittag, Rubrik in §5 |
| Aufgabe 2: 500 statt 400 bei Datetime | bekannt, gutes Lehrbeispiel — nicht „wegdebuggen", sondern zeigen |
| **Teil a von Aufgabe 3 frisst Teil b auf** | hart auf 25 Min. deckeln; bei Überziehung Referenzfassung aus `workshop/reference/` geben |
| Aufgabe 3 läuft aus der Zeit | Kern-Umfang ohne Erweiterungen, Ansage bei 30 Min. Rest |
| Gruppe winkt Plan/Findings durch | aktiv nachfragen, was sie geändert/abgelehnt haben |
| Agent überdehnt Scope (DELETE, Refactor) | Reviewer fängt es; als Lehrmoment nutzen |
| Übergangslogik landet im DTO | nicht korrigieren, sondern fragen: „woher kennt dein DTO den aktuellen Status?" |
| `npm run lint` zerlegt den Diff | steht in `settings.json` auf `deny`, mündlich erinnern |
| Präsentationen sprengen die Zeit | feste Reihenfolge, sichtbarer 3-Min-Timer, notfalls Punkt 2 streichen |
| DB-Schema klemmt nach Entity-Änderung | `data/appointments.db` löschen |

---

## 11. Nach dem Workshop

- Gruppen, die ihre Lösung behalten wollen: auf eigenen Branch pushen.
- Arbeitskopien / `data/appointments.db` lokal aufräumen.
- Kurzes Feedback einsammeln: Was war zu schnell/zu langsam? Hat der agentische
  Workflow in Aufgabe 3 den Aufwand wert gefühlt?
- Für die nächste Iteration: Domäne von Aufgabe 3 variieren. Beide Alternativen
  sind ebenfalls ohne Kopplung zu den Bestandsmodulen — `holidays/`
  (Feiertagskalender, am kleinsten, wiederholt aber die Datumslogik aus Aufgabe 2)
  und `announcements/` (Bekanntmachungen mit Veröffentlichungsfenster,
  feldübergreifende Validierung).
- Ebenfalls fürs nächste Mal prüfen: Hat Teil a von Aufgabe 3 gereicht? Wenn
  reihenweise Gruppen überzogen haben, sind entweder die Gerüste zu leer oder der
  Input-Block um 14:20 zu knapp.
