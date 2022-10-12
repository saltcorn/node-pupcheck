const puppeteer = require("puppeteer");
const fs = require("fs");

class Browser {
    static async init(o) {
        const b = new Browser();
        const executablePath = process.env.PUPPETEER_CHROMIUM_BIN || (fs.existsSync("/usr/bin/chromium-browser")
            ? "/usr/bin/chromium-browser"
            : fs.existsSync("/usr/bin/chromium")
                ? "/usr/bin/chromium"
                : undefined);
        b.browser = await puppeteer.launch({
            headless: true, //o || process.env.CI==='true',
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
        return b;
    }

    get baseURL() {
        return `http://${this.tenant ? this.tenant + "." : ""}example.com:2987`;
    }
    async goto(url) {
        const [response] = await Promise.all([
            this.page.waitForNavigation(),
            this.page.goto(this.baseURL + url),
        ]);
        expect(response.status()).toBe(200);
    }
    async clickNav(sel, dontCheck) {
        const prevpage = await this.page.content();

        const [response] = await Promise.all([
            this.page.waitForNavigation(),
            this.page.click(sel),
        ]);
        if (response.status() >= 400 && !dontCheck) {
            const page = await this.page.content();
            console.log("nav sel", sel);
            console.log("beforeNav", prevpage);
            console.log("afterNav", page);
        }
        if (!dontCheck) expect(response.status()).toBeLessThanOrEqual(399);
    }
    content() {
        return this.page.content();
    }
    async delete_tenant(nm) {
        this.tenant = undefined;
        await deleteTenant(nm);
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
module.exports = Browser