import * as fs from "fs";
import * as path from "path";
import * as log from "./log.mjs";
import * as utils from "./utils.mjs";
import * as reactTemplate from "./project/react/template.mjs";
import * as nextAppTemplate from "./project/next-app/template.mjs";
import * as nextPageTemplate from "./project/next-page/template.mjs";
import * as remixTemplate from "./project/remix/template.mjs";

const [,, projectName, command, ...others] = process.argv;

log.clear();

if (!projectName) {
  log.error('Project name is required');
  log.exit();
}

const mergedName = utils.createName(projectName);
const projectDir = path.join(process.cwd(), 'projects');
const projectPath = path.join(projectDir, mergedName);

if (!fs.existsSync(projectDir)) {
  fs.mkdirSync(projectDir);
}

function createProject() {
  if (fs.existsSync(projectPath)) {
    log.error('Project already exists');
    log.exit();
  }

  const stacks = {
    react: {
      message: `Creating ReactJS project with name "\${PROJECT_NAME}"`,
      template: reactTemplate.template,
    },
    "next-app": {
      message: `Creating NextJS App Routing project with name "\${PROJECT_NAME}"`,
      template: nextAppTemplate.template,
    },
    "next-page": {
      message: `Creating NextJS Pages Routing project with name "\${PROJECT_NAME}"`,
      template: nextPageTemplate.template,
    },
    remix: {
      message: `Creating RemixJS project with name "\${PROJECT_NAME}"`,
      template: remixTemplate.template,
    },
  };

  const template = others[0]?.toLowerCase() || "";
  const stack = stacks[template];

  if (!stack) {
    log.error('Invalid template');
    log.exit();
  }

  log.info(stack.message.replace(/\$\{PROJECT_NAME\}/gmi, mergedName));

  Object.keys(stack.template).forEach((key) => {
    let content = stack.template[key];
    const filePath = path.join(projectPath, key);
    const isBinary = content.includes("base64,");

    const fileDir = path.dirname(filePath);
    fs.existsSync(fileDir) || fs.mkdirSync(path.dirname(filePath), { recursive: true });

    if (isBinary) {
      content = Buffer.from(content.split("base64,")[1], "base64");
    } else {
      content = content.replace(/\$\{PROJECT_NAME\}/gmi, mergedName);
    }

    fs.writeFileSync(filePath, content);
  });

  log.info('Project created');
  log.info("Installation dependencies");

  const params = [projectPath, "&&", "yarn"];
  log.command(`cd ./projects/${mergedName} && yarn`);

  const interval = log.installing();

  utils.command("cd", params)
    .then(() => {
      clearInterval(interval);
      log.info("Dependencies installed");
      log.exit();
    })
    .catch((e) => {
      clearInterval(interval);
      log.error("Failed to install dependencies");
      log.error(e);
      log.exit();
    });

}

function runProject(cmd, name) {
  if (!fs.existsSync(projectPath)) {
    log.error('Project does not exists');
    log.exit();
  }

  const commanded = Array.isArray(cmd) ? cmd : [cmd];
  const params = [projectPath, "&&", "yarn", ...commanded, ...others];
  log.command(`cd ./projects/${mergedName} && yarn ${commanded.join(" ")}${others.length ? ` ${others.join(' ')}` : ''}`);

  utils.command("cd", params)
    .then(() => {
      log.info(name + 'project success.');
      log.exit();
    })
    .catch((e) => {
      log.error('Failed to ' + name + ' project.');
      log.error(e);
      log.exit();
    });
}

function removeProject() {
  if (!fs.existsSync(projectPath)) {
    log.error('Project does not exists');
    log.exit();
  }

  log.info(`Removing project "${mergedName}"`);
  fs.rmSync(projectPath, { recursive: true, force: true });
  log.info(`Project "${mergedName}" removed`);

  log.exit();
}

function linkPackage() {
  if (!fs.existsSync(projectPath)) {
    log.error('Project does not exists');
    log.exit();
  }

  const [packageName] = others;
  const mergedPackage = utils.createName(packageName);
  const packagePath = path.join(process.cwd(), 'packages', mergedPackage);

  if (!fs.existsSync(packagePath)) {
    log.error('Package does not exists');
    log.exit();
  }

  log.info(`Linking package "${mergedPackage}" to project "${mergedName}"`);

  const packageJson = JSON.parse(fs.readFileSync(path.join(projectPath, 'package.json'), 'utf8'));
  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.dependencies[mergedPackage] = `../../../packages/${mergedPackage}`;
  fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2));

  const params = [projectPath, "&&", "yarn"];
  log.command(`cd ./projects/${mergedName} && yarn`);

  const interval = log.installing();

  utils.command("cd", params)
    .then(() => {
      clearInterval(interval);
      log.info('Package linked');
      log.exit();
    })
    .catch((e) => {
      clearInterval(interval);
      log.error('Failed to link package');
      log.error(e);
      log.exit();
    });
}

switch (command) {
  case 'new':
    createProject();
    break;
  case 'clean':
    runProject(['cache', 'clean'], 'Clean cache');
    break;
  case 'rm':
    removeProject();
    break;
  case 'ln':
    linkPackage();
    break;
  default:
    runProject(command, "Run command " + command);
    break;
}
