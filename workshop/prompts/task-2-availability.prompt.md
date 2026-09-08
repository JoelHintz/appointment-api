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
- Ein Termin dauert genau eine Stunde.
- Ein Termin beginnt zur vollen Stunde.
- Ein Amt darf keine überschneidenden Termine haben.
- Direkt aufeinanderfolgende Termine sind erlaubt.
- Bereits gebuchte Slots müssen ausgeschlossen werden.

## Umsetzungsvorgaben

- Folge der bestehenden Feature-First-Struktur.
- Nutze die vorhandenen Entitäten `Office` und `Appointment`.
- Ergänze ein Query-DTO für den Parameter `date`.
- Ergänze ein Response-DTO für die Slots.
- Ergänze Swagger-Dekoratoren.
- Ergänze oder aktualisiere Unit-Tests.
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
    "startsAt": "2026-06-30T08:00:00.000Z",
    "endsAt": "2026-06-30T09:00:00.000Z"
  }
]
```

## Validierung

Der Endpunkt soll ungültige Datumsangaben ablehnen. Achtung: `@IsISO8601()` und
`@IsDateString()` akzeptieren auch vollständige Zeitstempel wie
`2026-06-30T12:00:00Z`. Überleg dir, ob das hier erlaubt sein soll.

## Tests

Deck mindestens ab:

- Slots werden geliefert, wenn keine Termine existieren
- belegte Ein-Stunden-Slots werden ausgeschlossen
- direkt aufeinanderfolgende Slots sind erlaubt
- leeres Array, wenn kein Slot frei ist
- ungültiger `date`-Parameter wird abgelehnt
