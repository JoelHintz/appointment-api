# Trainer-Guide: Ganztags-Workshop „Agentisches Coding"

Zielgruppe: Informatik-Studierende aller Level (Anfang Bachelor bis Ende Master),
gemischte Gruppen. Dauer: ein Tag, 9:00–17:00. Werkzeug: Claude Code in VS Code,
durchgehend mit dem Modell **Sonnet** (Kostenrahmen, siehe §3.5).
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
| 09:00–09:15 | Ankommen & Setup-**Rettung** | Zugänge einrichten, `npm test` stichprobenartig prüfen, Ersatzgeräte verteilen, Modell auf **Sonnet** stellen | Jede Gruppe lauffähig |
| 09:15–10:10 | **Vortrag**: Prinzipien agentischen Codings | siehe Abschnitt 4; `/init` einmal live vorführen | Mentales Modell |
| 10:10–10:25 | Pause | | |
| 10:25–10:40 | **App- & Swagger-Demo** | Die App einmal vorführen: `npm run start:dev`, Swagger unter `/api`, einen Termin anlegen, die Liste abrufen, einen Fehlerfall zeigen | Alle wissen, womit sie den ganzen Tag prüfen |
| 10:40–11:40 | **Block 1**: `CLAUDE.md` + Aufgabe 1 | **a)** App erkunden, Regeln benennen. **b)** `/init` + `CLAUDE.md` schärfen. **c)** `startHour`-Bug fixen | Codebasis verstanden, eigenes `CLAUDE.md`, erster Fix |
| 11:40–12:00 | **Auflösung Aufgabe 1** | Bug auflösen; die Rubrik aus §5 an **Gruppenergebnissen** durchgehen — noch **ohne** das Referenz-`CLAUDE.md` | „Was ist ein gutes `CLAUDE.md`" |
| 12:00–13:00 | Mittagspause | | |
| 13:00–14:00 | **Block 2**: Aufgabe 2 (Feature) | Availability-Endpunkt: Plan anfordern, reviewen, schrittweise umsetzen | Feature im Projektstil |
| 14:00–14:10 | **Auflösung Aufgabe 2** | Datums-Falle zeigen; **jetzt** das Referenz-`CLAUDE.md` zeigen — ab hier spoilert es nichts mehr | Vergleichsmaßstab |
| 14:10–14:40 | **Input**: Agenten & Skills | Wie ein Subagent aufgebaut ist; `reviewer` + `module-review` vorführen; Faustregel „Agent = Rolle, Skill = Wissen" an zwei Skill-Beispielen; die zwei Gerüste zeigen | Wissen, was in Teil a zu tun ist |
| 14:40–15:35 | **Block 3**, erste Hälfte | **a)** ~25 Min: eigene `architect`- und `developer`-Agenten schreiben. **b)** Start von `contact-requests/` | Eigene Agenten |
| 15:35–15:50 | Pause | | |
| 15:50–16:25 | **Block 3**, zweite Hälfte | `contact-requests/` fertig bauen und reviewen lassen | Reviewtes Modul |
| 16:25–16:30 | Umbau | | |
| 16:30–16:55 | **Abschlusspräsentationen** | **3 Min./Gruppe, hart getaktet**: Demo + „was hat der Agent falsch gemacht" | Teilen & Reflexion |
| 16:55–17:00 | Abschluss & Feedback | | |

Netto an Aufgaben: 3,5 h (60 / 60 / 90). Block 3 bleibt die engste Timebox —
plane die Minimalvariante fest ein (Abschnitt 7).

**Drei Dinge, die an diesem Zuschnitt hängen:**

- **Block 3 hat 90 Minuten, nicht 120.** Bei 9-Uhr-Start und einstündiger
  Mittagspause bleiben 420 Minuten Inhalt; die drei Aufgaben belegen davon 210,
  das Rahmenprogramm den Rest. Ein 120-Minuten-Block 3 ginge nur, wenn die
  Abschlusspräsentationen entfielen — und die tragen Lernziel 5. Wenn du Block 3
  doch dehnen willst, ist die **Auflösung von Aufgabe 2** (10 Min.) die einzige
  Stelle, an der ohne Substanzverlust etwas zu holen ist.
- **Das Referenz-`CLAUDE.md` kommt erst um 14:00.** Es beschreibt die
  Availability-Implementierung und die Datums-Falle, also die Lösung von
  Aufgabe 2. Um 11:40 gehst du die Rubrik deshalb an **Gruppenergebnissen**
  durch, nicht an der Referenz. So brauchst du keine gekürzte Handout-Fassung.
