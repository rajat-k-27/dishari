import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport(process.env.EMAIL_SERVER);

export const sendOrderConfirmation = async (orderData) => {
  const { customerInfo, orderNumber, items, totalAmount } = orderData;

  const itemsList = items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.title}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toFixed(2)}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join('');

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Dishari Cyber Café</h1>
        <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Order Confirmation</p>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #22c55e; margin-top: 0;">Thank You for Your Order!</h2>
        
        <p>Hi ${customerInfo.name},</p>
        
        <p>Your order has been confirmed and will be processed shortly.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #22c55e; margin-top: 0;">Order Details</h3>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Email:</strong> ${customerInfo.email}</p>
          <p><strong>Phone:</strong> ${customerInfo.phone}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #22c55e; margin-top: 0;">Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f0fdf4;">
                <th style="padding: 10px; text-align: left;">Item</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Price</th>
                <th style="padding: 10px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px;">Total:</td>
                <td style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px; color: #22c55e;">₹${totalAmount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #22c55e; margin-top: 0;">Delivery Address</h3>
          <p>
            ${customerInfo.address.street}<br>
            ${customerInfo.address.city}, ${customerInfo.address.state} ${customerInfo.address.zipCode}<br>
            ${customerInfo.address.country}
          </p>
        </div>
        
        <p style="margin-top: 30px;">If you have any questions about your order, please contact us.</p>
        
        <p style="margin-bottom: 0;">Best regards,<br><strong>Dishari Cyber Café Team</strong></p>
      </div>
      
      <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
        <p>© ${new Date().getFullYear()} Dishari Cyber Café. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: customerInfo.email,
      subject: `Order Confirmation - ${orderNumber}`,
      html: emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send confirmation email');
  }
};

export const sendContactConfirmation = async (contactData) => {
  const { name, email, subject } = contactData;

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Message Received</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Dishari Cyber Café</h1>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #22c55e;">Thank You for Contacting Us!</h2>
        
        <p>Hi ${name},</p>
        
        <p>We have received your message regarding: <strong>${subject}</strong></p>
        
        <p>Our team will review your message and get back to you within 24-48 hours.</p>
        
        <p style="margin-top: 30px;">Best regards,<br><strong>Dishari Cyber Café Team</strong></p>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'We received your message - Dishari Cyber Café',
      html: emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    // Don't throw error for confirmation emails
    return { success: false };
  }
};

export default transporter;
