# Trainer-Fallback: Prompts für Aufgabe 1

**Nicht standardmäßig ausgeben.** Die Gruppen sollen ihre Prompts selbst
formulieren; in der Aufgabendatei steht dafür genau **ein** Musterprompt (Teil a).
Alles hier ist für den Fall gedacht, dass eine Gruppe sonst nicht weiterkommt.

Die abgestuften Hinweise für die Gruppen stehen bereits **im Anhang der
Aufgabendatei** (Hinweis A: `/init`, Hinweis B: wo man in Teil c sucht,
Hinweis C: der konkrete Payload). Verweise zuerst dorthin. Die Prompts unten sind
die Stufe darunter.

---

## Teil a — wenn die Erkundung nicht in Gang kommt

Ein zweiter Musterprompt, der ein anderes Kartenfeld trifft als der in der
Aufgabe (dort geht es um den Weg einer Anfrage):

> Ich will verstehen, wie in diesem Projekt geprüft wird, was hereinkommt. Sieh
> dir `@src/appointments/dto/` und `@src/appointments/appointments.service.ts`
> an: Welche Prüfungen stehen in den DTOs, welche im Service — und woran erkenne
> ich, was wohin gehört? Nenne zu jeder Aussage die Datei. Ändere nichts.

Wenn eine Gruppe Claude alles beantworten lässt, ohne hinzusehen, ist die
wirksamste Intervention keine Prompt-Korrektur, sondern eine Frage:
*„Zeigt mir die Zeile, in der das steht."*

---

## Teil b — wenn die Prüfrunde nicht zündet

Die Gruppen sollen Claude als **Prüfer** ihres selbst geschriebenen `CLAUDE.md`
einsetzen. Fallback-Formulierung:

> Lies `@CLAUDE.md` und danach den Code unter `@src/`. Beantworte mir zwei
> Fragen, getrennt: (1) Welche Aussage in der Datei stimmt nicht mit dem Code
> überein? (2) Wenn du gleich eine neue Prüfung für Termine einbauen solltest —
> was müsstest du nachschlagen, weil es nicht in der Datei steht? Ändere nichts.

Die zweite Frage ist die wertvollere: Sie liefert die Lücken, nicht die Fehler.

---

## Teil c — wenn der Härtetest leer bleibt

Erst auf Hinweis B im Anhang verweisen. Wenn das nicht reicht:

> Ich teste diese API auf unsinnige Eingaben. Sieh dir
> `@src/appointments/dto/create-appointment.dto.ts` und
> `@src/appointments/dto/find-appointments.dto.ts` an und nenne mir für jedes
> Feld Beispielwerte, die die Validierung durchlassen würde, obwohl sie fachlich
> keinen Sinn ergeben. Nur Kandidaten, keine Lösung, und ändere nichts — ich
> probiere sie selbst in Swagger aus.

---

## Teil c — für den Fix (`startHour` ohne Bereichsprüfung)

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

## Zusatzaufgabe 4 (Öffnungszeiten)

Termine lassen sich aktuell zu jeder Stunde buchen, auch wenn das Amt geschlossen
hat. Ein Amt hat `opensAtHour` und `closesAtHour`.

Sieh dir `@src/appointments/appointments.service.ts` an und schlage vor, wie eine
Prüfung aussehen müsste, die einen Termin außerhalb der Öffnungszeiten ablehnt.
Erkläre mir zuerst, **warum** diese Prüfung nicht ins DTO gehört, und sag mir
dazu, ob deine Änderung auch für `PATCH` greift. Plan zuerst, dann umsetzen.
