#!/usr/bin/env node

const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const database = require("./lib/database");
const inquirer = require("./lib/inquirer");

clear();

console.log(
  chalk.yellow(
    figlet.textSync("In-Memory Database", { horizontalLayout: "full" })
  )
);

const run = async () => {
  const db = new database();
  let userInput = { command: "init" };
  while (true) {
    try {
      userInput = await inquirer.awaitUserCommand();
      if (userInput.command.toUpperCase().trim() === "END") break;
      db.handleInput(userInput.command);
    } catch (err) {
      console.log(chalk.red(err));
    }
  }
};

run();
