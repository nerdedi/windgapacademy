/**
 * ExpressionParser - Mathematical expression parsing and evaluation
 *
 * This module provides utilities for parsing, evaluating, and formatting
 * mathematical expressions. It's designed to work with React components
 * and modern JavaScript.
 *
 * Portions of this file were adapted from Khan Academy's khan-exercises
 * repository (https://github.com/Khan/khan-exercises)
 */

import * as math from "./mathUtils";

/**
 * Types of tokens in an expression
 */
export enum TokenType {
  NUMBER,
  OPERATOR,
  FUNCTION,
  VARIABLE,
  LEFT_PAREN,
  RIGHT_PAREN,
  COMMA,
}

/**
 * Represents a token in a mathematical expression
 */
interface Token {
  type: TokenType;
  value: string;
  precedence?: number;
}

/**
 * Operator precedence values
 */
const PRECEDENCE = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2,
  "^": 3,
};

/**
 * Supported mathematical functions
 */
const MATH_FUNCTIONS = [
  "sin",
  "cos",
  "tan",
  "asin",
  "acos",
  "atan",
  "sqrt",
  "log",
  "ln",
  "abs",
  "max",
  "min",
];

/**
 * Format a number for display
 */
export function formatNumber(num: number): string {
  if (Number.isInteger(num)) {
    return num.toString();
  }
  // Remove trailing zeros
  return num.toFixed(10).replace(/\.?0+$/, "");
}

/**
 * Format a fraction for display
 */
export function formatFraction(numerator: number, denominator: number): string {
  if (denominator === 1) {
    return formatNumber(numerator);
  }
  return `\\frac{${numerator}}{${denominator}}`;
}

/**
 * Clean up a math expression for display
 */
export function cleanMath(expr: string): string {
  return expr
    .replace(/\+\s*-/g, "- ")
    .replace(/-\s*-/g, "+ ")
    .replace(/\^\s*1(?!\d)/g, "");
}

/**
 * Tokenize a mathematical expression string
 */
export function tokenize(expression: string): Token[] {
  const tokens: Token[] = [];
  const regex = /(\d+(\.\d+)?)|([+\-*/^()])|([a-zA-Z][a-zA-Z0-9]*)|,/g;
  let match;

  while ((match = regex.exec(expression)) !== null) {
    const value = match[0].trim();
    if (!value) continue;

    // Determine token type
    if (match[1]) {
      // Number
      tokens.push({ type: TokenType.NUMBER, value });
    } else if (match[3]) {
      // Operator or parentheses
      if (value === "(") {
        tokens.push({ type: TokenType.LEFT_PAREN, value });
      } else if (value === ")") {
        tokens.push({ type: TokenType.RIGHT_PAREN, value });
      } else {
        tokens.push({
          type: TokenType.OPERATOR,
          value,
          precedence: PRECEDENCE[value as keyof typeof PRECEDENCE] || 0,
        });
      }
    } else if (match[4]) {
      // Variable or function
      if (MATH_FUNCTIONS.includes(value)) {
        tokens.push({ type: TokenType.FUNCTION, value });
      } else {
        tokens.push({ type: TokenType.VARIABLE, value });
      }
    } else if (value === ",") {
      tokens.push({ type: TokenType.COMMA, value });
    }
  }

  return tokens;
}

/**
 * Convert from infix notation to postfix (Reverse Polish Notation)
 */
export function toPostfix(tokens: Token[]): Token[] {
  const output: Token[] = [];
  const operators: Token[] = [];

  for (const token of tokens) {
    switch (token.type) {
      case TokenType.NUMBER:
      case TokenType.VARIABLE:
        output.push(token);
        break;

      case TokenType.FUNCTION:
        operators.push(token);
        break;

      case TokenType.COMMA:
        // Pop operators until we see a left parenthesis
        while (
          operators.length > 0 &&
          operators[operators.length - 1].type !== TokenType.LEFT_PAREN
        ) {
          output.push(operators.pop()!);
        }
        break;

      case TokenType.OPERATOR:
        while (operators.length > 0) {
          const topOp = operators[operators.length - 1];
          if (
            topOp.type !== TokenType.OPERATOR ||
            topOp.type === TokenType.LEFT_PAREN ||
            (token.precedence || 0) > (topOp.precedence || 0)
          ) {
            break;
          }
          output.push(operators.pop()!);
        }
        operators.push(token);
        break;

      case TokenType.LEFT_PAREN:
        operators.push(token);
        break;

      case TokenType.RIGHT_PAREN:
        // Pop operators until we see a left parenthesis
        while (
          operators.length > 0 &&
          operators[operators.length - 1].type !== TokenType.LEFT_PAREN
        ) {
          output.push(operators.pop()!);
        }
        // Pop the left parenthesis
        if (operators.length > 0 && operators[operators.length - 1].type === TokenType.LEFT_PAREN) {
          operators.pop();
        }
        // If there's a function before the parenthesis, pop it too
        if (operators.length > 0 && operators[operators.length - 1].type === TokenType.FUNCTION) {
          output.push(operators.pop()!);
        }
        break;
    }
  }

  // Pop any remaining operators
  while (operators.length > 0) {
    output.push(operators.pop()!);
  }

  return output;
}

