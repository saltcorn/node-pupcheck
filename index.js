const Browser = require("./browser")
const run = require("./run")
const go = async () => {
    const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

    //const b = await Browser.create({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })
    //const executablePath = '/Applications/Chromium.app/Contents/MacOS/Chromium' 
    await run([
        {
            type: "goto",
            url: "https://saltcorn.com"
        }
    ], { executablePath })
}

go()