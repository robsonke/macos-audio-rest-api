# Disclaimer

Forked from https://github.com/jnewland/airfoil-api and modified with extra endpoints plus bug fixes.

# Airfoil API

Wrap Airfoil's Applescript interface with a JSON API.

### Usage

    GET http://localhost:10123/speakers

    PUT http://localhost:10123/speakers/F0D1A90B2769@loft-bathroom/connect

    PUT http://localhost:10123/speakers/F0D1A90B2769@loft-bathroom/disconnect

    PUT /speakers/F0D1A90B2769@loft-bathroom/volume
    e.g.: curl -X PUT --data '0.76' http://localhost:10123/speakers/F0D1A90B2769@loft-bathroom/volume

    PUT /source/{name}
    e.g.: curl -X PUT http://localhost:10123/source/Built-in%20Microphone

    PUT /appsource/{name}
    e.g.: curl -X PUT http://localhost:10123/appsource/Vox

    PUT /syssource/{name}
    e.g.: curl -X PUT http://localhost:10123/syssource/System%20Audio
    PUT /appcontrol/{appname}
    e.g.: curl -X PUT --data 'stop' http://localhost:10123/appcontrol/Vox

    GET /volume/status

    PUT /volume/mute

    PUT /volume/unmute

    PUT /volume/louder

    PUT /volume/softer

    PUT /volume/{level}
    e.g.: curl -X PUT http://localhost:10123/volume/40

  ## Setup

      script/bootstrap

  ## Running It

      script/server

  airfoil-api will run on port `10123` by default. Use the `PORT` environment
  variable to use your own port.

  ### Forever

  airfoil-api has support for [Forever](https://github.com/foreverjs/forever). It uses `launchd` on OS X to kick it off so that it starts on boot.

  ### Development

  You can simply run it by calling `script/server`. This will run it in development mode with logging to standard out.

  ### Install as Service on OS X

      script/install
