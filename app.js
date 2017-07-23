var util = require('util');
var express = require('express');
var morgan = require('morgan');
var app = express();
var bodyParser = require('body-parser');
var applescript = require('applescript');

var logFormat = "'[:date[iso]] - :remote-addr - :method :url :status :response-time ms - :res[content-length]b'"
app.use(morgan(logFormat))

app.get('/speakers', function(req, res){
  var script = "" +
  "tell application \"Airfoil\"\n" +
  "set myspeakers to get every speaker\n" +
  "set allSpeakers to {}\n" +
  "repeat with currentSpeaker in myspeakers\n" +
  "  set thisSpeaker to {}\n" +
  "  set conn to connected of currentSpeaker\n" +
  "  copy conn to the end of thisSpeaker\n" +
  "  set volum to volume of currentSpeaker\n" +
  "  copy volum to the end of thisSpeaker\n" +
  "  set nm to name of currentSpeaker\n" +
  "  copy nm to the end of thisSpeaker\n" +
  "  set spkId to id of currentSpeaker\n" +
  "  copy spkId to the end of thisSpeaker\n" +
  "  set AppleScript's text item delimiters to \";\"\n" +
  "  set speakerText to thisSpeaker as text\n" +
  "  set AppleScript's text item delimiters to \"\"\n" +
  "  copy speakerText to the end of allSpeakers\n" +
  "end repeat\n" +
  "set AppleScript's text item delimiters to \"|\"\n" +
  "set speakerText to allSpeakers as text\n" +
  "set AppleScript's text item delimiters to \"\"\n" +
  "get speakerText\n" +
  "end tell";

  applescript.execString(script, function(error, result) {
    if (error) {
      res.json({error: error});
    } else {
      var speakers = [];
      var speakerText = result.split("|");
      speakerText.map(function(s) {
        var t = s.split(";");
        speakers.push({ connected: t[0], volume: parseFloat(t[1].replace(",", ".")), name: t[2], id: t[3] });
      });
      res.json(speakers);
    }
  });

});

app.post('/speakers/:id/connect', function (req, res) {
  var script = "tell application \"Airfoil\"\n";
  script += "set myspeaker to first speaker whose id is \"" + req.params.id + "\"\n";
  script += "connect to myspeaker\n";
  script += "delay 0.5\n";
  script += "connect to myspeaker\n";
  script += "delay 0.5\n";
  script += "connect to myspeaker\n";
  script += "delay 0.5\n";
  script += "connected of myspeaker\n";
  script += "end tell";
  applescript.execString(script, function(error, result) {
    if (error) {
      res.json({error: error});
    } else {
      res.json({id: req.params.id, connected: result})
    }
  });
});

app.post('/speakers/:id/disconnect', function (req, res) {
  var script = "tell application \"Airfoil\"\n";
  script += "set myspeaker to first speaker whose id is \"" + req.params.id + "\"\n";
  script += "disconnect from myspeaker\n";
  script += "connected of myspeaker\n";
  script += "end tell";
  applescript.execString(script, function(error, result) {
    if (error) {
      res.json({error: error});
    } else {
      res.json({id: req.params.id, connected: result})
    }
  });
});

app.post('/speakers/:id/volume', bodyParser.text({type: '*/*'}), function (req, res) {
  var script = "tell application \"Airfoil\"\n";
  script += "set myspeaker to first speaker whose id is \"" + req.params.id + "\"\n";
  script += "set (volume of myspeaker) to " + parseFloat(req.body) + "\n";
  script += "volume of myspeaker\n";
  script += "end tell";
  applescript.execString(script, function(error, result) {
    if (error) {
      res.json({error: error});
    } else {
      res.json({id: req.params.id, volume: parseFloat(result)})
    }
  });
});

// uses a device source, like a hardware input
app.post('/source/:id', function (req, res) {
  var script = "tell application \"Airfoil\"\n";
  script += "set current audio source to first device source whose name is \"" + req.params.id + "\"\n";
  script += "end tell";
  applescript.execString(script, function(error, result) {
    if (error) {
      res.json({error: error});
    } else {
      res.json({id: req.params.id})
    }
  });
});

// sets the application source which should be streamed to the speakers
app.post('/appsource/:id', function (req, res) {
  var script = "set appName to \"" + req.params.id + "\"\n";
  script += "tell application \"System Events\"\n"
  script += "set appList to every process whose name is \"" + req.params.id + "\"\n";
  script += "end tell\n"
  script += "if length of appList is 0 then\n";
  script += "tell application \"" + req.params.id + "\"\n";
  script += "launch\n";
  script += "delay 3\n";
  script += "activate\n";
  script += "end tell\n";
  script += "end if\n";
  script += "set pathToApp to (POSIX path of (path to application appName))\n"
  script += "tell application \"Airfoil\"\n";
  script += "set appsource to make new application source\n";
  script += "set application file of appsource to pathToApp\n";
  script += "set (current audio source) to appsource\n";
  script += "end tell\n";
  applescript.execString(script, function(error, result) {
    if (error) {
      res.json({error: error});
    } else {
      res.json({id: req.params.id})
    }
  });
});

// control the app that streams audio
app.post('/appcontrol/:id', bodyParser.text({type: '*/*'}), function (req, res) {
  var script = "tell application \"" + req.params.id + "\" to " + req.body + "\n";
  applescript.execString(script, function(error, result) {
    if (error) {
      res.json({error: error});
    } else {
      res.json({id: req.params.id})
    }
  });
});

// sets a system source as source
app.post('/syssource/:id', bodyParser.text({type: '*/*'}), function (req, res) {
  var script = "tell application \"Airfoil\"\n";
  script += "set aSource to first system source whose name is \"" + req.params.id + "\"\n";
  script += "set current audio source to aSource\n";
  script += "end tell\n";

  applescript.execString(script, function(error, result) {
    if (error) {
      res.json({error: error});
    } else {
      res.json({id: req.params.id})
    }
  });
});


app.listen(process.env.PORT || 10123);
