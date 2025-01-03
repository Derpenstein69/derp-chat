module.exports = {
  // Specify the line length that the printer will wrap on.
  printWidth: 80,

  // Specify the number of spaces per indentation-level.
  tabWidth: 2,

  // Indent lines with tabs instead of spaces.
  useTabs: false,

  // Print semicolons at the ends of statements.
  semi: true,

  // Use single quotes instead of double quotes.
  singleQuote: true,

  // Print trailing commas wherever possible when multi-line.
  trailingComma: 'es5',

  // Print spaces between brackets in object literals.
  bracketSpacing: true,

  // Put the `>` of a multi-line JSX element at the end of the last line instead of being alone on the next line.
  jsxBracketSameLine: false,

  // Include parentheses around a sole arrow function parameter.
  arrowParens: 'always',

  // Format only a segment of a file.
  rangeStart: 0,
  rangeEnd: Infinity,

  // Specify which parser to use.
  parser: 'typescript',

  // Specify the file name to use to infer which parser to use.
  filepath: 'none',

  // Require a 'prettierconfig' file to format.
  requirePragma: false,

  // Insert a special @format marker at the top of files specifying that the file has been formatted with prettier.
  insertPragma: false,

  // Wrap prose if it exceeds the print width.
  proseWrap: 'preserve',

  // Specify the global whitespace sensitivity for HTML files.
  htmlWhitespaceSensitivity: 'css',

  // End lines with a newline character.
  endOfLine: 'lf',
};
