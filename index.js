const run = require("./run");

(async () => {
  await run([
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
      text: "platform for building database",
    },
    {
      type: "containsnot",
      text: "platform for building datbase",
    },
  ]);
})();
