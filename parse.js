import { Marked, Lexer, Parser } from './vendor/marked/marked.esm.js';

const engine = new Marked();
const lexer = new Lexer(engine.defaults);
const parser = new Parser(engine.defaults);

export function parse(markdown) {
  lexer.tokens = [];
  lexer.tokens.links = Object.create(null);
  lexer.inlineQueue = [];
  lexer.state = {
    inLink: false,
    inRawBlock: false,
    linkEmitted: false,
    linkParenPossible: true,
    top: true,
  };

  const source = markdown.replace(/\r\n?/g, '\n');
  lexer.blockTokens(source, lexer.tokens);
  const queue = lexer.inlineQueue;
  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    lexer.inlineTokens(item.src, item.tokens);
  }
  return parser.parse(lexer.tokens);
}
