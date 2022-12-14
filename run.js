const Browser = require("./browser");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = async (spec, options) => {
  if (!Array.isArray(spec))
    throw new Error("pupcheck spec must be an array, got type: " + typeof spec);
  const b = await Browser.create(options);
  const dispatch = {
    async goto({ url }) {
      await b.goto(url);
    },
    async click({ selector, wait_nav }) {
      if (wait_nav === false) await b.page.click(selector);
      else await b.clickNav(selector);
    },
    async wait_for({ selector }) {
      await b.page.waitForSelector(selector);
    },
    async evaltrue({ js }) {
      const res = await b.page.evaluate(js);
      if (!res) throw new Error("evaltrue returned: " + JSON.stringify(res));
    },
    async sleep({ ms }) {
      await sleep(ms);
    },
    async type({ selector, text }) {
      await b.page.type(selector, text);
    },
    async select({ selector, value }) {
      await b.page.select(selector, value);
    },
    async slowly_type({ selector, text }) {
      await b.slowly_type(selector, text);
    },
    async erase({ selector, nchars }) {
      await b.erase_input(selector, nchars);
    },
    async contains({ text }) {
      if (!(await b.content()).includes(text))
        throw new Error("contains not found:" + text);
    },
    async containsnot({ text }) {
      if ((await b.content()).includes(text))
        throw new Error("containsnot found:" + text);
    },
    async status({ code }) {
      if (code !== b.status)
        throw new Error(`Expected status ${code}, got ${b.status}`);
    },
  };
  for (const item of spec) {
    if (!item.type)
      throw new Error("item has no type: " + JSON.stringify(item));
    if (!Object.keys(dispatch).includes(item.type))
      throw new Error("type not supported " + item.type);
  }
  for (const item of spec) {
    try {
      await dispatch[item.type](item);
    } catch (e) {
      await b.close();
      return `${e.name}: ${e.message}
in ${item.fileName} line ${item.lineNumber}:
${item.line}`;
    }
  }
  console.log(`${spec.length} steps passed`);
  await b.close();
  return;
};
