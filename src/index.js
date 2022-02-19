const chalk = require("chalk");
const config = require("./config");
const app = require("./app");

const http = require("http");
const server = http.Server(app);
server.listen(config.PORT || process.env.PORT, config.HOST, () =>
  console.log(chalk.blue(`Server started @ http://localhost:${config.PORT}/`))
);
