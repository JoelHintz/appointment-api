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

1. **Tests.** Ergänzt fokussierte Unit-Tests — alle Slots frei, belegter Slot
   ausgeschlossen, leeres Ergebnis, ungültiges Datum. Lasst Claude sie schreiben
   und **lest sie**, bevor ihr sie übernehmt.
2. Daten in der Vergangenheit ablehnen.
3. Sinnvoll reagieren, wenn das Amt an dem Tag geschlossen ist.
4. Nach Aufgabe 3: ein optionaler `?serviceId=`-Filter.

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
