import { EmailParams, MailerSend, Recipient, Sender } from "mailersend";
import { getUserOrThrow } from "./getUserOrThrow";

const emailTemplate = (code: string | number): string => {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperação de Senha</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .code {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: #fff;
            background: #007bff;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Recuperação de Senha</h2>
        <p>Você solicitou a recuperação de senha. Utilize o código abaixo para redefinir sua senha:</p>
        <div class="code">${code}</div>
        <p class="footer">Se você não solicitou essa alteração, ignore este e-mail.</p>
    </div>
</body>
</html>
`;
};

export async function sendEmail(userId: string, code: string | number) {
  const domain = "trial-3z0vkloypxxg7qrx.mlsender.net";
  const apiKey = process.env.API_KEY;
  if (!apiKey) return;

  const user = await getUserOrThrow(userId);
  const userProfile = user.profile;
  if (!userProfile) return;

  const mailerSend = new MailerSend({ apiKey });
  const sentFrom = new Sender(`blogapi@${domain}`, "Backend Server");

  const recipients = [
    new Recipient("paulomiguel11111971@gmail.com", userProfile.name),
  ];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject("Recuperação de senha V3")
    .setHtml(emailTemplate(code))
    .setText("Texto legal 'Hello World'");

  await mailerSend.email.send(emailParams);
}
