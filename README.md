# Projet de Spécialité : INP Legends
## Authors
- [Dehbi Yakoub](https://github.com/dehbiy)
- [Elaasri Youssef](https://github.com/youssef-elaasri)
- [Benabdellah Achraf](https://github.com/benabach)

## Encadrant
- [Sebastien VIARDOT](https://gricad-gitlab.univ-grenoble-alpes.fr/viardots)

## Description
Ce document présente un compte rendu d'un projet de spécialité web. En bref, c'est un RPG 2D où le joueur doit résoudre des défis de programmation en Python. Nous présentons dans ce rapport un cahier des charges et notre implémentation correspondante.

# Table des matières

# Description du Jeu
<!-- Expliquer brièvement l'atmosphère du jeu -->

# Cahier des Charges
## Cas d'Usages
```plantuml
@startuml
!theme plain

left to right direction

actor Player

rectangle "2D RPG Game" {
  usecase UC1 as "Register"
  usecase UC2 as "Login"
  usecase UC3 as "Navigate Map"
  usecase UC4 as "Interact with NPCs"
  usecase UC5 as "Solve Python challenges"
  usecase UC6 as "Chat with other players"
}

Player -down-> UC1 : registers
Player -down-> UC2 : logs in
Player -down-> UC3 : navigates
Player -down-> UC4 : interacts
Player -down-> UC6 : chats with
UC4 .> UC5 : <<extend>>

note right of UC1
  1. Player chooses username and password.
  2. Player submits registration form.
  3. System validates data and creates new account.
end note

note right of UC2
  1. Player enters username and password.
  2. System validates credentials.
  3. System grants access to game.
end note

note right of UC3
  1. Player uses controls to navigate map.
  2. System updates player location.
  3. Player encounters landmarks and NPCs.
end note

note right of UC4
  1. Player approaches NPC and initiates interaction.
  2. System presents NPC dialogue.
  3. NPC offers quests, information.
end note

note right of UC5
  1. NPC explains the challenge to the player.
  2. System shows an IDE, the player can write his python code.
  3. Player executes the code.
end note

note right of UC6
  1. Players exchange messages in real-time.
end note

@enduml
```

## Diagrammes Séquentielles


# Architecture

## Frontend
<!-- Description du frontend ... -->
### HTML
### CSS
### Classes JS
### Images
### Génération Dynamique des MAPs
<!-- Let Youssef cook ... -->
### Tests
<!-- Expliquer la difficulté de tester un jeu -->

## Backend
<!-- Description du backend -->
### Technologies Utilisées
- Node.js: 
- Express.js:
- Dockerode:
- Sequelize:
- Socket.IO:
### Docker

**DockerManager** est essentiel pour l'exécution des fichiers Python et des tests Unit. Comme son nom l'indique, DockerManager est basé sur Docker et permet d'avoir un environnement isolé sur la machine pour exécuter des programmes.

<!-- diagramme de classes -->
```plantuml
@startuml
class dockerManager {
  + docker: Docker
  + imageName: String

  + createVolume(String volumeName, Size size): void
  + runContainer(): void

}
note right of dockerManager::createVolume
Creates a new volume in Docker.
This volume is used to store files
that are executed inside the container.
The volume created is of type tmpfs
and has a size limit.
end note

note right of dockerManager::runContainer
Runs a Docker container based on the
specified image.
In the current project, the image is precreated; app_image.
The container will execute the loader.sh script.
end note
@enduml

```
<!-- Digramme de sequence -->

```plantuml

@startuml
actor User
participant Frontend
participant dockerManager
participant Dockerode
participant Container
participant FileSystem


User -> Frontend: Clicks Run
Frontend -> dockerManager: RunContainer()

dockerManager -> Dockerode: create container
Dockerode -> Container: create container
Dockerode --> dockerManager: container created

dockerManager -> Dockerode: Attach python_scripts volume
Dockerode -> Container: Attach /app/python_scripts/ volume
Dockerode --> dockerManager: volume attached

dockerManager -> Dockerode: Attach exec volume
Dockerode -> Container: Attach /app/exec/ volume
Dockerode --> dockerManager: volume attached



dockerManager -> Dockerode: start container
Dockerode --> dockerManager: container started

Dockerode -> Container: run loader.sh

Container -> FileSystem: copy <file>_tester.py to exec
FileSystem --> Container: file copied

Container -> FileSystem: create <file>_suggested with <content>
FileSystem --> Container: file created

Container -> Container: run python3 file1
Container -> Dockerode: return exit code

Dockerode --> dockerManager: script executed
dockerManager -> Dockerode: delete container
Dockerode -> Container: delelte

Dockerode --> dockerManager: container deleted

@enduml

```

### Python Scripts
<!-- Explication de la gestion des scripts python -->

### Schéma de la Base de Données

<!-- Schéma de la DB -->
``` plantuml
@startuml

entity "User" {
    +id: INTEGER [PK]
    ---
    username: STRING
    password_hash: STRING
    email: STRING
    created_at: DATE
}

entity "CompletedStage" {
    +flag: STRING(50) [PK]
    ---
    userId: INTEGER [FK]
}

entity "LobbySave" {
    +id: INTEGER [PK]
    ---
    userId: INTEGER [FK]
    mapId: INTEGER [FK]
}

entity "Map" {
    +id: INTEGER [PK]
    ---
    name: STRING
    description: TEXT
}

entity "SavePoint" {
    +id: INTEGER [PK]
    ---
    player_x: INTEGER
    player_y: INTEGER
    userId: INTEGER [FK]
    mapId: INTEGER [FK]
}

CompletedStage "n" -- "1" User
LobbySave "1" -- "1" User
LobbySave "n" -- "1" Map
SavePoint "1" -- "1" User
SavePoint "n" -- "1" Map

@enduml
```

### Rest API
<!-- Add routes -->

### Multijoueur
<!-- Expliquer l'intégration des sockets -->

### Securité
<!-- Ecrier comment docker pas sécurisé -->
La conteneurisation avec Docker constitue la principale couche de sécurité. En effet, cette dernière assure une isolation du code Python exécuté du système. Le conteneur lui-même est sécurisé : l'utilisateur n'a pas le droit d'écrire dans le conteneur, à l'exception du dossier dédié à l'exécution */app/exec*. Ce dossier même est limité en taille, ce qui garantit que les programmes exécutés ne consomment pas excessivement de ressources mémoire.

```js
createVolume(volumeName, size){
  const volumeOptions = {
                        Name: volumeName,
                        Driver: 'local',
                        DriverOpts: {
                            'type': 'tmpfs', //  Système de fichiers Unix temporaire
                            'device': 'tmpfs',
                            'o': `size=${size}` // La taille maximale
                        }
                    };
  // etc...
}
```

**Diagrame de sequence**
```plantuml
@startuml
participant dockerManager
participant Container
participant exec
participant app


dockerManager -> Container : Run a ressource consuming script
Container -> exec : Run script
exec -> Container: No space left
Container -> dockerManager: Exit code 1

dockerManager -> Container : Run an app fetching script
Container -> exec : Run script
exec -> app : Write
app -> Container: Permission denied
Container -> dockerManager: Exit code 1
@enduml
```

Un script malveillant peut cependant exploiter une faille de securité[^1] dans Docker. Un contenaire enregistre tous les logs dans un fichier .json et le stock dans la mémoire tant que le cintenaire est en vie. Une boucle infinie par exemple qui fait des prints peut consomer toute la mémoire de la machine host[^2]. Pour Remedier 0 cela nous limitant la taille du fichier log à *10o*:

[^1]: Ce n'est pas une faille de sécurité mais plus le comportement par defauts des contenaires docker.
[^2]: Nous avons sacrifié une machine pour decouvrir ce bug. Merci à Achhraf :' ) 

Un script malveillant peut cependant exploiter une faille de sécurité[^1] dans Docker. Un contenair enregistre tous les logs dans un fichier *.json* et les stocke en mémoire tant que le contenaor est en vie. Une boucle infinie, par exemple, qui effectue des impressions peut consommer toute la mémoire de la machine hôte[^2]. Pour remédier à cela, nous limitons la taille du fichier de log à *10 MB*. De plus, tous les testes python impose une limite de temps de 10 secondes.

[^1]: Ce n'est pas une faille de sécurité, mais plutôt le comportement par défaut des conteneurs Docker.
[^2]: Nous avons sacrifié une machine pour découvrir ce bug. Merci à Achhraf :' )



```js
  runContainer(scriptName, path, content, volumeName) {
    const containerOptions = {
                Image: this.image,
                Cmd: [`${scriptName}_tester.py`, `${scriptName}_suggested.py`, content],
                AttachStdout: true,
                AttachStderr: true,
                HostConfig:{
                    LogConfig: {
                        Type: 'json-file',
                        config:{
                            'max-size': '10b', // 10o est le maximum pour un fichier log
                            'max-file': '1' // Nous avons un seul fichier log
                        }
                    },
                    Binds:  [
                        `${process.cwd()}/${path}:/app/python_scripts`,
                        `${volumeName}:/app/exec`
                    ]
                }
            };
  }
```


### Tests
<!-- Couverture de tests backend -->

# Aspects d'amélioration

# Difficultées

# Prospection pour l'avenir


