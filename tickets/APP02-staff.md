# APP02 — Büropersonal & parallele Termine

## User Story

> **Als** öffentliche Stelle **möchte ich** meinem Büro Mitarbeiter zuordnen können (ein oder mehrere pro Büro),
> **damit** das Büro innerhalb der gleichen Stunde mehrere Termine parallel abhalten kann — genau so viele, wie verfügbare Mitarbeiter vorhanden sind.

## Kontext

Derzeit kann ein Büro **maximal einen Termin pro Stunden-Slot** vorhalten. Der Überschneidungs-Check in `AppointmentsService` ist ein exakter Abgleich auf `officeId` + `startsAt`, was gültig ist, da die Slots feste Ein-Stunden-Blöcke sind.

Nach dieser Funktion darf ein Büro **pro Mitarbeiter pro Slot einen Termin** vorhalten. Dies verändert das Buchungsausmaß grundlegend: Die Kapazität pro Slot wird zu einer Funktion der Mitarbeiterzahl statt einer harten Begrenzung auf einen.

## Anforderungen

1. **Neue `Staff`-Entität** (Modul: `src/staff/` oder Erweiterung von `src/offices/` — Designentscheidung bewusst offen)
   - Gehört genau zu einem Büro (`officeId`, muss existieren → sonst `NotFoundException`)
   - `name` (Pflichtfeld, nicht leer)
2. **Endpoints**
   - `POST /staff` — legt einen Mitarbeiter an, der einem Büro zugeordnet ist
   - `GET /staff` — listet Mitarbeiter auf (optional: Filterung nach `officeId`)
3. **Geänderte Geschäftsregel: Termin-Kapazität**
   - Ein Büro mit `n` Mitarbeitern kann pro Slot bis zu `n` Termine vorhalten
   - Buchung des `(n+1)`-ten Termins für denselben Slot → `400 BadRequestException`
   - **Randfall:** Ein Büro _ohne_ Mitarbeiter — entscheiden und dokumentieren: `0` erlaubt (strikt) vs. unbegrenzt (rückwärtskompatibel)
4. **Verfügbarkeits-Endpoint** (APP01, falls umgesetzt) muss angepasst werden: Ein Slot ist verfügbar, solange `booked < staffCount` — entscheiden, ob die Antwort die verbleibende Kapazität pro Slot ausweisen soll
5. Swagger/OpenAPI-Dokumentation und `class-validator`-DTOs (die globale `ValidationPipe` mit `forbidNonWhitelisted` beachten)
6. **Fokussierte Unit-Tests:**
   - Anlegen von Mitarbeitern mit unbekanntem Büro → `404`
   - Kapazitätsregel: Das `n`-te Booking succeeds, das `(n+1)`-te wird abgelehnt
   - Update-Ablauf: Verschieben eines Termins in einen bereits voll belegten Slot wird abgelehnt
   - Verfügbarkeit: Die Slots berücksichtigen die Mitarbeiter-Kapazität
7. Bestehenden Projektstil einhalten (dünne Controller, Geschäftslogik in den Services, Fixtures aus `test/testdata.factory.ts`)

## Offene Designfragen

Bewusst offen gelassen zur Diskussion:

- Wo gehört das Personal hin: eigenes `staff`-Modul oder Teil des `offices`-Moduls?
- Was passiert, wenn ein Mitarbeiter gelöscht wird (falls Löschung im Scope ist — _Empfehlung: aus dem Scope lassen_)?
- Ändert sich die Antwortstruktur des Verfügbarkeits-Endpoints (z. B. verbleibende Kapazität pro Slot)?

## Abnahmekriterien

- Mitarbeiter können über Swagger angelegt und aufgelistet werden
- Ein Büro mit 3 Mitarbeitern akzeptiert 3 Termine im selben Slot und lehnt den 4. ab
- Alle Unit-Tests bestehen (`npm test`)
- Bestehendes Verhalten (feste Stunden-Slots, `endsAt` als `startsAt + 60 min` berechnet) bleibt unverändert
- Man kann erklären, wo der Kapazitäts-Check den alten Überschneidungs-Check ersetzt
