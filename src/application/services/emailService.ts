import { SESClient, SendTemplatedEmailCommand } from '@aws-sdk/client-ses';
import 'dotenv/config';

// Configurar o cliente SES diretamente com variáveis de ambiente
const ses = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Função para enviar o e-mail de boas-vindas
export async function sendWelcomeEmail(recipientEmail: string, recipientName: string) {
  const command = new SendTemplatedEmailCommand({
    Source: process.env.SES_FROM_EMAIL!, // E-mail verificado no SES
    Destination: {
      ToAddresses: [recipientEmail],
    },
    Template: 'NagaleraWaitlist', // Nome do template SES
    TemplateData: JSON.stringify({
      email: recipientEmail,
      nome: recipientName,
    }),
  });

  try {
    await ses.send(command);
    console.log('E-mail de boas-vindas enviado com sucesso para:', recipientEmail);
  } catch (error) {
    console.error('Erro ao enviar e-mail de boas-vindas:', error);
  }
}
