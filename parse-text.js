const selectorAndRest = (restArgs) => {
  if (!restArgs) return ["", ""];
  if (restArgs[0] === "(") {
    // was: var closesAt = restArgs.indexOf(")");
    let closesAt = findClosingBracketMatchIndex(restArgs, 0);
    return [restArgs.slice(1, closesAt), restArgs.slice(closesAt + 1).trim()];
  } else {
    const sp = restArgs.split(" ");
    return [sp[0], sp.slice(1).join(" ")];
  }
};

// https://codereview.stackexchange.com/a/179484
function findClosingBracketMatchIndex(str, pos) {
  if (str[pos] != "(") {
    throw new Error("No '(' at index " + pos);
  }
  let depth = 1;
  for (let i = pos + 1; i < str.length; i++) {
    switch (str[i]) {
      case "(":
        depth++;
        break;
      case ")":
        if (--depth == 0) {
          return i;
        }
        break;
    }
  }
  throw new Error(`No matching closing parenthesis in selector ${str}`);
}
module.exports = (s, fileName) => {
  const lines = s.split(/\r?\n/).map((l) => l.trim());
  const items = [];
  let lineNumber = 0;
  for (const line of lines) {
    lineNumber++;
    if (!line) continue;
    if (line[0] === "#") continue;

    var firstSpace = line.indexOf(" ");
    const keyword = line.slice(0, firstSpace);
    const restArgs = line.slice(firstSpace + 1);
    switch (keyword.toLowerCase()) {
      case "goto":
        items.push({
          lineNumber,
          fileName,
          line,
          type: "goto",
          args: [restArgs],
        });
        break;
      case "contains":
        items.push({
          lineNumber,
          fileName,
          line,
          type: "contains",
          args: [restArgs],
        });
        break;
      case "containsnot":
      case "contains_not":
        items.push({
          lineNumber,
          fileName,
          line,
          type: "containsnot",
          args: [restArgs],
        });
        break;

      case "evaltrue":
      case "eval_true":
        items.push({
          lineNumber,
          fileName,
          line,
          type: "evaltrue",
          args: [restArgs],
        });
        break;
      case "type":
        {
          const [selector, text] = selectorAndRest(restArgs);
          items.push({
            lineNumber,
            fileName,
            line,
            type: "type",
            args: [selector, text],
          });
        }
        break;
      case "select":
        {
          const [selector, value] = selectorAndRest(restArgs);
          items.push({
            lineNumber,
            fileName,
            line,
            type: "select",
            args: [selector, value],
          });
        }
        break;
      case "slowly_type":
      case "slowlytype":
        {
          const [selector, text] = selectorAndRest(restArgs);
          items.push({
            lineNumber,
            fileName,
            line,
            type: "slowly_type",
            args: [selector, text],
          });
        }
        break;
      case "erase":
        {
          const [selector, nchars] = selectorAndRest(restArgs);
          if (isNaN(+nchars))
            throw new Error(
              `Parse error in line ${lineNumber}: erase selector not followed by a number`
            );
          items.push({
            lineNumber,
            fileName,
            line,
            type: "erase",
            args: [selector, +nchars],
          });
        }
        break;
      case "click":
        {
          const [selector, nav] = selectorAndRest(restArgs);
          const item = {
            lineNumber,
            fileName,
            line,
            type: "click",
            args: [selector, nav === "false" ? false : undefined],
          };

          items.push(item);
        }
        break;
      case "wait_for":
      case "waitfor":
        {
          const [selector] = selectorAndRest(restArgs);
          items.push({
            lineNumber,
            fileName,
            line,
            type: "wait_for",
            args: [selector],
          });
        }
        break;
      case "status":
        if (isNaN(+restArgs))
          throw new Error(
            `Parse error in line ${lineNumber}: status not followed by a number`
          );
        items.push({
          lineNumber,
          fileName,
          line,
          type: "status",
          args: [+restArgs],
        });
        break;
      case "sleep":
        if (isNaN(+restArgs))
          throw new Error(
            `Parse error in line ${lineNumber}: sleep not followed by a number`
          );
        items.push({
          lineNumber,
          fileName,
          line,
          type: "sleep",
          args: [+restArgs],
        });
        break;
      default:
        throw new Error(
          `Parse error in line ${lineNumber}: unknown command '${keyword}'`
        );
    }
  }
  return items;
};
