const Browser = require("./browser");
const fs = require("fs");
const fsp = fs.promises;
const { runInNewContext, Script } = require("vm");
const getDispatch = require("./dispatch");

module.exports = async (fileNm, options) => {
  const file = await fsp.readFile(fileNm);

  const b = await Browser.create(options);
  const dispatch = getDispatch(b);
  let runner;
  try {
    runner = runInNewContext(`async ()=>{${file}\n}`, dispatch);
  } catch (e) {
    e.message = `Parse error in file ${fileNm}: ${e.message}`;
    throw e;
  }
  await runner();
  await b.close();
  return;
};
