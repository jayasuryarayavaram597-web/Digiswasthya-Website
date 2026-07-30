import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";
import util from "util";

const execPromise = util.promisify(exec);

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const reportUrl = body.url || process.env.DIGISWASTHYA_PORTAL_URL || "public/sample-report.html";

    const scriptPath = path.join(process.cwd(), "src", "scripts", "agents", "pipeline.py");
    const command = `python "${scriptPath}" "${reportUrl}"`;

    console.log(`[Trigger Agent Scraper Pipeline] Executing: ${command}`);
    const { stdout, stderr } = await execPromise(command, { cwd: process.cwd() });

    return NextResponse.json({
      success: true,
      message: "Agent Scraper Pipeline executed successfully!",
      logs: stdout,
      errors: stderr || null
    });
  } catch (error: any) {
    console.error("[Agent Pipeline API Error]:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to execute Agent Scraper Pipeline",
      error: error.message || String(error)
    }, { status: 500 });
  }
}
