# Trainer-Fallback: Prompt für Teil c von Aufgabe 1

**Nicht standardmäßig ausgeben.** Die Gruppen sollen ihre Prompts selbst
formulieren. Nutze das nur, wenn eine Gruppe sonst gar nicht in Teil c ankommt.

---

## Für den Hauptbug (Zeitzonen-Doppelbuchung)

Ich arbeite in dieser NestJS Appointment API. Es gilt die Regel: Ein Amt darf
keine zwei Termine zur selben Startzeit haben. Ich kann sie aushebeln.

Wenn ich für dasselbe Amt zwei Termine anlege — einen mit
`startsAt: "2026-06-20T09:00:00+02:00"` und einen mit
`startsAt: "2026-06-20T07:00:00.000Z"` — werden beide akzeptiert, obwohl das
derselbe Zeitpunkt ist.

Ändere zunächst nichts. Sieh dir `@src/appointments/appointments.service.ts` an
und erkläre mir:

- Was genau wird gespeichert, wenn ich einen Offset schicke?
- Womit vergleicht die Überschneidungsprüfung?
- Warum fällt der Konflikt deshalb durch?

Schlage danach einen kleinen Fix vor, der das Problem an **einer** Stelle löst,
statt jeden Vergleich einzeln zu reparieren. Zeig mir den Plan, bevor du etwas
änderst. Fass die Fachregeln nicht an — Ein-Stunden-Slots zur vollen Stunde
bleiben. Ergänze zum Schluss einen fokussierten Unit-Test für genau diesen Fall
und lass `npm test` laufen.

---

## Für die Ausweichoption (`officeId`-Validierung)

Ich glaube, `POST /appointments` geht mit einer ungültigen `officeId` falsch um.

Ändere zunächst nichts. Sieh dir `@src/appointments/dto/create-appointment.dto.ts`
und `@src/appointments/appointments.service.ts` an und sag mir, was bei
`officeId: "abc"`, `officeId: 0` und `officeId: -1` passiert. Welcher HTTP-Status
kommt zurück, und ist das der richtige?

Schlage danach eine kleine Änderung vor, die `officeId` im DTO als positive
Ganzzahl validiert — im selben Stil wie
`@src/appointments/dto/find-appointments.dto.ts` — und das irreführende
Swagger-`example` korrigiert. Plan zuerst, dann umsetzen, dann `npm test`.
