## Technische Vorbereitung

In diesem Workshop arbeitet ihr in kleinen Gruppen mit einer vorhandenen **NestJS-/TypeScript-Anwendung** und **Claude Code**. Bitte bereitet euren Laptop vor dem Workshop anhand dieser Anleitung vor.

> **Ziel:** Führt die Vorbereitung möglichst auf eurem eigenen Laptop durch. Für den Workshop ist mindestens ein vollständig vorbereitetes Gerät pro Gruppe erforderlich.

### Erfolgreiches Setup

Nach Abschluss der Vorbereitung sollten folgende Punkte erfüllt sein:

- Visual Studio Code, Git, Node.js und npm sind installiert.
- Die offizielle Claude-Code-Erweiterung ist in Visual Studio Code installiert.
- Das Repository ist lokal vorhanden.
- Die Projektabhängigkeiten sind installiert.
- Die Anwendung startet und Swagger ist erreichbar.
- Die vorhandenen Tests laufen erfolgreich.

> **Claude-Zugang:** Der Zugang wird erst im Workshop eingerichtet. Ihr benötigt vorab keinen API-Key und müsst Claude Code noch nicht starten oder testen.
>
> **Sicherheit:** Speichert keine API-Keys oder personenbezogenen Daten im Repository oder in Prompts. Der im Workshop bereitgestellte API-Key darf nicht committet, veröffentlicht oder weitergegeben werden.

### 1. Voraussetzungen

Ihr benötigt:

- einen eigenen Laptop mit lokalen Installationsrechten,
- eine stabile Internetverbindung,
- ausreichend freien Speicherplatz für die Programme und das Projekt.

Verwendet für die folgenden Schritte ein Terminal eurer Wahl, zum Beispiel das integrierte Terminal in Visual Studio Code, PowerShell, die Windows-Eingabeaufforderung oder ein Terminal unter macOS beziehungsweise Linux.

### 2. Benötigte Software installieren

Für den Workshop benötigt ihr einige Werkzeuge, die während der praktischen Übungen verwendet werden. Installiert diese vorab, damit wir im Workshop direkt mit den Aufgaben starten können.

#### 2.1 Visual Studio Code

Visual Studio Code ist der Editor, in dem ihr die Anwendung betrachten, ändern und gemeinsam mit Claude Code bearbeiten werdet.

Installiert eine aktuelle Version von Visual Studio Code und startet den Editor anschließend einmal:

