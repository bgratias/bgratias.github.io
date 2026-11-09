// University of London BSc Computer Science
// Algorithms and Data Structures II
// Mid-term coursework - Due July 8, 2024

// Postfix++
// Implement a Postfix++ Interpreter to evaluate Postfix code with variables

////////////////////////////////////////
// Dependancies
////////////////////////////////////////
// "prompt-sync": "^4.2.0" to accept user input from command line
const prompt = require("prompt-sync")({ sigint: true });

////////////////////////////////////////
// Custom Data Structures
////////////////////////////////////////
/**
 * Represents a symbol table data structure for storing variable values.
 */
class SymbolTable {
  /**
   * Creates a symbol table of a given size.
   * @param {number} size - The size of the symbol table.
   */
  constructor(size) {
    this.symbolTable = new Array(size).fill(undefined);
    // set initial hash value to be stored at index 0
    // in this case the initial hash value is the ASCII value for 'A'
    this.charCodeOffset = "A".charCodeAt(0);
  }

  /**
   * Calculates the hash value for a given variable.
   * @param {string} variableName - The name of the variable.
   * @returns {number} The hash value of the variable name.
   */
  getHashValue(string) {
    // use ASCII value of Variable name to determine an index
    const hashValue = string.charCodeAt(0) - this.charCodeOffset;
    return hashValue;
  }

  /**
   * Retrieves the location for a given variable and stores the given
   * value to that location in the symbol table.
   * @param {string} variableName - The name of the variable.
   * @param {number} value - The value to set for the variable.
   */
  set(variableName, value) {
    const index = this.getHashValue(variableName);
    this.symbolTable[index] = value;
  }

  /**
   * Retrieves the location for a given variable and reads the
   * value from that location in the symbol table.
   * @param {string} variableName - The name of the variable.
   * @returns {number} The value of the variable.
   */
  get(variableName) {
    const index = this.getHashValue(variableName);
    const variableValue = this.symbolTable[index];

    // log an error if the variable has not been assigned a value
    if (variableValue == undefined) {
      consoleLogYellow("Variable " + variableName + " undefined.");
    }

    return variableValue;
  }
}

/**
 * Represents a stack data structure.
 */
class Stack {
  /**
   * Create a new Stack and set its length to zero
   */
  constructor() {
    this.stack = new Array();
    this.length = 0;
  }

  /**
   * Adds an element to the top of the stack.
   * @param {*} element - The element to be pushed onto the stack.
   */
  push(element) {
    this.stack[this.length] = element;
    this.length += 1;
  }

  /**
   * Removes and returns the top element from the stack.
   * @returns {*} The top element of the stack.
   */
  pop() {
    if (this.length > 0) {
      const element = this.stack.splice(-1, 1)[0];
      this.length -= 1;
      return element;
    }
  }

  /**
   * Returns the top element without removing it from the stack.
   * @returns {*} The top element of the stack.
   */
  peek() {
    return this.stack[this.length - 1];
  }

  /**
   * Prints the stack elements.
   */
  print() {
    // pop entire stack and push onto a temporary stack
    let tempStack = new Stack();
    while (this.length > 0) {
      tempStack.push(this.pop());
    }
    // pop temporary stack elements and push back onto the stack
    let stackString = "";
    while (tempStack.length > 0) {
      const element = tempStack.pop();
      this.push(element);
      // add each element to a string with commas
      stackString += element + ",";
    }
    // strip the last comma
    stackString = stackString.slice(0, -1);

    // output the string
    consoleLogCyan("[ " + stackString + " ]");
  }

  /**
   * Clear the stack.
   */
  purge() {
    // pop all elements off the stack
    while (this.length > 0) {
      this.pop();
    }
  }
}

////////////////////////////////////////
// Initialization
////////////////////////////////////////
const variableTable = new SymbolTable(26);
let executionStack = new Stack();

let runningState = true;
let evaluationFailure = false;

main();

////////////////////////////////////////
// Main
////////////////////////////////////////
function main() {
  printInstructions();

  while (runningState == true) {
    const postfixExpression = getExpression();
    evaluateTokens(postfixExpression);
    printResult();
    reset();
  }
}

/**
 * Prints instructions for using the Postfix++ interpreter.
 */
