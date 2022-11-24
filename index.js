const run = require("./run");
const path = require("path");
const parse = require("./parse-text");
const { readFileSync } = require("fs");
const getArgs = () => {
  const myArgs = process.argv.slice(2);
  const flags = { headful: false };
  const files = [];

  let flagsDone = false;
  for (let i = 0; i < myArgs.length; i++) {
    const arg = myArgs[i];

    if (!flagsDone && arg[0] !== "-") flagsDone = true;
    if (!flagsDone) {
      switch (arg) {
        case "-H":
          flags.headful = true;
          break;
        case "-h":
        case "--help":
          console.log("pupcheck [-H] [file ...]");
          console.log("\nSwitches:\n");
          console.log(
            "   -H  : Headful, opposite of headless; open browser window"
          );
          console.log("");
          process.exit(0);
        default:
          break;
      }
    } else {
      files.push(arg);
    }
  }

  return { flags, files };
};

const runFile = async (fnm, options) => {
  const ext = path.extname(fnm);
  let spec;
  const fileContents = readFileSync(fnm).toString();

  switch (ext) {
    case ".pch":
      spec = parse(fileContents);

      break;
    case ".json":
      spec = JSON.parse(fileContents);
      break;

    default:
      console.error("Skipping unknown file type:", fnm);
      break;
  }
  if (spec) {
    process.stdout.write(fnm + ": ");
    await run(spec, options);
  }
};

(async () => {
  const { flags, files } = getArgs();
  const options = {
    headful: flags.headful,
  };
  for (const file of files) {
    await runFile(file, options);
  }
})();
