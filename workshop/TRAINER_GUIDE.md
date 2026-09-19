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
4. **eigene Subagenten und ein eigenes Skill schreiben** und mit ihnen einen
   Workflow (Architekt → Developer → Reviewer) fahren, dessen Ergebnisse sie
   bewerten statt blind zu übernehmen;
5. benennen, wo AI-Assistenz hilft und wo menschliches Review unverzichtbar ist.

Die durchgehende Botschaft: **Der Mensch bleibt verantwortlich. Kontext (CLAUDE.md,
Skills, klare Prompts) ist die eigentliche Arbeit; Code-Erzeugung ist der leichte
Teil.**

---

## 2. Zeitplan (9:00–17:00)

| Zeit | Block | Inhalt | Ergebnis |
|---|---|---|---|
| 09:00–09:15 | Ankommen & Setup-**Rettung** | Zugänge einrichten, `npm test` stichprobenartig prüfen, Ersatzgeräte verteilen, Modell auf **Sonnet** stellen | Jede Gruppe lauffähig |
| 09:15–10:10 | **Vortrag**: Prinzipien agentischen Codings | siehe Abschnitt 4; `/init` einmal live vorführen — ausdrücklich als *Entwurf*, den die Gruppen später **nicht** als Startpunkt nehmen | Mentales Modell |
| 10:10–10:25 | Pause | | |
| 10:25–10:40 | **App- & Swagger-Demo** | Die App einmal vorführen: `npm run start:dev`, Swagger unter `/api`, einen Termin anlegen, die Liste abrufen, einen Fehlerfall zeigen | Alle wissen, womit sie den ganzen Tag prüfen |
| 10:40–10:45 | **Vorstellung Aufgabe 1** | Die drei Teile und das Abgabekriterium nennen, nicht den Weg dorthin | Alle wissen, was zu tun ist |
| 10:45–11:50 | **Block 1**: `CLAUDE.md` + Aufgabe 1 | **a)** Erkundungskarte: Swagger zuerst, dann der Code mit Claude. **b)** `CLAUDE.md` selbst schreiben, dann von Claude prüfen lassen. **c)** Härtetest: Funde sammeln, den `startHour`-Fund fixen | Codebasis verstanden, eigenes `CLAUDE.md`, erster Fix |
| 11:50–12:00 | **Auflösung Aufgabe 1** (10 Min., hart) | Kurz Funde einsammeln, Bug auflösen, Rubrik aus §5 an **einer** Gruppen-`CLAUDE.md` — noch **ohne** das Referenz-`CLAUDE.md` | „Was ist ein gutes `CLAUDE.md`" |
| 12:00–13:00 | Mittagspause (60 Min.) | | |
| 13:00–13:05 | **Vorstellung Aufgabe 2** | Endpunkt und Abgabekriterium nennen; zugleich der Wiedereinstieg nach dem Essen | Alle wissen, was zu tun ist |
| 13:05–14:05 | **Block 2**: Aufgabe 2 (Feature) | Availability-Endpunkt: Plan anfordern, reviewen, schrittweise umsetzen | Feature im Projektstil |
| 14:05–14:10 | **Auflösung Aufgabe 2** (5 Min., hart) | Referenz-`CLAUDE.md` zeigen — ab hier spoilert es nichts mehr —, dann **eine** Frage; welche, entscheidest du beim Herumgehen (§6) | Vergleichsmaßstab, Brücke zu Aufgabe 3 |
| 14:10–14:35 | **Input**: Agenten & Skills | Wie ein Subagent aufgebaut ist; `reviewer` + `module-review` vorführen; Faustregel „Agent = Rolle, Skill = Wissen" an zwei Skill-Beispielen | Mentales Modell für Agenten |
| 14:35–14:40 | **Vorstellung Aufgabe 3** | Die drei Gerüste zeigen, Teil a und Teil b abgrenzen, die 35-Minuten-Deckelung ansagen | Wissen, was in Teil a zu tun ist |
| 14:40–15:35 | **Block 3**, erste Hälfte | **a)** ~35 Min: eigene `architect`- und `developer`-Agenten plus das Skill `nest-feature-module` schreiben. **b)** Start von `applicants/` | Eigenes Werkzeug |
| 15:35–15:50 | Pause | | |
| 15:50–16:25 | **Block 3**, zweite Hälfte | `applicants/` fertig bauen und reviewen lassen | Reviewtes Feature |
| 16:25–16:30 | Umbau | | |
| 16:30–16:55 | **Abschlusspräsentationen** | **3 Min./Gruppe, hart getaktet**: Demo + „was hat der Agent falsch gemacht" | Teilen & Reflexion |
| 16:55–17:00 | Abschluss & Feedback | | |

Netto an Aufgaben: 3,58 h (65 / 60 / 90), dazu 15 Minuten Aufgabenvorstellung
und 15 Minuten Auflösung. Block 3 bleibt die engste Timebox — plane die
Minimalvariante fest ein (Abschnitt 7).

**Fünf Dinge, die an diesem Zuschnitt hängen:**

- **Die Auflösungen sind kurz, weil Aufgabe 1 die Zeit braucht.** Über den
  ganzen Tag gerechnet gilt `Auflösung 1 + Auflösung 2 + Block 1 = 80 Minuten` —
  und zwar unabhängig davon, wo die Mittagspause liegt. Jede Minute
  Nachbesprechung geht also direkt von Aufgabe 1 ab. Der Zuschnitt 10 / 5 / 65
  ist die Antwort darauf: Die Auflösung von Aufgabe 2 schrumpft auf das
  Referenz-`CLAUDE.md` plus eine Frage, die von Aufgabe 1 behält gerade so die
  Rubrik-Runde. Wenn du
  Aufgabe 1 auf 70 Minuten bringen willst, ist die einzige verbleibende Stelle
  die **App-Demo um 10:25** (15 → 10 Min.) — die Gruppen sehen Swagger in Teil a
  ohnehin selbst noch einmal.
