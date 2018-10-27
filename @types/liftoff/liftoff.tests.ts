import Liftoff = require("liftoff");
const cli = new Liftoff({
  name: "fm",
  processTitle: "fm-cli"
});
cli.launch({}, () => {});
