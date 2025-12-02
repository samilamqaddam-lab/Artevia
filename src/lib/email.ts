import * as brevo from '@getbrevo/brevo';

// Initialize Brevo (ex-Sendinblue) client
// You need to set BREVO_API_KEY in your environment variables
// Get your API key from https://app.brevo.com/settings/keys/api
const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '');

// Product name mapping for emails
// Maps product IDs to display names
const productNames: Record<string, string> = {
  'nb-premium': 'Bloc-notes personnalisés Premium',
  'nb-skin-a5': 'Bloc-note Skin A5',
  'pen-metal-s1': 'Stylos métal S1',
  'pen-metal-p1': 'Stylos métal P1',
  'mug-white': 'Mug blanc',
  'bottle-500ml': 'Bouteille 500ml',
  'tshirt-cotton': 'T-shirt coton',
  'tote-bag': 'Tote bag',
  'usb-4gb': 'Clé USB 4GB'
};

/**
 * Get product display name for emails
 * Falls back to product ID if name not found
 */
export function getProductDisplayName(productId: string): string {
  return productNames[productId] || productId;
}

export interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  company?: string;
  items: Array<{
    productName: string;
    quantity: number;
    price?: number;
  }>;
  totalAmount: number;
  discountAmount?: number;
  quantity: number;
  notes?: string;
  locale: 'fr' | 'ar';
  receivedAt: string;
  reviewEta?: string;
}

/**
 * Send order confirmation email to customer via Brevo
 */
export async function sendCustomerOrderConfirmation(data: OrderEmailData) {
  // Check if API key is configured
  if (!process.env.BREVO_API_KEY) {
    console.warn('BREVO_API_KEY not configured, skipping customer confirmation email');
    return {success: false, error: new Error('BREVO_API_KEY not configured')};
  }

  const subject =
    data.locale === 'fr'
      ? `Confirmation de commande ${data.orderId} - Arteva`
      : `تأكيد الطلب ${data.orderId} - Arteva`;

  const html = generateCustomerEmailHTML(data);

  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;
    sendSmtpEmail.sender = {name: 'Arteva', email: process.env.BREVO_SENDER_EMAIL || 'contact@arteva.ma'};
    sendSmtpEmail.to = [{email: data.customerEmail, name: data.customerName}];
    sendSmtpEmail.replyTo = {email: 'contact@arteva.ma', name: 'Arteva'};

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✓ Customer confirmation email sent for order ${data.orderId}`);
    return {success: true, data: result};
  } catch (error) {
    console.error('Failed to send customer confirmation email:', error);
    return {success: false, error};
  }
}

/**
 * Send order notification email to admin via Brevo
 */
export async function sendAdminOrderNotification(data: OrderEmailData) {
  // Check if API key is configured
  if (!process.env.BREVO_API_KEY) {
    console.warn('BREVO_API_KEY not configured, skipping admin notification email');
    return {success: false, error: new Error('BREVO_API_KEY not configured')};
  }

  const subject = `Nouvelle commande ${data.orderId} - ${data.company || data.customerName}`;
  const html = generateAdminEmailHTML(data);
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@arteva.ma';

  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;
    sendSmtpEmail.sender = {name: 'Arteva Notifications', email: process.env.BREVO_SENDER_EMAIL || 'contact@arteva.ma'};
    sendSmtpEmail.to = [{email: adminEmail}];

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✓ Admin notification email sent for order ${data.orderId}`);
    return {success: true, data: result};
  } catch (error) {
    console.error('Failed to send admin notification email:', error);
    return {success: false, error};
  }
}

/**
 * Generate customer confirmation email HTML (French)
 */
