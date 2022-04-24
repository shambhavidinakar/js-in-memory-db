const inquirer = require('inquirer');

module.exports = {
  awaitUserCommand: () => {
    const question = [
      {
        name: 'command',
        type: 'input',
        message: 'Enter your database request:',
        validate: function( value ) {
          if (value.length) {
            return true;
          } else {
            return 'Please enter a valid database request.';
          }
        }
      }
    ];
    return inquirer.prompt(question);
  },
}