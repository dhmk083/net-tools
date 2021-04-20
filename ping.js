const { spawn } = require("child_process");
const asciichart = require("asciichart");

const pad = 14;
const width = process.stdout.getWindowSize()[0] - pad;
const data = [0];
let maxPing = 0;

const ping = spawn("ping", ["192.168.0.1", "-t"]);
ping.stdout.on("data", (d) => {
  const str = d.toString();
  const msPos = str.indexOf("=", str.indexOf("=") + 1) + 1;
  const ms = parseInt(str.slice(msPos));

  if (isNaN(ms)) return;

  data.push(ms);
  if (data.length === width) data.shift();
  maxPing = Math.max(maxPing, ms);

  console.clear();
  console.log(asciichart.plot(data, { height: 20 }));
  console.log("MAX:", maxPing, "ms");
});
