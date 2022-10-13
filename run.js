const Browser = require("./browser")


module.exports = async (spec, options) => {
    if (!Array.isArray(spec)) throw new Error("pupcheck spec must be an array, got type: " + typeof spec)
    const b = await Browser.create(options)
    for (const item of spec) {
        await ({
            async goto({ url }) {
                await b.goto(url)
            },
            async contains({ text }) {
                if (!(await b.content()).includes(text))
                    throw new Error("contains not found:" + text)
            },
            async containsnot({ text }) {
                if ((await b.content()).includes(text))
                    throw new Error("containsnot found:" + text)
            }

        })[item.type](item)
    }
    await b.close()
}