- **Die 15 Minuten „Ankommen" tragen nur, wenn das Setup wirklich Hausaufgabe
  war.** Das ist laut Abschnitt 10 das größte Zeitrisiko des Tages; bei einer
  Havarie nimmst du die Zeit aus dem Vortrag, nicht aus Aufgabe 1.

**Setup ist Hausaufgabe.** `SETUP.md` geht mit ausreichend Vorlauf raus und
verlangt ausdrücklich, dass die Gruppen `npm ci`, `npm run start:dev` und
`npm test` vorher einmal ausgeführt haben. Die 15 Minuten am Morgen sind für
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
| `agents/architect.md` | **Gerüst** — Abschnitte leer, Leitfragen als Kommentare; `model: sonnet` bereits gesetzt |
| `agents/developer.md` | **Gerüst**, ebenfalls mit `model: sonnet` |
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
**Schreiben muss ihn die Hauptsitzung** — der Architekt hat bewusst kein
Schreibwerkzeug und kann die Datei nicht selbst anlegen.

### 3.3 `workshop/reference/`

| Datei | Entspricht | Wofür |
|---|---|---|
| `agent-architect.md` | `.claude/agents/architect.md` | Maßstab beim Herumgehen, Rettungsanker |
| `agent-developer.md` | `.claude/agents/developer.md` | dito |
| `skill-nest-feature-module.md` | — (bei den Gruppen nicht vorhanden) | Demo-Artefakt für den Input-Block um 14:20 |

Rettungsanker sparsam einsetzen — das Schreiben ist die Übung.

### Testlauf vor dem Workshop

Die Gerüste sind nicht lauffähig, und das Demo-Skill liegt außerhalb von
`.claude/` — beides muss für einen Test erst installiert werden.

**Installieren.** Die Referenzfassungen kommen unter **eigenen Namen** dazu, statt
die Gerüste zu überschreiben. Damit gibt es keinen Rückbau, den man vergessen
kann, und die Gerüste sind nie in Gefahr:

```bash
sed 's/^name: architect$/name: architect-ref/' workshop/reference/agent-architect.md > .claude/agents/architect-ref.md
sed 's/^name: developer$/name: developer-ref/' workshop/reference/agent-developer.md > .claude/agents/developer-ref.md
mkdir -p .claude/skills/nest-feature-module
cp workshop/reference/skill-nest-feature-module.md .claude/skills/nest-feature-module/SKILL.md
```

**Wieder entfernen.** Restlos, ohne git:

```bash
rm -f .claude/agents/architect-ref.md .claude/agents/developer-ref.md
rm -rf .claude/skills/nest-feature-module
```

#### T1 — Rauchtest (1 Min)

`/agents` muss `reviewer`, `architect`, `developer`, `architect-ref` und
`developer-ref` listen. Die Skills `module-review` und `nest-feature-module`
müssen auftauchen. Findet Claude etwas davon nicht, stimmt das Frontmatter nicht.

Prüfe dabei gleich, dass die **Gerüste** als unbrauchbar erkennbar sind: Ihre
`description` beginnt mit „UNVOLLSTÄNDIG".

#### T2 — Reviewer allein (5 Min)

Der Reviewer braucht einen Diff. Bau dir absichtlich einen schlechten: Ergänze in
`src/offices/offices.controller.ts` eine `@Delete(':id')`-Route, die das
Entity-Objekt direkt zurückgibt, und einen Test, der nur `toBeDefined()` prüft.

Dann: *„Nutze den reviewer-Agenten für die aktuellen Änderungen."*

Er muss drei Dinge treffen: den unerbetenen `DELETE`, die zurückgegebene Entity
statt eines DTO und den substanzlosen Test. Und er darf **nichts** ändern —
`git status` muss danach unverändert aussehen. Verwirf den Testdiff anschließend.

Das ist der wichtigste Einzeltest: Der Reviewer ist das einzige Werkzeug, das die
Gruppen fertig bekommen, und das Vorbild, an dem sie ihre eigenen Agenten bauen.

#### T3 — Volle Kette (~70 Min, misst das Zeitbudget)

**Voraussetzung: möglichst sauberer Arbeitsbaum.** Der Reviewer prüft `git diff` —
liegt dort noch anderes herum, bewertet er das mit. Committe Offenes vorher.

