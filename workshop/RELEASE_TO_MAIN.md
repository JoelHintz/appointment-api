# Stände und Branches

Wie das Material vom Entwicklungsstand zu den Teilnehmenden kommt. Nur für
Trainer:innen.

> Diese Strategie ist bewusst vorläufig gewählt und darf sich ändern, sobald sich
> etwas Besseres abzeichnet. Sie ist auf einen Solo-Betrieb ausgelegt: eine Person
> entwickelt, hält und führt durch.

## Grundidee

`main` ist **der aktuelle Teilnehmerstand**. Dort liegt alles, was die Gruppen im
Workshop brauchen — Aufgaben und die Beispiel-Agenten — und **keine Lösungen**.
Wer das Repository klont, landet damit sofort richtig; deshalb muss `SETUP.md`
keinen Branch nennen.

Entwickelt wird auf einem **Entwicklungsbranch**, auf dem Aufgaben und Lösungen
zusammenliegen. Das ist beim Schreiben praktisch: Aufgabentext und Referenzlösung
lassen sich gemeinsam anpassen.

Zwischen beiden gilt genau eine Regel:

> **`src/` und `test/` wandern nie vom Entwicklungsbranch nach `main`.**

Der Grund ist wichtig: Die Lösungen zu Aufgabe 1 und 2 sind **keine eigenen
Dateien**, sondern Änderungen mitten in Dateien, die es auf `main` ohnehin gibt —
zwei Dekoratoren in `create-appointment.dto.ts`, die Availability-Logik in
`offices.service.ts`. Sie lassen sich also nicht durch Löschen von Dateien
entfernen, sondern nur, indem man sie gar nicht erst hinüberlässt. Solange `main`
seinen eigenen `src/`-Stand behält, kann keine Lösung durchrutschen — egal wie
viele Aufgaben noch dazukommen.

## Branch-Landkarte

| Branch / Tag | Rolle |
|---|---|
| `main` | aktueller Teilnehmerstand. Aufgaben, Beispiel-Agenten, Basis-Code. Keine Lösungen, kein `CLAUDE.md`, kein `workshop/` |
| `workshop-solution-dev` | Entwicklungsbranch für den Ganztagsworkshop: Material **und** Lösungen **und** `workshop/` |
| `workshop-solution` | Lösungsstand zu einer Durchführung, vom Entwicklungsbranch abgezweigt. Zum Nachschauen nach dem Workshop |
| `hands-on-solution` | eigene Linie des **kurzen** Formats (Vortrags-Ergänzung, Englisch, eine Aufgabe). Wird vom Ganztagsmaterial **nicht** angefasst |
| `hands-on-regensburg-06-2026-en` (Tag) | gepinnte Durchführung des kurzen Formats |

Durchführungen werden per **Tag** festgehalten, nicht per Branch. Ein Tag ist
unveränderlich und beantwortet später verlässlich „was hatten die Leute damals
vor sich".

Zwei Dinge zur Benennung: Es gibt bewusst **keinen Branch namens `workshop`** —
er wäre neben dem Ordner `workshop/` eine Stolperfalle. Und `hands-on-solution`
gehört dem kurzen Format; das Ganztagsmaterial bekommt eigene Namen.

## Inventar

### Geht nach `main`

| Pfad | Inhalt |
|---|---|
| `TASK.md` | Index der Aufgaben |
| `tasks/` | die Aufgabenbeschreibungen |
| `.claude/agents/reviewer.md` | das eine ausgearbeitete Vorbild |
| `.claude/agents/architect.md` | **Gerüst** — wird in Aufgabe 3a ausgefüllt |
| `.claude/agents/developer.md` | **Gerüst** |
| `.claude/skills/module-review/` | die Review-Checkliste zum Reviewer |
| `.claude/settings.json` | Permission-Allowlist, spart Rückfragen im Workshop |
| `.gitignore` | nur die Zeile `/plan.md` |

`.claude/` liegt auf dem Entwicklungsbranch bereits **genau** im Teilnehmerzustand
(Reviewer vollständig, Architekt und Developer als Gerüst). Es ist also ein reines
Kopieren, nichts muss zurückgebaut werden.

