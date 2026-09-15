# Trainer-Fallback: Prompt für Teil c von Aufgabe 1

**Nicht standardmäßig ausgeben.** Die Gruppen sollen ihre Prompts selbst
formulieren. Nutze das nur, wenn eine Gruppe sonst gar nicht in Teil c ankommt.

---

## Für den Bug (`startHour` ohne Bereichsprüfung)

Ich arbeite in dieser NestJS Appointment API. Ein Termin belegt einen
Ein-Stunden-Slot, bezeichnet durch `date` und `startHour`.

Wenn ich `{"title": "Test", "officeId": 1, "date": "2026-06-20", "startHour": 25}`
schicke, wird der Termin mit `201` angelegt und bekommt `endHour: 26`. Eine
Stunde 25 gibt es nicht. Gleichzeitig wird `"startHour": 9.5` korrekt mit `400`
abgelehnt — es gibt hier also eine Prüfung, die nicht vollständig ist.

Ändere zunächst nichts. Sieh dir `@src/appointments/dto/create-appointment.dto.ts`
an und erkläre mir:

- Welche Prüfungen gelten aktuell für `startHour`?
- Welche Werte lässt das durch, die es als Uhrzeit nicht gibt?
- Gehört diese Prüfung ins DTO oder in den Service — und warum?

Schlage danach eine kleine Änderung vor. Zeig mir den Plan, bevor du etwas
änderst. Fass die Fachregeln selbst nicht an — Ein-Stunden-Slots zur vollen
Stunde bleiben, wie sie sind.

---

## Für die Zusatzaufgabe (Öffnungszeiten)

Termine lassen sich aktuell zu jeder Stunde buchen, auch wenn das Amt geschlossen
hat. Ein Amt hat `opensAtHour` und `closesAtHour`.

Sieh dir `@src/appointments/appointments.service.ts` an und schlage vor, wie eine
Prüfung aussehen müsste, die einen Termin außerhalb der Öffnungszeiten ablehnt.
Erkläre mir zuerst, **warum** diese Prüfung nicht ins DTO gehört, und sag mir
dazu, ob deine Änderung auch für `PATCH` greift. Plan zuerst, dann umsetzen.
