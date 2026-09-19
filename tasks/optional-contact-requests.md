# Zusatzaufgabe — Modul `contact-requests/`

| | |
|---|---|
| **Zeitbudget** | ca. 45 Minuten |
| **Level** | für Gruppen, die Aufgabe 3 samt Review-Durchlauf abgeschlossen haben |
| **Voraussetzung** | die Agenten und das Skill aus Aufgabe 3, Teil a |

Ein zweites Modul für denselben Ablauf — Architekt → Checkpoint → Developer →
Reviewer → Checkpoint. Neu ist der **Regeltyp**: In Aufgabe 3 braucht der Service
den gespeicherten Bestand, hier braucht er den gespeicherten **Zustand desselben
Datensatzes**.

## Feature

Eine Kontaktanfrage ist eine Nachricht, die eine Bürgerin oder ein Bürger an die
Verwaltung schickt und die dort einen Bearbeitungsstatus durchläuft. Das Modul
steht für sich; es braucht keine Beziehung zu `Office` oder `Appointment`.

**Entität `ContactRequest`:**

| Feld | Typ | Anmerkung |
|---|---|---|
| `id` | number | |
| `name` | string | |
| `email` | string | muss eine gültige E-Mail sein |
| `subject` | string | |
| `message` | string | |
| `status` | Enum | `new`, `in_progress`, `answered` |
| `submittedAt` | string | ISO-8601, serverseitig gesetzt |

**Endpunkte:** `POST /contact-requests`, `GET /contact-requests` mit optionalem
Filter `?status=`, `GET /contact-requests/:id`, `PATCH /contact-requests/:id`.
Kein `DELETE`.

**Fachregeln — im Service, nicht im DTO:**

1. `submittedAt` setzt der Server; ein Wert aus dem Request wird ignoriert.
2. Eine neue Anfrage startet immer auf `status: new`. Der Client kann den Status
   beim Anlegen nicht mitgeben.
3. **Erlaubt sind nur die Übergänge `new → in_progress` und
   `in_progress → answered`.** Kein Rücksprung, kein Überspringen; ein
   unerlaubter Übergang wird mit `400` abgelehnt.
4. Unbekannte `id` → `404`.

> Regel 3 ist der Punkt der Aufgabe. Ein DTO kann prüfen, ob `status` ein
> *gültiger Wert* ist. Ob dieser Übergang aus dem *aktuellen* Zustand erlaubt
> ist, weiß nur der Service — er müsste dafür den gespeicherten Datensatz kennen.

Dazu DTOs, Validierung, Swagger-Dekoratoren, Mapping und fokussierte Unit-Tests
wie in den bestehenden Modulen. Seeding braucht ihr nicht.

## Abnahmekriterien

- [ ] `npm test` und `npm run build` laufen durch.
- [ ] Ein abgelehnter Statusübergang ist in Swagger vorführbar.
- [ ] Das Modul liest sich wie `offices/` und `appointments/`.

## Wenn noch Zeit bleibt

Ein vierter Status `rejected` mit eigenen Übergangsregeln; ein automatisches
`answeredAt` beim Übergang auf `answered`; eine Suche `?q=` über `subject` und
`message`.
