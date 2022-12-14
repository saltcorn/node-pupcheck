const puppeteer = require("puppeteer");
const fs = require("fs");

class Browser {
  //nonstandard constructor bec it is async
  static async create(o) {
    const b = new Browser();
    const executablePath =
      o?.executablePath ||
      process.env.PUPPETEER_CHROMIUM_BIN ||
      (fs.existsSync("/usr/bin/chromium-browser")
        ? "/usr/bin/chromium-browser"
        : fs.existsSync("/usr/bin/chromium")
        ? "/usr/bin/chromium"
        : fs.existsSync(
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
          )
        ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        : undefined);
    b.browser = await puppeteer.launch({
      headless: !o?.headful, //o || process.env.CI==='true',
      executablePath,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      dumpio: true,
      defaultViewport: {
        width: 1200,
        height: 800,
      },
    });
    b.page = await b.browser.newPage();
    //  await page.goto("http://localhost:3000/");
    b.page.on("pageerror", function (err) {
      const theTempValue = err.toString();
      throw new Error("Page error: " + theTempValue);
    });
    b.page.on("error", function (err) {
      const theTempValue = err.toString();
      throw new Error("Error: " + theTempValue);
    });
    b.page.on("dialog", async (dialog) => {
      await dialog.accept();
    });
    b.baseURL = o?.baseURL || process.env.PUPCHECK_BASE_URL || "";
    b.status = null;
    return b;
  }

  async goto(url) {
    const [response] = await Promise.all([
      this.page.waitForNavigation(),
      this.page.goto(this.baseURL + url),
    ]);
    this.status = response.status();
  }
  async clickNav(sel) {
    const [response] = await Promise.all([
      this.page.waitForNavigation(),
      this.page.click(sel),
    ]);
    this.status = response ? response.status() : null;
  }
  content() {
    return this.page.content();
  }

  async type(sel, s) {
    await this.page.type("#inputemail", "admin@foo.com");
  }

  // https://stackoverflow.com/a/52633235
  async erase_input(selector, nchars) {
    await this.page.click(selector);
    await this.page.waitForTimeout(50);
    const inputValue = await this.page.$eval(selector, (el) => el.value);
    for (let i = 0; i < (nchars || inputValue.length); i++) {
      await this.page.waitForTimeout(10);
      await this.page.keyboard.press("ArrowRight");
    }
    for (let j = 0; j < (nchars || inputValue.length); j++) {
      await this.page.waitForTimeout(10);
      await this.page.keyboard.press("Backspace");
    }
    await this.page.waitForTimeout(20);
  }
  async slowly_type(selector, text, noclick) {
    if (!noclick) await this.page.click(selector);
    await this.page.waitForTimeout(50);
    for (let i = 0; i < text.length; i++) {
      await this.page.waitForTimeout(20);
      await this.page.keyboard.press(text[i]);
    }
    await this.page.waitForTimeout(50);
  }
  async getInnerText(sel) {
    const element = await this.page.$(sel);
    const text = await this.page.evaluate(
      (element) => element.textContent,
      element
    );
    return text;
  }

  async close() {
    await this.browser.close();
  }
}

module.exports = Browser;
