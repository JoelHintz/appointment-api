---
name: nest-feature-module
description: UNVOLLSTÄNDIG — dieses Gerüst muss erst ausgefüllt werden. Ersetzt diesen Text durch einen Satz, der beschreibt, welches Wissen hier steht und wann es gebraucht wird. An dieser Zeile entscheidet sich, ob das Skill überhaupt gefunden wird.
---

<!--
  GERÜST — auszufüllen in Aufgabe 3, Teil a.

  Das ausgearbeitete Beispiel ist `.claude/skills/module-review/SKILL.md`: eine
  Prüf-Checkliste. Dieses Skill ist das Gegenstück — das Wissen, wie in diesem
  Projekt ein Feature-Modul gebaut wird. Euer `developer`-Agent verweist darauf,
  so wie der `reviewer` auf `module-review` verweist.

  Zwei Fragen, die ihr beim Schreiben beantworten müsst:

  - Ein Skill enthält Wissen, keinen Ablauf. Was wisst ihr über dieses Projekt,
    das ein Agent braucht, bevor er die erste Datei anlegt?
  - `CLAUDE.md` ist immer geladen und gilt projektweit. Ein Skill wird für einen
    wiederkehrenden Job dazugeholt und darf deshalb ausführlicher sein. Was
    gehört hierher und nicht dorthin?

  Der Inhalt wird auf Englisch geschrieben — er ist Material für das Modell.
  Löscht die Kommentare, wenn ihr fertig seid.
-->

# Feature modules in this project

## Dateien und Aufbau

<!--
  Welche Dateien hat ein Feature-Modul hier, und wie heißen sie?
  In welcher Reihenfolge entstehen sie, damit jeder Schritt für sich prüfbar
  bleibt? Vergleicht `src/offices` und `src/appointments`.
-->

## Verdrahtung

<!--
  Was muss registriert werden, damit ein neues Modul überhaupt startet — und was
  passiert, wenn ein Modul ein fremdes Repository benutzt?
  Wo wird die Validierung installiert? Schaut in `src/main.ts` nach, bevor ihr
  hier etwas behauptet.
-->

## DTOs und Validierung

<!--
  Welche Regeln gelten in diesem Projekt für Request-Shapes?
  Welche Felder gehören ausdrücklich NICHT in ein Create-DTO?
  Wenn ihr Aufgabe 1 oder 2 gemacht habt: Welche Falle habt ihr dort gefunden,
  und wie verhindert ihr, dass ein Agent erneut hineinläuft?
-->

## Service

<!--
  Welche Art von Prüfung kann ausschließlich hier stehen und nicht im DTO?
  Formuliert dafür eine Faustregel in einem Satz.
  Welche Exceptions benutzt dieses Projekt wofür?
-->

## Tests

<!--
  Wie sieht ein Test in diesem Projekt aus — womit werden Repositories ersetzt,
  und was ist der Mindestumfang, den ein neues Modul abdecken sollte?
-->
