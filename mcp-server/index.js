// Minimal MCP-compatible server (stdio) for local testing
// This is a stub that echoes back received JSON-RPC-like messages.
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

function send(obj) {
  const s = JSON.stringify(obj);
  process.stdout.write(s + "\n");
}

rl.on("line", (line) => {
  try {
    const req = JSON.parse(line);
    // echo method and id
    const res = {
      jsonrpc: "2.0",
      id: req.id || null,
      result: { echo: req.method || "noop", params: req.params || null },
    };
    send(res);
  } catch (err) {
    send({ jsonrpc: "2.0", error: { message: "invalid json" } });
  }
});

// announce readiness
send({ jsonrpc: "2.0", method: "mcp.server.ready" });