`README.md` und `SETUP.md` liegen ohnehin auf `main` und werden dort gepflegt —
sie kommen **nicht** vom Entwicklungsbranch.

> **Offener Punkt:** `SETUP.md` hat auf dem Entwicklungsbranch zwei Sonnet-Absätze
> bekommen (§2.4 und die Abschlusscheckliste). Weil die Datei nicht portiert wird,
> müssen sie **direkt auf `main`** nachgezogen werden. Der Kostenrahmen steht
> sonst nur in `TASK.md` und den Agenten.

### Bleibt auf dem Entwicklungsbranch: das Lösungs-Register

Lösungen zerfallen in zwei Sorten, und nur die zweite ist gefährlich.

**Ganze Dateien.** Sie existieren auf `main` überhaupt nicht. Sie können nicht
versehentlich mitkommen, solange man `src/` nicht anfasst — und wenn doch, sieht
man sie sofort im `git status`.

| Datei | Aufgabe |
|---|---|
| `src/appointments/dto/create-appointment.dto.spec.ts` | 1 |
| `src/offices/dto/office-availability-query.dto.ts` | 2 |
| `src/offices/dto/office-availability-slot.dto.ts` | 2 |

**Hunks in geteilten Dateien.** Diese Dateien gibt es auf `main` ebenfalls, nur in
ihrer unreparierten Fassung. Ein Merge, der sie mitzieht, sieht harmlos aus und
verrät die Lösung trotzdem. Deshalb sind sie unten vollständig festgehalten.

---

#### `src/appointments/dto/create-appointment.dto.ts` — Aufgabe 1

Das ist die **einzige** Code-Datei mit einer Aufgabe-1-Lösung. `main` hat
`startHour` als `@IsInt()` ohne Bereich:

```ts
-import { IsInt, IsNotEmpty, Matches, Min } from 'class-validator';
+import { IsInt, IsNotEmpty, Matches, Max, Min } from 'class-validator';

   @IsInt()
+  @Min(0)
+  @Max(23)
   @Type(() => Number)
-  @ApiProperty({ description: '…', example: 9 })
+  @ApiProperty({ description: '…', example: 9, minimum: 0, maximum: 23 })
   startHour!: number;
```

`appointments.service.ts`, die Entities, der Mapper und
`appointments.service.spec.ts` sind seit dem Datum-plus-Stunde-Umbau auf beiden
Branches **identisch** — es gibt dort nichts mehr zurückzubauen.

#### `src/appointments/dto/create-appointment.dto.spec.ts` — Aufgabe 1

Die beiden Tests `rejects a start hour outside a day` und
`accepts the first and last hour of a day`. Die Datei selbst existiert auf `main`
nicht (siehe Tabelle oben).

#### `src/offices/offices.service.ts` — Aufgabe 2

Neu: Import von `NotFoundException`, das injizierte `appointmentRepository` im
Konstruktor sowie die Methode `findAvailability`. `findAll` gibt es auf `main`
ebenfalls — beim Portieren des Basis-Umbaus nur diesen Hunk übernehmen.

#### `src/offices/offices.controller.ts` — Aufgabe 2

Neu: Import von `Param`, `ParseIntPipe`, `Query` und den zwei Availability-DTOs
sowie die komplette Route `@Get(':id/availability')` mit `findAvailability`.

#### `src/offices/offices.module.ts` — Aufgabe 2

```ts
-  imports: [TypeOrmModule.forFeature([Office])],
+  imports: [TypeOrmModule.forFeature([Office, Appointment])],
```
plus der Import von `Appointment`.

#### `src/offices/offices.service.spec.ts` und `offices.controller.spec.ts` — Aufgabe 2

Je ein `describe('findAvailability')`-Block; im Service-Spec zusätzlich die
Mock-Registrierung des `Appointment`-Repositories.

#### Aufgabe 3 — `contact-requests/`

Gebaut. Der Kern ist `src/contact-requests/` — ein **eigenes Modulverzeichnis**,
also ausschließlich neue Dateien, die unkritische Sorte.

