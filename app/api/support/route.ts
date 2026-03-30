import { NextRequest, NextResponse } from "next/server";
import Mailjet from "node-mailjet";

const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY!,
  process.env.MAILJET_SECRET_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, description } = body;

    if (!name || !email || !subject || !description) {
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
              Email: "support@foundersworkclave.com",
              Name: "Founders Workclave Support",
            },
          ],
          Subject: `New Support Request — ${subject}`,
          HTMLPart: `
            <h2>New Support Request</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:12px;border:1px solid #eee;font-weight:bold;width:140px;">Name</td>
                <td style="padding:12px;border:1px solid #eee;">${name}</td>
              </tr>
              <tr>
                <td style="padding:12px;border:1px solid #eee;font-weight:bold;">Email</td>
                <td style="padding:12px;border:1px solid #eee;">${email}</td>
              </tr>
              <tr>
                <td style="padding:12px;border:1px solid #eee;font-weight:bold;">Subject</td>
                <td style="padding:12px;border:1px solid #eee;">${subject}</td>
              </tr>
              <tr>
                <td style="padding:12px;border:1px solid #eee;font-weight:bold;">Description</td>
                <td style="padding:12px;border:1px solid #eee;">${description}</td>
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
      { error: "Failed to send support request" },
      { status: 500 }
    );
  }
}
