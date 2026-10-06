// Just a snippet to test syntax
const code = `
function findStepText(root) {
  if (!root) return null;
  
  // check text nodes
  if (root.nodeType === 3) {
    const match = root.textContent.match(/step\\s+\\d+\\s+of\\s+(\\d+)/i);
    if (match) return parseInt(match[1], 10);
  }
  
  // check shadow DOM
  if (root.shadowRoot) {
    const res = findStepText(root.shadowRoot);
    if (res) return res;
  }
  
  // check children
  for (const child of root.childNodes) {
    const res = findStepText(child);
    if (res) return res;
  }
  return null;
}
`;
console.log("Syntax ok");