Das Modul hängt aber an **drei geteilten Dateien**, die es auf `main` ebenfalls
gibt. Ohne sie ist es nicht verdrahtet, mit ihnen verrät der Diff die Lösung:

| Datei | Hunk |
|---|---|
| `src/app.module.ts` | Import und `imports`-Eintrag von `ContactRequestsModule` |
| `src/main.ts` | `.addTag('contact-requests')` im `DocumentBuilder` |
| `test/testdata.factory.ts` | die vier `createContactRequest…`-Factories |

Damit fällt auch Aufgabe 3 vollständig unter die `src/`-und-`test/`-Regel — die
frühere Annahme, hier kämen nur neue Dateien dazu, war zu optimistisch.

---

Dazu, ebenfalls nie nach `main`:

- **`CLAUDE.md`** — es zu erzeugen ist Aufgabe 1b, und der Inhalt nimmt Aufgabe 2
  vorweg.
- **`workshop/`** komplett. Insbesondere `workshop/reference/` (die ausgearbeiteten
  Agenten — gingen sie mit, wäre Aufgabe 3a hinfällig) und `workshop/prompts/`
  (Fallback-Prompts; die Gruppen sollen selbst formulieren).

## Rezept: Stand nach `main` bringen

> **Zwei Voraussetzungen.**
>
> Das Material muss auf dem Entwicklungsbranch **committet** sein —
> `git checkout <branch> -- <pfade>` liest aus der Historie, nicht aus dem
> Arbeitsverzeichnis.
>
> Und: Diese Befehle **im normalen Terminal ausführen, nicht über Claude**.
> `.claude/settings.json` verbietet `git checkout`, `git restore`, `git reset`
> und `git clean` bewusst, damit im Workshop niemand versehentlich Arbeit
> überschreibt. Das Release ist eine Trainer-Tätigkeit und findet außerhalb
> dieser Schranke statt.

```bash
git switch main
git pull

# Nur die Material-Pfade holen. src/ und test/ stehen bewusst nicht dabei.
git checkout workshop-solution-dev -- TASK.md tasks/ .claude/

# Die eine gitignore-Zeile nachziehen, falls noch nicht auf main
grep -q '^/plan.md' .gitignore || printf '\n# Workshop scratch: the approved plan the architect agent produces (task 3)\n/plan.md\n' >> .gitignore

git status
git diff --cached --stat
```

In der Ausgabe dürfen **`src/`, `test/`, `CLAUDE.md` und `workshop/` nicht
auftauchen**. Wenn doch, wurde zu viel geholt — zurücknehmen, nicht committen.

## Einmalig: den Datum-plus-Stunde-Umbau nach `main` bringen

> Gilt nur so lange, bis `main` den Umbau hat. Danach ersatzlos löschen.

Der Umbau (`date` + `startHour` + `endHour` statt Zeitstempel, `opensAtHour` /
`closesAtHour` statt `"HH:MM"`) ist **Basis-Code, keine Lösung** — er gehört also
nach `main`. Ein `cherry-pick` des Commits `Model appointments as date plus full
hour` funktioniert trotzdem nicht: Derselbe Commit fasst `offices.service.ts` an,
und diese Datei trägt auf dem Entwicklungsbranch die Aufgabe-2-Lösung.

Deshalb dateiweise, im normalen Terminal auf einem Arbeitsbaum mit `main`:

```bash
git switch main && git pull

# 1. Vollständig übernehmen — diese Dateien sind lösungsfrei.
git checkout workshop-solution-dev -- \
  src/appointments/entity/appointment.entity.ts \
  src/appointments/appointments.service.ts \
  src/appointments/appointments.service.spec.ts \
  src/appointments/appointments.mapper.ts \
  src/appointments/appointments.controller.spec.ts \
  src/appointments/dto/appointment-response.dto.ts \
  src/appointments/dto/create-appointment.dto.ts \
  src/offices/entity/office.entity.ts \
  src/offices/offices.seed.ts \
  src/offices/dto/office-response.dto.ts

# 2. Die Aufgabe-1-Lösung wieder herausnehmen: @Min(0) und @Max(23) an
#    startHour löschen, Max aus dem Import entfernen, minimum/maximum aus
#    @ApiProperty streichen.
$EDITOR src/appointments/dto/create-appointment.dto.ts

# 3. Von Hand nachziehen, weil diese Dateien Lösungen tragen:
#    - offices.service.ts        → nur der findAll-Hunk (opensAtHour/closesAtHour)
#    - offices.service.spec.ts   → nur der findAll-Block
#    - offices.controller.spec.ts→ die Office-Objekte im findAll-Test
#    - test/testdata.factory.ts  → die vier Appointment-/Office-Factories

rm -f data/appointments.db     # synchronize: true migriert die Spalten nicht
npm ci && npm test && npm run build
```

