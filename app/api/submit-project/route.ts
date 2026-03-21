import { NextRequest, NextResponse } from "next/server";
import Mailjet from "node-mailjet";

const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY!,
  process.env.MAILJET_SECRET_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { idea, category, vision } = body;

    if (!idea || !category || !vision) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "admin@foundersworkclave.com",
            Name: "Founders Workclave",
          },
          To: [
            {
              Email: "rebotbusinesssolutions@gmail.com",
              Name: "Rebot Business Solutions",
            },
          ],
          Subject: `New Project Submission — ${category}`,
          HTMLPart: `
            <h2>New Project Submission</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:12px;border:1px solid #eee;font-weight:bold;width:140px;">Idea</td>
                <td style="padding:12px;border:1px solid #eee;">${idea}</td>
              </tr>
              <tr>
                <td style="padding:12px;border:1px solid #eee;font-weight:bold;">Category</td>
                <td style="padding:12px;border:1px solid #eee;">${category}</td>
              </tr>
              <tr>
                <td style="padding:12px;border:1px solid #eee;font-weight:bold;">Vision</td>
                <td style="padding:12px;border:1px solid #eee;">${vision}</td>
              </tr>
            </table>
          `,
        },
      ],
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Mailjet error:", error);
    return NextResponse.json(
      { error: "Failed to send submission" },
      { status: 500 }
    );
  }
}
