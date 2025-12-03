import {NextResponse} from 'next/server';
import * as brevo from '@getbrevo/brevo';

/**
 * GET /api/test-email - Test Brevo email configuration
 * This is a debug endpoint to verify email setup
 */
export async function GET() {
  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env: {
      BREVO_API_KEY: process.env.BREVO_API_KEY ? `${process.env.BREVO_API_KEY.slice(0, 20)}...` : 'NOT SET',
      BREVO_SENDER_EMAIL: process.env.BREVO_SENDER_EMAIL || 'NOT SET',
      ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'NOT SET'
    }
  };

  // Test Brevo API connection
  if (!process.env.BREVO_API_KEY) {
    results.error = 'BREVO_API_KEY is not configured';
    return NextResponse.json(results, {status: 500});
  }

  try {
    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    // Try to send a test email
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = 'Test Arteva - Configuration Email';
    sendSmtpEmail.htmlContent = '<h1>Test réussi!</h1><p>Votre configuration Brevo fonctionne correctement.</p>';
    sendSmtpEmail.sender = {
      name: 'Arteva Test',
      email: process.env.BREVO_SENDER_EMAIL || 'contact@arteva.ma'
    };
    sendSmtpEmail.to = [{
      email: process.env.ADMIN_EMAIL || 'contact@arteva.ma',
      name: 'Admin Test'
    }];

    console.log('Attempting to send test email...');
    console.log('Sender:', sendSmtpEmail.sender);
    console.log('To:', sendSmtpEmail.to);

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    results.success = true;
    results.brevoResponse = response;
    results.message = 'Test email sent successfully! Check your inbox.';

    console.log('Brevo response:', JSON.stringify(response, null, 2));

    return NextResponse.json(results);
  } catch (error) {
    console.error('Brevo test failed:', error);

    results.success = false;
    results.error = error instanceof Error ? {
      message: error.message,
      name: error.name,
      stack: error.stack
    } : String(error);

    // Try to extract more details from Brevo error
    if (error && typeof error === 'object' && 'body' in error) {
      results.brevoError = (error as {body: unknown}).body;
    }

    return NextResponse.json(results, {status: 500});
  }
}
