const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const senderEmailBody = `
<!DOCTYPE html>
<html lang="pt-br" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Seu código de confirmação — Microhub</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* Reset básico para clientes de e-mail */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }

    body, .bg-body {
      background-color: #020617; /* slate-950 */
    }

    .font-mono {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    }
    .font-sans {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }

    a { color: #60a5fa; }

    .btn:hover {
      background-color: #3b82f6 !important;
    }

    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .stack { display: block !important; width: 100% !important; }
      .hero-title { font-size: 24px !important; line-height: 32px !important; }
      .card-pad { padding: 28px 20px !important; }
      .code-digit { width: 38px !important; height: 48px !important; font-size: 22px !important; }
      .code-gap { width: 6px !important; }
    }
  </style>
</head>

<body class="bg-body" style="margin:0; padding:0; background-color:#020617;">
  <!-- Preheader -->
  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; line-height:1px; color:#020617;">
    Seu código de confirmação é {{confirmation_code}}. Ele expira em {{expires_in}}.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#020617;">
    <tr>
      <td align="center" style="padding: 40px 16px;">

        <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <img src="https://res.cloudinary.com/dhanssgkj/image/upload/v1787100223/logo-light.svg" alt="Logo da Microhub" width="140" style="display:block; max-width:140px; height:auto;">
            </td>
          </tr>

          <!-- Card principal -->
          <tr>
            <td style="background-color:#1e293b; border-radius:16px; border:1px solid #334155;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

                <!-- Faixa de destaque no topo -->
                <tr>
                  <td style="border-radius:16px 16px 0 0; overflow:hidden; height:6px; line-height:6px; font-size:0;">
                    <div style="height:6px; background-color:#3b82f6; background-image:linear-gradient(90deg,#1e293b,#3b82f6,#4f46e5);">&nbsp;</div>
                  </td>
                </tr>

                <tr>
                  <td class="card-pad" style="padding: 44px 44px 32px 44px;" align="center">

                    <!-- Ícone de segurança -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="width:64px; height:64px; border-radius:14px; background-color:#4f46e5;">
                          <div style="font-family: Arial, sans-serif; font-size:26px; line-height:64px; color:#ffffff;">&#128274;</div>
                        </td>
                      </tr>
                    </table>

                    <h1 class="font-sans hero-title" style="margin: 24px 0 12px 0; font-size:26px; line-height:34px; font-weight:700; color:#f8fafc; text-align:center;">
                      Seu código de confirmação
                    </h1>

                    <p class="font-sans" style="margin:0; font-size:15px; line-height:24px; color:#cbd5e1; text-align:center; max-width:420px;">
                      {{message}}
                    </p>
                  </td>
                </tr>

                <!-- Código de 6 dígitos -->
                <tr>
                  <td style="padding: 8px 44px 8px 44px;" align="center">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="background-color:#0f172a; border:1px solid #334155; border-radius:12px;">
                      <tr>
                        <td align="center" style="padding: 26px 20px;">
                          <!--[if mso]>
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                          <td style="width:46px; height:56px; background-color:#1e293b; border:1px solid #3b82f6; border-radius:8px; text-align:center; font-family:'SFMono-Regular',Consolas,monospace; font-size:26px; font-weight:700; color:#f8fafc;">{{digit_1}}</td>
                          <td style="width:8px;">&nbsp;</td>
                          <td style="width:46px; height:56px; background-color:#1e293b; border:1px solid #3b82f6; border-radius:8px; text-align:center; font-family:'SFMono-Regular',Consolas,monospace; font-size:26px; font-weight:700; color:#f8fafc;">{{digit_2}}</td>
                          <td style="width:8px;">&nbsp;</td>
                          <td style="width:46px; height:56px; background-color:#1e293b; border:1px solid #3b82f6; border-radius:8px; text-align:center; font-family:'SFMono-Regular',Consolas,monospace; font-size:26px; font-weight:700; color:#f8fafc;">{{digit_3}}</td>
                          <td style="width:8px;">&nbsp;</td>
                          <td style="width:46px; height:56px; background-color:#1e293b; border:1px solid #3b82f6; border-radius:8px; text-align:center; font-family:'SFMono-Regular',Consolas,monospace; font-size:26px; font-weight:700; color:#f8fafc;">{{digit_4}}</td>
                          <td style="width:8px;">&nbsp;</td>
                          <td style="width:46px; height:56px; background-color:#1e293b; border:1px solid #3b82f6; border-radius:8px; text-align:center; font-family:'SFMono-Regular',Consolas,monospace; font-size:26px; font-weight:700; color:#f8fafc;">{{digit_5}}</td>
                          <td style="width:8px;">&nbsp;</td>
                          <td style="width:46px; height:56px; background-color:#1e293b; border:1px solid #3b82f6; border-radius:8px; text-align:center; font-family:'SFMono-Regular',Consolas,monospace; font-size:26px; font-weight:700; color:#f8fafc;">{{digit_6}}</td>
                          </tr></table>
                          <![endif]-->
                          <!--[if !mso]><!-->
                          <div style="mso-hide:all;">
                            <span class="code-digit" style="display:inline-block; width:46px; height:56px; line-height:56px; margin:0 4px; background-color:#1e293b; border:1px solid #3b82f6; border-radius:8px; text-align:center; font-family:'SFMono-Regular',Consolas,monospace; font-size:26px; font-weight:700; color:#f8fafc;">{{digit_1}}</span><span class="code-digit" style="display:inline-block; width:46px; height:56px; line-height:56px; margin:0 4px; background-color:#1e293b; border:1px solid #3b82f6; border-radius:8px; text-align:center; font-family:'SFMono-Regular',Consolas,monospace; font-size:26px; font-weight:700; color:#f8fafc;">{{digit_2}}</span><span class="code-digit" style="display:inline-block; width:46px; height:56px; line-height:56px; margin:0 4px; background-color:#1e293b; border:1px solid #3b82f6; border-radius:8px; text-align:center; font-family:'SFMono-Regular',Consolas,monospace; font-size:26px; font-weight:700; color:#f8fafc;">{{digit_3}}</span><span class="code-digit" style="display:inline-block; width:46px; height:56px; line-height:56px; margin:0 4px; background-color:#1e293b; border:1px solid #3b82f6; border-radius:8px; text-align:center; font-family:'SFMono-Regular',Consolas,monospace; font-size:26px; font-weight:700; color:#f8fafc;">{{digit_4}}</span><span class="code-digit" style="display:inline-block; width:46px; height:56px; line-height:56px; margin:0 4px; background-color:#1e293b; border:1px solid #3b82f6; border-radius:8px; text-align:center; font-family:'SFMono-Regular',Consolas,monospace; font-size:26px; font-weight:700; color:#f8fafc;">{{digit_5}}</span><span class="code-digit" style="display:inline-block; width:46px; height:56px; line-height:56px; margin:0 4px; background-color:#1e293b; border:1px solid #3b82f6; border-radius:8px; text-align:center; font-family:'SFMono-Regular',Consolas,monospace; font-size:26px; font-weight:700; color:#f8fafc;">{{digit_6}}</span>
                          </div>
                          <!--<![endif]-->
                        </td>
                      </tr>
                    </table>

                    <p class="font-sans" style="margin:16px 0 0 0; font-size:13px; line-height:20px; color:#64748b; text-align:center;">
                      Este código expira em <strong style="color:#93c5fd;">{{expires_in}}</strong> minutos.
                    </p>
                  </td>
                </tr>

                <!-- Aviso de segurança -->
                <tr>
                  <td style="padding: 24px 44px 8px 44px;">
                    <p class="font-sans" style="margin:0; font-size:13px; line-height:21px; color:#64748b; text-align:center;">
                      Por segurança, nunca compartilhe este código com outras pessoas.
                      A equipe da Microhub jamais solicitará seu código por telefone, chat ou e-mail.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 32px 44px 40px 44px;">
                    <hr style="border:none; border-top:1px solid #334155; margin:0 0 24px 0;">
                    <p class="font-sans" style="margin:0; font-size:13px; line-height:20px; color:#64748b; text-align:center;">
                      Se você não solicitou este código, pode ignorar este e-mail com segurança.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Assinatura / rodapé -->
          <tr>
            <td align="center" style="padding: 32px 20px 0 20px;">
              <p class="font-sans" style="margin:0 0 6px 0; font-size:13px; color:#64748b;">
                Atenciosamente, <span style="color:#94a3b8;">Equipe Microhub</span>
              </p>
              <p class="font-mono" style="margin:0 0 16px 0; font-size:12px; color:#475569;">
                Plataforma brasileira de monitoramento de microsserviços para e-commerce.
              </p>

              <p class="font-sans" style="margin:20px 0 0 0; font-size:11px; color:#334155;">
                © {{year}} Microhub. Todos os direitos reservados.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>

</html>
`
const receiverEmailBody = `
<!DOCTYPE html>
<html lang="pt-br" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Novo contato recebido — Microhub</title>

  <![endif]-->
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }

    body, .bg-body { background-color: #020617; } /* slate-950 */

    .font-mono {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    }
    .font-sans {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }

    a { color: #60a5fa; }
    .btn:hover { background-color: #3b82f6 !important; }
    .btn-outline:hover { background-color: #1e293b !important; }

    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .stack { display: block !important; width: 100% !important; }
      .hero-title { font-size: 22px !important; line-height: 30px !important; }
      .card-pad { padding: 28px 20px !important; }
      .btn-cell { padding-bottom: 12px !important; display:block !important; width:100% !important; }
    }
  </style>
</head>

<body class="bg-body" style="margin:0; padding:0; background-color:#020617;">

  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; line-height:1px; color:#020617;">
    Novo contato recebido pelo site: {{name}} — {{subject}}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#020617;">
    <tr>
      <td align="center" style="padding: 40px 16px;">

        <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px;">


          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <img src="https://res.cloudinary.com/dhanssgkj/image/upload/v1787100223/logo-light.svg" alt="Logo da Microhub">
            </td>
          </tr>


          <tr>
            <td style="background-color:#1e293b; border-radius:16px; border:1px solid #334155;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">


                <tr>
                  <td style="border-radius:16px 16px 0 0; overflow:hidden; height:6px; line-height:6px; font-size:0;">
                    <div style="height:6px; background-color:#4f46e5; background-image:linear-gradient(90deg,#4f46e5,#3b82f6,#1e293b);">&nbsp;</div>
                  </td>
                </tr>

                <tr>
                  <td class="card-pad" style="padding: 40px 44px 28px 44px;" align="center">


                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="width:64px; height:64px; border-radius:14px; background-color:#3b82f6;">
                          <div style="font-family: Arial, sans-serif; font-size:26px; line-height:64px; color:#ffffff;">&#9993;</div>
                        </td>
                      </tr>
                    </table>

                    <h1 class="font-sans hero-title" style="margin: 24px 0 10px 0; font-size:24px; line-height:32px; font-weight:700; color:#f8fafc; text-align:center;">
                      Novo contato pelo site
                    </h1>

                    <p class="font-sans" style="margin:0; font-size:14px; line-height:22px; color:#94a3b8; text-align:center;">
                      Recebido em <strong style="color:#cbd5e1;">{{sent_at}}</strong> através do formulário de contato.
                    </p>
                  </td>
                </tr>


                <tr>
                  <td style="padding: 0 44px 8px 44px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0f172a; border:1px solid #334155; border-radius:12px;">
                      <tr>
                        <td style="padding: 24px 28px;">
                          <p class="font-mono" style="margin:0 0 16px 0; font-size:11px; letter-spacing:1px; text-transform:uppercase; color:#93c5fd;">
                            Dados do contato
                          </p>

                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="padding: 8px 0; border-bottom:1px solid #1e293b; font-family:sans-serif; font-size:13px; color:#64748b; width:100px; vertical-align:top;">Nome</td>
                              <td style="padding: 8px 0; border-bottom:1px solid #1e293b; font-family:sans-serif; font-size:14px; color:#f1f5f9; vertical-align:top; font-weight:600;">{{name}}</td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; border-bottom:1px solid #1e293b; font-family:sans-serif; font-size:13px; color:#64748b; vertical-align:top;">E-mail</td>
                              <td style="padding: 8px 0; border-bottom:1px solid #1e293b; font-family:sans-serif; font-size:14px; vertical-align:top;">
                                <a href="mailto:{{e-mail}}" style="color:#60a5fa; text-decoration:none;">{{e-mail}}</a>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; border-bottom:1px solid #1e293b; font-family:sans-serif; font-size:13px; color:#64748b; vertical-align:top;">Assunto</td>
                              <td style="padding: 8px 0; border-bottom:1px solid #1e293b; font-family:sans-serif; font-size:14px; color:#e2e8f0; vertical-align:top;">{{subject}}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>


                <tr>
                  <td style="padding: 16px 44px 8px 44px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0f172a; border:1px solid #334155; border-radius:12px;">
                      <tr>
                        <td style="padding: 24px 28px;">
                          <p class="font-mono" style="margin:0 0 12px 0; font-size:11px; letter-spacing:1px; text-transform:uppercase; color:#93c5fd;">
                            Mensagem
                          </p>
                          <p class="font-sans" style="margin:0; font-size:14px; line-height:23px; color:#cbd5e1;">
                            {{message}}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>


          <tr>
            <td align="center" style="padding: 32px 20px 0 20px;">
              <p class="font-mono" style="margin:0 0 16px 0; font-size:12px; color:#475569;">
                Sistema de notificações — Microhub
              </p>
              <p class="font-sans" style="margin:0; font-size:11px; color:#334155;">
                © {{year}} Microhub. Todos os direitos reservados.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>

</html>
`
const codeUserEmailBody = `
<!DOCTYPE html>
<html lang="pt-br" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Seu código de confirmação — Microhub</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* Reset básico para clientes de e-mail */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; }

    body, .bg-body {
      background-color: #020617; /* slate-950 */
    }

    .font-mono {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    }
    .font-sans {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }

    a { color: #60a5fa; }

    .btn:hover {
      background-color: #3b82f6 !important;
    }

    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .stack { display: block !important; width: 100% !important; }
      .hero-title { font-size: 24px !important; line-height: 32px !important; }
      .card-pad { padding: 28px 20px !important; }
      .code-digit { width: 38px !important; height: 48px !important; font-size: 22px !important; }
      .code-gap { width: 6px !important; }
    }
  </style>
</head>

<body class="bg-body" style="margin:0; padding:0; background-color:#020617;">
  <!-- Preheader -->
  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; line-height:1px; color:#020617;">
    Seu código de confirmação é {{confirmation_code}}. Ele expira em {{expires_in}}.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#020617;">
    <tr>
      <td align="center" style="padding: 40px 16px;">

        <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <img src="https://res.cloudinary.com/dhanssgkj/image/upload/v1787100223/logo-light.svg" alt="Logo da Microhub" width="140" style="display:block; max-width:140px; height:auto;">
            </td>
          </tr>

          <!-- Card principal -->
          <tr>
            <td style="background-color:#1e293b; border-radius:16px; border:1px solid #334155;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

                <!-- Faixa de destaque no topo -->
                <tr>
                  <td style="border-radius:16px 16px 0 0; overflow:hidden; height:6px; line-height:6px; font-size:0;">
                    <div style="height:6px; background-color:#3b82f6; background-image:linear-gradient(90deg,#1e293b,#3b82f6,#4f46e5);">&nbsp;</div>
                  </td>
                </tr>

                <tr>
                  <td class="card-pad" style="padding: 44px 44px 32px 44px;" align="center">

                    <!-- Ícone de segurança -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="width:64px; height:64px; border-radius:14px; background-color:#4f46e5;">
                          <div style="font-family: Arial, sans-serif; font-size:26px; line-height:64px; color:#ffffff;">&#128274;</div>
                        </td>
                      </tr>
                    </table>

                    <h1 class="font-sans hero-title" style="margin: 24px 0 12px 0; font-size:26px; line-height:34px; font-weight:700; color:#f8fafc; text-align:center;">
                      Seu código de confirmação
                    </h1>

                    <p class="font-sans" style="margin:0; font-size:15px; line-height:24px; color:#cbd5e1; text-align:center; max-width:420px;">
                      {{message}}
                    </p>
                  </td>
                </tr>

                <!-- Código de 6 dígitos -->
                <tr>
                  <td style="padding: 8px 44px 8px 44px;" align="center">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="background-color:#0f172a; border:1px solid #334155; border-radius:12px;">
                      <tr>
                        <td style="padding: 28px 24px;">
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td class="code-digit" style="width:46px; height:56px; background-color:#1e293b; border:1px solid #3b82f6; border-radius:8px; text-align:center; font-family:'SFMono-Regular',Consolas,monospace; font-size:26px; font-weight:700; color:#f8fafc;">{{digit_1}}</td>
                              <td class="code-gap" style="width:8px;"></td>
                              <td class="code-digit" style="width:46px; height:56px; background-color:#1e293b; border:1px solid #3b82f6; border-radius:8px; text-align:center; font-family:'SFMono-Regular',Consolas,monospace; font-size:26px; font-weight:700; color:#f8fafc;">{{digit_2}}</td>
                              <td class="code-gap" style="width:8px;"></td>
                              <td class="code-digit" style="width:46px; height:56px; background-color:#1e293b; border:1px solid #3b82f6; border-radius:8px; text-align:center; font-family:'SFMono-Regular',Consolas,monospace; font-size:26px; font-weight:700; color:#f8fafc;">{{digit_3}}</td>
                              <td class="code-gap" style="width:8px;"></td>
                              <td class="code-digit" style="width:46px; height:56px; background-color:#1e293b; border:1px solid #3b82f6; border-radius:8px; text-align:center; font-family:'SFMono-Regular',Consolas,monospace; font-size:26px; font-weight:700; color:#f8fafc;">{{digit_4}}</td>
                              <td class="code-gap" style="width:8px;"></td>
                              <td class="code-digit" style="width:46px; height:56px; background-color:#1e293b; border:1px solid #3b82f6; border-radius:8px; text-align:center; font-family:'SFMono-Regular',Consolas,monospace; font-size:26px; font-weight:700; color:#f8fafc;">{{digit_5}}</td>
                              <td class="code-gap" style="width:8px;"></td>
                              <td class="code-digit" style="width:46px; height:56px; background-color:#1e293b; border:1px solid #3b82f6; border-radius:8px; text-align:center; font-family:'SFMono-Regular',Consolas,monospace; font-size:26px; font-weight:700; color:#f8fafc;">{{digit_6}}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <p class="font-sans" style="margin:16px 0 0 0; font-size:13px; line-height:20px; color:#64748b; text-align:center;">
                      Este código expira em <strong style="color:#93c5fd;">{{expires_in}}</strong> minutos.
                    </p>
                  </td>
                </tr>

                <!-- Aviso de segurança -->
                <tr>
                  <td style="padding: 24px 44px 8px 44px;">
                    <p class="font-sans" style="margin:0; font-size:13px; line-height:21px; color:#64748b; text-align:center;">
                      Por segurança, nunca compartilhe este código com outras pessoas.
                      A equipe da Microhub jamais solicitará seu código por telefone, chat ou e-mail.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 32px 44px 40px 44px;">
                    <hr style="border:none; border-top:1px solid #334155; margin:0 0 24px 0;">
                    <p class="font-sans" style="margin:0; font-size:13px; line-height:20px; color:#64748b; text-align:center;">
                      Se você não solicitou este código, pode ignorar este e-mail com segurança.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Assinatura / rodapé -->
          <tr>
            <td align="center" style="padding: 32px 20px 0 20px;">
              <p class="font-sans" style="margin:0 0 6px 0; font-size:13px; color:#64748b;">
                Atenciosamente, <span style="color:#94a3b8;">Equipe Microhub</span>
              </p>
              <p class="font-mono" style="margin:0 0 16px 0; font-size:12px; color:#475569;">
                Plataforma brasileira de monitoramento de microsserviços para e-commerce.
              </p>

              <p class="font-sans" style="margin:20px 0 0 0; font-size:11px; color:#334155;">
                © {{year}} Microhub. Todos os direitos reservados.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>

</html>
`

