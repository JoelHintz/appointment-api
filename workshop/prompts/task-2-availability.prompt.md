# Trainer-Fallback: Prompt für Aufgabe 2

**Nicht standardmäßig ausgeben.** Die Gruppen sollen ihre Prompts selbst
formulieren. Nutze das nur, wenn eine Gruppe sonst nicht vorankommt.

---

Ich arbeite in einer NestJS + TypeScript Appointment API.

Bitte implementiere:

```http
GET /offices/:id/availability?date=2026-06-30
```

## Ziel

Gib alle freien Ein-Stunden-Slots für das gewählte Amt am angegebenen Datum
zurück.

## Fachliche Regeln

- Ein Termin gehört zu genau einem Amt.
- Ein Slot wird durch `date` und `startHour` bezeichnet, beides Ortszeit des
  Amts. Rechne keine Zeitzonen um.
- Ein Termin dauert genau eine Stunde: `endHour = startHour + 1`.
- Slots entstehen zwischen `opensAtHour` und `closesAtHour` des Amts.
- Ein Amt darf keine zwei Termine im selben Slot haben.
- Direkt aufeinanderfolgende Termine sind erlaubt.
- Bereits gebuchte Slots müssen ausgeschlossen werden.

## Umsetzungsvorgaben

- Folge der bestehenden Feature-First-Struktur.
- Nutze die vorhandenen Entitäten `Office` und `Appointment`.
- Ergänze ein Query-DTO für den Parameter `date`.
- Ergänze ein Response-DTO für die Slots.
- Ergänze `@ApiProperty()` an beiden DTOs — ohne sie ist der Endpunkt in Swagger
  nicht bedienbar.
- Halte die Umsetzung einfach und lesbar.
- Führe keine neuen Abhängigkeiten ein.
- Keine Authentifizierung, kein Frontend, kein Caching, keine Queues, keine
  produktionsspezifischen Abstraktionen.

## Vorgehen

Sieh dir zuerst den bestehenden Controller, Service, die DTOs, die Entität und
die Teststruktur an.

Schlage danach einen kurzen Umsetzungsplan vor.

Setz ihn erst nach meiner Freigabe um.

## Erwartete Antwortform

```json
[
  {
    "officeId": 1,
    "date": "2026-06-30",
    "startHour": 8,
    "endHour": 9
  }
]
```

## Validierung

Der Endpunkt soll ungültige Datumsangaben ablehnen. Achtung: `@IsISO8601()` und
`@IsDateString()` akzeptieren auch vollständige Zeitstempel wie
`2026-06-30T12:00:00Z`. Überleg dir, ob das hier erlaubt sein soll.

## Tests

Tests sind hier optional. Wenn du welche schreibst, deck diese Fälle ab — und
erklär mir jeden Test in einem Satz, damit ich ihn prüfen kann, statt ihn nur zu
übernehmen:

- Slots werden geliefert, wenn keine Termine existieren
- belegte Ein-Stunden-Slots werden ausgeschlossen
- direkt aufeinanderfolgende Slots sind erlaubt
- leeres Array, wenn kein Slot frei ist
- ungültiger `date`-Parameter wird abgelehnt

---

## Fallback für Zusatzaufgabe 1 (Termin stornieren)

Nur ausgeben, wenn eine Gruppe die Erweiterung sonst nicht anfängt. Der Prompt
nennt die beiden Folgestellen bewusst **nicht** — das Finden ist die Aufgabe.

In derselben Appointment API sollen Termine storniert werden können. Die Entität
`Appointment` kennt den Status `canceled` bereits, aber keine Route kann ihn
setzen.

Regeln:

- Ein stornierter Termin behält seine Daten und bleibt über `GET /appointments/:id`
  abrufbar.
- Ein stornierter Termin belegt keinen Slot mehr: Er darf in der Verfügbarkeit
  nicht mehr blockieren, und sein Slot muss neu buchbar sein.
- Ein bereits stornierter Termin lässt sich erneut stornieren, ohne dass sich
  etwas ändert. Eine Übergangsprüfung brauche ich nicht.

Die Route soll zum bestehenden REST-Stil passen: keine Verb-Routen, kein `DELETE`,
Rückgabe als DTO. Schlag mir zwei Varianten mit einem Satz Begründung vor, bevor
du dich für eine entscheidest.

Sieh dir vorher an, welche Stellen im Code heute Termine laden, und sag mir, ob
deine Änderung dort etwas ändern muss. Plan zuerst, dann umsetzen.