- **Die 5 Minuten für die Auflösung von Aufgabe 2 sind erzwungen, nicht
  gewählt.** Der Nachmittag hat 240 Minuten; Vorstellung, Block 2, Input,
  Vorstellung, Block 3, Pause, Umbau, Präsentationen und Abschluss belegen davon
  235. Mehr ist dort nicht zu holen, ohne an Block 3 oder den
  Abschlusspräsentationen zu schneiden. Das Fenster trägt deshalb genau zwei
  Minuten Referenz-`CLAUDE.md` und **eine** Frage. Welche Frage, steht nicht
  fest — §6 gibt dir die Entscheidungsregel und den Grund dafür. Alles andere
  aus den Trainer-Notizen sagst du der einzelnen Gruppe beim Herumgehen.
- **Vor jeder Aufgabe stehen 5 Minuten Vorstellung.** Sie nennen Umfang und
  Abgabekriterium, nicht den Lösungsweg — sonst nimmst du der Aufgabe genau das,
  wofür sie gebaut ist. Die Vorstellung von Aufgabe 3 ist aus dem Input-Block
  herausgelöst (30 → 25 Minuten), kostet also keine zusätzliche Zeit; die von
  Aufgabe 2 um 13:05 ist zugleich der Wiedereinstieg nach dem Essen.
- **Block 3 hat 90 Minuten, nicht 120.** Bei 9-Uhr-Start bleiben gut 420 Minuten
  Inhalt; die drei Aufgaben belegen davon 215, Vorstellungen, Auflösungen und
  Rahmenprogramm den Rest. Ein 120-Minuten-Block 3 ginge nur, wenn die
  Abschlusspräsentationen entfielen — und die tragen Lernziel 5.
- **Das Referenz-`CLAUDE.md` kommt erst um 14:05.** Es beschreibt die
  Availability-Implementierung und die Datums-Falle, also die Lösung von
  Aufgabe 2. Um 11:50 gehst du die Rubrik deshalb an einem **Gruppenergebnis**
  durch, nicht an der Referenz. So brauchst du keine gekürzte Handout-Fassung.
- **Die 15 Minuten „Ankommen" tragen nur, wenn das Setup wirklich Hausaufgabe
  war.** Das ist laut Abschnitt 10 das größte Zeitrisiko des Tages; bei einer
  Havarie nimmst du die Zeit aus dem Vortrag, nicht aus Aufgabe 1.

**Der lange Nachmittagsblock.** Von 13:00 bis 15:35 läuft der Tag ohne echte
Pause durch. Die längste *aktive* Strecke ist trotzdem nur 60 Minuten: In der
Mitte liegen 35 Minuten Zuhören (Auflösung 2, Input, Vorstellung 3). Sag dort
ausdrücklich „steht kurz auf", und sag in beiden Arbeitsblöcken an, dass Pausen
nach Bedarf genommen werden — die Gruppen arbeiten selbstgesteuert, es muss
niemand sitzen bleiben. Der bewusst in Kauf genommene Preis der 12-Uhr-Pause ist,
dass Block 2 um 13:05 direkt ins Suppenkoma fällt; die 5 Minuten Vorstellung
davor sind der Weckruf und sollten wach gehalten werden.

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
| `skills/nest-feature-module/SKILL.md` | **Gerüst** — das Bauwissen, Gegenstück zu `module-review` |
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
| `skill-nest-feature-module.md` | `.claude/skills/nest-feature-module/SKILL.md` | Maßstab für das Skill aus Teil a, zugleich Demo-Artefakt für den Input-Block um 14:10 |

Rettungsanker sparsam einsetzen — das Schreiben ist die Übung.

### Testlauf vor dem Workshop

Die drei Gerüste sind nicht lauffähig — für einen Test müssen die
Referenzfassungen erst installiert werden.

**Installieren.** Die Referenzfassungen kommen unter **eigenen Namen** dazu, statt
die Gerüste zu überschreiben. Damit gibt es keinen Rückbau, den man vergessen
kann, und die Gerüste sind nie in Gefahr:

```bash
sed 's/^name: architect$/name: architect-ref/' workshop/reference/agent-architect.md > .claude/agents/architect-ref.md
sed 's/^name: developer$/name: developer-ref/' workshop/reference/agent-developer.md > .claude/agents/developer-ref.md
mkdir -p .claude/skills/nest-feature-module-ref
sed 's/^name: nest-feature-module$/name: nest-feature-module-ref/' workshop/reference/skill-nest-feature-module.md > .claude/skills/nest-feature-module-ref/SKILL.md
```

Das Skill-Gerüst der Gruppen liegt selbst unter
`.claude/skills/nest-feature-module/` — die Referenz kommt deshalb ebenfalls unter
eigenem Namen daneben und überschreibt es nicht.

**Wieder entfernen.** Restlos, ohne git:

```bash
rm -f .claude/agents/architect-ref.md .claude/agents/developer-ref.md
rm -rf .claude/skills/nest-feature-module-ref
```

#### T1 — Rauchtest (1 Min)

`/agents` muss `reviewer`, `architect`, `developer`, `architect-ref` und
`developer-ref` listen. Die Skills `module-review`, `nest-feature-module` und
`nest-feature-module-ref` müssen auftauchen. Findet Claude etwas davon nicht,
stimmt das Frontmatter nicht.

