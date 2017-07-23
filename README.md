# Disclaimer

Forked from https://github.com/jnewland/airfoil-api and modified with extra endpoints plus bug fixes.

# Airfoil API

Wrap Airfoil's Applescript interface with a JSON API.

### Usage

    $ curl http://localhost:10123/speakers
    [{"connected":"false","volume":0.75,"name":"Computer","id":"com.rogueamoeba.airfoil.LocalSpeaker"},{"connected":"false","volume":0.9375,"name":"stream","id":"685B35A4C6BC@stream"},{"connected":"true","volume":0.5,"name":"loft-bathroom","id":"F0D1A90B2769@loft-bathroom"},{"connected":"false","volume":0.75,"name":"magnavox","id":"F0D1A9083B63@magnavox"},{"connected":"false","volume":0.49470898509,"name":"Bedroom ","id":"68D93C804DEA@Bedroom "},{"connected":"false","volume":0.679894208908,"name":"loft","id":"B034953D7649@loft"}]
    $ curl -X POST http://localhost:10123/speakers/F0D1A90B2769@loft-bathroom/connect
    {"id":"F0D1A90B2769@loft-bathroom","connected":"true"}
    $ curl -X POST http://localhost:10123/speakers/F0D1A90B2769@loft-bathroom/disconnect
    {"id":"F0D1A90B2769@loft-bathroom","connected":"false"}
    $ curl -X POST --data '0.75' http://localhost:10123/speakers/F0D1A90B2769@loft-bathroom/volume
    {"id":"F0D1A90B2769@loft-bathroom","volume":0.75}
    $ curl -X POST --data '0.76' http://localhost:10123/speakers/F0D1A90B2769@loft-bathroom/volume
    {"id":"F0D1A90B2769@loft-bathroom","volume":0.759999990463}
    $ curl -X POST http://localhost:10123/source/Built-in%20Microphone
    {"id":"Built-in Microphone"}
    $ curl -X POST http://localhost:10123/appsource/Vox
    {"id":"Vox"}
    $ curl -X POST http://localhost:10123/syssource/System%20Audio
    {"id":"System Audio"}
    $ curl -X POST --data 'stop' http://localhost:10123/appcontrol/Vox
    {"id":"Vox"}

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
