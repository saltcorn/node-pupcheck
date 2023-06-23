const Browser = require("./browser");
const getDispatch = require("./dispatch");

module.exports = async (spec, options) => {
  if (!Array.isArray(spec))
    throw new Error("pupcheck spec must be an array, got type: " + typeof spec);
  const b = await Browser.create(options);
  const dispatch = getDispatch(b);
  for (const item of spec) {
    if (!item.type)
      throw new Error("item has no type: " + JSON.stringify(item));
    if (!Object.keys(dispatch).includes(item.type))
      throw new Error("type not supported " + item.type);
  }
  for (const item of spec) {
    try {
      await dispatch[item.type](...item.args);
    } catch (e) {
      await b.close();
      return `${e.name}: ${e.message}
in ${item.fileName} line ${item.lineNumber}:
${item.line}`;
    }
  }
  console.log(`${spec.length} steps passed`);
  await b.close();
  return;
};
