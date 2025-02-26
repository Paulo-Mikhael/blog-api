import { EmailParams, MailerSend, Recipient, Sender } from "mailersend";

const emailTemplate = `<!DOCTYPE html>
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
            padding: 20px;
        }
        .container {
            max-width: 600px;
            background: #ffffff;
            padding: 20px;
            margin: auto;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .button {
            display: inline-block;
            background: #007bff;
            color: #ffffff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #666;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Recuperação de Senha</h2>
        <p>Recebemos uma solicitação para redefinir sua senha. Se não foi você, ignore este e-mail.</p>
        <p>Para redefinir sua senha, clique no botão abaixo:</p>
        <p><a href="{{reset_link}}" class="button">Redefinir Senha</a></p>
        <p>O link expirará em 24 horas.</p>
        <p class="footer">Se precisar de ajuda, entre em contato com o suporte.</p>
    </div>
</body>
</html>`;

export async function sendEmail(clientName: string) {
  const domain = "trial-3z0vkloypxxg7qrx.mlsender.net";
  const apiKey = process.env.API_KEY;
  if (!apiKey) return;

  const mailerSend = new MailerSend({ apiKey });
  const sentFrom = new Sender(`paulo@${domain}`, "Paulo Miguel");

  const recipients = [
    new Recipient("paulomiguel11111971@gmail.com", clientName),
  ];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject("Recuperação de senha")
    .setHtml(emailTemplate)
    .setText("Texto legal 'Hello World'");

  await mailerSend.email.send(emailParams);
}
