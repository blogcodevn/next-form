import * as fs from "fs";
import * as path from "path";
import * as log from "./log.mjs";
import * as utils from "./utils.mjs";

const [,, projectName, ...rest] = process.argv;

log.clear();

if (!utils.isValidName(projectName)) {
  log.error('Invalid project name');
  log.exit();
}

const mergedName = utils.createName(projectName);
const projectDir = path.join(process.cwd(), 'projects');
const projectPath = path.join(projectDir, mergedName);

if (!fs.existsSync(projectPath)) {
  log.error('Project does not exists');
  log.exit();
}

const params = [projectPath, "&&", "yarn", "start", ...rest];
log.command(`cd ./projects/${mergedName} && yarn start`);

utils.command("cd", params).catch((e) => {
  log.error('Failed to start project', e);
  log.exit();
});
