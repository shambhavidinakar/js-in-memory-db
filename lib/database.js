const chalk = require("chalk");
class Database {
  constructor() {
    this.database = { entries: {}, valueCount: {} };
    this.transactions = { status: false, transactionToRollBack: [] };
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

  getForRollBack(name) {
    return this.database.entries[name] || null;
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
    if (this.transactions.status)
      console.log(
        chalk.red(
          "Invalid Input: Please commit or rollback current transaction before starting a new one."
        )
      );
    this.transactions.status = true;
  }

  rollbackTransaction() {
    if(!this.transactions.status || this.transactions.transactionToRollBack.length === 0) console.log(
      chalk.red(
        "Nothing to Rollback."
      )
    );
    const command = this.transactions.transactionToRollBack.pop();
    this.transactions.status = false;
    this.handleInput(command);
    this.transactions.status = true;
  }

  commit(){
    if(!this.transactions.status) console.log(
      chalk.red(
        "Nothing to Commit."
      )
    );
    this.transactions.transactionToRollBack =[];
    this.transactions.status = false;
  }

  adjustValueAndName(name) {
    if (this.database.valueCount[this.database.entries[name]]-- === 0) {
      delete this.database.valueCount[this.database.entries[name]];
    }
    delete this.database.entries[name];
  }

  validateArgs(action, args, paramCount) {
    if (paramCount === 2 && args.length !== paramCount) {
      console.log(
        chalk.red(
          "Invalid Input: the " +
            action +
            " command takes a name and a value only."
        )
      );
      return false;
    } else if (paramCount === 1 && args.length !== paramCount && args[0].trim().length === 0)
    {
      console.log(
        chalk.red(
          "Invalid Input: the " +
            action +
            " command command takes one argument only."
        )
      );
      return false;
    }
    return true;
  }

  handleInput(input) {
    const inputRaw = input.split(" ");
    const [action, ...args] = inputRaw;
    switch (action.toUpperCase()) {
      case "SET":
        if (this.validateArgs(action, args, 2)) {
          const [name, value] = args;
          if (this.transactions.status) {
            //check database if name exists 
            const prev_value = this.getForRollBack(args[0].trim())
            if(prev_value !== null) {
              inputRaw[2] = prev_value;
              this.transactions.transactionToRollBack.push(inputRaw.join(" "));
            }else{
              inputRaw[0] = "DELETE";
              this.transactions.transactionToRollBack.push(inputRaw.join(" "));
            }
          }
          if (name && value) {
            this.set(name, value);
          }
        }
        break;
      case "GET":
        if (this.validateArgs(action, args, 1)) this.get(args[0].trim());
        break;
      case "DELETE":
        if (this.validateArgs(action, args, 1)) {
          if (this.transactions.status) {
            inputRaw[0] = "SET";
            inputRaw.push(this.getForRollBack(args[0].trim()));
            this.transactions.transactionToRollBack.push(inputRaw.join(" "));
          }
          this.deleteName(args[0].trim());
          
        }
        break;
      case "COUNT":
        if (this.validateArgs(action, args, 1)) this.count(args[0].trim());
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