Ganz sauber wird der Baum hier allerdings nicht: Die oben installierten
`-ref`-Agenten und das Demo-Skill liegen zwangsläufig als untracked herum, und
committen willst du sie nicht. **Grenze den Reviewer in Schritt 4 deshalb
ausdrücklich auf `src/` und `test/` ein.**

Die vier Schritte, direkt einfügbar. Der Fachtext ist der aus
`workshop/prompts/task-3-contact-requests.prompt.md`, ohne dessen Trainer-Vorspann:

**1 — Architekt**

> Nutze den `architect-ref`-Agenten. Plane ein neues Feature-Modul
> `contact-requests/` für diese Appointment API. Eine Kontaktanfrage ist eine
> Nachricht, die eine Bürgerin oder ein Bürger an die Verwaltung schickt und die
> dort einen Bearbeitungsstatus durchläuft. Das Modul steht für sich — keine
> Beziehung zu `Office` oder `Appointment`.
>
> Entität `ContactRequest`: `id`, `name`, `email`, `subject`, `message`, `status`
> (Enum `new` / `in_progress` / `answered`), `submittedAt`. Endpunkte:
> `POST /contact-requests`, `GET /contact-requests` mit optionalem `?status=`,
> `GET /contact-requests/:id`, `PATCH /contact-requests/:id`, kein `DELETE`.
>
> Fachliche Regeln, die in den Service gehören: `submittedAt` setzt der Server;
> neue Anfragen starten auf `new`; erlaubt sind nur `new → in_progress` und
> `in_progress → answered`, sonst `400`; unbekannte `id` → `404`.
>
> Kein Seeding. Erweiterungen (`rejected`, `answeredAt`, Suche) nur als offene
> Punkte notieren, nicht planen.

**2 — Checkpoint.** Plan lesen. Offene Fragen beantworten, Überflüssiges streichen.

**3 — Developer**

> Schreib den freigegebenen Plan nach `plan.md` und lass ihn dann vom
> `developer-ref`-Agenten umsetzen.

**4 — Reviewer**

> Nutze den `reviewer`-Agenten für die aktuellen Änderungen in `src/` und
> `test/`. Die installierten `-ref`-Agenten und das Demo-Skill gehören nicht
> zum Review.

Prüfe: Hält der Architekt sich daran, keinen Code zu schreiben? Folgt der
Developer dem Plan und meldet Abweichungen? Bleibt `npm test` grün? Und vor
allem: **wie lange dauert es?** Das 70-Minuten-Budget für Teil b ist geschätzt,
nicht gemessen. Das Ergebnis ist zugleich deine Referenzlösung für Aufgabe 3.

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

### 3.5 Kostenrahmen: durchgehend Sonnet

Der Workshop läuft acht Stunden mit mehreren Gruppen parallel. Damit der
Verbrauch planbar bleibt, arbeiten alle durchgehend mit **Sonnet**. Die Vorgabe
steht an vier Stellen, damit sie nicht an einer einzelnen Erinnerung hängt:

| Stelle | Was dort steht |
|---|---|
| `SETUP.md` §2.4 und Checkliste | `/model sonnet` direkt nach der Anmeldung |
| `TASK.md`, Abschnitt „Arbeitsweise" | dieselbe Ansage für den ganzen Tag |
| `.claude/agents/*.md` | `model: sonnet` im Frontmatter aller drei Agenten |
| Zeitplan, 09:00–09:15 | du stellst es beim Einrichten der Zugänge gemeinsam ein |

**Der wichtigste Hebel ist die Hauptsitzung**, nicht die Subagenten: Architekt
und Reviewer laufen je ein- bis zweimal auf kleinen Eingaben, während die
Hauptsitzung den ganzen Tag über läuft. Wenn du beim Herumgehen nur eine Sache
prüfst, dann die Modellanzeige der Sitzung.

In den beiden Gerüsten steht die `model:`-Zeile bereits drin, mit einem Kommentar,
dass sie stehen bleiben soll. Der Grund: Die Gruppen füllen das Frontmatter in
Aufgabe 3 selbst aus — eine Vorgabe, die sie selbst formulieren müssten, wäre
keine.

> **Achtung beim Portieren:** `SETUP.md` wird laut `RELEASE_TO_MAIN.md` auf `main`
> gepflegt und **nicht** vom Entwicklungsbranch übernommen. Die Sonnet-Absätze
> dort müssen direkt auf `main` nachgezogen werden.

