const text = "Some header\nStep 1 of 3\nFooter";
const match = text.match(/step\s+\d+\s+of\s+(\d+)/i);
console.log(match ? parseInt(match[1], 10) : null);