Danach die inhaltliche Checkliste unten durchgehen — insbesondere, dass
`startHour: 25` auf `main` wieder **`201`** liefert.

## Rezept: Lösungsbranch für eine Durchführung

```bash
git switch -c workshop-solution workshop-solution-dev
git push -u origin workshop-solution
```

Und die Durchführung selbst pinnen, im Stil des vorhandenen Tags:

```bash
git tag -a workshop-<ort>-<mm-yyyy>-de -m "Materials for the full-day workshop at <Ort> on <Datum>. Language: German."
```

## Basis-Code ändern

Änderungen, die **keine Lösung** sind — ein Dependency-Update, ein Fix am
Grundgerüst, eine Korrektur in `SETUP.md` — gehören zuerst auf `main` und werden
von dort in den Entwicklungsbranch gemergt:

```bash
git switch main && git commit ...
git switch workshop-solution-dev && git merge main
```

Nie umgekehrt. Die Richtung ist das, was `src/` auf `main` sauber hält.

## Verifikation vor der Durchführung

### Mechanisch: ist `main` lösungsfrei?

Aus dem Register oben abgeleitet. Läuft **von jedem Branch aus ohne Wechsel**,
weil `git grep <muster> main` direkt in der Historie sucht — und ist damit auch
nicht von der Deny-Liste betroffen.

```bash
# 1. Kein Lösungsmarker auf main. Alle vier Befehle müssen OHNE Ausgabe bleiben.
git grep -n '@Max(23)'           main -- src/appointments/dto/
git grep -n 'findAvailability'   main -- src/
git grep -n 'OfficeAvailability' main -- src/
git grep -n 'ContactRequest'     main -- src/ test/

# 2. Gegenprobe: der Basis-Umbau ist da und die Lücke sitzt an der richtigen
#    Stelle. Erwartet: mindestens 1 Treffer.
git grep -c 'startHour' main -- src/appointments/dto/create-appointment.dto.ts

# 3. Lösungs-only-Dateien gibt es auf main nicht. Jede Zeile muss fehlschlagen.
git cat-file -e main:src/offices/dto/office-availability-query.dto.ts
git cat-file -e main:src/offices/dto/office-availability-slot.dto.ts
git cat-file -e main:src/appointments/dto/create-appointment.dto.spec.ts
git cat-file -e main:src/contact-requests/contact-requests.service.ts

# 4. Kein Rückstand aus einem Testlauf. Erwartet: exakt 3 Agenten, exakt 1 Skill.
git ls-tree --name-only main .claude/agents/ | wc -l    # muss 3 sein
git ls-tree --name-only main .claude/skills/ | wc -l    # muss 1 sein

# 5. Die Modellvorgabe ist da. Erwartet: 3 Treffer.
git grep -c 'model: sonnet' main -- .claude/agents/ | wc -l
```

Schritt 4 fängt den Fall ab, dass ein Testlauf (Trainer-Guide §3.3) Spuren
hinterlässt: `.claude/` wird vom Rezept **komplett** kopiert, also würden ein
vergessener `architect-ref` oder ein installiertes `nest-feature-module` an die
Teilnehmenden ausgeliefert. Beim Skill wäre das keine Kleinigkeit — es beschreibt
genau die Konventionen, die der Architekt in Aufgabe 3 selbst herleiten soll.