function generateCustomerEmailHTML(data: OrderEmailData): string {
  const itemsHTML = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.productName}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      ${item.price ? `<td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.price.toFixed(2)} €</td>` : ''}
    </tr>
  `
    )
    .join('');

  const translations = {
    fr: {
      greeting: `Bonjour ${data.customerName},`,
      thankYou: 'Merci pour votre commande !',
      confirmation:
        'Nous avons bien reçu votre demande de devis et notre équipe va la traiter dans les plus brefs délais.',
      orderDetails: 'Détails de la commande',
      orderNumber: 'Numéro de commande',
      orderDate: 'Date de commande',
      reviewEta: 'Délai de révision estimé',
      company: 'Société',
      contact: 'Contact',
      email: 'Email',
      phone: 'Téléphone',
      items: 'Articles',
      product: 'Produit',
      quantity: 'Quantité',
      price: 'Prix',
      subtotal: 'Sous-total',
      discount: 'Réduction',
      total: 'Total',
      notes: 'Notes',
      footer:
        'Vous recevrez une confirmation dès que votre devis aura été révisé par notre équipe.',
      signature: "L'équipe Arteva",
      questions: 'Des questions ? Contactez-nous à',
      hours: 'heures'
    },
    ar: {
      greeting: `مرحبا ${data.customerName}`,
      thankYou: 'شكرا لطلبك!',
      confirmation: 'لقد استلمنا طلب عرض الأسعار الخاص بك وسيقوم فريقنا بمعالجته في أقرب وقت ممكن.',
      orderDetails: 'تفاصيل الطلب',
      orderNumber: 'رقم الطلب',
      orderDate: 'تاريخ الطلب',
      reviewEta: 'الوقت المقدر للمراجعة',
      company: 'الشركة',
      contact: 'الاتصال',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      items: 'العناصر',
      product: 'المنتج',
      quantity: 'الكمية',
      price: 'السعر',
      subtotal: 'المجموع الفرعي',
      discount: 'الخصم',
      total: 'المجموع',
      notes: 'ملاحظات',
      footer: 'ستتلقى تأكيدًا بمجرد مراجعة عرض الأسعار من قبل فريقنا.',
      signature: 'فريق Arteva',
      questions: 'أسئلة؟ اتصل بنا على',
      hours: 'ساعات'
    }
  };

  const t = translations[data.locale];

  const notesSection = data.notes
    ? `
    <div style="margin-top: 24px; padding: 16px; background-color: #f9fafb; border-left: 4px solid #3b82f6; border-radius: 4px;">
      <p style="margin: 0; font-weight: 600; color: #1f2937;">${t.notes}:</p>
      <p style="margin: 8px 0 0 0; color: #4b5563;">${data.notes}</p>
    </div>
  `
    : '';

  const discountRow =
    data.discountAmount && data.discountAmount > 0
      ? `
    <tr>
      <td colspan="2" style="padding: 12px; text-align: right; color: #059669; font-weight: 600;">
        ${t.discount}:
      </td>
      <td style="padding: 12px; text-align: right; color: #059669; font-weight: 600;">
        -${data.discountAmount.toFixed(2)} €
      </td>
    </tr>
  `
      : '';

  return `
    <!DOCTYPE html>
    <html lang="${data.locale}" dir="${data.locale === 'ar' ? 'rtl' : 'ltr'}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${t.thankYou}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Arteva</h1>
        </div>

        <!-- Content -->
        <div style="padding: 32px;">
          <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 24px;">${t.thankYou}</h2>
          <p style="color: #4b5563; margin: 0 0 24px 0; line-height: 1.6;">${t.greeting}</p>
          <p style="color: #4b5563; margin: 0 0 24px 0; line-height: 1.6;">${t.confirmation}</p>

          <!-- Order Info Box -->
          <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
            <h3 style="color: #1f2937; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">${t.orderDetails}</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">${t.orderNumber}:</td>
                <td style="padding: 8px 0; color: #1f2937; font-weight: 600; text-align: ${data.locale === 'ar' ? 'left' : 'right'};">${data.orderId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">${t.orderDate}:</td>
                <td style="padding: 8px 0; color: #1f2937; text-align: ${data.locale === 'ar' ? 'left' : 'right'};">${new Date(data.receivedAt).toLocaleDateString(data.locale === 'fr' ? 'fr-FR' : 'ar-MA')}</td>
              </tr>
              ${
                data.reviewEta
                  ? `
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">${t.reviewEta}:</td>
                <td style="padding: 8px 0; color: #1f2937; text-align: ${data.locale === 'ar' ? 'left' : 'right'};">24 ${t.hours}</td>
              </tr>
              `
                  : ''
              }
              ${
                data.company
                  ? `
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">${t.company}:</td>
                <td style="padding: 8px 0; color: #1f2937; text-align: ${data.locale === 'ar' ? 'left' : 'right'};">${data.company}</td>
              </tr>
              `
                  : ''
              }
            </table>
          </div>

          <!-- Items Table -->
          <h3 style="color: #1f2937; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">${t.items}</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <thead>
              <tr style="background-color: #f9fafb;">
                <th style="padding: 12px; text-align: ${data.locale === 'ar' ? 'right' : 'left'}; color: #6b7280; font-weight: 600; border-bottom: 2px solid #e5e7eb;">${t.product}</th>
                <th style="padding: 12px; text-align: center; color: #6b7280; font-weight: 600; border-bottom: 2px solid #e5e7eb;">${t.quantity}</th>
                ${data.items[0]?.price ? `<th style="padding: 12px; text-align: ${data.locale === 'ar' ? 'left' : 'right'}; color: #6b7280; font-weight: 600; border-bottom: 2px solid #e5e7eb;">${t.price}</th>` : ''}
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 12px; text-align: ${data.locale === 'ar' ? 'left' : 'right'}; font-weight: 600; border-top: 2px solid #e5e7eb;">
                  ${t.subtotal}:
                </td>
                <td style="padding: 12px; text-align: ${data.locale === 'ar' ? 'left' : 'right'}; font-weight: 600; border-top: 2px solid #e5e7eb;">
                  ${data.totalAmount.toFixed(2)} €
                </td>
              </tr>
              ${discountRow}
              <tr>
                <td colspan="2" style="padding: 12px; text-align: ${data.locale === 'ar' ? 'left' : 'right'}; font-size: 18px; font-weight: 700; color: #1f2937;">
                  ${t.total}:
                </td>
                <td style="padding: 12px; text-align: ${data.locale === 'ar' ? 'left' : 'right'}; font-size: 18px; font-weight: 700; color: #3b82f6;">
                  ${(data.totalAmount - (data.discountAmount || 0)).toFixed(2)} €
                </td>
              </tr>
            </tfoot>
          </table>

          ${notesSection}

          <p style="color: #4b5563; margin: 24px 0 0 0; line-height: 1.6;">${t.footer}</p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; margin: 0 0 8px 0; font-size: 14px;">${t.signature}</p>
          <p style="color: #6b7280; margin: 0; font-size: 14px;">
            ${t.questions} <a href="mailto:contact@arteva.ma" style="color: #3b82f6; text-decoration: none;">contact@arteva.ma</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate admin notification email HTML
 */
function generateAdminEmailHTML(data: OrderEmailData): string {
  const itemsHTML = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.productName}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      ${item.price ? `<td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.price.toFixed(2)} €</td>` : '<td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">-</td>'}
    </tr>
  `
    )
    .join('');

  const notesSection = data.notes
    ? `
    <div style="margin-top: 24px; padding: 16px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
      <p style="margin: 0; font-weight: 600; color: #92400e;">Notes du client:</p>
      <p style="margin: 8px 0 0 0; color: #78350f;">${data.notes}</p>
    </div>
  `
    : '';

  const discountRow =
    data.discountAmount && data.discountAmount > 0
      ? `
    <tr>
      <td colspan="2" style="padding: 12px; text-align: right; color: #059669; font-weight: 600;">
        Réduction:
      </td>
      <td style="padding: 12px; text-align: right; color: #059669; font-weight: 600;">
        -${data.discountAmount.toFixed(2)} €
      </td>
    </tr>
  `
      : '';

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nouvelle commande ${data.orderId}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">🔔 Nouvelle Commande</h1>
        </div>

        <!-- Content -->
        <div style="padding: 32px;">
          <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
            <p style="margin: 0; color: #991b1b; font-weight: 600; font-size: 16px;">Action requise: Nouvelle demande de devis</p>
          </div>

          <h2 style="color: #1f2937; margin: 0 0 16px 0; font-size: 24px;">Commande ${data.orderId}</h2>

          <!-- Customer Info -->
          <div style="background-color: #f9fafb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
            <h3 style="color: #1f2937; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Informations Client</h3>
            <table style="width: 100%; border-collapse: collapse;">
              ${
                data.company
                  ? `
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Société:</td>
                <td style="padding: 8px 0; color: #1f2937; font-weight: 600; text-align: right;">${data.company}</td>
              </tr>
              `
                  : ''
              }
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Contact:</td>
                <td style="padding: 8px 0; color: #1f2937; text-align: right;">${data.customerName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Email:</td>
                <td style="padding: 8px 0; color: #1f2937; text-align: right;">
                  <a href="mailto:${data.customerEmail}" style="color: #3b82f6; text-decoration: none;">${data.customerEmail}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Téléphone:</td>
                <td style="padding: 8px 0; color: #1f2937; text-align: right;">
                  <a href="tel:${data.customerPhone}" style="color: #3b82f6; text-decoration: none;">${data.customerPhone}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Langue:</td>
                <td style="padding: 8px 0; color: #1f2937; text-align: right;">${data.locale === 'fr' ? 'Français' : 'العربية'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; font-weight: 500;">Date:</td>
                <td style="padding: 8px 0; color: #1f2937; text-align: right;">${new Date(data.receivedAt).toLocaleString('fr-FR')}</td>
              </tr>
            </table>
          </div>

          <!-- Items Table -->
          <h3 style="color: #1f2937; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Articles Commandés</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <thead>
              <tr style="background-color: #f9fafb;">
                <th style="padding: 12px; text-align: left; color: #6b7280; font-weight: 600; border-bottom: 2px solid #e5e7eb;">Produit</th>
                <th style="padding: 12px; text-align: center; color: #6b7280; font-weight: 600; border-bottom: 2px solid #e5e7eb;">Quantité</th>
                <th style="padding: 12px; text-align: right; color: #6b7280; font-weight: 600; border-bottom: 2px solid #e5e7eb;">Prix</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 12px; text-align: right; font-weight: 600; border-top: 2px solid #e5e7eb;">
                  Sous-total:
                </td>
                <td style="padding: 12px; text-align: right; font-weight: 600; border-top: 2px solid #e5e7eb;">
                  ${data.totalAmount.toFixed(2)} €
                </td>
              </tr>
              ${discountRow}
              <tr>
                <td colspan="2" style="padding: 12px; text-align: right; font-size: 18px; font-weight: 700; color: #1f2937;">
                  Total:
                </td>
                <td style="padding: 12px; text-align: right; font-size: 18px; font-weight: 700; color: #dc2626;">
                  ${(data.totalAmount - (data.discountAmount || 0)).toFixed(2)} €
                </td>
              </tr>
              <tr>
                <td colspan="2" style="padding: 12px; text-align: right; color: #6b7280;">
                  Nombre d'articles:
                </td>
                <td style="padding: 12px; text-align: right; color: #6b7280;">
                  ${data.quantity}
                </td>
              </tr>
            </tfoot>
          </table>

          ${notesSection}

          <!-- CTA -->
          <div style="margin-top: 32px; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://arteva.ma'}/admin/orders"
               style="display: inline-block; background-color: #dc2626; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Voir la commande
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; margin: 0; font-size: 14px;">
            Email automatique - Système Arteva
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