/**
 * Evaluate a postfix expression
 */
export function evaluatePostfix(tokens: Token[], variables: Record<string, number> = {}): number {
  const stack: number[] = [];

  for (const token of tokens) {
    switch (token.type) {
      case TokenType.NUMBER:
        stack.push(parseFloat(token.value));
        break;

      case TokenType.VARIABLE:
        if (token.value in variables) {
          stack.push(variables[token.value]);
        } else if (token.value === "pi" || token.value === "π") {
          stack.push(Math.PI);
        } else if (token.value === "e") {
          stack.push(Math.E);
        } else {
          throw new Error(`Undefined variable: ${token.value}`);
        }
        break;

      case TokenType.OPERATOR:
        if (stack.length < 2) {
          throw new Error("Not enough operands for operator: " + token.value);
        }
        const b = stack.pop()!;
        const a = stack.pop()!;

        switch (token.value) {
          case "+":
            stack.push(a + b);
            break;
          case "-":
            stack.push(a - b);
            break;
          case "*":
            stack.push(a * b);
            break;
          case "/":
            stack.push(a / b);
            break;
          case "^":
            stack.push(Math.pow(a, b));
            break;
          default:
            throw new Error("Unknown operator: " + token.value);
        }
        break;

      case TokenType.FUNCTION:
        if (stack.length < 1) {
          throw new Error("Not enough arguments for function: " + token.value);
        }

        const arg = stack.pop()!;
        switch (token.value) {
          case "sin":
            stack.push(Math.sin(arg));
            break;
          case "cos":
            stack.push(Math.cos(arg));
            break;
          case "tan":
            stack.push(Math.tan(arg));
            break;
          case "asin":
            stack.push(Math.asin(arg));
            break;
          case "acos":
            stack.push(Math.acos(arg));
            break;
          case "atan":
            stack.push(Math.atan(arg));
            break;
          case "sqrt":
            stack.push(Math.sqrt(arg));
            break;
          case "log":
            stack.push(Math.log10(arg));
            break;
          case "ln":
            stack.push(Math.log(arg));
            break;
          case "abs":
            stack.push(Math.abs(arg));
            break;
          default:
            throw new Error("Unknown function: " + token.value);
        }
        break;
    }
  }

  if (stack.length !== 1) {
    throw new Error("Invalid expression");
  }

  return stack[0];
}

/**
 * Evaluate a mathematical expression string
 */
export function evaluateExpression(
  expression: string,
  variables: Record<string, number> = {},
): number {
  const tokens = tokenize(expression);
  const postfix = toPostfix(tokens);
  return evaluatePostfix(postfix, variables);
}

/**
 * Convert an expression to LaTeX format for display
 */
export function expressionToLaTeX(expression: string): string {
  // This is a simplified version - a real implementation would parse the expression
  // and convert it to proper LaTeX notation
  return expression
    .replace(/\*/g, "\\cdot ")
    .replace(/\//g, "\\div ")
    .replace(/\^/g, "^{")
    .replace(/\^{(\d+|[a-zA-Z])/g, "^{$1}")
    .replace(/pi|π/g, "\\pi ")
    .replace(/sqrt\(/g, "\\sqrt{")
    .replace(/sin\(/g, "\\sin(")
    .replace(/cos\(/g, "\\cos(")
    .replace(/tan\(/g, "\\tan(")
    .replace(/ln\(/g, "\\ln(")
    .replace(/log\(/g, "\\log(");
}

/**
 * Generate a random mathematical expression
 */
export function generateExpression(
  options: {
    maxTerms?: number;
    operations?: string[];
    variables?: string[];
    maxCoefficient?: number;
    allowNegative?: boolean;
  } = {},
): string {
  const {
    maxTerms = 3,
    operations = ["+", "-", "*"],
    variables = ["x", "y"],
    maxCoefficient = 10,
    allowNegative = true,
  } = options;

  const terms = Math.floor(Math.random() * maxTerms) + 1;
  let expression = "";

  for (let i = 0; i < terms; i++) {
    if (i > 0) {
      expression += " " + math.shuffle(operations)[0] + " ";
    }

    const coefficient = Math.floor(Math.random() * maxCoefficient) + 1;
    let sign = "";

    if (allowNegative && Math.random() < 0.3) {
      sign = "-";
    }

    if (Math.random() < 0.5 || variables.length === 0) {
      // Just a number
      expression += sign + coefficient;
    } else {
      // Coefficient and variable
      const variable = math.shuffle(variables)[0];
      if (coefficient === 1) {
        expression += sign + variable;
      } else {
        expression += sign + coefficient + variable;
      }
    }
  }

  return expression;
}
