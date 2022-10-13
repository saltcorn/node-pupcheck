const parse = require("../parse-text")

describe("text parser", () => {
    it("parse empty file", async () => {
        expect(parse(``)).toStrictEqual([])
        expect(parse(`
        
        `)).toStrictEqual([])
        expect(parse(`  `)).toStrictEqual([])
    })
    it("parse simple file", async () => {
        expect(parse(`
          goto https://saltcorn.com
          status 200        
        `)).toStrictEqual([
            { type: "goto", url: "https://saltcorn.com" },
            { type: "status", code: 200 }
        ])

    })

})