### 3.6 Ersatzgeräte

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

## 5. Block 1 — App, `CLAUDE.md` und Aufgabe 1 (60 Min.)

Aufgabe: `tasks/task-1-explore-and-bugfix.md`. Sie deckt den ganzen Block ab und
hat drei aufeinander aufbauende Teile:

| Teil | ~Zeit | Inhalt |
|---|---|---|
| a | 15 Min | App in Swagger erkunden, die drei Termin-Regeln selbst benennen |
| b | 25 Min | `/init`, Ergebnis kritisch nachbessern gegen eine Prüfliste |
| c | 20 Min | Den `startHour`-Bug finden und beheben |

**Die drei Teile sind absichtlich verzahnt.** In Teil a arbeiten die Gruppen die
Regel „ein Termin beginnt zur vollen Stunde" heraus, in Teil b schreiben sie sie
in ihr `CLAUDE.md` — und in Teil c stellen sie fest, dass der Code sie nur halb
durchsetzt. Genau diese Pointe trägt den Block; wenn du beim Herumgehen merkst,
dass eine Gruppe Teil a überspringt, hol sie zurück.

### Trainer-Notizen

- Erstsemester brauchen in Teil a länger — das ist in Ordnung, das ist der
  Lernkern. Teil c ist mit 20 Minuten großzügig bemessen und hat zwei
  dokumentierte Zusatzaufgaben für schnelle Gruppen.
- Die Fragen am Ende von Teil a sollen sie **ohne** Claude beantworten. Wer sie
  nicht beantworten kann, hat gelesen statt verstanden.
