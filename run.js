const Browser = require("./browser")


module.exports = async (spec, options) => {
    if (!Array.isArray(spec)) throw new Error("pupcheck spec must be an array, got type: " + typeof spec)
    const b = await Browser.create(options)
    for (const item of spec) {
        await ({
            async goto({ url }) {
                await b.goto(url)
            }

        })[item.type](item)
    }
    await b.close()
}