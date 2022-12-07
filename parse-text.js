const selectorAndRest = (restArgs) => {
  if (!restArgs) return ["", ""];
  if (restArgs[0] === "(") {
    var closesAt = restArgs.indexOf(")");
    return [restArgs.slice(1, closesAt), restArgs.slice(closesAt + 1).trim()];
  } else {
    const sp = restArgs.split(" ");
    return [sp[0], sp.slice(1).join(" ")];
  }
};

module.exports = (s) => {
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
        items.push({ type: "goto", url: restArgs });
        break;
      case "contains":
        items.push({ type: "contains", text: restArgs });
        break;
      case "containsnot":
      case "contains_not":
        items.push({ type: "containsnot", text: restArgs });
        break;

      case "evaltrue":
      case "eval_true":
        items.push({ type: "evaltrue", js: restArgs });
        break;
      case "type":
        {
          const [selector, text] = selectorAndRest(restArgs);
          items.push({
            type: "type",
            selector,
            text,
          });
        }
        break;
      case "slowly_type":
      case "slowlytype":
        {
          const [selector, text] = selectorAndRest(restArgs);
          items.push({
            type: "slowly_type",
            selector,
            text,
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
            type: "erase",
            selector,
            nchars: +nchars,
          });
        }
        break;
      case "click":
        {
          const [selector] = selectorAndRest(restArgs);
          items.push({
            type: "click",
            selector,
          });
        }
        break;
      case "wait_for":
      case "waitfor":
        {
          const [selector] = selectorAndRest(restArgs);
          items.push({
            type: "wait_for",
            selector,
          });
        }
        break;
      case "status":
        if (isNaN(+restArgs))
          throw new Error(
            `Parse error in line ${lineNumber}: status not followed by a number`
          );
        items.push({ type: "status", code: +restArgs });
        break;
      case "sleep":
        if (isNaN(+restArgs))
          throw new Error(
            `Parse error in line ${lineNumber}: sleep not followed by a number`
          );
        items.push({ type: "sleep", ms: +restArgs });
        break;
      default:
        throw new Error(
          `Parse error in line ${lineNumber}: unknown command '${keyword}'`
        );
        break;
    }
  }
  return items;
};
