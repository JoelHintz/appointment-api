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
`normalizeStartsAt` sitzt in `appointments.service.ts`, die Availability-Logik in
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

### Bleibt auf dem Entwicklungsbranch: das Lösungs-Register

Lösungen zerfallen in zwei Sorten, und nur die zweite ist gefährlich.

**Ganze Dateien.** Sie existieren auf `main` überhaupt nicht. Sie können nicht
versehentlich mitkommen, solange man `src/` nicht anfasst — und wenn doch, sieht
man sie sofort im `git status`.

| Datei | Aufgabe |
|---|---|
| `src/appointments/dto/create-appointment.dto.spec.ts` | 1 — Ausweichoption |
| `src/offices/dto/office-availability-query.dto.ts` | 2 |
| `src/offices/dto/office-availability-slot.dto.ts` | 2 |

**Hunks in geteilten Dateien.** Diese Dateien gibt es auf `main` ebenfalls, nur in
ihrer unreparierten Fassung. Ein Merge, der sie mitzieht, sieht harmlos aus und
verrät die Lösung trotzdem. Deshalb sind sie unten vollständig festgehalten.

---

#### `src/appointments/appointments.service.ts` — Aufgabe 1

`main` hat `validateStartsAt`, das nur prüft. Die Lösung macht daraus
`normalizeStartsAt`, das zusätzlich zurückgibt:

```ts
-  private validateStartsAt(startsAt: string): void {
+  private normalizeStartsAt(startsAt: string): string {
     // ... unveränderte Prüfungen auf gültiges Datum und volle Stunde ...
+
+    return start.toISOString();
   }
```

Dazu vier Aufrufstellen. In `create()` wird der normalisierte Wert gespeichert
**und** verglichen:

```ts
-    this.validateStartsAt(dto.startsAt);
+    const startsAt = this.normalizeStartsAt(dto.startsAt);
```
…danach `startsAt` statt `dto.startsAt` in `validateOfficeIsAvailable` und in
`toSave` (auch für `calculateEndTime`).

In `update()` wandert die Ableitung von `endsAt` aus `mergeDtoIntoEntity` heraus
und hinter die Normalisierung — das behebt nebenbei, dass `endsAt` bisher **vor**
der Validierung berechnet wurde:

```ts
-    this.validateStartsAt(toSave.startsAt);
+    toSave.startsAt = this.normalizeStartsAt(toSave.startsAt);
+    toSave.endsAt = this.calculateEndTime(toSave.startsAt);
```

```ts
     if (dto.startsAt !== undefined) {
       appointment.startsAt = dto.startsAt;
-      appointment.endsAt = this.calculateEndTime(dto.startsAt);
     }
```

#### `src/appointments/appointments.service.spec.ts` — Aufgabe 1

Zwei Tests am Ende von `describe('create')`:
`should store a start time with an offset as canonical UTC` und
`should detect a conflict when the same instant is sent with a different offset`.

#### `src/appointments/dto/create-appointment.dto.ts` — Aufgabe 1, Ausweichoption

```ts
-import { IsISO8601, IsNotEmpty } from 'class-validator';
+import { Type } from 'class-transformer';
+import { IsInt, IsISO8601, IsNotEmpty, Min } from 'class-validator';

-  @IsNotEmpty()
-  @ApiProperty({ description: '…', example: '1' })
+  @IsInt()
+  @Min(1)
+  @Type(() => Number)
+  @ApiProperty({ description: '…', example: 1 })
   officeId!: number;
```

#### `src/offices/offices.service.ts` — Aufgabe 2

Neu: Import von `NotFoundException` und `Between`, das injizierte
`appointmentRepository` im Konstruktor sowie die beiden Methoden
`findAvailability` und `parseHour`.

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
# 1. Kein Lösungsmarker auf main. Alle sechs Befehle müssen OHNE Ausgabe bleiben.
git grep -n 'normalizeStartsAt'  main -- src/
git grep -n 'findAvailability'   main -- src/
git grep -n 'parseHour'          main -- src/
git grep -n 'OfficeAvailability' main -- src/
git grep -n '@IsInt\|@Type'      main -- src/appointments/dto/create-appointment.dto.ts
git grep -n 'ContactRequest'     main -- src/ test/

