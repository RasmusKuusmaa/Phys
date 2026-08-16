/**
 * A tiny arithmetic expression parser/evaluator for formula rearrangements
 * (e.g. "m * a", "sqrt(2 * a * s)"). Deliberately not `eval`/`Function` —
 * expressions ultimately run in the learner's browser, and a hand-rolled
 * evaluator sidesteps both injection risk and CSP `unsafe-eval` issues,
 * even though today's expressions come only from build-time-validated
 * content, not user input.
 */

type TokenType = "number" | "identifier" | "operator" | "lparen" | "rparen" | "comma";
type Token = { type: TokenType; value: string };

const FUNCTIONS: Record<string, (...args: number[]) => number> = {
  sqrt: Math.sqrt,
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  abs: Math.abs,
  ln: Math.log,
  log10: Math.log10,
  exp: Math.exp,
  pow: (a, b) => Math.pow(a, b),
  min: (...args) => Math.min(...args),
  max: (...args) => Math.max(...args),
};

function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < source.length) {
    const ch = source[i];
    if (/\s/.test(ch)) {
      i++;
    } else if (/[0-9.]/.test(ch)) {
      let j = i;
      while (j < source.length && /[0-9.]/.test(source[j])) j++;
      tokens.push({ type: "number", value: source.slice(i, j) });
      i = j;
    } else if (/[A-Za-z_]/.test(ch)) {
      let j = i;
      while (j < source.length && /[A-Za-z0-9_]/.test(source[j])) j++;
      tokens.push({ type: "identifier", value: source.slice(i, j) });
      i = j;
    } else if ("+-*/^".includes(ch)) {
      tokens.push({ type: "operator", value: ch });
      i++;
    } else if (ch === "(") {
      tokens.push({ type: "lparen", value: ch });
      i++;
    } else if (ch === ")") {
      tokens.push({ type: "rparen", value: ch });
      i++;
    } else if (ch === ",") {
      tokens.push({ type: "comma", value: ch });
      i++;
    } else {
      throw new Error(`Unexpected character "${ch}" in expression: ${source}`);
    }
  }
  return tokens;
}

type Node =
  | { type: "number"; value: number }
  | { type: "identifier"; name: string }
  | { type: "call"; name: string; args: Node[] }
  | { type: "unary"; op: "-"; operand: Node }
  | { type: "binary"; op: "+" | "-" | "*" | "/" | "^"; left: Node; right: Node };

class Parser {
  private tokens: Token[];
  private pos = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private consume(type: TokenType): Token {
    const token = this.tokens[this.pos];
    if (!token || token.type !== type) {
      throw new Error(`Expected ${type} but got ${token ? `${token.type} "${token.value}"` : "end of expression"}`);
    }
    this.pos++;
    return token;
  }

  parseExpression(): Node {
    const node = this.parseAdditive();
    if (this.pos !== this.tokens.length) {
      throw new Error(`Unexpected trailing token "${this.peek()?.value}"`);
    }
    return node;
  }

  private parseAdditive(): Node {
    let left = this.parseMultiplicative();
    while (this.peek()?.type === "operator" && (this.peek()!.value === "+" || this.peek()!.value === "-")) {
      const op = this.consume("operator").value as "+" | "-";
      const right = this.parseMultiplicative();
      left = { type: "binary", op, left, right };
    }
    return left;
  }

  private parseMultiplicative(): Node {
    let left = this.parsePower();
    while (this.peek()?.type === "operator" && (this.peek()!.value === "*" || this.peek()!.value === "/")) {
      const op = this.consume("operator").value as "*" | "/";
      const right = this.parsePower();
      left = { type: "binary", op, left, right };
    }
    return left;
  }

  private parsePower(): Node {
    const left = this.parseUnary();
    if (this.peek()?.type === "operator" && this.peek()!.value === "^") {
      this.consume("operator");
      const right = this.parsePower(); // right-associative
      return { type: "binary", op: "^", left, right };
    }
    return left;
  }

  private parseUnary(): Node {
    if (this.peek()?.type === "operator" && this.peek()!.value === "-") {
      this.consume("operator");
      return { type: "unary", op: "-", operand: this.parseUnary() };
    }
    return this.parsePrimary();
  }

  private parsePrimary(): Node {
    const token = this.peek();
    if (!token) throw new Error("Unexpected end of expression");

    if (token.type === "number") {
      this.consume("number");
      return { type: "number", value: parseFloat(token.value) };
    }
    if (token.type === "lparen") {
      this.consume("lparen");
      const node = this.parseAdditive();
      this.consume("rparen");
      return node;
    }
    if (token.type === "identifier") {
      this.consume("identifier");
      if (this.peek()?.type === "lparen") {
        this.consume("lparen");
        const args: Node[] = [];
        if (this.peek()?.type !== "rparen") {
          args.push(this.parseAdditive());
          while (this.peek()?.type === "comma") {
            this.consume("comma");
            args.push(this.parseAdditive());
          }
        }
        this.consume("rparen");
        return { type: "call", name: token.value, args };
      }
      return { type: "identifier", name: token.value };
    }
    throw new Error(`Unexpected token "${token.value}"`);
  }
}

export function parseExpression(source: string): Node {
  return new Parser(tokenize(source)).parseExpression();
}

export function evaluateExpression(node: Node, scope: Record<string, number>): number {
  switch (node.type) {
    case "number":
      return node.value;
    case "identifier": {
      const value = scope[node.name];
      if (value === undefined) throw new Error(`Unbound identifier "${node.name}"`);
      return value;
    }
    case "unary":
      return -evaluateExpression(node.operand, scope);
    case "binary": {
      const left = evaluateExpression(node.left, scope);
      const right = evaluateExpression(node.right, scope);
      switch (node.op) {
        case "+":
          return left + right;
        case "-":
          return left - right;
        case "*":
          return left * right;
        case "/":
          return left / right;
        case "^":
          return Math.pow(left, right);
      }
      break;
    }
    case "call": {
      const fn = FUNCTIONS[node.name];
      if (!fn) throw new Error(`Unknown function "${node.name}"`);
      return fn(...node.args.map((arg) => evaluateExpression(arg, scope)));
    }
  }
}

export function evaluate(source: string, scope: Record<string, number>): number {
  return evaluateExpression(parseExpression(source), scope);
}

/** Returns the free identifiers referenced by an expression, excluding known function names. */
export function expressionIdentifiers(source: string): string[] {
  const names = new Set<string>();
  function walk(node: Node) {
    if (node.type === "identifier") names.add(node.name);
    else if (node.type === "unary") walk(node.operand);
    else if (node.type === "binary") {
      walk(node.left);
      walk(node.right);
    } else if (node.type === "call") {
      node.args.forEach(walk);
    }
  }
  walk(parseExpression(source));
  return [...names];
}