const send = async (req, res) => {
  const { name, email, subject, message } = req.body

  const responseBody = {
    "isError": true,
    "message": "Credenciais inválidas"
  }

  if (!name || !email || !subject || !message)
    res.status(400).json(responseBody)

  try {
    const now = new Date()
    const dateFormated = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} às ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const infoSender = await transporter.sendMail({
      from: '"Contato Microhub" <' + process.env.SMTP_USER + '>',
      to: email,
      subject: "Agradecemos o contato!",
      html: 
        senderEmailBody
          .replace("{{user_name}}", name)
          .replace("{{subject}}", subject)
          .replace("{{sent_at}}", dateFormated)
          .replace("{{year}}", now.getFullYear()), 
    });

    const infoReceiver = await transporter.sendMail({
      from: '"Contato Microhub" <' + process.env.SMTP_USER + '>',
      to: process.env.SMTP_USER,
      subject: "Contato do site intitucional",
      html: 
        receiverEmailBody
          .replaceAll("{{name}}", name)
          .replaceAll("{{subject}}", subject)
          .replace("{{message}}", message)
          .replaceAll("{{e-mail}}", email)
          .replace("{{sent_at}}", dateFormated)
          .replace("{{year}}", now.getFullYear()), 
    });
    
    if (infoReceiver.rejected.length + infoSender.rejected.length === 0) {
      responseBody.isError = false
      responseBody.message = "Email enviado com sucesso!"
      res.status(200).json(responseBody)
    } else {
      responseBody.isError = true
      responseBody.message = "Email não foi enviado. Tente novamente mais tarde"
      res.status(500).json(responseBody)
    }

  } catch (e) {
    console.error(e)
    responseBody.message = "Algo deu errado. Tente novamente mais tarde"
    res.status(500).json(responseBody)
  }
}



