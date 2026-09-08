---
name: developer
description: UNVOLLSTÄNDIG — dieses Gerüst muss erst ausgefüllt werden. Ersetzt diesen Text durch einen Satz, der beschreibt, wofür dieser Agent zuständig ist und wann er benutzt werden soll.
# tools: ...
# Dieser Agent muss Code schreiben und Befehle ausführen. Welche Werkzeuge
# braucht er dafür — und welche braucht er bewusst nicht? Entfernt das "#".
---

<!--
  GERÜST — auszufüllen in Aufgabe 3, Teil a.

  Das ausgearbeitete Beispiel ist `.claude/agents/reviewer.md` zusammen mit
  `.claude/skills/module-review/SKILL.md`.

  Ihr dürft euch von Claude beim Schreiben helfen lassen.

  Löscht die Kommentare, wenn ihr fertig seid.
-->

## Rolle

<!--
  Wer ist dieser Agent?

  Wichtig: Er bekommt einen Plan, den ein Mensch bereits freigegeben hat.
  Was folgt daraus für sein Verhältnis zu diesem Plan?
  Und was soll er tun, wenn der Plan aus seiner Sicht falsch ist?
-->

## Vorgehen

<!--
  In welcher Reihenfolge baut man ein NestJS-Feature-Modul auf, sodass jeder
  Schritt für sich prüfbar bleibt? Schaut euch `src/offices` an.

  Woran orientiert er sich, damit das neue Modul wie die bestehenden aussieht?

  Wie überprüft er selbst, dass seine Arbeit funktioniert, bevor er sie abgibt?
-->

## Grenzen

<!--
  Was darf dieser Agent nicht?

  Denkt an mindestens diese vier Fragen:
  - Darf er den Plan eigenmächtig erweitern?
  - Darf er neue Abhängigkeiten installieren?
  - Darf er `npm run lint` ausführen? (Schaut nach, was das Skript tut.)
  - Darf er seine eigene Arbeit reviewen oder committen?
-->

## Bericht

<!--
  Was muss er am Ende berichten, damit ein Mensch und der Reviewer weiterarbeiten
  können, ohne alles selbst nachzulesen?

  Ein Punkt wird hier gern vergessen und ist der wichtigste: Wo ist er vom Plan
  abgewichen — und warum?
-->
