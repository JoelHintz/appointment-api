# Trainer-Fallback: Feature-Beschreibung für Aufgabe 3

**Nicht standardmäßig ausgeben.** Die Gruppen sollen ihre Prompts selbst
formulieren; das ist Teil der Übung. Nutze diesen Text nur, wenn eine Gruppe
sonst an Teil b gar nicht mehr ankommt.

---

Plane ein neues Feature-Modul `contact-requests/` für diese Appointment API.

**Fachlicher Hintergrund.** Eine Kontaktanfrage ist eine Nachricht, die eine
Bürgerin oder ein Bürger an die Verwaltung schickt. Sie durchläuft dort einen
Bearbeitungsstatus. Das Modul steht für sich — es braucht keine Beziehung zu
`Office` oder `Appointment`.

**Kern-Umfang:**

- Entität `ContactRequest`: `id`, `name`, `email`, `subject`, `message`,
  `status` (Enum `new` / `in_progress` / `answered`) und `submittedAt`
  (ISO-8601).
- Endpunkte im bestehenden REST-Stil:
  - `POST /contact-requests` — Anfrage einreichen
  - `GET /contact-requests` — Liste mit optionalem Filter `?status=`
  - `GET /contact-requests/:id`
  - `PATCH /contact-requests/:id` — Status ändern
  - kein `DELETE`
- Request- und Response-DTOs, Validierung, Swagger-Dekoratoren, Mapping wie in
  den bestehenden Modulen.
- Fokussierte Unit-Tests im vorhandenen Teststil.

**Fachliche Regeln — sie gehören in den Service, nicht in die DTOs:**

1. `submittedAt` setzt der Server. Ein Wert aus dem Request wird ignoriert.
2. Eine neue Anfrage startet immer mit `status: new`. Der Client kann den Status
   beim Anlegen nicht mitgeben.
3. Erlaubt sind nur die Übergänge `new → in_progress` und
   `in_progress → answered`. Kein Rücksprung, kein Überspringen. Ein unerlaubter
   Übergang wird mit `400` und einer verständlichen Meldung abgelehnt.
4. Unbekannte `id` → `404`.

**Vorerst nicht planen** (nur als mögliche Erweiterungen notieren): ein vierter
Status `rejected`, ein automatisches `answeredAt`, eine Suche über `?q=`.

Seeding wird nicht benötigt.

Halte dich an `CLAUDE.md` und orientiere dich an `@src/offices` und
`@src/appointments`. Liefere einen kurzen Plan, inklusive offener Fragen.
