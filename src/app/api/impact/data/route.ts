import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { impactData } from "@/data/impactData";

export async function GET() {
  try {
    const storePath = path.join(process.cwd(), "src", "data", "liveImpactStore.json");
    
    if (fs.existsSync(storePath)) {
      const raw = fs.readFileSync(storePath, "utf-8");
      const liveData = JSON.parse(raw);
      return NextResponse.json({
        success: true,
        source: "live_agent_pipeline",
        data: liveData
      });
    }

    return NextResponse.json({
      success: true,
      source: "fallback_static",
      data: impactData
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to fetch impact data"
    }, { status: 500 });
  }
}
