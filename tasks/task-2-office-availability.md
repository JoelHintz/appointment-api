# Aufgabe 2 — Feature: freie Termin-Slots eines Amts

| | |
|---|---|
| **Zeitbudget** | ca. 60 Minuten |
| **Level** | alle (Kern), Erweiterungen für Fortgeschrittene |
| **Voraussetzung** | keine (unabhängig von Aufgabe 1) |

## Ziel

Baut einen Endpunkt, der die **freien Ein-Stunden-Slots** für ein Amt an einem
Tag zurückgibt:

```http
GET /offices/:id/availability?date=2026-06-30
```

Einige Details sind bewusst offen gelassen. Schaut euch die bestehende Codebasis
an, bevor ihr Design-Entscheidungen trefft.

## Fachliche Regeln

- Ein Termin dauert genau eine Stunde und beginnt zur vollen Stunde.
- Ein Slot wird durch `date` und `startHour` bezeichnet — beides Ortszeit des
  Amts. Die API rechnet keine Zeitzonen um.
- Slots entstehen zwischen `opensAtHour` und `closesAtHour` des Amts.
- Bereits gebuchte Slots werden ausgeschlossen.
- Direkt aufeinanderfolgende Termine sind erlaubt.

## Anforderungen

- Ein REST-Endpunkt, der zum bestehenden Stil passt.
- Ein Query-DTO für `date`.
- Ein Response-DTO für die Slots.
- `@ApiProperty()` an beiden DTOs — ohne die Dekoratoren ist der Endpunkt in
  Swagger nicht bedienbar, und ihr könnt eure eigene Lösung nicht ausprobieren.

## Nachweis

Prüft in Swagger:

| Request | erwartet |
|---|---|
| `?date=2026-06-30` ohne gebuchte Termine | alle Stunden zwischen `opensAtHour` und `closesAtHour` |
| derselbe Aufruf, nachdem ihr eine Stunde gebucht habt | genau diese Stunde fehlt |
| `?date=30.06.2026` | `400` |
| `?date=2026-06-30T12:00:00Z` | `400` |
| unbekanntes Amt | `404` |
| `npm test` | grün |

> Die vierte Zeile ist die interessante. Wenn euer Endpunkt dort nicht `400`
> liefert, schaut genau hin, **was** er stattdessen zurückgibt — und ob ihr das
> auf Anhieb als falsch erkannt hättet.

## Zusatzaufgaben, wenn ihr Zeit habt

### Tests

Fokussierte Unit-Tests: alle Slots frei, belegter Slot ausgeschlossen, leeres
Ergebnis, ungültiges Datum. Lasst Claude sie schreiben und **lest sie**, bevor
ihr sie übernehmt.

### Einen Termin stornieren

Termine lassen sich anlegen und ändern, aber nicht absagen. Der Status `canceled`
existiert in der Entität — setzen kann ihn keine Route.

- Ein stornierter Termin bleibt abrufbar und belegt keinen Slot mehr.
- Ein bereits stornierter Termin lässt sich erneut stornieren, ohne Wirkung.

Die Route wählt ihr selbst und begründet sie in einem Satz. Es gelten die Regeln
des Projekts: keine Verb-Routen, kein `DELETE`, Rückgabe als DTO.

| Request | erwartet |
|---|---|
| Termin um 10 Uhr anlegen, stornieren, abrufen | `200`, `status: canceled`, Daten unverändert |
| `GET /offices/:id/availability` für denselben Tag | 10 Uhr ist wieder frei |
| erneut einen Termin um 10 Uhr anlegen | `201` |

Die letzten beiden Zeilen brauchen mehr als den neuen Endpunkt. Und wenn ihr zum
Prüfen `GET /appointments?status=canceled` benutzt: Der Filter nimmt auch
unsinnige Werte an, statt sie abzulehnen — das ist eine Zeile, die ihr gleich
mitnehmen könnt.

### Vergangene Daten ablehnen

Ein Datum in der Vergangenheit soll `400` liefern. Klärt vorher: Woher kommt
„heute" — und wie prüft ein Test eine Regel, die von der Uhr abhängt?

## Abnahmekriterien

- [ ] Der Endpunkt lässt sich in Swagger mit gültiger und ungültiger Eingabe aufrufen.
- [ ] Es werden nur gültige, nicht gebuchte Stunden-Slots zurückgegeben.
- [ ] Die Nachweis-Tabelle stimmt.
- [ ] `npm test` läuft durch.
- [ ] Die Umsetzung folgt dem bestehenden Projektstil.
- [ ] Ihr könnt die wesentlichen Teile eurer Lösung erklären.

## Bevor ihr abschließt

- **Erklären:** Kann jede:r den gewählten Endpunkt erklären und sagen, wo die
      Fachlogik liegt?
- **Testen:** `npm test` — alles grün?
- **Swagger:** Gültige und ungültige Eingabe ausprobiert?
- **Diff prüfen:** `git diff` gemeinsam lesen. Etwas Unerwartetes dabei?
