<br>
<p align="center">
  <a href="https://rudi.rennesmetropole.fr/">
  <img src="https://blog.rudi.bzh/wp-content/uploads/2020/11/logo_bleu_orange.svg" width=100px alt="Rudi logo" />  </a>
</p>

<h2 align="center" >Rudi Node Storage</h3>
<p align="center">Le gestionnaire de connecteur média pour RUDI qui assure l'interface entre le RUDI Productor et le système de stockage.</p>

<p align="center"><a href="https://rudi.rennesmetropole.fr/">🌐 Instance de Rennes Métropole</a> · <a href="doc.rudi.bzh">📚 Documentation</a> ·  <a href="https://blog.rudi.bzh/">📰 Blog</a><p>
<br>

## Présentation

Rudi Node Storage est un Media Driver qui :
- Gère l'accès aux fichiers média pour les données ouvertes
- Fournit un système de journalisation
- Implémente un mécanisme d'isolation sécurisé

## Fonctionnalités principales

- API REST pour la gestion des fichiers média
- Système de contrôle d'accès
- Double système de journalisation (application et gestion média)
- Stockage des données dans MongoDB (collection 'media')
- Journalisation des événements (collection 'media_events')
- Validation des données par schémas JSON

## API

### Points d'accès principaux

- `POST /media/post` - Publication de fichiers
- `GET /media/<media-uuid>` - Récupération de liens
- `GET /media/download/<media-uuid>` - Téléchargement direct
- `GET /media/downloadz/<media-uuid>` - Téléchargement compressé
- `GET /media/check/<media-uuid>` - Vérification d'intégrité

### Publication de médias

#### Fichiers standards
```json
{
  "media_id": "uuid-v4",
  "media_type": "FILE",
  "media_name": "nom_fichier",
  "file_size": 21660,
  "file_type": "application/json",
  "charset": "utf-8",
  "access_date": "2024-12-31"
}
```

#### URLs indirectes
```json
{
  "media_id": "uuid-v4",
  "media_type": "INDIRECT",
  "media_name": "nom_ressource",
  "url": "https://example.com/resource",
  "access_date": "2024-12-31"
}
```

## Stockage des données

### Base de données
- Les fichiers sont stockés dans MongoDB
- Format CSV de backup : `<md5sum>;<uuid>;<filename>;<mimetype>;<encoding>;<creation_date>;<size>`

### Schémas de validation
Disponibles via les endpoints :
- `/media/schema/rudi-media-db-context.json`
- `/media/schema/rudi-media-db-meta.json`
- `/media/schema/rudi-media-db-file.json`
- `/media/schema/rudi-media-db-url.json`
- `/media/schema/rudi-media-db-event.json`

## Configuration

### Fichier .ini
```ini
[server]
listening_address = 0.0.0.0
listening_port = 3201
server_url = "https://<server_domain>"
server_prefix = /media/

[database]
db_url = mongodb://localhost:27017/
db_name = rudi_media

[storage]
media_dir = '/_media'
acc_timeout = 20
```

### Options en ligne de commande
- `-p <port>` : Port d'écoute
- `--revision <git-sha>` : Version
- `--ini <fichier>` : Fichier de configuration

## Journalisation

- Fichiers en rotation avec horodatage
- Accès via `/media/logs/`
- Format JSON
- Nécessite des droits en lecture

## Installation

```bash
npm install
```

## Auteur

Laurent Morin - Université Rennes 1

