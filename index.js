const run = require("./run");

(async () => {
  const executablePath =
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  //const executablePath = '/Applications/Chromium.app/Contents/MacOS/Chromium'

  await run(
    [
      {
        type: "goto",
        url: "https://saltcorn.com",
      },
      {
        type: "status",
        code: 200,
      },
      {
        type: "contains",
        text: "Focus on database-backed",
      },
      {
        type: "containsnot",
        text: "Focus on datbase-backed",
      },
    ],
    { executablePath }
  );
})();