function printInstructions() {
  console.log("\x1b[36m"); // set console text colour to cyan
  console.log("\nPostfix++ Interpreter Instructions:");
  console.error("===================================");
  console.log("Postfix expressions consist of two operands and an operator separated by spaces.");
  console.log("Multiple expressions can be chained together.\n");
  console.log("Available operations are:");
  console.log("  '+' Addition                    6 2 +    [ 8 ]");
  console.log("  '-' Subtraction                 6 2 -    [ 4 ]");
  console.log("  '*' Multiplication              6 2 *    [ 12 ]");
  console.log("  '/' Division                    6 2 /    [ 3 ]");
  console.log("  '%' Modulation                  6 2 %    [ 0 ]");
  console.log("  '^' Exponentiation              6 2 ^    [ 36 ]");
  console.log("  'log' Logarithmization          6 36 log [ 2 ]\n");
  console.log("Expressions can contain variables named A-Z.");
  console.log("  '=' Variable Assignment         A 2 =");
  console.log("  A-Z return variable value       A        [ 2 ]\n");
  console.log("Enter 'q' to quit.\n");
  console.log("\x1b[0m"); // reset console text colour to white
}

/**
 * Retrieves a Postfix expression from the user.
 * Parses this expression into an array of tokens.
 * @returns {string[]} The parsed Postfix expression.
 */
function getExpression() {
  // get user expression from the command line
  const userExpression = getCommandLineInput();
  // send the user expression string to be parsed into tokens
  const parsedExpression = parseInput(userExpression);
  // return an array of the tokens
  return parsedExpression;
}

/**
 * Obtains user input from the command line.
 * @returns {string} The user input.
 */
function getCommandLineInput() {
  let userInput = "";
  // Keep asking until the user gives us some input
  while (userInput == "") {
    userInput = prompt("Postfix Expression > ");
    // trim any whitespace characters off the end
    userInput = userInput.trimEnd();
  }
  return userInput;
}

/**
 * Parses the user input into an expression.
 * @param {string} userInput - The input from the user.
 * @returns {string[]} The parsed input as an array of tokens.
 */
function parseInput(userInput) {
  let token = "";
  let parsedExpression = [];

  // add a space to mark the end of the final token
  userInput += " ";

  // iterate over each character of the userInput string
  for (let character of userInput) {
    // tokenize the string using space as the delimiter
    if (character == " ") {
      // only create a token if it contains characters
      if (token != "") {
        parsedExpression.push(token);
        token = "";
      }
    } else {
      token += character;
    }
  }

  return parsedExpression;
}

/**
 * Evaluates the tokens of a Postfix expression.
 * @param {string[]} expression - The Postfix expression to evaluate.
 */
function evaluateTokens(expression) {
  // take action on each token in the expression
  for (let token of expression) {
    switch (true) {
      // if its an operand, push onto the execution stack
      case isOperand(token):
        executionStack.push(Number(token));
        break;

      // if its a variable, push it onto the execution stack
      case isVariable(token):
        executionStack.push(token);
        break;

      // if its an operator, then execute the operation
      case isOperator(token):
        executeOperation(token);
        break;

      // if its a variable assignment, then execute the assignment
      case isAssignment(token):
        executeAssignment();
        break;

      // if the token is q, then set a flag to quit the program
      case token == "q":
        runningState = false;
        break;

      // if the token is empty, take no action
      case isEmpty(token):
        break;

      // if a token does not match any above patterns, flag as failed
      default:
        consoleLogYellow("Expression token '" + token + "' is invalid.");
        evaluationFailure = true;
    }

    // If there has been an evaluation failure then stop evaluating tokens
    if (evaluationFailure) {
      break;
    }
  }
}

/**
 * Executes a single Postfix operation.
 * @param {string} token - The operator token.
 */