Prüfe dabei gleich, dass die **drei Gerüste** als unbrauchbar erkennbar sind:
Ihre `description` beginnt mit „UNVOLLSTÄNDIG".

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

#### T3 — Volle Kette (~60 Min, misst das Zeitbudget)

**Voraussetzung: möglichst sauberer Arbeitsbaum.** Der Reviewer prüft `git diff` —
liegt dort noch anderes herum, bewertet er das mit. Committe Offenes vorher.

Ganz sauber wird der Baum hier allerdings nicht: Die oben installierten
`-ref`-Agenten und das Referenz-Skill liegen zwangsläufig als untracked herum, und
committen willst du sie nicht. **Grenze den Reviewer in Schritt 4 deshalb
ausdrücklich auf `src/` und `test/` ein.**

**Und: Auf diesem Branch existiert `src/applicants/` bereits** — es ist die
Referenzlösung. Für einen ehrlichen Durchlauf brauchst du einen Baum ohne sie,
also `main` mit eingespieltem Material (§3.1) oder einen Branch, auf dem du das
Modul und die Appointment-Änderungen vorher entfernst. Sonst plant der Architekt
gegen eine Lösung, die schon dasteht.

Die vier Schritte, direkt einfügbar. Der Fachtext ist der aus
`workshop/prompts/task-3-applicants.prompt.md`, ohne dessen Trainer-Vorspann:

**1 — Architekt**

> Nutze den `architect-ref`-Agenten. Plane ein neues Feature-Modul `applicants/`
> für diese Appointment API und die Beziehung vom Termin dorthin. Ein Termin
> kennt bisher nur Datum, Startstunde, Amt und einen Freitext-Titel — die API
> weiß nicht, wer kommt.
>
> Entität `Applicant`: `id`, `firstName`, `lastName`, `email`, `birthDate`
> (Kalenderdatum). Endpunkte: `POST /applicants`, `GET /applicants`,
> `GET /applicants/:id`, kein `PATCH`, kein `DELETE`. Am Termin kommt
> `applicantId` beim Anlegen dazu, optional; die Entitätsspalte bleibt
> `nullable`, und die Terminantwort zeigt die Person wie heute das Amt.
>
> Fachliche Regeln, die in den Service gehören: unbekannte `applicantId` → `404`;
> eine Person hat pro Amt und Tag höchstens einen Termin, sonst `400`.
>
> Kein Seeding. Erweiterungen (`applicantId` verpflichtend, eindeutige E-Mail,
> `GET /applicants/:id/appointments`) nur als offene Punkte notieren, nicht
> planen.

**2 — Checkpoint.** Plan lesen. Offene Fragen beantworten, Überflüssiges streichen.

**3 — Developer**

> Schreib den freigegebenen Plan nach `plan.md` und lass ihn dann vom
> `developer-ref`-Agenten umsetzen.

**4 — Reviewer**

> Nutze den `reviewer`-Agenten für die aktuellen Änderungen in `src/` und
> `test/`. Die installierten `-ref`-Agenten und das Referenz-Skill gehören nicht
> zum Review.

Prüfe: Hält der Architekt sich daran, keinen Code zu schreiben? Folgt der
Developer dem Plan und meldet Abweichungen? Zieht er die bestehenden
Appointment-Tests und `test/testdata.factory.ts` nach? Bleibt `npm test` grün?
Und vor allem: **wie lange dauert es?** Das 55-Minuten-Budget für Teil b ist
geschätzt, nicht gemessen.

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

`skills/module-review` und das Gerüst `skills/nest-feature-module`, das die
Gruppen in Teil a füllen, sind die zwei Belege dafür: eine Prüf-Checkliste und
eine Konventionssammlung — beides Wissen, beides unabhängig davon nützlich, wer
es gerade aufruft. Zeig im Input-Block das fertige `module-review` und daneben
das leere Gerüst; die ausgearbeitete Fassung liegt für dich unter
`reference/skill-nest-feature-module.md`.

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

In den beiden Agent-Gerüsten steht die `model:`-Zeile bereits drin, mit einem Kommentar,
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

**Sag im selben Atemzug, dass die Gruppen gleich nicht damit anfangen.** In
Aufgabe 1 schreiben sie ihre erste Fassung selbst und lassen Claude sie danach
prüfen; `/init` steht nur als Rettungsleine im Anhang. Der Grund gehört in
denselben Satz: Ein Generator kennt das Projekt von außen — er kann aufschreiben,
was im Code steht, aber nicht, was ihr beim Ausprobieren über das Verhalten
gelernt habt. Und wer einen fertigen Text vor sich hat, redigiert ihn nur noch.

---

## 5. Block 1 — App, `CLAUDE.md` und Aufgabe 1 (5 + 65 Min.)

Aufgabe: `tasks/task-1-explore-and-bugfix.md`. Sie deckt den ganzen Block ab und
hat drei aufeinander aufbauende Teile:

| Teil | ~Zeit | Inhalt |
|---|---|---|
| a | 20 Min | 5 Min Swagger ohne Claude, dann die Erkundungskarte mit Claude; zum Schluss die drei Termin-Regeln selbst benennen |
| b | 25 Min | `CLAUDE.md` selbst schreiben, dann von Claude prüfen lassen, dann gegen eine Prüfliste |
| c | 20 Min | Härtetest: selbst Funde sammeln, den Fund mit dem unsichtbaren Termin fixen |

**Die 5 Minuten Vorstellung um 10:40** nennen nur die drei Teile und das
Abgabekriterium. Der Reproduktionsweg, der Payload und `/init` bleiben im Anhang
der Aufgabendatei — sonst ist der explorative Teil erledigt, bevor er beginnt.

