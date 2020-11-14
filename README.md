# Project Name

> Fake SoundCloud App - Song Description Module

## Related Projects

  - https://github.com/lions-beside-us/soundcloudplayer
  - https://github.com/lions-beside-us/soundcloud-images
  - https://github.com/lions-beside-us/comments-service
  - https://github.com/lions-beside-us/hashtags-service
  - https://github.com/lions-beside-us/user-service
  - https://github.com/lions-beside-us/soundcloud-related-tracks

## CRUD Operations
GET /songDescription/:songId returns a JSON object of song description for a single song, given songId


POST /songDescription adds a new song to database with data from the request's body

PUT /songDescription/:songId updates information in database for given songId with data from the request's body

DELETE /songDescription/:songId deletes song for given songId from the database

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)

## Usage

> Some usage instructions

## Requirements

An `nvmrc` file is included if using [nvm](https://github.com/creationix/nvm).

- Node 6.13.0
- etc

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install -g webpack
npm install
```