Schritt 2 ist der wichtigere von beiden: Ein leeres Ergebnis in Schritt 1 könnte
auch bedeuten, dass jemand am Muster vorbei umbenannt hat — oder dass der
Basis-Umbau auf `main` noch gar nicht angekommen ist. Erst die Gegenprobe zeigt,
dass die kaputte Fassung wirklich dort steht, wo die Gruppen sie finden sollen.

> Kommt eine Lösung dazu, gehört **ein Marker dafür in diese Liste** — sonst
> wächst das Register, aber die Prüfung nicht mit.

### Inhaltlich: verhält sich `main` wie erwartet?

Auf einem Arbeitsbaum mit `main` prüfen:

- [ ] `npm ci && npm test` läuft grün.
- [ ] `npm run start:dev` startet, Swagger unter `http://localhost:3000/api`.
- [ ] **Kein** `CLAUDE.md` im Wurzelverzeichnis.
- [ ] **Kein** Ordner `workshop/`.
- [ ] `GET /offices/{id}/availability` existiert **nicht** (Aufgabe 2 ist offen).
- [ ] `POST /appointments` mit `"date": "2026-06-20", "startHour": 25` liefert
      **`201`** mit `endHour: 26` (Aufgabe 1 ist offen).
- [ ] `POST /appointments` mit `"startHour": 9.5` liefert **`400`** — die
      unvollständige Prüfung ist da, nur ohne Bereich.
- [ ] `GET /offices` liefert `opensAtHour` / `closesAtHour` als **Zahlen**
      (der Basis-Umbau ist angekommen).
- [ ] `TASK.md` ist vorhanden, und zu **jeder** Zeile seiner Aufgabentabelle
      existiert die verlinkte Datei in `tasks/`.
- [ ] `.claude/agents/reviewer.md` und `.claude/skills/module-review/` sind
      vollständig.
- [ ] `.claude/agents/architect.md` und `developer.md` sind **noch Gerüste** —
      Kommentare drin, `description` beginnt mit „UNVOLLSTÄNDIG". Das geht am
      ehesten kaputt, wenn du vorher einen Testlauf gemacht hast (Rezept im
      Trainer-Guide §3.3).
- [ ] Alle drei Agenten tragen `model: sonnet`, und `SETUP.md` sowie `TASK.md`
      nennen die Vorgabe.
- [ ] `git status` ist sauber.

## Wenn eine Aufgabe dazukommt

1. Aufgabentext nach `tasks/`, Zeile in die Tabelle in `TASK.md`. Ein etwaiger
   Fallback-Prompt gehört nach `workshop/prompts/`, **nicht** ins
   Teilnehmermaterial.
2. Referenzlösung auf dem Entwicklungsbranch umsetzen — ausschließlich in `src/`
   und `test/`.
3. **Ins Lösungs-Register eintragen.** Neue ganze Dateien in die erste Tabelle;
   Änderungen an Dateien, die es auf `main` schon gibt, als eigenen Abschnitt mit
   dem konkreten Hunk.
4. **Einen Marker in die mechanische Prüfung aufnehmen** — idealerweise einen
   Bezeichner, den es ohne die Lösung nirgends gibt (`findAvailability` und
   `@Max(23)` sind solche). Ein Register ohne passenden Marker ist Dokumentation,
   die niemand einhält.

Punkt 2 ist die eigentliche Disziplin: Solange Lösungen nur in `src/` und `test/`
stehen, bleibt das Rezept unverändert. Sobald eine Lösung in eine Material-Datei
sickert, ist die Grenze aufgeweicht.

## Offene Punkte

- **Das zweite Format.** `main` trägt immer nur die *aktuelle* Aufgabenstellung.
  Solange das kurze und das lange Format nicht gleichzeitig aktuell sein müssen,
  trägt das. Sobald doch, brauchen beide getrennte Material-Pfade (etwa unter
  `formats/`), weil sie sich sonst um `TASK.md` und `tasks/` streiten.
- **`SETUP.md` nennt keinen Branch.** Das ist derzeit korrekt, weil `main` der
  Teilnehmerstand ist. Sollte sich das ändern, muss `SETUP.md` mitgezogen werden —
  sonst klonen die Gruppen einen Stand ohne Aufgaben.
