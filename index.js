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
  let userInput = {command:"init"};
  while (userInput.command != "END" || userInput.command != "end" ) {
    try {
      userInput = await inquirer.awaitUserCommand();
      db.handleInput(userInput.command);
    } catch (err) {
      console.log(chalk.red(err));
    }
  }
};

run();
