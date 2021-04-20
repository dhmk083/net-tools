const { exec } = require("child_process");

const color = (str, n) => `\x1b[3${n}m${str}\x1b[0m`;

const colorChannel = (c) => color(c, (c % 6) + 1);

const colorStrength = (s) => color(s, s < 50 ? 1 : s < 75 ? 3 : 2);

exec("@chcp 65001 & netsh wlan show all", (err, stdout, stderr) => {
  stdout = stdout.slice(stdout.indexOf("networks currently visible"));

  const reg = {
    names: [...stdout.matchAll(/SSID \d+ : (.+?)\r\n/g)],
    channels: [...stdout.matchAll(/Channel\s+: (\d+)/g)],
    strengths: [...stdout.matchAll(/Signal\s+: (\d+)/g)],
    types: [...stdout.matchAll(/Radio type\s+: (.+?)\r\n/g)],
  };

  const data = {
    names: reg.names.map((m) => m[1]),
    channels: reg.channels.map((m) => colorChannel(m[1])),
    strengths: reg.strengths.map((m) => colorStrength(parseInt(m[1]))),
    types: reg.types.map((m) => m[1]),
  };

  const pads = Object.keys(data).reduce((self, k) => {
    self[k] = Math.max(...data[k].map((x) => x.toString().length));
    return self;
  }, {});

  data.names.forEach((_, i) => {
    console.log(...Object.keys(data).map((k) => data[k][i].padEnd(pads[k])));
  });
});
