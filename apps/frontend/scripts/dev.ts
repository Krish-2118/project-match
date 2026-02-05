import { spawn } from "node:child_process";
import fs from "node:fs";
import * as net from "node:net";
import path from "node:path";

function parseDotenvFile(contents: string): Record<string, string> {
  const env: Record<string, string> = {};
  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex <= 0) continue;

    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key) env[key] = value;
  }
  return env;
}

function loadRepoRootEnv(): Record<string, string> {
  const envPath = path.join(process.cwd(), "../..", ".env");
  try {
    if (!fs.existsSync(envPath)) return {};
    const contents = fs.readFileSync(envPath, "utf8");
    return parseDotenvFile(contents);
  } catch {
    return {};
  }
}

function extractPidFromLock(contents: string): number | null {
  const trimmed = contents.trim();
  if (!trimmed) return null;

  const asNumber = Number.parseInt(trimmed, 10);
  if (Number.isFinite(asNumber)) return asNumber;

  try {
    const json = JSON.parse(trimmed) as unknown;
    if (typeof json === "object" && json !== null && "pid" in json) {
      const pidValue = (json as { pid?: unknown }).pid;
      if (typeof pidValue === "number" && Number.isFinite(pidValue)) return pidValue;
      if (typeof pidValue === "string") {
        const pidFromString = Number.parseInt(pidValue, 10);
        if (Number.isFinite(pidFromString)) return pidFromString;
      }
    }
  } catch {
    // ignore
  }

  const pidMatch = trimmed.match(/\bpid\b[^0-9]*([0-9]{1,10})\b/i);
  if (pidMatch?.[1]) {
    const pid = Number.parseInt(pidMatch[1], 10);
    if (Number.isFinite(pid)) return pid;
  }

  const anyNumberMatch = trimmed.match(/\b([0-9]{1,10})\b/);
  if (anyNumberMatch?.[1]) {
    const pid = Number.parseInt(anyNumberMatch[1], 10);
    if (Number.isFinite(pid)) return pid;
  }

  return null;
}

function isPidRunning(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function ensureNoStaleNextLock(hintPort: number) {
  const lockPath = path.join(process.cwd(), ".next", "dev", "lock");
  if (!fs.existsSync(lockPath)) return;

  try {
    const stat = fs.statSync(lockPath);
    if (stat.isDirectory()) {
      try {
        fs.rmSync(lockPath, { recursive: true });
        console.log(`[frontend] Removed stale Next dev lock directory: ${lockPath}`);
        return;
      } catch {
        console.error(
          `[frontend] Next dev lock directory exists and could not be removed: ${lockPath}\nAnother instance may be running. Stop it and retry.`,
        );
        process.exit(1);
      }
    }
  } catch {
    // ignore stat issues and fall through
  }

  let contents = "";
  try {
    contents = fs.readFileSync(lockPath, "utf8");
  } catch (error) {
    const code = (error as NodeJS.ErrnoException | undefined)?.code;
    console.error(
      `[frontend] Next dev lock is currently in use (${code ?? "unknown"}): ${lockPath}\n` +
        `Another Next dev instance is probably already running.\n\n` +
        `If you want to stop it (Windows), find the PID on port ${hintPort}:\n` +
        `  Get-NetTCPConnection -LocalPort ${hintPort} | Select-Object -First 1 OwningProcess\n` +
        `  Stop-Process -Id <PID> -Force`,
    );
    process.exit(1);
  }

  const pid = extractPidFromLock(contents);
  if (pid) {
    if (isPidRunning(pid)) {
      console.error(
        `[frontend] Another Next dev instance is running (PID ${pid}). Stop it and retry:\n` +
          `  Stop-Process -Id ${pid} -Force`,
      );
      process.exit(1);
    }

    try {
      fs.unlinkSync(lockPath);
      console.log(`[frontend] Removed stale Next dev lock (PID ${pid}).`);
      return;
    } catch {
      console.error(
        `[frontend] Stale lock detected (PID ${pid} not running) but couldn't delete: ${lockPath}\n  Remove-Item -LiteralPath '${lockPath}' -Force`,
      );
      process.exit(1);
    }
  }

  try {
    fs.unlinkSync(lockPath);
    console.log(`[frontend] Removed stale Next dev lock.`);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException | undefined)?.code;
    console.error(
      `[frontend] Next dev lock exists but couldn't be removed (${code ?? "unknown"}): ${lockPath}\n` +
        `Another instance may be running. Stop it and retry.`,
    );
    process.exit(1);
  }
}

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once("error", () => resolve(false));
    server.once("listening", () => server.close(() => resolve(true)));

    // Next binds to "::" by default, so check the same interface to avoid false positives.
    try {
      server.listen({ port, host: "::" });
    } catch {
      resolve(false);
    }
  });
}

async function findAvailablePort(startPort: number, maxTries: number): Promise<number> {
  for (let i = 0; i < maxTries; i += 1) {
    const port = startPort + i;
    if (await isPortAvailable(port)) return port;
  }
  throw new Error(`No available port found in range ${startPort}-${startPort + maxTries - 1}`);
}

const preferredPort = Number.parseInt(process.env.FRONTEND_PORT || "3001", 10);
ensureNoStaleNextLock(Number.isFinite(preferredPort) ? preferredPort : 3001);

const port = await findAvailablePort(Number.isFinite(preferredPort) ? preferredPort : 3001, 20);

console.log(`[frontend] Starting Next dev on port ${port}`);

const rootEnv = loadRepoRootEnv();
const child = spawn(process.execPath, ["x", "next", "dev", "--turbopack", "-p", String(port)], {
  stdio: "inherit",
  env: { ...rootEnv, ...process.env, PORT: String(port) },
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
