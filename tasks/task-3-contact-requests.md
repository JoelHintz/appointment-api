# Aufgabe 3 — Eigene Agenten bauen und ein neues Modul erzeugen

| | |
|---|---|
| **Zeitbudget** | ca. 95 Minuten (25 für Teil a, 70 für Teil b) |
| **Level** | alle (Kern), Erweiterungen nach Erfahrung |
| **Voraussetzung** | Aufgaben 1 und 2 sind nicht nötig, aber hilfreich |

Diese Aufgabe hat zwei Teile. **Erst baut ihr euer Werkzeug, dann benutzt ihr es.**

---

## Teil a — Die fehlenden Agenten schreiben (~25 Min)

Im Projekt liegt **ein vollständiges Beispiel**: der Agent
`.claude/agents/reviewer.md` zusammen mit dem Skill
`.claude/skills/module-review/SKILL.md`. Lest beide. Das ist eure Vorlage.

Daneben liegen **zwei Gerüste**, die noch leer sind:

- `.claude/agents/architect.md` — plant eine Änderung, schreibt keinen Code
- `.claude/agents/developer.md` — setzt einen freigegebenen Plan um

Füllt sie aus. In jedem Gerüst stehen die Leitfragen als Kommentare.

> **Ihr dürft Claude beim Schreiben helfen lassen** — das ist ausdrücklich
> erwünscht. Um einen guten Agenten zu bekommen, müsst ihr Claude erklären, was
> ein guter Architekt oder Developer tun soll. Genau diese Erklärung ist der
> Agent. Das ist die Übung.

**Fertig ist Teil a, wenn:**

- [ ] Beide Dateien haben eine `description`, an der man erkennt, wann der Agent
      benutzt werden soll.
- [ ] Beide haben eine bewusst gewählte `tools`-Liste. Ihr könnt begründen, warum
      der Architekt weniger Werkzeuge braucht als der Developer.
