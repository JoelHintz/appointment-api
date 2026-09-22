# Aufgabe 2: Feature für freie Termin-Slots eines Amts

## Ziel

Baut einen Endpunkt, der die **freien Ein-Stunden-Slots** für ein Amt an einem
Tag zurückgibt:

```http
GET /offices/:id/availability?date=2027-06-30
```

Einige Details sind bewusst offengelassen; entscheidet sie, wenn ihr den Plan
lest.

## Fachliche Regeln

- Ein Slot wird durch `date` und `startHour` bezeichnet, beides Ortszeit des
  Amts. Die API rechnet keine Zeitzonen um.
- Slots entstehen zwischen `opensAtHour` und `closesAtHour` des Amts.
- Bereits gebuchte Slots werden ausgeschlossen.

## Anforderungen

- Ein REST-Endpunkt, der zum bestehenden Stil passt.
- Ein Query-DTO für `date`.
- Ein Response-DTO für die Slots.
- `@ApiProperty()` an beiden DTOs; ohne sie fehlt in Swagger das Eingabefeld für
  `date`, und ihr könnt eure eigene Lösung nicht ausprobieren.

## Nachweis

Prüft in Swagger:

| Request | erwartet |
|---|---|
| Amt 1 (8 bis 16 Uhr), `?date=2027-06-30`, nichts gebucht | Slots mit `startHour` 8 bis 15 |
| derselbe Aufruf, nachdem ihr 10 Uhr gebucht habt | 10 fehlt, 9 und 11 sind da |
| `?date=30.06.2027` | `400` |
| unbekanntes Amt | `404` |

`npm test` bleibt grün.

## Abnahmekriterien

- [ ] Die Nachweis-Tabelle stimmt.
- [ ] Ihr könnt sagen, was ihr am Plan geändert oder bewusst so gelassen habt,
      und warum.
- [ ] Die Umsetzung folgt dem bestehenden Projektstil, ihr habt den `git diff`
      gemeinsam gelesen, und jede:r kann sagen, wo die Fachlogik liegt.

## Zusatzaufgaben

### Tests

Fokussierte Unit-Tests: alle Slots frei, belegter Slot ausgeschlossen, leeres
Ergebnis, ungültiges Datum. Lasst Claude sie schreiben und **lest sie**, bevor
ihr sie übernehmt.

### Einen Termin stornieren

Der Status `canceled` existiert in der Entität, aber keine Route setzt ihn. Ein
stornierter Termin bleibt abrufbar und belegt keinen Slot mehr; ein zweites
Stornieren ändert nichts. Die Route wählt ihr selbst und begründet sie in einem
Satz, nach den Regeln des Projekts: keine Verb-Routen, kein `DELETE`, Rückgabe
als DTO.

| Request | erwartet |
|---|---|
| Termin um 10 Uhr anlegen, stornieren, abrufen | `200`, `status: canceled`, Daten unverändert |
| unbekannten Termin stornieren | `404` |
| Availability für denselben Tag | 10 Uhr ist wieder frei |
| erneut einen Termin um 10 Uhr anlegen | `201` |

### Vergangene Daten ablehnen

Der Availability-Endpunkt liefert für ein Datum in der Vergangenheit `400`.
Klärt vorher: Woher kommt „heute“, und wie prüft ein Test eine Regel, die von
der Uhr abhängt?
