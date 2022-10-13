const parse = require("../parse-text")

describe("text parser", () => {
    it("parse empty file", async () => {
        expect(parse(``)).toStrictEqual([])
        expect(parse(`
        
        `)).toStrictEqual([])
        expect(parse(`  `)).toStrictEqual([])
    })
})