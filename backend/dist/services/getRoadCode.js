"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRoadCode = getRoadCode;
//const text = "Keep <b>left</b> at the fork, follow signs for <b>A23/M12</b>/<wbr/><b>Regensburg</b>/<wbr/><b>München</b>/<wbr/><b>A9</b>/<wbr/><b>Nürnberg-Nord</b>/<wbr/><b>N.-Flughafen</b>/<wbr/><b>Fähre/A10</b> and merge onto <b>A3</b>"
var text = "Continue onto <b>A12/M12<div style=\"font-size:0.9em\">Entering Poland</div>";
var commandsPriors = [{
  "command": "Merge on",
  "prior": 1
}, {
  "command": "Merge onto",
  "prior": 1
}, {
  "command": "Continue onto",
  "prior": 1
}, {
  "command": "Continue to follow",
  "prior": 1
}, {
  "command": "Stay on",
  "prior": 1
}, {
  "command": "and becomes",
  "prior": 1
}, {
  "command": "exit onto",
  "prior": 1
}, {
  "command": "exit onto the",
  "prior": 1
}, {
  "command": "Take the ramp to",
  "prior": 1
}, {
  "command": "Take the exit toward",
  "prior": 1
}, {
  "command": "Take the",
  "prior": 1
}, {
  "command": "follow signs for",
  "prior": 2
}, {
  "command": "Head southwest on",
  "prior": 2
}, {
  "command": "Head northwest on",
  "prior": 2
}, {
  "command": "Head southeast on",
  "prior": 2
}, {
  "command": "Head northeast on",
  "prior": 2
}, {
  "command": "Head north on",
  "prior": 2
}, {
  "command": "Head south on",
  "prior": 2
}, {
  "command": "Head west on",
  "prior": 2
}, {
  "command": "Head east on",
  "prior": 2
}, {
  "command": "Turn right onto",
  "prior": 2
}, {
  "command": "Turn left onto",
  "prior": 2
}, {
  "command": "Turn left at",
  "prior": 2
}, {
  "command": "Turn right at",
  "prior": 2
}];

function getRoadCode(text) {
  text = text.replace(/<\/?[^>]+(>|$)/g, "");
  var cur = null;

  for (var i = 0; i < commandsPriors.length; i++) {
    var cpText = text;
    var reg = new RegExp("".concat(commandsPriors[i].command, ".[^ ]+"), "igm");
    var match = cpText.match(reg);

    for (var k = 0; Array.isArray(match) && k < match.length; k++) {
      var reg2 = new RegExp("[a-z][0-9]+", "igm");
      var match2 = match[k].match(reg2);

      if (!cur && Array.isArray(match2)) {
        cur = match2;
        break;
      }
    }
  }

  return cur;
}

getRoadCode(text);
//# sourceMappingURL=getRoadCode.js.map