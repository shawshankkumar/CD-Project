const esprima = require('esprima');

function analyzeTokens(code) {
  const ast = esprima.parseScript(code);
  const tokens = [];
  
  function traverse(node) {
    if (node.type === 'Identifier') {
      tokens.push({ type: 'Variable', value: node.name });
    } else if (node.type === 'Literal') {
      tokens.push({ type: 'Literal', value: node.value });
    } else if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
      tokens.push({ type: 'Function', value: node.id ? node.id.name : 'anonymous' });
    } else if (node.type === 'WhileStatement' || node.type === 'DoWhileStatement') {
      tokens.push({ type: 'Loop', value: 'while' });
    } else if (node.type === 'ForStatement') {
      tokens.push({ type: 'Loop', value: 'for' });
    } else if (node.type === 'ForInStatement') {
      tokens.push({ type: 'Loop', value: 'for...in' });
    } else if (node.type === 'ForOfStatement') {
      tokens.push({ type: 'Loop', value: 'for...of' });
    }
    
    for (const key in node) {
      if (node[key] && typeof node[key] === 'object') {
        traverse(node[key]);
      }
    }
  }
  
  traverse(ast);
  return tokens;
}

// Example usage
const code = `
  function add(a, b) {
    return a + b;
  }
  
  const num1 = 5;
  const num2 = 3;
  let sum = add(num1, num2);
  
  for (let i = 0; i < 5; i++) {
    console.log(i);
  }
`;

const tokens = analyzeTokens(code);

tokens.forEach(token => {
  const { type, value } = token;
  console.log(`Type: ${type}, Value: ${value}`);
});