- [Visual Studio Code herunterladen und installieren](https://code.visualstudio.com/docs/setup/setup-overview)

#### 2.2 Git

Git ist ein Versionsverwaltungssystem. Es wird verwendet, um das Workshop-Projekt von GitHub herunterzuladen und Änderungen am Projekt nachzuverfolgen.

Installiert Git:

- [Git installieren](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

Öffnet danach ein neues Terminal und prüft die Installation:

```bash
git --version
```

Der Befehl sollte eine Versionsnummer ausgeben.

#### 2.3 Node.js und npm

Die bereitgestellte Termin-API basiert auf TypeScript und läuft mit Node.js. npm wird verwendet, um die benötigten Bibliotheken und Werkzeuge für das Projekt zu installieren.

Installiert **Node.js 24 LTS** in einer aktuellen Version der Reihe 24.x. npm wird zusammen mit Node.js installiert:

- [Node.js herunterladen](https://nodejs.org/en/download)

Öffnet danach ein neues Terminal und prüft beide Programme:

```bash
node --version
npm --version
```

Die Node.js-Version sollte mit `v24.` beginnen. npm sollte ebenfalls eine Versionsnummer ausgeben.

#### 2.4 Claude Code für Visual Studio Code

Claude Code ist der zentrale AI-Coding-Assistent, den wir im Workshop verwenden werden. Er unterstützt unter anderem beim Verstehen von Code, bei der Fehlersuche, beim Schreiben von Tests und bei der Implementierung neuer Funktionen.

Installiert dafür in Visual Studio Code die offizielle Erweiterung von Anthropic:

1. Öffnet in Visual Studio Code die Ansicht **Extensions**.
2. Sucht nach **Claude Code**.
3. Installiert die Erweiterung des Herausgebers **Anthropic**.
4. Startet Visual Studio Code neu, falls die Erweiterung nicht angezeigt wird.

Weitere Informationen:

- [Claude Code in Visual Studio Code einrichten](https://code.claude.com/docs/en/vs-code)

Für die Vorbereitung reicht die Installation der Erweiterung. Die Anmeldung beziehungsweise Einrichtung des Workshop-Zugangs erfolgt gemeinsam im Workshop.

### 3. Projekt einrichten

Im nächsten Schritt ladet ihr das für den Workshop verwendete Projekt herunter und installiert die dafür benötigten Abhängigkeiten.

#### 3.1 Repository klonen

Öffnet das GitHub-Repository zunächst im Browser unter:

- [Appointment API auf GitHub](https://github.com/JoelHintz/appointment-api)

Wenn ihr die Seite aufrufen könnt, öffnet als Nächstes ein Terminal in dem Ordner, in dem das Projekt gespeichert werden soll, und klont das Repository:

```bash
git clone https://github.com/JoelHintz/appointment-api.git
```

Wechselt anschließend in den Projektordner und öffnet ihn in Visual Studio Code:

```bash
cd appointment-api
code .
```

Falls `code .` nicht funktioniert, öffnet Visual Studio Code und wählt **File > Open Folder** beziehungsweise **Datei > Ordner öffnen**. Wählt dann den Ordner `appointment-api` aus.

Im Projektordner sollten unter anderem `package.json`, `package-lock.json` und `src/` vorhanden sein.

#### 3.2 Abhängigkeiten installieren

Bevor die Anwendung gestartet werden kann, müssen die für das Projekt benötigten Bibliotheken und Werkzeuge installiert werden.

Führt folgenden Befehl im Projektordner aus:

```bash
npm ci
```

`npm ci` installiert die benötigten Abhängigkeiten für das Projekt und verwendet dabei den in `package-lock.json` festgelegten Stand. Dadurch wird für alle Gruppen eine möglichst einheitliche Installation hergestellt.

Löscht oder verändert `package-lock.json` nicht.

### 4. Setup prüfen

Nun prüfen wir, ob die Anwendung auf eurem Rechner wie erwartet funktioniert. Die folgenden Schritte dienen als kurzer Funktionstest. Wenn alle erfolgreich sind, ist euer Laptop für den Workshop vorbereitet.

#### 4.1 Anwendung starten

Um zu prüfen, ob das Projekt korrekt eingerichtet wurde, startet die Anwendung im Projektverzeichnis mit folgendem Befehl:

```bash
npm run start:dev
```

Lasst das Terminal geöffnet, solange die Anwendung läuft. Mit **Ctrl+C** könnt ihr die Anwendung jederzeit beenden.

#### 4.2 Swagger öffnen

Die Anwendung stellt HTTP-Endpunkte zur Verfügung und besitzt keine eigene grafische Benutzeroberfläche. Stattdessen wird eine Swagger-Oberfläche bereitgestellt, über die die verfügbaren Endpunkte dokumentiert und getestet werden können.

Öffnet bei laufender Anwendung folgende Seite im Browser:

- Swagger-Oberfläche: http://localhost:3000/api

Die Prüfung ist erfolgreich, wenn die Swagger-Seite geladen wird. Ihr müsst noch keine Endpunkte aufrufen oder testen.

#### 4.3 Tests ausführen

Zusätzlich zur manuellen Prüfung über Swagger verfügt die Anwendung über automatische Tests. Diese helfen dabei sicherzustellen, dass die Anwendung korrekt eingerichtet wurde und sich wie erwartet verhält.

Öffnet ein zweites Terminal im Projektordner und führt folgenden Befehl aus:

```bash
npm test
```

Die vorhandenen Tests sollten erfolgreich durchlaufen. Falls der Testprozess anschließend auf Dateiänderungen wartet, könnt ihr ihn mit **Ctrl+C** beenden.

#### 4.4 Projektstatus prüfen

Zum Abschluss könnt ihr überprüfen, ob durch Installation, Starten der Anwendung und Testausführung unbeabsichtigte Änderungen am Repository entstanden sind:

```bash
git status
```

Der Befehl sollte keine unerwarteten Änderungen an Projektdateien anzeigen.

#### 4.5 Optional: Projekt kennenlernen

Wenn ihr euch bereits vor dem Workshop einen ersten Eindruck verschaffen möchtet, könnt ihr euch einige wichtige Dateien und Ordner ansehen.

Besonders hilfreich sind:

- `README.md` für Projektziel und verfügbare Befehle
- `package.json` für Skripte und Abhängigkeiten
- `src/` für den Anwendungscode
- `test/` beziehungsweise Dateien mit der Endung `.spec.ts` für die automatisierten Tests

Es ist nicht erforderlich, vor dem Workshop Änderungen am Code vorzunehmen oder NestJS im Detail zu lernen.

### 5. Abschließende Checkliste

- [ ] Visual Studio Code startet.
- [ ] `git --version` funktioniert.
- [ ] `node --version` zeigt eine Version `v24.x.x`.
- [ ] `npm --version` funktioniert.
- [ ] Die Claude-Code-Erweiterung von Anthropic ist installiert.
- [ ] Das Repository wurde geklont und als Projektordner geöffnet.
- [ ] `npm ci` wurde erfolgreich ausgeführt.
- [ ] `npm run start:dev` startet die Anwendung.
- [ ] Die Swagger-Oberfläche ist unter `http://localhost:3000/api` erreichbar.
- [ ] `npm test` läuft erfolgreich.
- [ ] `git status` zeigt keine unbeabsichtigten Änderungen.

### 6. Troubleshooting

In diesem Abschnitt findet ihr eine Auswahl typischer Probleme, die während der Einrichtung auftreten können, sowie passende Lösungsvorschläge.

Solltet ihr beim Setup auf Schwierigkeiten stoßen, sucht nach dem Fehlerbild, das am besten zu eurem Problem passt. Führt dabei nur die Schritte aus, die für euer konkretes Problem vorgesehen sind.

#### Git, Node.js oder npm wird nicht gefunden

- Schließt alle Terminals und Visual Studio Code.
- Öffnet ein neues Terminal und probiert den Befehl erneut.
- Startet den Rechner neu, falls der Befehl weiterhin nicht gefunden wird.
- Installiert oder repariert nur das betroffene Programm und öffnet danach erneut ein Terminal.

Wenn ein Befehl in einem separaten Terminal funktioniert, aber nicht in Visual Studio Code, startet Visual Studio Code vollständig neu oder verwendet das funktionierende Terminal.

Falls `node --version` nicht mit `v24.` beginnt, installiert Node.js 24 LTS. Eine manuelle Änderung der PATH-Variable ist normalerweise nicht nötig. Prüft sie nur, wenn eine Neuinstallation das Problem nicht behebt und ihr mit PATH-Einstellungen vertraut seid.

#### Das Repository kann nicht geklont werden

- Prüft, ob das Repository im Browser erreichbar ist.
- Prüft eure Internetverbindung sowie mögliche Einschränkungen durch VPN oder Firewall.
- Prüft, ob bereits ein Ordner namens `appointment-api` vorhanden ist.

Wenn der vorhandene Ordner bereits das Repository enthält:

```bash
cd appointment-api
git status
```

Wenn der Ordner kein Git-Repository enthält, benennt ihn beispielsweise in `appointment-api-backup` um und klont das Repository erneut.

#### npm findet package.json nicht

Ihr befindet euch wahrscheinlich im falschen Ordner. Wechselt in den Projektordner:

```bash
cd appointment-api
```

Prüft anschließend in Visual Studio Code, ob `package.json` im geöffneten Ordner sichtbar ist.

#### npm ci schlägt fehl

- Prüft, ob `node --version` eine Version `v24.x.x` zeigt.
- Schließt Visual Studio Code und laufende Node-Prozesse.
- Löscht den Ordner `node_modules` über den Datei-Explorer beziehungsweise Finder. Löscht **nicht** `package-lock.json`.

Führt anschließend erneut aus:

```bash
npm ci
```

Zusätzlich gilt:

- Bei Netzwerkfehlern: Prüft die Internetverbindung und testet nach Möglichkeit ein anderes Netzwerk. Prüft auch, ob VPN oder Firewall den Download blockieren.
- Bei Berechtigungsfehlern: Legt das Projekt in einem persönlichen Ordner ab, beispielsweise unter **Dokumente**, und klont es dort erneut.
- Wenn `package.json` und `package-lock.json` laut Fehlermeldung nicht zusammenpassen: Führt nicht automatisch `npm install` aus. Notiert die Fehlermeldung für den Workshop.

#### Anwendung startet nicht oder Swagger ist nicht erreichbar

- Prüft, ob der Ordner `appointment-api` geöffnet ist.
- Prüft, ob `npm ci` erfolgreich war.

Startet die Anwendung erneut:

```bash
npm run start:dev
```

Wenn Port 3000 bereits verwendet wird, beendet eine bereits laufende Anwendung in einem anderen Terminal mit **Ctrl+C**. Ändert den Port nicht eigenständig.

Wenn die Anwendung ohne Fehlermeldung läuft, öffnet die Swagger-Oberfläche erneut. Testet bei Bedarf ein privates Browserfenster oder einen anderen Browser.

#### Tests schlagen fehl

- Prüft mit `git status`, ob Dateien verändert wurden.
- Löscht bei Verdacht auf eine unvollständige Installation `node_modules` und führt erneut `npm ci` aus.

Startet anschließend die Tests erneut:

```bash
npm test
```

Wenn die Tests auch in einem unveränderten, frisch geklonten Projekt fehlschlagen, notiert die erste Fehlermeldung und die Testzusammenfassung.

#### Das Problem besteht weiterhin

Kommt auch mit einem unvollständigen Setup zum Workshop. Wir reservieren zu Beginn des Workshops Zeit, um offene Setup-Probleme gemeinsam zu lösen.

Haltet folgende Informationen fest:

```text
Betriebssystem:
Node.js-Version:
Betroffener Schritt:
Erste Fehlermeldung:
Bereits ausprobierte Lösung:
```

Achtet bei Screenshots darauf, dass keine Passwörter, API-Keys oder anderen vertraulichen Informationen sichtbar sind.

### 7. Kurzreferenz

```bash
# Repository klonen
git clone https://github.com/JoelHintz/appointment-api.git
cd appointment-api

# Abhängigkeiten installieren
npm ci

# Anwendung starten
npm run start:dev

# Tests in einem zweiten Terminal ausführen
npm test

# Projektstatus prüfen
git status
```

### 8. Quellen und weiterführende Dokumentation

#### Installation

- Anthropic: [Claude Code in Visual Studio Code](https://code.claude.com/docs/en/vs-code)
- Git: [Git installieren](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- Microsoft: [Visual Studio Code installieren](https://code.visualstudio.com/docs/setup/setup-overview)
- Node.js: [Node.js herunterladen](https://nodejs.org/en/download)
- npm: [Dokumentation zu npm ci](https://docs.npmjs.com/cli/commands/npm-ci)

#### Verwendete Technologien

- Jest: [Getting Started](https://jestjs.io/docs/getting-started)
- NestJS: [First steps](https://docs.nestjs.com/first-steps)
- Swagger: [Swagger UI](https://swagger.io/tools/swagger-ui/)
- TypeScript: [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