function executeOperation(token) {
  // pop two operands off the execution stack
  let operand1 = executionStack.pop();
  let operand2 = executionStack.pop();
  let result = undefined;

  // if either operand is a variable, then instantiate
  if (isVariable(operand1)) {
    operand1 = variableTable.get(operand1);
  }
  if (isVariable(operand2)) {
    operand2 = variableTable.get(operand2);
  }

  // if either operand is NOT an operand, then flag a failure
  if (!isOperand(operand1) || !isOperand(operand2)) {
    consoleLogYellow("Invalid operand.");
    evaluationFailure = true;
    return;
  }

  // select the mathematical operation based on the operator token
  // evaluate the operation and push the result onto the execution stack
  switch (token) {
    case "+": // addition
      result = operand2 + operand1;
      break;

    case "-": // subtraction
      result = operand2 - operand1;
      break;

    case "*": // multiplication
      result = operand2 * operand1;
      break;

    case "/": // division
      if (operand1 == 0) {
        consoleLogYellow("Division by zero cannot be defined.");
        evaluationFailure = true;
        return;
      }
      result = operand2 / operand1;
      break;

    case "%": // modulation
      if (operand1 == 0) {
        consoleLogYellow("Modulo zero cannot be defined.");
        evaluationFailure = true;
        return;
      }
      result = operand2 % operand1;
      break;

    case "^": // exponentiation
      result = operand2 ** operand1;
      break;

    case "log": // logarithmization
      const logBase = operand2;
      if (logBase == 0 || logBase == 1) {
        consoleLogYellow("Logarithm base " + logBase + " cannot be defined.");
        evaluationFailure = true;
        return;
      }
      if (operand1 < 0 || logBase < 0) {
        consoleLogYellow("Logarithm of negative numbers cannot be defined.");
        evaluationFailure = true;
        return;
      }
      result = Math.log(operand1) / Math.log(logBase);
      break;

    default:
      consoleLogYellow("Unknown Operator.");
      evaluationFailure = true;
      return;
  }
  // push the result onto the execution stack
  executionStack.push(result);
}

/**
 * Assigns a value to a variable.
 */
function executeAssignment() {
  // pop operand and variable name off the execution stack
  let operand1 = executionStack.pop();
  const variableName = executionStack.pop();

  // if operand is a variable then instantiate
  if (isVariable(operand1)) {
    operand1 = variableTable.get(operand1);
  }

  // if the variable name is not valid, flag a failure
  if (!isVariable(variableName) || !isOperand(operand1)) {
    consoleLogYellow("Invalid variable assignment expression.");
    evaluationFailure = true;
    return;
  }

  // store the operand in the variableTable
  variableTable.set(variableName, operand1);
}

/**
 * output the result of the Postfix expression evaluation.
 */
function printResult() {
  // check if there were any evaluation failures
  if (evaluationFailure) {
    consoleLogYellow("Postfix expression can not be evaluated.");
  }
  // check if there are too many tokens on the stack
  else if (executionStack.length > 1) {
    consoleLogYellow("Missing operator. Postfix expression cannot be evaluated.");
  }
  // if the final token is a variable Name, instantiate it
  else {
    if (isVariable(executionStack.peek())) {
      const variableName = executionStack.pop();
      const variableValue = variableTable.get(variableName);
      executionStack.push(variableValue);
    }
    // output the execution stack
    executionStack.print();
  }
  console.log();
}

/**
 * reset for a new Postfix expression
 */
function reset() {
  // clear failure flag
  evaluationFailure = false;

  // clear the execution stack
  executionStack.purge();
}

/**
 * Output cyan coloured text to the console.
 * @param {string} outputString - the string to be printed.
 */
function consoleLogCyan(outputString) {
  const colourCyan = "\x1b[36m";
  const colourWhite = "\x1b[0m";
  console.log(colourCyan, outputString, colourWhite);
}

/**
 * Output yellow coloured text to the console.
 * @param {string} outputString - the string to be printed.
 */
function consoleLogYellow(outputString) {
  const colourYellow = "\x1b[33m";
  const colourWhite = "\x1b[0m";
  console.log(colourYellow, outputString, colourWhite);
}

////////////////////////////////////////
// String Validation functions
////////////////////////////////////////

/**
 * Checks if a string is a numerical operand.
 * It may be positive or negative and any number of decimal places.
 * @param {string} string - The string to check.
 * @returns {boolean} True if the string is an operand, false otherwise.
 */
function isOperand(string) {
  return /^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(string);
}

/**
 * Checks if a string is one only of the supported mathematical operators.
 * @param {string} string - The string to check.
 * @returns {boolean} True if the string is an operator, false otherwise.
 */
function isOperator(string) {
  return /^[+*%^\-/]$/.test(string) || string == "log";
}

/**
 * Checks if a string is a variable name of one only uppercase A-Z
 * @param {string} string - The string to check.
 * @returns {boolean} True if the string is a variable, false otherwise.
 */
function isVariable(string) {
  return /^[A-Z]$/.test(string);
}

/**
 * Checks if a string is an assignment operator '='.
 * @param {string} string - The string to check.
 * @returns {boolean} True if the string is an assignment operator, false otherwise.
 */
function isAssignment(string) {
  return /^[=]$/.test(string);
}

/**
 * Checks if a string is empty.
 * @param {string} string - The string to check.
 * @returns {boolean} True if the string is empty, false otherwise.
 */
function isEmpty(string) {
  return string.length == 0;
}