- Die vierte Frage („etwas, das die API verspricht und nie einlösen kann")
  zielt auf `?status=canceled`: Der Filter existiert, aber **keine Route kann
  `status` setzen** — `UpdateAppointmentDto` erbt nur `title`, `officeId`,
  `date` und `startHour`. Das Ergebnis ist also immer `[]`. Wer das findet, hat
  Controller, DTO und Entity zusammen gelesen.
- **Unit-Tests sind in Aufgabe 1 und 2 bewusst optional.** Der Pflichtnachweis
  ist eine konkrete Swagger-Prüfung plus ein grünes `npm test`. Begründung: Der
  Test kostete in der 85-Minuten-Fassung ein Drittel der Zeit für Teil c, und
  unsichere Gruppen übernehmen unter Zeitdruck ungelesen, was Claude schreibt —
  das ist schlechter als kein Test. Die Referenzlösungen im Repository bleiben
  vollständig getestet.
- **Folge für Aufgabe 3:** Der Reviewer-Agent wird fehlende Tests als Finding
  melden. Das ist erwünscht und zeigt ihn bei der Arbeit — kein Materialfehler.
- **Direkt vor der Mittagspause** (11:40–12:00): Bug auflösen, danach die Rubrik
  unten an zwei, drei **Gruppenergebnissen** durchgehen. Frage: Was fehlt? Was ist
  zu vage? Was ist zu viel?

> **Achtung, Spoiler.** Nimm dafür **nicht** das `CLAUDE.md` des Trainer-Branchs.
> Es beschreibt die Availability-Implementierung *und* die Datums-Falle — also
> die Lösung von Aufgabe 2, die um 13:00 startet. Das Referenz-`CLAUDE.md` zeigst
> du um **14:00**, nach der Auflösung von Aufgabe 2. Dann brauchst du auch keine
> gekürzte Handout-Fassung.

### „Woran erkennt man ein gutes `CLAUDE.md`" (Rubrik)

- **Kommandos stimmen und sind vollständig** (`npm test`, ein einzelner Test,
  `build`, `start:dev`, Hinweis dass `lint` Dateien umschreibt).
- **Domänenregeln explizit**: ein Slot ist `date` + volle `startHour` in Ortszeit
  des Amts, keine zwei Termine pro Amt im selben Slot, `endHour = startHour + 1`
  abgeleitet.
- **Architektur in 3–5 Sätzen**: zwei Feature-Module, `ValidationPipe` global in
  `main.ts`, Swagger unter `/api`, DTOs statt Entities, Mapping-Stelle.
- **Konventionen**: Feature-first, plural Ordner/Routen, singular Entity/DTO,
  kein `DELETE`.
- **Fallen benannt**, v. a. dass `@IsISO8601()`/`@IsDateString()` auch Datetimes
  akzeptieren und ein Datumsfeld deshalb `@Matches` braucht.
- **Kein Roman.** Eine Bildschirmseite reicht. Alles, was nicht das Verhalten des
  Agenten ändert, ist Ballast.

### Teil c — der `startHour`-Bug, zum Auflösen um 11:40

Referenzlösung auf dem Trainer-Branch: `@Min(0)` und `@Max(23)` an `startHour` in
`src/appointments/dto/create-appointment.dto.ts` plus zwei Tests in
`create-appointment.dto.spec.ts`.

**Was passiert.** Verifiziert gegen die laufende App:

```
POST {"title":"Stunde 25","officeId":1,"date":"2026-06-20","startHour":25}
→ 201  {"id":3, …, "startHour":25, "endHour":26, …}

POST {…,"startHour":9.5}   → 400  "startHour must be an integer number"
GET  /offices/1/availability?date=2026-06-20  → Stunde 25 kommt nicht vor
```

`startHour` ist als `@IsInt()` deklariert, aber ohne Bereich. Die Stunde 25 ist
eine gültige ganze Zahl, also kommt sie durch; der Service leitet stumpf
`endHour: 26` ab. Der Termin belegt damit einen Slot, den keine Liste je anzeigt
— er ist gebucht und unsichtbar zugleich.

**Der Fix:** `@Min(0) @Max(23)` an `startHour`. Zwei Dekoratoren, eine Datei.

**Drei Punkte fürs Auflösen:**

1. **Eine halbe Prüfung ist gefährlicher als gar keine.** Dass `9.5` abgelehnt
   wird, erzeugt den Eindruck, `startHour` sei validiert. Frag die Gruppe, wann
   ihnen das aufgefallen ist.
2. **Formregeln gehören ins DTO, Fachregeln in den Service.** Der Fix gehört ins
   DTO, weil „eine Stunde hat einen Wertebereich" nichts über Ämter oder Termine
   weiß. Die Zusatzaufgabe mit den Öffnungszeiten ist die Gegenprobe: Die gehört
   in den Service, weil sie das Amt kennen muss.
3. **Die Verzahnung sichtbar machen.** Lass eine Gruppe ihre Regel aus dem
   `CLAUDE.md` vorlesen und daneben die Antwort mit `endHour: 26` zeigen. Eine
   dokumentierte Invariante, die der Code nur halb hält — das ist der Moment, für
   den der Block gebaut ist.

Erwähnenswert beim Auflösen: Der ganze Vertrag ist bewusst eng geschnitten.
Weil ein Termin `date` + `startHour` trägt statt eines Zeitstempels, gibt es
halbe Stunden, Sekunden und Zeitzonen-Offsets gar nicht erst — der einzige
ungültige Zustand, der übrig blieb, war der Wertebereich. Das ist die
allgemeine Lehre: **Verträge eng schneiden, statt Fallen zu dokumentieren.**

### Zusatzaufgaben und weitere Funde

Die Aufgabe nennt zwei Zusatzaufgaben. Die **zweite** ist die interessantere:
Termine außerhalb der Öffnungszeiten ablehnen. Sie gehört in den Service (die
Prüfung muss das Amt laden), und weil `UpdateAppointmentDto` über `PartialType`
die Validatoren erbt, während eine Service-Prüfung explizit in `update()` stehen
muss, fällt dabei ganz nebenbei die Frage an: „Gilt eure neue Regel auch für
`PATCH`?" Gute Stelle, um den Unterschied DTO/Service festzuklopfen.

Zwei weitere Funde für sehr schnelle Gruppen, beide verifiziert:

- `GET /appointments?status=irgendwas` wird **nicht** geprüft — `@IsEnum` fehlt
  in `find-appointments.dto.ts`, `@IsOptional()` allein reicht, um die
  `whitelist` zu überleben. Der Müllwert geht bis in die Abfrage und liefert
  stillschweigend `[]`, also eine falsche Antwort statt eines Fehlers.
- `title` hat nur `@IsNotEmpty()` und keinen `@IsString()`. `"title": 123` wird
  mit `201` angenommen und steht als **Zahl** in der Antwort; `{"a":1}` erzeugt
  ein `500` aus dem SQLite-Treiber. Der Lehrsatz dazu ist stark: `title!: string`
  ist eine Compile-Zeit-Behauptung, zur Laufzeit ist davon nichts übrig.

---

## 6. Block 2 — Aufgabe 2: Availability-Endpunkt (60 Min.)

Aufgabe: `tasks/task-2-office-availability.md`, Start-Prompt:
`prompts/task-2-availability.prompt.md`.

### Trainer-Notizen

- Referenzlösung liegt auf dem Trainer-Branch (`GET /offices/:id/availability`,
  `OfficeAvailabilityQueryDto`, `OfficeAvailabilitySlotDto`,
  `OfficesService.findAvailability`, Tests in `offices.service.spec.ts`). Nur zum
  Abgleich, nicht ausgeben.
- **Häufigster Fehler:** `@IsDateString()` statt `@Matches` auf `date`. Dann
  kommt `?date=2026-06-30T12:00:00Z` durch die Validierung, die Abfrage findet
  keinen einzigen Termin, und der unsinnige Wert wird in jedem Slot
  zurückgespiegelt. Die Antwort sieht **korrekt aus** und ist trotzdem falsch —
  kein Absturz, der die Gruppe warnt. Die beste Stelle des Tages für „valide DTO
  ≠ verwendbarer Wert". Fix: `@Matches(/^\d{4}-\d{2}-\d{2}$/)`.
- **Zweiter Klassiker:** Zeitzonen. Es gibt hier keine. `date` und `startHour`
  sind Ortszeit des Amts, `opensAtHour`/`closesAtHour` ebenfalls, und die API
  rechnet nichts um. Wer anfängt, `Date`-Objekte zu bauen, hat den Vertrag nicht
  gelesen — zurückholen.
- Slot-Ende `hour < closesAtHour` (nicht `<=`): der Slot, der um `closesAtHour`
  beginnen würde, entfällt.
- **Tests sind hier optional**, die Nachweis-Tabelle in der Aufgabe ist der
  Pflichtteil. Wenn eine Gruppe doch testet, achte auf: keine Buchungen → alle
  Slots; belegter Slot ausgeschlossen; angrenzende Slots erlaubt; leeres
  Ergebnis; ungültiges Datum → 400.
- **`@ApiProperty()` bleibt Pflicht**, an Query- und Response-DTO. In
  `nest-cli.json` ist kein Swagger-CLI-Plugin konfiguriert — ohne die Dekoratoren
  zeigt Swagger einen leeren Body, und die Gruppe kann ihre eigene Lösung nicht
  ausprobieren. Wenn jemand meldet „der Endpunkt geht nicht", schau zuerst dort
  hin.

### Stretch für starke Gruppen

Vergangene Daten ablehnen; „Amt an dem Wochentag geschlossen".

---

## 7. Block 3 — Aufgabe 3: eigene Agenten + `contact-requests/` (90 Min.)

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

### Teil b — Modul bauen (~65 Min.)

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
- **`plan.md` schreibt der Architekt nicht selbst.** Er hat nur `Read`, `Grep`,
  `Glob`; Schreiben würde seine Grenze aufheben. Den freigegebenen Plan speichert
  die Hauptsitzung. Wer das „repariert", indem er dem Architekten `Write` gibt,
  hat die Entscheidung aus Teil a zurückgenommen — frag nach, was der Architekt
  damit jetzt sonst noch darf.
- **Reviewer auf `src/` und `test/` eingrenzen.** Im Arbeitsbaum liegen auch die
  Agent-Dateien aus Teil a. Ohne Eingrenzung reviewt er die eigenen Prompts der
  Gruppe mit, und die Findings verwässern.
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
| Gruppe kommt ohne fertiges Setup | **grösstes Zeitrisiko**, weil nur 15 Min. eingeplant sind: `SETUP.md` mit Vorlauf verschicken, Erledigung ankündigen, Ersatzgeräte bereithalten |
| `npm ci` / nativer `better-sqlite3`-Build scheitert | Ersatzgeräte, Cloud-Editor; `SETUP.md` §7 |
| Schwaches `CLAUDE.md`, niemand merkt es | Referenz-Vergleich nach Mittag, Rubrik in §5 |
| Aufgabe 2: Datetime kommt durch und liefert still eine falsche Liste | bekannt, gutes Lehrbeispiel — nicht „wegdebuggen", sondern zeigen |
| Aufgabe 2: Endpunkt in Swagger nicht bedienbar | `@ApiProperty()` an den DTOs fehlt; kein Swagger-CLI-Plugin im Projekt |
| Gruppe liefert ohne jede Prüfung ab („Claude sagt, es geht") | Nachweis-Tabelle der Aufgabe einfordern — sie ersetzt den Test, nicht das Prüfen |
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
