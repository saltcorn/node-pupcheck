const Browser = require("./browser")

const go = async () => {
    const b = await Browser.create({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })
    await b.goto("https://saltcorn.com")
    await b.close()

}

go()