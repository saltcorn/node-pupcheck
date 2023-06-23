function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//b: Browser
module.exports = (b) => ({
  async goto(url) {
    await b.goto(url);
  },
  async click(selector, wait_nav) {
    if (wait_nav === false) await b.page.click(selector);
    else await b.clickNav(selector);
  },
  async wait_for(selector) {
    await b.page.waitForSelector(selector);
  },
  async evaltrue(js) {
    const res = await b.page.evaluate(js);
    if (!res) throw new Error("evaltrue returned: " + JSON.stringify(res));
  },
  async sleep(ms) {
    await sleep(ms);
  },
  async type(selector, text) {
    await b.page.type(selector, text);
  },
  async select(selector, value) {
    await b.page.select(selector, value);
  },
  async slowly_type(selector, text) {
    await b.slowly_type(selector, text);
  },
  async erase({ selector, nchars }) {
    await b.erase_input(selector, nchars);
  },
  async contains(text) {
    if (!(await b.content()).includes(text))
      throw new Error("contains not found:" + text);
  },
  async containsnot(text) {
    if ((await b.content()).includes(text))
      throw new Error("containsnot found:" + text);
  },
  status(code) {
    if (code !== b.status)
      throw new Error(`Expected status ${code}, got ${b.status}`);
  },
});
