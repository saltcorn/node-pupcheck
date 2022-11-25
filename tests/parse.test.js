const parse = require("../parse-text");

describe("text parser", () => {
  it("parse empty file", async () => {
    expect(parse(``)).toStrictEqual([]);
    expect(
      parse(`
        
        `)
    ).toStrictEqual([]);
    expect(parse(`  `)).toStrictEqual([]);
  });
  it("parse simple file", async () => {
    expect(
      parse(`
          goto https://saltcorn.com
          status 200        
        `)
    ).toStrictEqual([
      { type: "goto", url: "https://saltcorn.com" },
      { type: "status", code: 200 },
    ]);
  });
  it("parse file with comments", async () => {
    expect(
      parse(`
          goto https://saltcorn.com
          # this is a comment
          status 200        
        `)
    ).toStrictEqual([
      { type: "goto", url: "https://saltcorn.com" },
      { type: "status", code: 200 },
    ]);
  });
  it("parse click", async () => {
    expect(parse(`click #foo`)).toStrictEqual([
      { type: "click", selector: "#foo" },
    ]);
  });
  it("parse click with parens", async () => {
    expect(parse(`click (#foo a)`)).toStrictEqual([
      { type: "click", selector: "#foo a" },
    ]);
  });
  it("parse simple type", async () => {
    expect(parse(`type #foo bar baz`)).toStrictEqual([
      { type: "type", selector: "#foo", text: "bar baz" },
    ]);
  });
  it("parse type with child elem", async () => {
    expect(parse(`type (#foo input) bar baz`)).toStrictEqual([
      { type: "type", selector: "#foo input", text: "bar baz" },
    ]);
  });
});
