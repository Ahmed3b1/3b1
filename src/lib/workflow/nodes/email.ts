import nodemailer from "nodemailer";
export async function executeEmailNode(config: any) {
    const { to, subject, body } = config;

    const res = await fetch("https://api.mailersend.com/v1/email", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.MAILERSEND_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: {
                email: "no-reply@test-ywj2lpnzvykg7oqz.mlsender.net",
                name: "Workflow Bot",
            },
            to: [{ email: to }],
            subject,
            html: body,
            text: body,
        }),
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error("MailerSend error:", errorText);
        throw new Error("Failed to send email via MailerSend API");
    }

    return {
        success: true,
    };
}