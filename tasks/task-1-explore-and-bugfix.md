# Aufgabe 1 — Codebasis erschließen, `CLAUDE.md` schreiben, ersten Bug fixen

| | |
|---|---|
| **Zeitbudget** | ca. 65 Minuten (20 / 25 / 20) |
| **Level** | alle |
| **Voraussetzung** | keine |

Ihr erschließt eine fremde Anwendung mit Claude Code, haltet das Ergebnis in
einem `CLAUDE.md` fest und behebt damit einen Fehler in der Validierung.

---

## Teil a — Die Anwendung erschließen (~20 Min)

### 1. Verhalten, ohne Claude (~5 Min)

`npm run start:dev` starten, Swagger unter `http://localhost:3000/api` öffnen.
Legt Termine an, ruft die Listen ab, ändert einen per `PATCH`, bucht denselben
Slot zweimal. Noch nichts im Code nachlesen.

### 2. Code, mit Claude (~15 Min)

Arbeitet die Erkundungskarte ab: die ersten drei Punkte sind Pflicht, dazu
mindestens einer aus dem unteren Block.

- [ ] **Module** — Woraus besteht ein Feature-Modul, und wie erfährt die
      Anwendung davon?
- [ ] **Validierung** — Wo wird eine eingehende Anfrage geprüft? Was prüft das
      DTO, was der Service?
- [ ] **Transportobjekte** — Warum gibt der Controller ein DTO zurück und nicht
      die Entity? Wo wird umgewandelt?

- [ ] **Konventionen** — Wie muss eine neue Datei heißen, wo gehört sie hin?
      Wann Singular, wann Plural?
- [ ] **Persistenz** — Wie hängen `Appointment` und `Office` zusammen?
- [ ] **Start & Daten** — Woher kommen die drei Ämter, und warum sind sie nach
      einem Neustart nicht doppelt vorhanden?
- [ ] **Tests** — Was ist in diesem Projekt getestet, was nicht?

Dabei gelten zwei Regeln: Öffnet die Dateien, die Claude nennt, und prüft die
Aussage nach. Und lasst in Teil a nichts ändern — schreibt das in eure Prompts.

**Ein Prompt als Muster.** Die übrigen Fragen formuliert ihr selbst.

> In diesem NestJS-Projekt kenne ich mich noch nicht aus. Sieh dir
> `@src/appointments/` an und erkläre mir in wenigen Sätzen, welchen Weg eine
> eingehende `POST /appointments`-Anfrage nimmt: Welche Datei ist für welchen
> Schritt zuständig? Nenne zu jedem Schritt die Datei. Ändere nichts.

Brauchbar machen ihn die `@`-Referenz, eine konkrete Frage statt „erklär mir
alles", die Bitte um die Datei — und „ändere nichts".

### 3. Zum Abschluss, ohne Claude

- Wo liegt die Fachlogik — im Controller, im Service oder in den DTOs?
- Welche drei Regeln gelten für einen Termin? Sie stehen nicht an einer Stelle
  im Code.

---

## Teil b — Euer `CLAUDE.md` (~25 Min)

`CLAUDE.md` liest Claude in diesem Projekt bei jeder Sitzung automatisch mit.
Was dort steht, muss man nicht in jedem Prompt wiederholen.

### 1. Erste Fassung, von euch (~10 Min)

Legt `CLAUDE.md` im Wurzelverzeichnis an; eine Bildschirmseite genügt. Sechs
Überschriften reichen: **Projekt**, **Architektur** (3–5 Sätze), **Fachregeln**
(die drei Termin-Regeln in euren Worten), **Konventionen**, **Kommandos** und
**Was hier nicht getan wird**.

Schreibt sie selbst, auch wenn sich so eine Datei erzeugen ließe: Was ihr in
Teil a über das Verhalten der Anwendung gelernt habt, steht in keinem generierten
Text. Wenn ihr nicht weiterkommt, hilft **Hinweis A** im Anhang.

### 2. Claude als Prüfer (~10 Min)

Formuliert einen Prompt, der sinngemäß fragt:

> Lies mein `CLAUDE.md` und danach den Code. Was darin stimmt nicht mit dem
> Projekt überein? Was fehlt dir, wenn du gleich etwas an den Terminen ändern
> sollst?

Bessert nach. Auch hier gilt: erst nachsehen, dann übernehmen.

### 3. Prüfliste (~5 Min)

- [ ] Die Kommandos stimmen — gegen `package.json` abgeglichen, inklusive des
      Hinweises, dass `npm run lint` Dateien umschreibt.
- [ ] Die drei Termin-Regeln stehen vollständig drin.
- [ ] Es steht drin, was hier *nicht* getan wird: kein `DELETE`, keine neuen
      Abhängigkeiten, keine Authentifizierung.

