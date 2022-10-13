const Browser = require("./browser")


module.exports = async (spec, options) => {
    if (!Array.isArray(spec)) throw new Error("pupcheck spec must be an array, got type: " + typeof spec)
    const b = await Browser.create(options)

    const dispatch = {
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

    }
    for (const item of spec) {
        if (!item.type) throw new Error("item has no type: " + JSON.stringify(item))
        if (!Object.keys(dispatch).includes(item.type))
            throw new Error("type not supported " + item.type)
    }
    for (const item of spec) {
        await dispatch[item.type](item)
    }
    console.log(`${spec.length} steps passed`)
    await b.close()
}