- [ ] In jeder Datei steht mindestens eine klare **Grenze** („darf nicht …").
- [ ] Die Kommentare sind gelöscht.

---

## Teil b — Das Modul erzeugen (~70 Min)

### Ziel

Ergänzt ein neues Feature-Modul `contact-requests/`: **Kontaktanfragen**, die
Bürger:innen an die Verwaltung schicken, und die dort einen Bearbeitungsstatus
durchlaufen.

Das Modul steht für sich — es braucht keine Beziehung zu `Office` oder
`Appointment`.

### Der Ablauf

1. **Feature fassen** — in zwei bis drei Sätzen.
2. **Architekt** liefert einen kurzen Plan. Er schreibt **keinen Code**.
3. **Checkpoint Mensch** — Plan lesen, offene Fragen klären, Überflüssiges
   streichen. Freigegebenen Plan in `plan.md` ablegen.

   > Euer Architekt kann `plan.md` **nicht selbst schreiben** — er hat kein
   > Schreibwerkzeug, und das ist Absicht. Lasst die Hauptsitzung den
   > freigegebenen Plan speichern. Gebt dem Architekten dafür kein `Write`:
   > Damit wäre die Grenze, die ihr in Teil a gezogen habt, wieder weg.

4. **Developer** setzt um. Die Übergabe ist ein Satz: „Setze den freigegebenen
   Plan aus `@plan.md` um." Mehr braucht es nicht — seine Rolle steht in seiner
   Agent-Datei, die Aufgabe im Plan.
5. **Reviewer** prüft den Diff und liefert Findings nach Schweregrad.

   > Sagt ihm dazu, dass er **nur `src/` und `test/`** prüfen soll. Im
   > Arbeitsbaum liegen auch die Agent-Dateien aus Teil a — sonst reviewt er
   > eure eigenen Prompts mit.

6. **Checkpoint Mensch** — Findings sichten, entscheiden, was behoben wird,
   zurück an den Developer, danach erneut reviewen.

> **Worum es hier wirklich geht:** nicht um Tempo. Ihr **lest den Plan und die
> Findings und entscheidet darüber**. Wenn der Plan falsch ist, schickt ihn
> zurück. Ein durchgewinkter Plan ist eine nicht bestandene Aufgabe.

### Kern-Umfang

**Entität `ContactRequest`:**

| Feld | Typ | Anmerkung |
|---|---|---|
| `id` | number | |
| `name` | string | Name der anfragenden Person |
| `email` | string | muss eine gültige E-Mail sein |
| `subject` | string | |
| `message` | string | |
| `status` | Enum | `new`, `in_progress`, `answered` |
| `submittedAt` | string | ISO-8601, **serverseitig gesetzt** |

**Endpunkte** im bestehenden REST-Stil:

- `POST /contact-requests` — Anfrage einreichen
- `GET /contact-requests` — Liste, mit optionalem Filter `?status=`
- `GET /contact-requests/:id` — eine Anfrage
- `PATCH /contact-requests/:id` — Status ändern
- kein `DELETE`

**Fachliche Regeln — die gehören in den Service, nicht ins DTO:**

1. `submittedAt` setzt der Server. Ein Wert aus dem Request wird ignoriert.
2. Eine neue Anfrage startet immer mit `status: new`. Der Client kann den Status
   beim Anlegen nicht mitgeben.
3. **Erlaubt sind nur die Übergänge `new → in_progress` und
   `in_progress → answered`.** Kein Rücksprung, kein Überspringen. Ein
   unerlaubter Übergang wird mit `400` und einer verständlichen Meldung
   abgelehnt.
4. Unbekannte `id` → `404`.

> Regel 3 ist der Kern der Aufgabe. Ein DTO kann prüfen, ob `status` ein
> *gültiger Wert* ist. Ob dieser Übergang aus dem *aktuellen* Zustand erlaubt
> ist, weiß nur der Service — er müsste dafür den gespeicherten Datensatz kennen.
> Genau deshalb liegt Fachlogik im Service.

**Außerdem:** DTOs, Validierung, Swagger-Dekoratoren und Mapping wie in den
bestehenden Modulen, plus fokussierte Unit-Tests. Orientiert euch an
`src/offices` und `src/appointments` — das neue Modul soll daneben fast
langweilig wirken.

Seeding braucht ihr nicht: mit `POST` habt ihr schnell genug Testdaten.

### Empfohlene Tests

- `POST` setzt `status: new` und `submittedAt` selbst, auch wenn der Client etwas
  anderes mitschickt
- `GET` filtert nach `status`
- `PATCH` erlaubt `new → in_progress`
- `PATCH` lehnt `in_progress → new` mit `400` ab
- unbekannte `id` → `404`

### Erweiterungen (nur mit zeitlichem Puffer)

1. Ein vierter Status `rejected` mit eigenen Übergangsregeln — aus welchen
   Zuständen darf man dorthin?
2. Beim Übergang auf `answered` automatisch ein `answeredAt` setzen.
3. Suche über `?q=` in `subject` und `message`.
4. **Erweitert das Skill `module-review`** um Prüfpunkte, die speziell für euer
   Modul gelten — zum Beispiel: „Steht die Prüfung der Statusübergänge im
   Service und nicht im DTO?" Lasst den Reviewer danach noch einmal laufen.

> **Wenn ihr überlegt, ein Skill für euren Ablauf zu schreiben:** Ein Skill, das
> nur „rufe Architekt, dann Developer, dann Reviewer" sagt, enthält kein Wissen —
> die Substanz steht in den Agent-Dateien, und den einen Schritt, auf den es
> ankommt (der Mensch schaut hin), kann ein Skill ohnehin nicht erzwingen.
> Faustregel: **Agent = Rolle, Skill = Wissen, Ablauf = Handarbeit.**

## Abnahmekriterien

- [ ] `npm test` und `npm run build` laufen durch.
- [ ] Die Endpunkte funktionieren in Swagger, inklusive eines abgelehnten
      Statusübergangs.
- [ ] Das neue Modul liest sich wie `offices/` und `appointments/`.
- [ ] Ihr könnt erklären, **warum** Regel 3 nicht im DTO stehen kann.
- [ ] Ihr könnt **einen Fehler benennen, den ein Agent gemacht hat und den ein
      Mensch gefangen hat**.

## Für die Abschlusspräsentation (3 Minuten, hart getaktet)

1. **Demo** in Swagger: eine Anfrage einreichen, den Status weiterschalten, einen
   unerlaubten Übergang abgelehnt bekommen.
2. **Ein Test**, kurz erklärt: was sichert er ab?
3. **Ein Satz:** Was hat ein Agent falsch gemacht, und wie habt ihr es gemerkt?
