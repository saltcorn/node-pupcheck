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
      parse(
        `goto https://saltcorn.com
status 200        
        `,
        "myfile"
      )
    ).toStrictEqual([
      {
        fileName: "myfile",
        line: "goto https://saltcorn.com",
        lineNumber: 1,
        type: "goto",
        url: "https://saltcorn.com",
      },
      {
        fileName: "myfile",
        lineNumber: 2,
        line: "status 200",
        type: "status",
        code: 200,
      },
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
      {
        fileName: undefined,
        line: "goto https://saltcorn.com",
        lineNumber: 2,
        type: "goto",
        url: "https://saltcorn.com",
      },
      {
        fileName: undefined,
        lineNumber: 4,
        line: "status 200",
        type: "status",
        code: 200,
      },
    ]);
  });
  it("parse click", async () => {
    expect(parse(`click #foo`)).toStrictEqual([
      {
        fileName: undefined,
        line: "click #foo",
        lineNumber: 1,
        type: "click",
        selector: "#foo",
      },
    ]);
  });
  it("parse click with parens", async () => {
    expect(parse(`click (#foo a)`)).toStrictEqual([
      {
        fileName: undefined,
        line: "click (#foo a)",
        lineNumber: 1,
        type: "click",
        selector: "#foo a",
      },
    ]);
  });
  it("parse another click with parens", async () => {
    expect(
      parse(`click (tr[data-todo-type=RECOMMENDATIONS] td:nth-child(2) a)`)
    ).toStrictEqual([
      {
        fileName: undefined,
        line: "click (tr[data-todo-type=RECOMMENDATIONS] td:nth-child(2) a)",
        lineNumber: 1,
        type: "click",
        selector: "tr[data-todo-type=RECOMMENDATIONS] td:nth-child(2) a",
      },
    ]);
  });
  it("parse simple type", async () => {
    expect(parse(`type #foo bar baz`)).toStrictEqual([
      {
        fileName: undefined,
        line: "type #foo bar baz",
        lineNumber: 1,
        type: "type",
        selector: "#foo",
        text: "bar baz",
      },
    ]);
  });
  it("parse type with child elem", async () => {
    expect(parse(`type (#foo input) bar baz`)).toStrictEqual([
      {
        fileName: undefined,
        line: "type (#foo input) bar baz",
        lineNumber: 1,
        type: "type",
        selector: "#foo input",
        text: "bar baz",
      },
    ]);
  });
});
