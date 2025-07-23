// logger.js
const path = require('path');

const COLORS = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  gray: "\x1b[90m",
};

const getTime = () => `${COLORS.gray}[${new Date().toISOString()}]${COLORS.reset}`;

/**
 * Returns the path.basename of the file that called the logger
 * (i.e. the file that called one of the logger functions).
 * If the caller file cannot be determined, returns 'unknown'.
 *
 * Note: This relies on the V8 engine's Error.prototype.stack property.
 * This property is not part of the ECMA spec, so it may not work in all
 * environments.
 */
function getCallerFile() {
  const err = new Error();
  const stackLines = err.stack?.split("\n");

  if (stackLines && stackLines.length > 3) {
    const callerLine = stackLines[3]; // line that called logger
    const match = callerLine.match(/\(([^)]+)\)/); // extract (filePath:line:col)
    if (match && match[1]) {
      const fullPath = match[1].split(":")[0]; // remove :line:col
      return path.basename(fullPath);
    }
  }
  return;
}

function formatError(err) {
  if (err instanceof Error) {
    return `${err.message}\n${err.stack}`;
  }
  return err;
}

const logger = {
  info: (...args) => {
    const file = getCallerFile();
    console.log(`${COLORS.green}[INFO]${COLORS.reset} ${getTime()} [${file}]`, ...args);
  },
  warn: (...args) => {
    const file = getCallerFile();
    console.warn(`${COLORS.yellow}[WARN]${COLORS.reset} ${getTime()} [${file}]`, ...args);
  },
  error: (...args) => {
    const formattedArgs = args.map(arg =>
      arg instanceof Error ? formatError(arg) : arg
    );
    // Apply red color only to the message, not timestamp or file
    console.error(`${COLORS.red}[ERROR]`, ...formattedArgs, COLORS.reset);
  },
};


module.exports = logger;
