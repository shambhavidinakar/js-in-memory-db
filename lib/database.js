const chalk = require("chalk");
class Database {
  constructor() {
    this.database = { entries: {}, valueCount: {} };
    this.transactions = [];
  }

  set(name, value) {
    if (this.database.entries[name] === undefined) {
      this.database.entries[name] = value;
      this.setValueCount(value);
    } else if (this.database.entries[name] !== value) {
      this.adjustValueAndName(name);
      this.database.entries[name] = value;
      this.setValueCount(value);
    }
  }

  setValueCount(value) {
    if (!!this.database.valueCount[value]) {
      this.database.valueCount[value]++;
    } else {
      this.database.valueCount[value] = 1;
    }
  }

  get(name) {
    console.log(this.database.entries[name] || null);
  }

  deleteName(name) {
    if (this.database.entries[name]) {
      this.adjustValueAndName(name);
    }
  }

  count(value) {
    console.log(this.database.valueCount[value] || 0);
  }

  beginTransaction() {
    if (this.transactions.length === 0) {
      this.transactions.push(this.database);
    }
    this.transactions.push({
      valueCount: { ...this.database.valueCount },
      entries: { ...this.database.entries },
    });
    this.database = this.transactions[this.transactions.length - 1];
  }

  rollbackTransaction() {
    if (this.transactions.length > 1) {
      this.transactions.pop();
      this.database = this.transactions.pop();
    } else {
      console.log(chalk.red("TRANSACTION NOT FOUND"));
    }
  }

  commit() {
    if (this.transactions.length > 1) {
      this.database = this.transactions.pop();
      this.transactions = [];
    } else {
      console.log(chalk.red("NOTHING TO COMMIT"));
    }
  }

  adjustValueAndName(name) {
    if (this.database.valueCount[this.database.entries[name]]-- === 0) {
      delete this.database.valueCount[this.database.entries[name]];
    }
    delete this.database.entries[name];
  }

  handleInput(input) {
    const inputRaw = input.split(" ");
    const [action, ...args] = inputRaw;
    switch (action.toUpperCase()) {
      case "SET":
        if (args.length > 2) {
          console.log(
            chalk.red(
              "Invalid Input: the SET command takes a name and a value only."
            )
          );
        }
        const [name, value] = args;
        if (name && value) {
          this.set(name, value);
        } else {
          console.log(
            chalk.red(
              "Invalid Input: the SET command must include a name and a value."
            )
          );
        }
        break;
      case "GET":
        if (args.length !== 1 || !args[0].trim()) {
          console.log(
            chalk.red("Invalid Input: the GET command takes one name.")
          );
        } else this.get(args[0].trim());
        break;
      case "DELETE":
        if (args.length !== 1 || !args[0].trim()) {
          console.log(
            chalk.red("Invalid Input: the DELETE command takes a name only.")
          );
        } else this.deleteName(args[0].trim());
        break;
      case "COUNT":
        if (args.length !== 1 || !args[0].trim()) {
          console.log(
            chalk.red("Invalid Input: the COUNT command takes a value only.")
          );
        } else this.count(args[0].trim());
        break;
      case "BEGIN":
        this.beginTransaction();
        break;
      case "ROLLBACK":
        this.rollbackTransaction();
        break;
      case "COMMIT":
        this.commit();
        break;
      default:
        console.log(chalk.red("Function is not valid."));
    }
  }
}

module.exports = Database;
