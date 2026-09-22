# APP01: Antragstellende am Termin erfassen

## User Story

> **Als** Mitarbeiterin oder Mitarbeiter eines Amts
> **möchte ich** bei jedem Termin sehen, für wen er gebucht ist,
> **sodass** ich Ankommende direkt am Termin erkenne, statt sie mit einer
> ausgedruckten Liste abzugleichen.

## Kontext

Ein Termin speichert heute ein Amt, ein Datum, eine Startstunde und einen
Freitext-Titel, aber nicht die Person, für die er gebucht ist. Das Personal
gleicht die Leute deshalb mit einer separaten, ausgedruckten Liste ab, und ohne
Namen und E-Mail-Adresse am Termin können wir später auch keine
Buchungsbestätigung verschicken.

Wir nennen diese Person die **antragstellende Person** (im Code `applicant`) und
nicht „Bürger“, denn auch Menschen, die nicht in der Stadt wohnen, buchen
Termine. Antragstellende sind eigene Datensätze, und ein Termin verweist auf
einen davon so, wie er heute schon auf sein Amt verweist.

## Akzeptanzkriterien

**Antragstellende**

- [ ] Eine antragstellende Person mit Vorname, Nachname, E-Mail-Adresse und
      Geburtsdatum anlegen.
- [ ] Das Geburtsdatum ist ein Kalenderdatum.
- [ ] Alle Antragstellenden auflisten.
- [ ] Eine antragstellende Person über ihre ID abrufen; eine unbekannte ID wird
      nicht gefunden.

**Termine**

- [ ] Eine Buchung kann die antragstellende Person nennen; eine Buchung ohne
      sie wird weiterhin angenommen.
- [ ] Bestehende Termine nennen niemanden und bleiben gültig und lesbar.
- [ ] Ein Termin zeigt seine antragstellende Person so, wie er schon sein Amt
      zeigt.

**Buchungsregeln**

- [ ] Eine Buchung mit einer unbekannten antragstellenden Person wird als nicht
      gefunden abgelehnt.
- [ ] Eine zweite Buchung für dieselbe Person beim **selben Amt** am **selben
      Tag** wird wie ein schon belegter Slot abgelehnt, mit einer klaren Meldung.
- [ ] Dieselbe Person am selben Tag bei einem **anderen Amt** wird angenommen.

## Offene Fragen

Beides hat noch niemand entschieden, und es muss vor Beginn der Umsetzung
geklärt sein:

- Dürfen sich zwei Antragstellende eine E-Mail-Adresse teilen?
- Gilt die Regel „eine Buchung pro Tag“ auch, wenn ein bestehender Termin
  geändert wird, zum Beispiel auf einen anderen Tag verschoben?

## Nicht im Umfang

- Antragstellende ändern oder entfernen. Danach hat noch niemand gefragt.
- Die Buchungsbestätigung verschicken. Dieses Ticket erfasst nur die Adresse, an
  die sie gehen wird.
- Seed-Daten. Die echten Datensätze werden separat geladen.
- Die antragstellende Person bei jeder neuen Buchung zur Pflicht machen. Dahin
  geht die Geschichte, aber nicht mit diesem Ticket.
- Alle Termine einer Person auflisten. Das Personal hätte das gern; es bekommt
  ein eigenes Ticket.