# 2. Gegenprobe: die unreparierte Fassung ist noch da. Erwartet: 3 Treffer.
git grep -c 'validateStartsAt' main -- src/appointments/appointments.service.ts

# 3. Lösungs-only-Dateien gibt es auf main nicht. Jede Zeile muss fehlschlagen.
git cat-file -e main:src/offices/dto/office-availability-query.dto.ts
git cat-file -e main:src/offices/dto/office-availability-slot.dto.ts
git cat-file -e main:src/appointments/dto/create-appointment.dto.spec.ts
git cat-file -e main:src/contact-requests/contact-requests.service.ts

# 4. Kein Rückstand aus einem Testlauf. Erwartet: exakt 3 Agenten, exakt 1 Skill.
git ls-tree --name-only main .claude/agents/ | wc -l    # muss 3 sein
git ls-tree --name-only main .claude/skills/ | wc -l    # muss 1 sein
```

Schritt 4 fängt den Fall ab, dass ein Testlauf (Trainer-Guide §3.3) Spuren
hinterlässt: `.claude/` wird vom Rezept **komplett** kopiert, also würden ein
vergessener `architect-ref` oder ein installiertes `nest-feature-module` an die
Teilnehmenden ausgeliefert. Beim Skill wäre das keine Kleinigkeit — es beschreibt
genau die Konventionen, die der Architekt in Aufgabe 3 selbst herleiten soll.

Schritt 2 ist der wichtigere von beiden: Ein leeres Ergebnis in Schritt 1 könnte
auch bedeuten, dass jemand am Muster vorbei umbenannt hat. Erst die Gegenprobe
zeigt, dass die kaputte Fassung wirklich noch dort steht, wo die Gruppen sie
finden sollen.

> Kommt eine Lösung dazu, gehört **ein Marker dafür in diese Liste** — sonst
> wächst das Register, aber die Prüfung nicht mit.

### Inhaltlich: verhält sich `main` wie erwartet?

Auf einem Arbeitsbaum mit `main` prüfen:

- [ ] `npm ci && npm test` läuft grün.
- [ ] `npm run start:dev` startet, Swagger unter `http://localhost:3000/api`.
- [ ] **Kein** `CLAUDE.md` im Wurzelverzeichnis.
- [ ] **Kein** Ordner `workshop/`.
- [ ] `GET /offices/{id}/availability` existiert **nicht** (Aufgabe 2 ist offen).
- [ ] Zwei `POST /appointments` aufs selbe Amt mit `2026-06-20T09:00:00+02:00` und
      `2026-06-20T07:00:00.000Z` werden **beide angelegt** (Aufgabe 1 ist offen).
- [ ] `POST /appointments` mit `officeId: "abc"` liefert **404**, nicht 400
      (Ausweichoption von Aufgabe 1 ist offen).
- [ ] `TASK.md` ist vorhanden, und zu **jeder** Zeile seiner Aufgabentabelle
      existiert die verlinkte Datei in `tasks/`.
- [ ] `.claude/agents/reviewer.md` und `.claude/skills/module-review/` sind
      vollständig.
- [ ] `.claude/agents/architect.md` und `developer.md` sind **noch Gerüste** —
      Kommentare drin, `description` beginnt mit „UNVOLLSTÄNDIG". Das geht am
      ehesten kaputt, wenn du vorher einen Testlauf gemacht hast (Rezept im
      Trainer-Guide §3.3).
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
   Bezeichner, den es ohne die Lösung nirgends gibt (`normalizeStartsAt` und
   `findAvailability` sind solche). Ein Register ohne passenden Marker ist
   Dokumentation, die niemand einhält.

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
