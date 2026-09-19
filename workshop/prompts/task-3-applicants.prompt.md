# Trainer-Fallback: Feature-Beschreibung für Aufgabe 3

**Nicht standardmäßig ausgeben.** Die Gruppen sollen ihre Prompts selbst
formulieren; das ist Teil der Übung. Nutze diesen Text nur, wenn eine Gruppe
sonst an Teil b gar nicht mehr ankommt.

---

Plane ein neues Feature-Modul `applicants/` für diese Appointment API und die
Beziehung vom Termin dorthin.

**Fachlicher Hintergrund.** Ein Termin kennt bisher nur ein Datum, eine
Startstunde, das Amt und einen Freitext-Titel — die API weiß nicht, wer kommt.
Die buchende Person fehlt, und damit fehlen Terminbestätigung, Abgleich am
Schalter und jeder Schutz gegen Mehrfachbuchungen.

**Kern-Umfang:**

- Entität `Applicant`: `id`, `firstName`, `lastName`, `email`, `birthDate`
  (Kalenderdatum).
- Endpunkte im bestehenden REST-Stil: `POST /applicants`, `GET /applicants`,
  `GET /applicants/:id`. Kein `PATCH`, kein `DELETE`.
- Am Termin: `applicantId` beim Anlegen, **optional** — bestehende Termine haben
  keine Person, und die Entitätsspalte bleibt deshalb `nullable`. Die
  Terminantwort zeigt die Person so, wie sie heute das Amt zeigt.
- Request- und Response-DTOs, Validierung, Swagger-Dekoratoren und Mapping wie in
  den bestehenden Modulen.
- Fokussierte Unit-Tests im vorhandenen Teststil.

**Fachliche Regeln — sie gehören in den Service, nicht in die DTOs:**

1. Eine unbekannte `applicantId` wird mit `404` abgelehnt.
2. Eine Person hat pro Amt und Tag höchstens einen Termin; eine zweite Buchung
   wird mit `400` und einer verständlichen Meldung abgelehnt.

**Vorerst nicht planen** (nur als mögliche Erweiterungen notieren):
`applicantId` verpflichtend machen, eine eindeutige E-Mail-Adresse,
`GET /applicants/:id/appointments`.

Seeding wird nicht benötigt.

Halte dich an `CLAUDE.md` und orientiere dich an `@src/offices` und
`@src/appointments`. Liefere einen kurzen Plan, inklusive offener Fragen.
