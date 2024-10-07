import chalk from "chalk";

const green = chalk.green;
const red = chalk.red;
const yellowBright = chalk.yellowBright;
const yellow = chalk.yellow;
const blue = chalk.blue;
const cyan = chalk.cyan;
const gray = chalk.gray;
chalk.yellowBright

const NAME = green("≫ blogcode");
const ERROR = red("[ ERROR ]");
const RUN = yellowBright("[ RUN ]");
const INSTALL = cyan("[ INSTALL ]");
const INFO = blue("[ INFO ]");
const MESSAGE = blue("[ MESSAGE ]");
const WARNING = yellow("[ WARNING ]");

function fulFill(str, length = 10) {
  return str.padEnd(length, "&nbsp;");
}

export function clear() {
  console.clear();
}

export function command(cmd) {
  console.log(`\n${NAME} ${fulFill(RUN)} ${gray(cmd)}`);
}

export function error(message) {
  console.log(`\n${NAME} ${ERROR} ${red(message)}`);
}

export function breakLine() {
  console.log();
}

export function installing() {
  let dots = "";
  return setInterval(() => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    dots += ".";

    if (dots.length > 3) {
      dots = "";
    }

    const message = `Installing dependencies${dots}`;
    process.stdout.write(`${NAME} ${INSTALL} ${gray(message)}`);
  }, 500);
}

export function exit() {
  console.log(`\n${NAME} exit`);
  breakLine();
  process.exit(0);
}

export function info(message) {
  console.log(`\n${NAME} ${INFO} ${gray(typeof message === "object" ? JSON.stringify(message, undefined, 2) : message.toString())}`);
}

export function message(message) {
  console.log(`\n${NAME} ${MESSAGE} ${typeof message === "object" ? JSON.stringify(message, undefined, 2) : message.toString()}`);
}

export function warning(msg) {
  console.log(`\n${NAME} ${WARNING} ${typeof msg === "object" ? JSON.stringify(msg, undefined, 2) : msg.toString()}`);
}
