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
- Slots entstehen zwischen der Öffnungs- und der Schließzeit des Amts. Behandelt
  `opensAt` / `closesAt` als **UTC**-Stunden — eine bewusste Vereinfachung für
  den Workshop, keine korrekte Zeitzonenbehandlung.
- Bereits gebuchte Slots werden ausgeschlossen.
- Direkt aufeinanderfolgende Termine sind erlaubt.

## Anforderungen

- Ein REST-Endpunkt, der zum bestehenden Stil passt.
- Ein Query-DTO für `date`.
- Ein Response-DTO für die Slots.
- Swagger-Dekoratoren, ausreichend zum manuellen Testen unter `/api`.
- Fokussierte Unit-Tests.

> **Falle bei der Datums-Validierung**
>
> `@IsISO8601()` und `@IsDateString()` akzeptieren auch vollständige
> Zeitstempel wie `2026-06-30T12:00:00Z`, nicht nur `2026-06-30`. Ein solcher
> Wert kommt durch die Validierung und lässt danach eine naive Datums-Zerlegung
> auflaufen. Wenn ihr ein reines Datum braucht, schränkt es explizit ein, z. B.
> mit `@Matches(/^\d{4}-\d{2}-\d{2}$/)`.

## Empfohlene Tests

- Alle Slots, wenn keine Termine existieren
- Belegte Slots werden ausgeschlossen
- Direkt aufeinanderfolgende Slots sind erlaubt
- Leeres Ergebnis, wenn nichts frei ist
- Ungültiges Datum wird abgelehnt

## Erweiterungen (nach Level auswählen)

1. Daten in der Vergangenheit ablehnen.
2. Sinnvoll reagieren, wenn das Amt an dem Tag geschlossen ist.
3. Nach Aufgabe 3: ein optionaler `?serviceId=`-Filter.

## Abnahmekriterien

- [ ] Der Endpunkt lässt sich in Swagger mit gültiger und ungültiger Eingabe aufrufen.
- [ ] Es werden nur gültige, nicht gebuchte Stunden-Slots zurückgegeben.
- [ ] Ungültige oder unvollständige Eingaben werden sauber behandelt.
- [ ] `npm test` läuft durch, sinnvolle Tests sind ergänzt.
- [ ] Die Umsetzung folgt dem bestehenden Projektstil.
- [ ] Ihr könnt die wesentlichen Teile eurer Lösung erklären.

## Bevor ihr abschließt

- **Erklären:** Kann jede:r den gewählten Endpunkt erklären und sagen, wo die
      Fachlogik liegt?
- **Testen:** `npm test` — alles grün?
- **Swagger:** Gültige und ungültige Eingabe ausprobiert?
- **Diff prüfen:** `git diff` gemeinsam lesen. Etwas Unerwartetes dabei?