Faustregel für den Rest des Tages: Was ihr Claude dreimal erklärt, gehört ins
`CLAUDE.md`.

---

## Teil c — Härtetest (~20 Min)

### Funde sammeln

Sucht in Swagger nach Eingaben, die die API **annimmt, obwohl es sie fachlich
nicht gibt**. Claude darf beim Suchen helfen, aber nur lesend — in diesem Schritt
wird noch nichts geändert.

Haltet die Funde stichwortartig fest:

| Request | erwartet | tatsächlich |
|---|---|---|
| | | |

Zwei Funde genügen; es gibt mindestens vier. Wenn nach etwa sechs Minuten nichts
in der Tabelle steht: **Hinweis B** im Anhang, danach **Hinweis C**.

### Fix

Sucht euch einen eurer Funde aus und behebt ihn — wenn ihr mehrere habt, den mit
der unangenehmsten Auswirkung. Benennt die Ursache in einem Satz, bevor ihr etwas
ändert, und behebt sie an der Stelle, an der diese Art Regel hingehört (siehe
Teil a). Die Fachregeln selbst bleiben unverändert: Ein-Stunden-Slots zur vollen
Stunde.

### Nachweis

| Request | erwartet |
|---|---|
| die Eingabe aus eurem Fund | abgelehnt, `400` |
| dieselbe Anfrage mit einem sinnvollen Wert | `200` bzw. `201` |
| der Grenzfall: der letzte Wert, der noch gültig ist | weiterhin akzeptiert |
| `npm test` | grün |

Die dritte Zeile zeigt, ob euer Fix nicht zu streng ausgefallen ist — bei einem
Wertebereich für Stunden ist das die 23, bei Öffnungszeiten die letzte Stunde vor
Schließung.

### Zusatzaufgaben

1. **`CLAUDE.md` prüfen** — frische Sitzung (`/clear`), dann eine Frage, die nur
   mit Projektwissen richtig zu beantworten ist: „Wo gehört eine Prüfung hin, die
   die Öffnungszeiten des Amts berücksichtigt?"
2. **Test** — einen Test in `create-appointment.dto.spec.ts` schreiben lassen und
   lesen: Prüft er, was ihr gefixt habt?
3. **Werkzeugkasten** — einmal bewusst ausprobieren: `@`-Referenz, Plan-Modus
   (findet selbst heraus, wie man ihn einschaltet), `git diff` erklären lassen.
4. **Zweiter Fix** — einen weiteren Fund aus eurer Tabelle beheben. Vorher
   entscheiden: DTO oder Service?
5. **Öffnungszeiten** (fortgeschritten) — Termine außerhalb `opensAtHour` /
   `closesAtHour` ablehnen. Warum gehört diese Prüfung woandershin als die aus
   der Hauptaufgabe? Greift sie auch bei `PATCH`?

---

## Abnahmekriterien

- [ ] Ein selbst geschriebenes `CLAUDE.md` liegt im Projekt und hält der
      Prüfliste aus Teil b stand.
- [ ] Einer eurer Funde ist behoben, die Nachweis-Tabelle stimmt, der `git diff` ist
      gemeinsam gelesen.
- [ ] Jede:r kann die Ursache in einem Satz benennen und sagen, wo die Fachlogik
      liegt.

---

## Anhang: Hinweise

Erst lesen, wenn ihr feststeckt.

**A — Teil b, wenn die erste Fassung nicht zustande kommt.** `/init` klopft das
Projekt ab und schlägt ein `CLAUDE.md` vor. Kopiert eure eigene Fassung vorher
weg, denn `/init` fängt bei einer vorhandenen Datei nicht bei null an, und lest
das Ergebnis Zeile für Zeile: Es ist ein Entwurf und kennt nichts aus Teil a.

**B — Teil c, wenn die Tabelle leer bleibt.** Die Vertragsgrenze der API sind die
DTOs, hier vor allem `src/appointments/dto/`. Nehmt ein Feld nach dem anderen und
fragt: Welche Werte lässt die Prüfung durch, die es fachlich nicht gibt? Probiert
die Kandidaten in Swagger aus.

**C — Teil c, wenn ihr danach immer noch keinen Fund habt.** Legt
`{ "title": "Stunde 25", "officeId": 1, "date": "2026-06-20", "startHour": 25 }`
an: Das ergibt `201`. Schaut auf `endHour` und ruft danach
`GET /offices/1/availability?date=2026-06-20` auf. Zum Vergleich wird
`"startHour": 9.5` mit `400` abgelehnt — es gibt also eine Prüfung, sie ist nur
nicht vollständig.
