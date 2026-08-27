# Technische Vorbereitung für den Workshop

In diesem Workshop arbeitet ihr in kleinen Gruppen mit einer vorhandenen **NestJS-/TypeScript-Anwendung** und **Claude Code**. Bitte bereitet euren Laptop vor dem Workshop anhand dieser Anleitung vor. Für die Teilnahme am Workshop muss mindestens ein vollständig eingerichteter Laptop pro Gruppe verfügbar sein.

## Ziel des Setups

Das Setup ist erfolgreich, wenn:

- das Workshop-Repository lokal vorhanden ist,
- die Projektabhängigkeiten installiert sind,
- die Anwendung startet,
- die Swagger-Oberfläche erreichbar ist,
- die vorhandenen Tests erfolgreich laufen und
- `git status` keine unbeabsichtigten Änderungen zeigt.

> **Claude-Zugang**
>
> Installiert Claude Code vorab. Die Anmeldung und die Einrichtung des Workshop-Zugangs erfolgen erst im Workshop. Ihr benötigt für die Vorbereitung keinen API-Key und müsst Claude Code noch nicht starten oder testen.

> **Wichtig: Sicherheit**
>
> Verwendet im Repository, in Prompts und in Screenshots keine API-Keys, personenbezogenen Daten oder andere vertrauliche Informationen.
>
> Workshop-Zugangsdaten dürfen nicht committet, veröffentlicht oder weitergegeben werden.

## 1. Voraussetzungen

Ihr benötigt:

- einen Laptop mit Windows, macOS oder Linux,
- die Berechtigung, Programme zu installieren,
- eine stabile Internetverbindung.

### Terminal verwenden

Führt die Befehle in einem Terminal eurer Wahl aus. Empfohlen wird das integrierte Terminal in Visual Studio Code:

**Terminal > New Terminal**

Unter Windows und macOS könnt ihr alternativ das vorinstallierte Systemterminal verwenden.

### 2.1 Visual Studio Code

Visual Studio Code wird als Entwicklungsumgebung für das Workshop-Projekt verwendet.

Installiert eine aktuelle Version von Visual Studio Code und startet den Editor anschließend einmal:

