import { spawn } from "node:child_process";
import * as log from "./log.mjs";

export function createName(name) {
  return `@blogcode/${name}`;
}

export function isValidName(name) {
  if (typeof name !== 'string') {
    return false;
  }

  return name.toLowerCase().match(/^[a-z][a-z\d\.\-_]+$/);
}

export function command(cmd, params) {
  return new Promise((resolve, reject) => {
    const shell = spawn(cmd, params, { shell: true });

    shell.on("exit", (code, ...rest) => {
      if (code === 0) {
        resolve();
      } else {
        reject(rest);
      }
    });

    shell.on("error", (error) => {
      reject(error);
    });

    shell.stdout.on("data", (data) => {
      const message = data.toString();
      log.message(message);
    });

    shell.stderr.on("data", (data) => {
      const message = data.toString();

      if (typeof message === "string" && message.trim().match(/^error/i)) {
        reject(message);
        return;
      }

      if (typeof message === "string" && message.trim().match(/^warning/i)) {
        log.warning(message);
        return;
      }

      log.info(message);
    });
  });
}
