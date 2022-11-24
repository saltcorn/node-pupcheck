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
      case "status":
        if (isNaN(+restArgs))
          throw new Error(
            `Parse error in line ${lineNumber}: status not followed by a number`
          );
        items.push({ type: "status", code: +restArgs });
        break;
      default:
        break;
    }
  }
  return items;
};