**Die drei Teile sind absichtlich verzahnt.** In Teil a arbeiten die Gruppen die
Regel „ein Termin beginnt zur vollen Stunde" heraus, in Teil b schreiben sie sie
in ihr `CLAUDE.md` — und in Teil c stellen sie fest, dass der Code sie nur halb
durchsetzt. Genau diese Pointe trägt den Block; wenn du beim Herumgehen merkst,
dass eine Gruppe Teil a überspringt, hol sie zurück.

**Der Zuschnitt ist explorativ, nicht geführt.** Die konkreten Reproduktionswege,
der Payload und `/init` stehen nicht mehr im Fließtext, sondern als Hinweise A, B
und C im **Anhang der Aufgabendatei**. Wenn du beim Herumgehen hilfst, verweise
auf den Anhang, statt die Antwort zu geben — der Anhang ist die dokumentierte
Rettungsleine, und er sorgt dafür, dass jede Gruppe in Teil c ankommt.

### Trainer-Notizen

- Erstsemester brauchen in Teil a länger — das ist in Ordnung, das ist der
  Lernkern. Die 5 Minuten gegenüber der 70-Minuten-Fassung sind aus **Teil c**
  genommen, weil er der einzige großzügig bemessene Teil war; seine fünf
  dokumentierten Zusatzaufgaben sind jetzt der Puffer, den du schnellen Gruppen
  gibst, statt ihn einzuplanen.
- **Teil a ist der Werkzeug-Einstieg.** Für die meisten ist es die erste eigene
  Sitzung mit Claude Code. Zwei Dinge sind dort wichtiger als Vollständigkeit:
  dass sie **nachsehen**, was Claude behauptet (Datei öffnen, hinschauen), und
  dass sie in ihre Prompts „ändere nichts" hineinschreiben. Die Erkundungskarte
  verlangt bewusst kein schriftliches Ergebnis — geschrieben wird erst das
  `CLAUDE.md` in Teil b.