const sendVerificationCode = async (email, code, companyName, role) => {
  const now = new Date()
  const expiresIn = 15;

  try {
    let bodyFormatted = codeUserEmailBody
        .replace("{{confirmation_code}}", code)
        .replace("{{message}}", `Olá. Seja bem-vindo a Microhub! Utilize o código abaixo para criar sua conta atrelada à empresa <strong style="color:#93c5fd;">${companyName}</strong> com cargo de <strong style="color:#93c5fd;">${role == 0 ? "adminstrador" : "desenvolvedor"}</strong>.`)
        .replaceAll("{{expires_in}}", expiresIn)
        .replace("{{year}}", now.getFullYear())

    for (let i = 0; i < 6; i++)
      bodyFormatted = bodyFormatted.replace(`{{digit_${i +1}}}`, code[i])

      const infoEmail = await transporter.sendMail({
        from: '"Microhub" <' + process.env.SMTP_USER +'>',
        to: email,
        subject: "Seu código de verificação - Microhub",
        html: bodyFormatted
      });

      return infoEmail;
  } catch (e) {
    console.error(e)
    responseBody.message = "Algo deu errado. Tente novamente mais tarde"
    res.status(500).json(responseBody)
  }
  
};
       

module.exports = {
  send,
  sendVerificationCode
}