- [Visual Studio Code herunterladen und installieren](https://code.visualstudio.com/docs/setup/setup-overview)

### 2.2 Git

Git wird benötigt, um das Workshop-Repository herunterzuladen und Änderungen nachzuverfolgen.

Installiert Git:

- [Git installieren](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

Öffnet danach ein neues Terminal und prüft die Installation:

```bash
git --version
```

Der Befehl sollte eine Versionsnummer ausgeben.

### 2.3 Node.js und npm

Die Workshop-Anwendung basiert auf TypeScript und wird mit Node.js ausgeführt. npm wird für die Installation der Projektabhängigkeiten verwendet.

Installiert die aktuelle Version von **Node.js 24 LTS**. npm wird zusammen mit Node.js installiert:

- [Node.js herunterladen](https://nodejs.org/en/download)

Öffnet danach ein neues Terminal und prüft beide Programme:

```bash
node --version
npm --version
```

Erwartetes Ergebnis:

- `node --version` beginnt mit `v24.`
- `npm --version` gibt eine Versionsnummer aus

### 2.4 Claude Code für Visual Studio Code

Claude Code ist der AI-Coding-Assistent, den wir im Workshop verwenden werden. Installiert in Visual Studio Code die offizielle Erweiterung von Anthropic:

1. Öffnet in Visual Studio Code die Ansicht **Extensions**.
2. Sucht nach **Claude Code**.
3. Prüft, dass Anthropic als Herausgeber angegeben ist.
4. Installiert die Erweiterung.
5. Startet Visual Studio Code neu, falls die Erweiterung nicht angezeigt wird.

Weitere Informationen:

- [Claude Code in Visual Studio Code einrichten](https://code.claude.com/docs/en/vs-code)

Eine Anmeldung oder ein Funktionstest ist vor dem Workshop nicht erforderlich. Der Workshop-Zugang wird gemeinsam während des Workshops eingerichtet.

## 3. Projekt einrichten

Im nächsten Schritt ladet ihr das für den Workshop verwendete Projekt herunter und installiert die dafür benötigten Abhängigkeiten.

### 3.1 Repository klonen

Prüft zunächst, ob ihr das Repository im Browser öffnen könnt:

- [Appointment API auf GitHub](https://github.com/JoelHintz/appointment-api)

Öffnet anschließend ein Terminal in dem Ordner, in dem ihr das Projekt speichern möchtet, und klont das Repository:

```bash
git clone https://github.com/JoelHintz/appointment-api.git
```

Wechselt in den Projektordner:

```bash
cd appointment-api
```

Öffnet den Projektordner in Visual Studio Code:

```bash
code .
```

Falls `code .` nicht funktioniert:

1. Öffnet Visual Studio Code.
2. Wählt **File > Open Folder** beziehungsweise **Datei > Ordner öffnen**.
3. Wählt den Ordner `appointment-api` aus.

Prüft, ob im geöffneten Ordner unter anderem folgende Inhalte sichtbar sind:

- `package.json`
- `package-lock.json`
- `src/`

### 3.2 Abhängigkeiten installieren

Bevor die Anwendung gestartet werden kann, müssen die für das Projekt benötigten Bibliotheken und Werkzeuge installiert werden. Führt im Projektordner folgenden Befehl aus:

```bash
npm ci
```

`npm ci` installiert die in `package-lock.json` festgelegten Abhängigkeiten und sorgt damit für einen einheitlichen Projektstand.

Löscht oder verändert package-lock.json nicht.

## 4. Setup prüfen

Die folgenden Schritte dienen als kurzer Funktionstest, ob die Anwendung auf dem Rechner wie erwartet funktioniert.

### 4.1 Anwendung starten

Startet die Anwendung im Projektordner:

```bash
npm run start:dev
```

Lasst das Terminal geöffnet, solange die Anwendung läuft. Die Anwendung kann mit `Ctrl+C` beendet werden.

### 4.2 Swagger-Oberfläche prüfen

Die Anwendung besitzt keine eigene grafische Benutzeroberfläche. Die verfügbaren HTTP-Endpunkte werden über Swagger dargestellt.

Öffnet bei laufender Anwendung folgende Seite im Browser:

- [Swagger-Oberfläche öffnen](http://localhost:3000/api)

Die Prüfung ist erfolgreich, wenn die Swagger-Oberfläche geladen wird. Ihr müsst noch keine Endpunkte aufrufen oder testen.

### 4.3 Tests ausführen

Zusätzlich verfügt die Anwendung über automatische Tests. Lasst die Anwendung zunächst weiterlaufen und öffnet ein zweites Terminal im Projektordner.

```bash
npm test
```

Die vorhandenen Tests sollten erfolgreich durchlaufen. Falls der Testprozess anschließend auf Dateiänderungen wartet, könnt ihr ihn mit `Ctrl+C` beenden.

### 4.4 Git-Status prüfen

Zum Abschluss prüft, ob durch Installation, Starten der Anwendung und Testausführung unbeabsichtigte Änderungen am Repository entstanden sind:

```bash
git status
```

Der Befehl sollte keine unbeabsichtigten Änderungen anzeigen. Verwerft keine Änderungen, wenn ihr nicht sicher seid, ob sie noch benötigt werden.

## 5. Optional: Projekt kennenlernen

Wenn ihr euch vor dem Workshop einen ersten Überblick verschaffen möchtet, könnt ihr euch folgende Bereiche ansehen:

Besonders hilfreich sind:

- `README.md` für Projektziel und verfügbare Befehle
- `package.json` für Skripte und Abhängigkeiten
- `src/` für den Anwendungscode
- `test/` beziehungsweise Dateien mit der Endung `.spec.ts` für die automatisierten Tests

Es ist nicht erforderlich, vor dem Workshop Änderungen am Code vorzunehmen oder NestJS zu lernen.

## 6. Abschließende Checkliste

- [ ] Visual Studio Code ist installiert und startet.
- [ ] `git --version` gibt eine Versionsnummer aus.
- [ ] `node --version` beginnt mit `v24.`
- [ ] `npm --version` gibt eine Versionsnummer aus.
- [ ] Die Claude-Code-Erweiterung von Anthropic ist installiert.
- [ ] Das Repository ist lokal in Visual Studio Code verfügbar.
- [ ] `npm ci` wurde erfolgreich ausgeführt.
- [ ] `npm run start:dev` startet die Anwendung.
- [ ] Die Swagger-Oberfläche ist unter `http://localhost:3000/api` erreichbar.
- [ ] `npm test` läuft erfolgreich.
- [ ] `git status` zeigt keine unbeabsichtigten Änderungen.

## 7. Troubleshooting

In diesem Abschnitt findet ihr eine Auswahl typischer Probleme, die während der Einrichtung auftreten können, sowie passende Lösungsvorschläge.

Solltet ihr beim Setup auf Schwierigkeiten stoßen, sucht nach dem Fehlerbild, das am besten zu eurem Problem passt. Führt dabei nur die Schritte aus, die für euer konkretes Problem vorgesehen sind.

### Git, Node.js oder npm wird nicht gefunden

1. Schließt alle geöffneten Terminals und Visual Studio Code vollständig.
2. Öffnet Visual Studio Code und das Terminal erneut.
3. Führt den betroffenen Befehl noch einmal aus:

```bash
git --version
node --version
npm --version
```

Falls der Befehl weiterhin nicht gefunden wird:

1. Startet den Rechner neu.
2. Prüft, ob das betroffene Programm installiert ist.
3. Installiert oder repariert nur das betroffene Programm.
4. Öffnet anschließend ein neues Terminal.

Wenn ein Befehl im Systemterminal funktioniert, aber nicht im Terminal von Visual Studio Code, startet Visual Studio Code vollständig neu oder verwendet vorübergehend das funktionierende Terminal.

Falls `node --version` nicht mit `v24.` beginnt, installiert Node.js 24 LTS.

Eine manuelle Änderung der `PATH`-Variable ist normalerweise nicht erforderlich. Prüft die `PATH`-Einstellungen nur, wenn eine Neuinstallation das Problem nicht behebt und ihr mit Systemeinstellungen vertraut seid.

### Das Repository kann nicht geklont werden

Prüft zunächst:

- Ist das [Appointment-API-Repository](https://github.com/JoelHintz/appointment-api) im Browser erreichbar?
- Besteht eine Internetverbindung?
- Blockieren VPN oder Firewall möglicherweise den Zugriff?
- Existiert bereits ein Ordner mit dem Namen `appointment-api`?

Falls bereits ein Ordner mit dem Namen existiert:

1. Benennt ihn beispielsweise in `appointment-api-backup` um.
2. Klont das Repository erneut:

```bash
git clone https://github.com/JoelHintz/appointment-api.git
```

### `package.json` wird nicht gefunden

Ihr befindet euch wahrscheinlich nicht im Projektordner.

```bash
cd appointment-api
```

Prüft anschließend in Visual Studio Code, ob `package.json` im geöffneten Ordner sichtbar ist. Falls ihr den Projektordner nicht findet, öffnet ihn erneut über **File > Open Folder** beziehungsweise **Datei > Ordner öffnen**.

### `npm ci` schlägt fehl

Prüft die Version von Node.js:

```bash
node --version
```

Die Ausgabe muss mit `v24.` beginnen.

Wenn die Version von Node.js nicht das Problem ist, installiert die Abhängigkeiten erneut:

1. Beendet laufende Node.js-Prozesse und die gestartete Anwendung.
2. Schließt Visual Studio Code.
3. Löscht den Ordner `node_modules` über den Datei-Explorer oder Finder.
4. Löscht nicht `package-lock.json`.
5. Öffnet den Projektordner erneut.
6. Führt die Installation erneut aus:

```bash
npm ci
```

Hilft auch das nicht, könnt ihr das Projekt noch auf folgende Fehlerbilder prüfen:

- **Netzwerkfehler:** Prüft Internetverbindung, VPN und Firewall. Testet nach Möglichkeit ein anderes Netzwerk.
- **Berechtigungsfehler:** Klont das Projekt in einen persönlichen Ordner, beispielsweise unter `Dokumente`, und führt dort `npm ci` aus.
- **`package.json` und `package-lock.json` passen nicht zusammen:** Führt nicht automatisch `npm install` aus und verändert `package-lock.json` nicht. Haltet die erste Fehlermeldung für den Workshop fest.

### Die Anwendung startet nicht

Prüft, ob der richtige Projektordner geöffnet ist, `package.json` sichtbar ist, `npm ci` erfolgreich war und Node.js 24 verwendet wird.

```bash
node --version
npm run start:dev
```

Achtet besonders auf die erste Fehlermeldung im Terminal.

### Port 3000 wird bereits verwendet

1. Prüft alle geöffneten Terminals.
2. Beendet eine bereits laufende Anwendung mit `Ctrl+C`.
3. Startet die Anwendung erneut:

```bash
npm run start:dev
```

Ändert den verwendeten Port nicht selbstständig.

### Swagger ist nicht erreichbar

Prüft, ob die Anwendung ohne Fehlermeldung läuft, und öffnet die [Swagger-Oberfläche](http://localhost:3000/api) erneut.

Falls die Seite nicht geladen wird:

- prüft die eingegebene Adresse,
- aktualisiert die Seite,
- testet ein privates Browserfenster,
- testet einen anderen Browser,
- prüft das Terminal auf Fehlermeldungen.

### Tests schlagen fehl

Prüft zunächst, ob ihr bereits Änderungen am Projekt vorgenommen habt:

```bash
git status
```

Verwerft keine eigenen Änderungen, wenn ihr nicht sicher seid, ob sie noch benötigt werden.

Falls die Installation möglicherweise unvollständig ist:

1. Beendet laufende Node.js-Prozesse.
2. Löscht den Ordner `node_modules`.
3. Löscht nicht `package-lock.json`.
4. Installiert die Abhängigkeiten erneut und startet die Tests:

```bash
npm ci
npm test
```

Wenn die Tests auch in einem unveränderten, frisch geklonten Projekt fehlschlagen, haltet den Namen des fehlgeschlagenen Tests, die erste Fehlermeldung und die Testzusammenfassung fest.

### Das Problem besteht weiterhin

Kommt auch mit einem unvollständigen Setup zum Workshop. Wir haben zu Beginn des Workshops Zeit, um offene Setup-Probleme gemeinsam zu lösen.

Haltet möglichst folgende Informationen fest:

```text
Betriebssystem:
Node.js-Version:
Betroffener Schritt:
Ausgeführter Befehl:
Erste Fehlermeldung:
Bereits ausprobierte Lösung:
```

Achtet bei Screenshots darauf, dass keine Passwörter, API-Keys oder anderen vertraulichen Informationen sichtbar sind.

## 8. Kurzreferenz

```bash
# Repository klonen
git clone https://github.com/JoelHintz/appointment-api.git
cd appointment-api

# Projekt in Visual Studio Code öffnen
code .

# Abhängigkeiten installieren
npm ci

# Anwendung starten
npm run start:dev

# Tests in einem zweiten Terminal ausführen
npm test

# Projektstatus prüfen
git status
```

Swagger ist bei laufender Anwendung über die [Swagger-Oberfläche](http://localhost:3000/api) erreichbar.

## 9. Quellen und weiterführende Dokumentation

### Installation und Setup

- Anthropic: [Claude Code in Visual Studio Code](https://code.claude.com/docs/en/vs-code)
- Git: [Git installieren](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- Microsoft: [Visual Studio Code installieren](https://code.visualstudio.com/docs/setup/setup-overview)
- Node.js: [Node.js herunterladen](https://nodejs.org/en/download)
- npm: [Dokumentation zu npm ci](https://docs.npmjs.com/cli/commands/npm-ci)

### Verwendete Technologien

- Jest: [Getting Started](https://jestjs.io/docs/getting-started)
- NestJS: [First steps](https://docs.nestjs.com/first-steps)
- Swagger: [Swagger UI](https://swagger.io/tools/swagger-ui/)
- TypeScript: [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