- **Rechne damit, dass Claude den Bug aus Teil c schon in Teil a ausplaudert.**
  Eine Frage wie „wo und wie wird hier validiert?" führt auf `startHour` ohne
  Bereichsprüfung. Das ist **kein Materialfehler** — behandle es als Normalfall:
  Teil c wird für diese Gruppe zum Nachweis statt zur Entdeckung („zeigt mir in
  Swagger, dass das stimmt, und benennt die Ursache in einem Satz"). Beim
  Auflösen ist das sogar eine eigene Frage wert: Wer hatte den Fund von Claude,
  wer selbst — und wer hat ihn **überprüft**?
- Die beiden Abschlussfragen von Teil a sollen sie **ohne** Claude beantworten.
  Wer sie nicht beantworten kann, hat gelesen statt verstanden.
- **`/init` ist nicht mehr der Einstieg in Teil b**, sondern Hinweis A im Anhang.
  Grund: Wer den generierten Text zuerst sieht, redigiert ihn nur noch, statt
  eigenes Wissen zu formulieren — und die Rubrik-Runde um 11:50 hat dann
  sechsmal dasselbe Dokument vor sich. Im Vortrag führst du `/init` trotzdem
  vor, aber ausdrücklich als *Entwurf*. Wenn eine Gruppe von sich aus danach
  greift: laufen lassen, aber auf die zwei Bedingungen in Hinweis A achten
  (eigene Fassung wegkopieren, Ergebnis Zeile für Zeile lesen).
- **Unit-Tests sind in Aufgabe 1 und 2 bewusst optional.** Der Pflichtnachweis
  ist eine konkrete Swagger-Prüfung plus ein grünes `npm test`. Begründung: Der
  Test kostete in der 85-Minuten-Fassung ein Drittel der Zeit für Teil c — bei
  den jetzigen 65 Minuten wäre der Anteil noch größer —, und
  unsichere Gruppen übernehmen unter Zeitdruck ungelesen, was Claude schreibt —
  das ist schlechter als kein Test. Die Referenzlösungen im Repository bleiben
  vollständig getestet.
- **Folge für Aufgabe 3:** Der Reviewer-Agent wird fehlende Tests als Finding
  melden. Das ist erwünscht und zeigt ihn bei der Arbeit — kein Materialfehler.
- **Direkt nach Block 1** (11:50–12:00, 10 Minuten, hart): erst die Fundtabellen
  einsammeln — zwei, drei Gruppen nennen je einen Fund, du sammelst sie an der
  Tafel —, dann den Bug auflösen, danach die Rubrik unten an zwei, drei
  **Gruppenergebnissen** durchgehen. Frage: Was fehlt? Was ist zu vage? Was ist
  zu viel? Das Fenster ist knapp und liegt direkt vor dem Essen, wird dir also
  nicht geschenkt: Plane zwei Minuten Fundsammlung, fünf Minuten Bug und drei
  Minuten Rubrik an **einer** Gruppen-`CLAUDE.md`. Wenn du kürzen musst,
  schrumpft die Fundsammlung, nicht die Rubrik — die Gruppen arbeiten nach der
  Pause mit ihrem `CLAUDE.md` in Aufgabe 2 weiter.

> **Achtung, Spoiler.** Nimm dafür **nicht** das `CLAUDE.md` des Trainer-Branchs.
> Es beschreibt die Availability-Implementierung *und* die Datums-Falle — also
> die Lösung von Aufgabe 2, die um 13:05 startet. Das Referenz-`CLAUDE.md` zeigst
> du um **14:05**, bei der Auflösung von Aufgabe 2. Dann brauchst du auch keine
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

### Teil c — der `startHour`-Bug, zum Auflösen um 11:50

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

### Der Fundkatalog zu Teil c

Teil c ist offen gestellt: Die Gruppen suchen selbst nach Eingaben, die die API
annimmt, obwohl es sie fachlich nicht gibt. Vier Funde sind verifiziert — das ist
deine Landkarte beim Herumgehen und für die Fundsammlung um 11:50.

| # | Fund | Wie es auffällt | Wohin der Fix gehörte |
|---|---|---|---|
| 1 | `startHour` ohne Bereich | `"startHour": 25` → `201`, `endHour: 26`, taucht in keiner Liste auf | **DTO** — `@Min(0) @Max(23)`. Das ist der Pflicht-Fix |
| 2 | `?status=` ohne `@IsEnum` | `GET /appointments?status=irgendwas` → `200 []` statt `400` | DTO (`find-appointments.dto.ts`) |
| 3 | `title` ohne `@IsString()` | `"title": 123` → `201`, steht als **Zahl** in der Antwort; `{"a":1}` → `500` aus dem SQLite-Treiber | DTO |
| 4 | Öffnungszeiten ungeprüft | Termin um 23 Uhr in einem Amt, das um 16 Uhr schließt → `201` | **Service** — die Prüfung muss das Amt laden |

Drei Dinge, die du aus dem Katalog herausholen kannst:

- **Jeder Fund darf der gefixte sein.** Die Aufgabe schreibt keinen vor, und die
  Nachweis-Tabelle ist entsprechend allgemein formuliert: die Eingabe aus dem
  eigenen Fund wird abgelehnt, eine sinnvolle geht durch, und der letzte noch
  gültige Wert bleibt erlaubt. Die dritte Zeile ist die, an der ein zu strenger
  Fix auffliegt — frag beim Herumgehen danach, sie wird gern übersprungen.
- **Fund 1 ist trotzdem der, den du um 11:55 auflöst.** Er trägt die Pointe
  (gebucht und unsichtbar zugleich), und er ist der einzige mit Referenzlösung im
  Code. Gruppen, die einen anderen Fund gefixt haben, verstehen ihn beim Auflösen
  mit — sie haben ihn in aller Regel in ihrer Tabelle stehen.
- **Fund 2 ist der stillste.** Der Müllwert geht bis in die Abfrage durch und
  liefert eine leere Liste, also eine *falsche Antwort statt eines Fehlers*.
  Dieselbe Sorte Falle wie die Datums-Falle in Aufgabe 2 — gute Brücke.
  Verwandt und erwähnenswert: `?status=canceled` ist ein *gültiger* Wert, aber
  **keine Route kann `status` jemals setzen** (`UpdateAppointmentDto` erbt nur
  `title`, `officeId`, `date`, `startHour`). Der Filter kann also nie etwas
  liefern. Wer das findet, hat Controller, DTO und Entity zusammen gelesen.
- **Fund 3 hat den stärksten Lehrsatz:** `title!: string` ist eine
  Compile-Zeit-Behauptung, zur Laufzeit ist davon nichts übrig.
- **Fund 4 ist die Gegenprobe zu Fund 1** und steht als Zusatzaufgabe 4 in der
  Aufgabendatei: Er gehört in den Service, weil die Prüfung das Amt kennen muss.
  Weil `UpdateAppointmentDto` über `PartialType` die Validatoren erbt, eine
  Service-Prüfung aber explizit in `update()` stehen muss, fällt dabei die Frage
  „gilt eure neue Regel auch für `PATCH`?" ganz von selbst an.

### Die Zusatzaufgaben

Die Aufgabe bietet fünf an, ausdrücklich zur Auswahl und in dieser Reihenfolge:

- **Der Test steht vorn.** Er sichert das, was die Gruppe gerade geändert hat,
  bevor etwas Neues dazukommt. Pflicht ist er weiterhin nicht (§5, Abschnitt zu
  den optionalen Tests) — aber wer Zeit hat, fängt hier an.
- **„`CLAUDE.md` prüfen"** ist der einzige Punkt des Vormittags, an dem die
  Gruppen den Nutzen von Kontext *messen* statt ihn zu glauben: frische Sitzung,
  eine Frage, die nur mit Projektwissen richtig zu beantworten ist. Das Ergebnis
  ist zugleich das beste Material für die Rubrik-Runde.
- **„Werkzeugkasten"** ist die Auffangaufgabe für Gruppen, die sich mit dem
  Werkzeug noch unsicher fühlen. Der Plan-Modus ist absichtlich nicht erklärt —
  ihn selbst zu finden, ist Teil der Übung und zahlt direkt auf Block 2 ein
  („erst einen Plan anfordern").

Zweiter Fund/zweiter Fix und die Öffnungszeiten sind die fachlichen
Erweiterungen; die Öffnungszeiten sind die anspruchsvollste und die einzige, die
in den Service gehört.

## 6. Block 2 — Aufgabe 2: Availability-Endpunkt (5 + 60 Min.)

Aufgabe: `tasks/task-2-office-availability.md`, Start-Prompt:
`prompts/task-2-availability.prompt.md`.

### Die Auflösung um 14:05 (5 Minuten, mit Entscheidungsregel)

Zwei Minuten Referenz-`CLAUDE.md` auf dem Beamer, dann drei Minuten für **eine**
Frage. Die Standardfrage ist **nicht** die Datums-Falle:

> **Standard (3 Min.):** „Hat irgendwer den Plan seines Agenten zurückgewiesen
> oder geändert, bevor er umgesetzt wurde — und woran habt ihr das festgemacht?"
> Zwei, drei Antworten einsammeln, nicht kommentieren.
>
> **Stattdessen die Datums-Falle**, wenn dir beim Herumgehen **mehrere** Gruppen
> mit `200` statt `400` aufgefallen sind: einmal den falschen Response-Body
> zeigen — acht freie Slots für ein ausgebuchtes Amt, und in jedem Slot der
> Zeitstempel zurückgespiegelt. Den Fix nicht vorführen, der ist eine Zeile.

**Warum die Plan-Frage der Normalfall ist.** Sie betrifft jede Gruppe,
unabhängig davon, was deren Agent generiert hat, sie bedient Lernziel 5, und sie
ist die Rampe zu Aufgabe 3, wo die zwei menschlichen Checkpoints der ganze Punkt
sind. Die Datums-Falle betrifft dagegen nur die Gruppen, bei denen sie
zugeschnappt ist — und das sind nach Konstruktion die falschen (siehe den
nächsten Hinweis).

Dazu kommt: Die Lektion „falsche Antwort statt Fehler" ist an diesem Tag nicht
neu. **Fund 2 aus Aufgabe 1** ist dieselbe Sorte Falle (§5) und wird um 11:50
bereits aufgelöst. Ein zweiter Durchlauf um 14:05 wiederholt sie, statt etwas
hinzuzufügen.

### Trainer-Notizen

- Referenzlösung liegt auf dem Trainer-Branch (`GET /offices/:id/availability`,
  `OfficeAvailabilityQueryDto`, `OfficeAvailabilitySlotDto`,
  `OfficesService.findAvailability`, Tests in `offices.service.spec.ts`). Nur zum
  Abgleich, nicht ausgeben.
- **Die Datums-Falle:** `@IsDateString()` statt `@Matches` auf `date`. Dann
  kommt `?date=2026-06-30T12:00:00Z` durch die Validierung, die Abfrage findet
  keinen einzigen Termin, und der unsinnige Wert wird in jedem Slot
  zurückgespiegelt. Die Antwort sieht **korrekt aus** und ist trotzdem falsch —
  kein Absturz, der die Gruppe warnt. Fix: `@Matches(/^\d{4}-\d{2}-\d{2}$/)`.
- **Rechne aber nicht damit, dass sie oft zuschnappt, und schon gar nicht bei
  den starken Gruppen.** Im ganzen `src/` gibt es genau ein bestehendes
  `date`-Feld — in `create-appointment.dto.ts` — und das benutzt `@Matches`
  samt eigener Fehlermeldung; `@IsDateString()` kommt nirgends vor. Ein Agent,
  der die Projektkonventionen befolgt, kopiert also die richtige Zeile. Damit
  korreliert die Falle **negativ** mit dem Erfolg in Aufgabe 1: Wer ein gutes
  `CLAUDE.md` geschrieben hat, läuft nicht hinein. Deshalb ist sie ein
  Herumgeh-Thema und nur im Ausnahmefall ein Plenumsthema.
- **Das Material entschärft sie außerdem mit Absicht.** Die Nachweis-Tabelle der
  Aufgabe verlangt für genau diesen Request ein `400`. Wer sie abarbeitet,
  bekommt keinen stillen Fehler, sondern eine laute Abweichung — erwartet `400`,
  bekommen `200` — und der Kasten darunter schickt ihn auf Spurensuche. Das ist
  der eigentliche Lernort. Wenn du im Plenum nachlegst, holst du nur die ab, die
  zufällig richtig lagen und den Fehlerfall nie gesehen haben.
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

### Zusatzaufgabe: Termin stornieren

Die Aufgabe führt drei Erweiterungen, angeführt von den Tests; die Stornierung ist
die einzige, die eine Vorbereitung von dir braucht, und mit **etwa 30 Minuten** die einzige, die eine Gruppe nicht
mehr nebenbei schafft — schick nur Gruppen hinein, die den Kernteil deutlich vor
der Zeit fertig haben. **Keine Referenzlösung im Code**; diese Erweiterung ist auf
dem Trainer-Branch bewusst nicht implementiert.

- **Der Endpunkt ist der kleinere Teil.** Der Wert steckt in zwei Stellen, die die
  Aufgabe nicht nennt: `OfficesService.findAvailability` lädt Termine nur nach Amt
  und Datum, `AppointmentsService.validateOfficeIsAvailable` ebenso. Beide müssen
  stornierte Termine ausschließen, sonst bleibt der Slot blockiert und ist auch
  nicht neu buchbar. Erzwungen wird das über die letzten beiden Zeilen der
  Nachweis-Tabelle, nicht über einen Hinweis im Text. Wer nur den Endpunkt baut,
  meldet fertig und hat einen Fehler eingebaut — das ist der Lehrsatz: **ein neues
  Feature ändert das Verhalten eines bestehenden.**
- **Rechne mit `DELETE /appointments/:id` als erstem Vorschlag.** Zwei Gegenfragen:
  Wie sieht die Terminhistorie des Amts danach aus? Und steht in eurem `CLAUDE.md`,
  dass es hier kein `DELETE` gibt — hat der Agent das gelesen?
- **Referenzweg** (nur zum Abgleich, nicht ausgeben): `status` mit
  `@IsEnum(AppointmentStatus)` und `@IsOptional()` ins `UpdateAppointmentDto`,
  **nicht** ins Create-DTO — neue Termine starten immer auf `scheduled`. Dann
  `PATCH /appointments/:id` mit `{"status": "canceled"}`, der Service übernimmt den
  Wert, und beide Abfragen oben bekommen ein `status: Not(AppointmentStatus.CANCELED)`.
  Eine eigene Unterressource (`PATCH /appointments/:id/status`) ist genauso
  vertretbar. Verlangt ist die Begründung, nicht eine bestimmte Route.
- **Bewusst ohne Übergangsregel.** Zweimal stornieren ist folgenlos. Die Frage,
  welcher Übergang aus welchem Zustand erlaubt ist, ist der Kern von Aufgabe 3 und
  soll hier nicht vorweggenommen werden. Baut eine Gruppe von sich aus eine
  Prüfung ein, ist das richtig gedacht — merk es dir für den Nachmittag und knüpf
  dort daran an.
- **Anschluss an Aufgabe 1:** Bis hierhin konnte keine Route je einen Status
  setzen, der `?status=`-Filter lief also immer ins Leere. Gruppen, die diesen Fund
  am Vormittag hatten, sehen ihn hier lebendig werden. Das fehlende `@IsEnum` am
  Filter steht als Nebensatz in derselben Zusatzaufgabe — es ist der zweite Teil
  desselben Fundes und kostet eine Zeile.

### Weitere Stretch-Punkte

Vergangene Daten ablehnen (die interessante Frage dabei ist nicht die Prüfung,
sondern woher „heute" kommt und wie man das testet) und der Umgang mit einem Amt
ohne Öffnungsstunden an dem Tag. **Nicht** als Stretch anbieten: „Amt an diesem
Wochentag geschlossen" — das bräuchte eine Wochentagsberechnung aus dem Datum und
damit genau die `Date`-Objekte, von denen die Aufgabe weghält.

---

## 7. Block 3 — Aufgabe 3: eigenes Werkzeug + `applicants/` (5 + 90 Min.)

Aufgabe in `tasks/task-3-applicants.md`. Zwei Teile: **erst das Werkzeug bauen,
dann damit arbeiten.**

### Teil a — Agenten und Skill schreiben (~35 Min.)

Die Gruppen füllen drei Gerüste: `.claude/agents/architect.md`,
`.claude/agents/developer.md` und `.claude/skills/nest-feature-module/SKILL.md`.
Vorbild ist das Paar `agents/reviewer.md` + `skills/module-review/SKILL.md` — ein
Agent, der eine Rolle beschreibt, und ein Skill, das Wissen hält. Am Ende hat
jede Gruppe dasselbe Paar selbst gebaut: Der Developer verweist auf das Skill.

Sie dürfen sich dabei von Claude helfen lassen — das ist gewollt: Um einen guten
Agenten zu bekommen, müssen sie Claude erklären, was ein guter Architekt tun soll,
und genau diese Erklärung *ist* der Agent.

Worauf du beim Herumgehen achtest:

- **Wurde eine `tools`-Liste bewusst gewählt?** Die Frage „warum braucht der
  Architekt kein `Write`?" ist die beste Einzelfrage des Blocks. Wer sie
  beantworten kann, hat Subagenten verstanden.
- **Steht in jeder Agent-Datei eine echte Grenze?** Ohne „schreibt keinen Code"
  plant der Architekt nicht, sondern implementiert einfach.
- **Ist die `description` brauchbar?** Sie entscheidet, ob Agent oder Skill
  überhaupt gefunden werden.
- **Das Skill ist der neue Prüfstein.** Häufigster Ausgang: Es schreibt
  `CLAUDE.md` ab. Gegenfrage: „Was wisst ihr über dieses Projekt, das nicht in
  `CLAUDE.md` gehört, weil es nur beim Bauen gebraucht wird?" Zweiter Ausgang:
  Es enthält eine Aufrufreihenfolge statt Wissen — dann §3.4.
- Häufigster Fehler bei den Agenten: schöne Sätze, aber kein Ausgabeformat. Ein
  Plan ohne festes Format ist nicht in zwei Minuten prüfbar.

Referenzfassungen zum Abgleich: `workshop/reference/`, inklusive
`skill-nest-feature-module.md`. Sparsam ausgeben.

### Teil b — Feature bauen (~55 Min.)

Ablauf: Feature fassen → **Architekt** → *Checkpoint Mensch* → **Developer** →
**Reviewer** → *Checkpoint Mensch* → Fixes → erneutes Review.

Kern: das Modul `applicants/` (`firstName`, `lastName`, `email`, `birthDate`;
`POST`, `GET`, `GET /:id`) plus `applicantId` beim Anlegen eines Termins und die
Person in der Terminantwort. Die Beziehung ist dasselbe Muster, mit dem der
Termin schon am Amt hängt — darauf dürfen die Gruppen ruhig hingewiesen werden.

Die zwei Fachregeln:

1. Eine unbekannte `applicantId` → `404`.
2. **Eine Person hat pro Amt und Tag höchstens einen Termin** → `400`.

> **Regel 2 ist der didaktische Kern des Tages.** Ein DTO sieht nur den Request.
> Ob diese Person an diesem Tag in diesem Amt schon einen Termin hat, weiß nur,
> wer den gespeicherten Bestand kennt. Wenn eine Gruppe das ins DTO schreiben
> will, lass sie es versuchen und frag dann: „Woher weiß dein DTO, welche Termine
> diese Person schon hat?" Das sitzt besser als jede Erklärung.

**Warum `applicantId` optional ist:** Ein Pflichtfeld würde die bestehenden
Termine und die Test-Factories ungültig machen. Genau das ist Zusatzaufgabe 1 —
erst abwärtskompatibel ausliefern, dann verschärfen. Wer sie angeht, hat
kurzzeitig einen roten Build; nichts für die letzten zehn Minuten vor der
Präsentation.

Weitere Zusatzaufgaben: eindeutige E-Mail (die `unique: true`-Falle liefert einen
`500`, wenn der Service nicht vorher prüft); `GET /applicants/:id/appointments`;
**`module-review` um eigene Prüfpunkte erweitern**. Die letzte ist die
wertvollste: Sie schärft ein Skill, das die Gruppe gerade selbst benutzt hat.

Wer alles durch hat, bekommt `tasks/optional-contact-requests.md` — dasselbe
Vorgehen an einem Modul ohne Beziehungen, mit einem anderen Regeltyp
(Statusübergänge, die den gespeicherten Zustand desselben Datensatzes brauchen).

### Trainer-Notizen

- **Zeitgefahr.** Teil a hart auf 35 Minuten deckeln. Wer dort eine Stunde
  verbrennt, erlebt den eigentlichen Workflow nicht mehr. Bei Überziehung:
  Referenzfassung geben und weitermachen.
- **Der Wert steckt in den Checkpoints.** Gruppen, die Plan und Findings
  durchwinken, machen die Übung falsch. Frag: „Was habt ihr am Plan geändert?
  Welches Finding habt ihr abgelehnt und warum?"
- Master-lastige Gruppen bekommen den expliziten Auftrag, die Agenten-Outputs zu
  **kritisieren** und eine Zusatzaufgabe anzugehen — idealerweise `module-review`.
- **`plan.md` schreibt der Architekt nicht selbst.** Er hat nur `Read`, `Grep`,
  `Glob`; Schreiben würde seine Grenze aufheben. Den freigegebenen Plan speichert
  die Hauptsitzung. Wer das „repariert", indem er dem Architekten `Write` gibt,
  hat die Entscheidung aus Teil a zurückgenommen — frag nach, was der Architekt
  damit jetzt sonst noch darf.
- **Reviewer auf `src/` und `test/` eingrenzen.** Im Arbeitsbaum liegen auch die
  Agent- und Skill-Dateien aus Teil a. Ohne Eingrenzung reviewt er die eigenen
  Prompts der Gruppe mit, und die Findings verwässern.
- Typische Agenten-Fehler hier: Regel 2 im DTO statt im Service; die Beziehung
  über eine rohe `applicantId`-Spalte statt über `@ManyToOne` modelliert;
  `relations: { applicant: true }` beim Laden vergessen, sodass `applicantName`
  immer `null` bleibt; beim Update den bearbeiteten Termin nicht ausgeschlossen
  (`ignoredAppointmentId`); Entität statt Response-DTO zurückgegeben; ungefragt
  ein `DELETE` oder ein `PATCH /applicants/:id`; Tests, die nur `toBeDefined()`
  prüfen.
- **Aufgabe 3 fasst `create-appointment.dto.ts` an — dieselbe Datei wie Aufgabe 1.**
  Beide Änderungen sind additiv, ein Konflikt entsteht nicht; erwähne es nur,
  wenn eine Gruppe stutzt.
- **`npm run lint` nicht laufen lassen** — schreibt Dateien um, zerlegt den Diff.
  Steht in `settings.json` auf `deny`; erinnere die Gruppen trotzdem.
- DB zurücksetzen bei Schema-Ärger: `data/appointments.db` löschen (gitignored,
  wird per `synchronize: true` neu erzeugt). Das neue `applicant`-Feld ist
  bewusst `nullable`, damit bestehende Termine den Start nicht blockieren.

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
| Schwaches `CLAUDE.md`, niemand merkt es | Rubrik-Runde um 11:50 (§5); Referenz-Vergleich um 14:05 |
| Block 1 überzieht und frisst die Auflösung um 11:50 auf | Das Mittagessen um 12:00 ist der harte Anschlag: Block 1 um 11:45 ankündigen, notfalls Fundsammlung streichen und nur Bug plus Rubrik machen |
| Block 2 startet um 13:05 direkt nach dem Essen | Die 5 Minuten Vorstellung als Weckruf nutzen, nicht als Vorlesung; erst die Gruppen sagen lassen, was der Endpunkt liefern soll |
| Aufgabe 1, Teil c: Gruppe findet keinen einzigen Fund | Hinweise B und C stehen im **Anhang der Aufgabendatei** — dorthin verweisen, statt die Antwort zu geben |
| Aufgabe 1, Teil c: Gruppe fixt einen anderen Fund als den `startHour`-Bug | Zulässig und eingeplant — die Nachweis-Tabelle ist allgemein formuliert. Nur auf die Grenzfall-Zeile achten (§5) |
| Claude nennt den `startHour`-Bug schon in Teil a | Normalfall, kein Materialfehler: Teil c wird für diese Gruppe zum **Nachweis** statt zur Entdeckung (§5) |
| Gruppe lässt `/init` in Teil b die Arbeit machen | Zulassen, aber die zwei Bedingungen aus Hinweis A einfordern: eigene Fassung wegkopieren, Ergebnis Zeile für Zeile lesen |
| Aufgabe 2: Datetime kommt durch und liefert still eine falsche Liste | bekannt und gewollt; die Nachweis-Tabelle der Aufgabe fängt es ab. Beim Herumgehen ansprechen, im Plenum nur bei mehreren Fällen (§6) |
| Aufgabe 2: Endpunkt in Swagger nicht bedienbar | `@ApiProperty()` an den DTOs fehlt; kein Swagger-CLI-Plugin im Projekt |
| Gruppe liefert ohne jede Prüfung ab („Claude sagt, es geht") | Nachweis-Tabelle der Aufgabe einfordern — sie ersetzt den Test, nicht das Prüfen |
| **Teil a von Aufgabe 3 frisst Teil b auf** | hart auf 35 Min. deckeln; bei Überziehung Referenzfassung aus `workshop/reference/` geben — beim Skill zuerst, es ist am leichtesten zu ersetzen |
| Aufgabe 3 läuft aus der Zeit | Kern-Umfang ohne Zusatzaufgaben, Ansage bei 30 Min. Rest |
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
  Input-Block um 14:10 zu knapp.
