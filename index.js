#! /usr/bin/env node

const run = require("./run");
const path = require("path");
const parse = require("./parse-text");
const { readFileSync } = require("fs");

const helpText = `pupcheck [-Hhv] [file ...]

Command line switches:

  -H         : Headful; open browser window
  -v         : verbose
  -h, --help : help
  
pupcheck file (*.pch) commands:
  
  # This is a comment but only if # is first character

  goto {url}
    Navigate to this URL
    Example: goto https://google.com

  status {status code}
    Assert this status code
    Example: status 200
  
  contains {contents}
    Assert this is in the page contents
    Example: contains Tasks completed

  containsnot {contents}
    Assert this is in not in the page contents
    Example: contains An error occurred

  click {selector}
    Click the selected element and wait for navigation to complete
    Example: click button#click_me

  type {selector} {text}
    Type the text into the selected input element
    Example: type input#full_name John Smith

  sleep {milliseconds}
    Sleep for this many milliseconds
    Example: sleep 1000
`;

const getArgs = () => {
  const myArgs = process.argv.slice(2);
  const flags = {};
  const files = [];

  if (myArgs.length === 0) {
    console.log(helpText);
    process.exit(0);
  }

  let flagsDone = false;
  for (let i = 0; i < myArgs.length; i++) {
    const arg = myArgs[i];

    if (!flagsDone && arg[0] !== "-") flagsDone = true;
    if (!flagsDone) {
      switch (arg) {
        case "-H":
          flags.headful = true;
          break;
        case "-v":
          flags.verbose = true;
          break;
        case "-h":
        case "--help":
          console.log(helpText);
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

  if (["md"].includes(ext)) {
    console.log("Skipping file:", fnm);
    return;
  }

  switch (ext) {
    case ".json":
      spec = JSON.parse(fileContents);
      break;

    default:
      spec = parse(fileContents, fnm);

      break;
  }
  if (spec) {
    process.stdout.write(fnm + ": ");
    if (options.verbose) console.log(JSON.stringify(spec, null, 2));
    const error = await run(spec, options);
    if (error) {
      console.error(error);
      process.exit(1);
    }
  }
};

(async () => {
  const { flags, files } = getArgs();
  const options = {
    headful: flags.headful,
    verbose: flags.verbose,
  };
  for (const file of files) {
    await runFile(file, options);
  }
})();
