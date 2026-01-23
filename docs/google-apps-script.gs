/**
 * Adhirat Technologies - Email Notification Google Apps Script
 * 
 * This script sends beautiful, glassmorphism-styled email notifications
 * to admin@adhirat.com when contact forms are submitted or users subscribe
 * to the newsletter.
 * 
 * DEPLOYMENT INSTRUCTIONS:
 * ========================
 * 1. Go to https://script.google.com
 * 2. Create a new project (File > New Project)
 * 3. Replace the default Code.gs content with this entire file
 * 4. Click Deploy > New Deployment
 * 5. Select "Web app" as the deployment type
 * 6. Set "Execute as" to "Me"
 * 7. Set "Who has access" to "Anyone"
 * 8. Click "Deploy"
 * 9. Authorize the app when prompted
 * 10. Copy the Web app URL
 * 11. Paste the URL in /assets/js/email-notifications.js (GOOGLE_SCRIPT_URL)
 * 
 * IMPORTANT: After making changes, create a new deployment version
 * to apply updates.
 */

const ADMIN_EMAIL = 'admin@adhirat.com';
const COMPANY_NAME = 'Adhirat Technologies';

/**
 * Handle incoming POST requests
 */
function doPost(e) {
    try {
        const data = JSON.parse(e.postData.contents);
        
        if (data.type === 'contact') {
            sendContactEmail(data);
        } else if (data.type === 'newsletter') {
            sendNewsletterEmail(data);
        }
        
        return ContentService.createTextOutput(JSON.stringify({ success: true }))
            .setMimeType(ContentService.MimeType.JSON);
    } catch (error) {
        Logger.log('Error: ' + error.message);
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
    return ContentService.createTextOutput(JSON.stringify({ 
        status: 'OK',
        message: 'Adhirat Email Notification Service is running'
    })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Send contact form notification email
 */
function sendContactEmail(data) {
    const subject = `🚀 New Inquiry: ${data.service} - ${data.name}`;
    
    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
    </head>
    <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%); min-height: 100vh; font-family: 'Space Grotesk', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        
        <!-- Main Container -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="min-height: 100vh;">
            <tr>
                <td align="center" style="padding: 40px 20px;">
                    
                    <!-- Glass Card -->
                    <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px;">
                        <tr>
                            <td style="background: linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%); backdrop-filter: blur(20px); border-radius: 24px; border: 1px solid rgba(139, 92, 246, 0.3); box-shadow: 0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);">
                                
                                <!-- Header with Gradient -->
                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td style="padding: 40px 40px 0 40px;">
                                            <!-- Logo & Badge Row -->
                                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                <tr>
                                                    <td style="vertical-align: middle;">
                                                        <div style="font-size: 28px; font-weight: 700; color: white; letter-spacing: -0.5px;">
                                                            Adhirat<span style="background: linear-gradient(90deg, #8b5cf6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">.Tech</span>
                                                        </div>
                                                    </td>
                                                    <td align="right" style="vertical-align: middle;">
                                                        <span style="background: linear-gradient(90deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.2)); border: 1px solid rgba(139, 92, 246, 0.4); border-radius: 999px; padding: 8px 16px; font-size: 12px; font-weight: 600; color: #a78bfa; text-transform: uppercase; letter-spacing: 1px;">
                                                            ✦ New Inquiry
                                                        </span>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Hero Section -->
                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td style="padding: 40px;">
                                            <h1 style="margin: 0 0 12px 0; font-size: 32px; font-weight: 700; color: white; line-height: 1.2;">
                                                Contact Form <span style="background: linear-gradient(90deg, #8b5cf6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Submission</span>
                                            </h1>
                                            <p style="margin: 0; color: rgba(148, 163, 184, 1); font-size: 16px; line-height: 1.6;">
                                                A potential client has reached out through your website.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Divider -->
                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td style="padding: 0 40px;">
                                            <div style="height: 1px; background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), rgba(6, 182, 212, 0.5), transparent);"></div>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Info Cards -->
                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td style="padding: 32px 40px;">
                                            
                                            <!-- From Section -->
                                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 20px;">
                                                <tr>
                                                    <td style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 16px; padding: 20px;">
                                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                            <tr>
                                                                <td width="50" style="vertical-align: top;">
                                                                    <div style="width: 44px; height: 44px; background: linear-gradient(135deg, #8b5cf6, #06b6d4); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                                                        <span style="font-size: 20px;">👤</span>
                                                                    </div>
                                                                </td>
                                                                <td style="padding-left: 16px; vertical-align: top;">
                                                                    <div style="font-size: 11px; font-weight: 600; color: #a78bfa; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px;">FROM</div>
                                                                    <div style="font-size: 18px; font-weight: 600; color: white; margin-bottom: 2px;">${data.name}</div>
                                                                    <a href="mailto:${data.email}" style="font-size: 14px; color: #06b6d4; text-decoration: none;">${data.email}</a>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                            
                                            <!-- Service Interest -->
                                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 20px;">
                                                <tr>
                                                    <td style="background: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.2); border-radius: 16px; padding: 20px;">
                                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                            <tr>
                                                                <td width="50" style="vertical-align: top;">
                                                                    <div style="width: 44px; height: 44px; background: linear-gradient(135deg, #06b6d4, #8b5cf6); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                                                        <span style="font-size: 20px;">🚀</span>
                                                                    </div>
                                                                </td>
                                                                <td style="padding-left: 16px; vertical-align: top;">
                                                                    <div style="font-size: 11px; font-weight: 600; color: #22d3ee; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px;">SERVICE INTEREST</div>
                                                                    <div style="font-size: 18px; font-weight: 600; color: white;">${data.service}</div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                            
                                            <!-- Message -->
                                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                <tr>
                                                    <td style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 24px;">
                                                        <div style="font-size: 11px; font-weight: 600; color: #a78bfa; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px;">💬 PROJECT DETAILS</div>
                                                        <div style="font-size: 15px; color: rgba(226, 232, 240, 0.9); line-height: 1.8; white-space: pre-wrap;">${data.message}</div>
                                                    </td>
                                                </tr>
                                            </table>
                                            
                                            ${data.attachmentUrl ? `
                                            <!-- Attachment -->
                                            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top: 20px;">
                                                <tr>
                                                    <td style="background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.2); border-radius: 16px; padding: 16px 20px;">
                                                        <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                            <tr>
                                                                <td width="30">
                                                                    <span style="font-size: 18px;">📎</span>
                                                                </td>
                                                                <td>
                                                                    <span style="font-size: 13px; font-weight: 500; color: #4ade80;">Attachment included</span>
                                                                </td>
                                                                <td align="right">
                                                                    <a href="${data.attachmentUrl}" style="font-size: 13px; font-weight: 600; color: #4ade80; text-decoration: none;">View File →</a>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                            ` : ''}
                                            
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Divider -->
                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td style="padding: 0 40px;">
                                            <div style="height: 1px; background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), rgba(6, 182, 212, 0.5), transparent);"></div>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Footer -->
                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td style="padding: 32px 40px;">
                                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                <tr>
                                                    <td>
                                                        <div style="font-size: 12px; color: rgba(148, 163, 184, 0.7);">
                                                            📍 Submitted at ${new Date(data.timestamp).toLocaleString('en-AU', { 
                                                                dateStyle: 'full', 
                                                                timeStyle: 'short',
                                                                timeZone: 'Australia/Sydney'
                                                            })}
                                                        </div>
                                                    </td>
                                                    <td align="right">
                                                        <a href="mailto:${data.email}" style="display: inline-block; background: linear-gradient(90deg, #8b5cf6, #06b6d4); color: white; padding: 10px 24px; border-radius: 8px; font-size: 13px; font-weight: 600; text-decoration: none;">
                                                            Reply Now →
                                                        </a>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                
                            </td>
                        </tr>
                    </table>
                    
                    <!-- Bottom Text -->
                    <table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width: 600px;">
                        <tr>
                            <td align="center" style="padding: 32px 20px;">
                                <p style="margin: 0; font-size: 12px; color: rgba(148, 163, 184, 0.5);">
                                    This notification was sent by <strong style="color: rgba(148, 163, 184, 0.7);">${COMPANY_NAME}</strong><br>
                                    © ${new Date().getFullYear()} All rights reserved • <a href="https://adhirat.com" style="color: #8b5cf6; text-decoration: none;">adhirat.com</a>
                                </p>
                            </td>
                        </tr>
                    </table>
                    
                </td>
            </tr>
        </table>
        
    </body>
    </html>
    `;
    
    GmailApp.sendEmail(ADMIN_EMAIL, subject, 
        `New Contact Form Submission\n\nFrom: ${data.name}\nEmail: ${data.email}\nService: ${data.service}\n\nMessage:\n${data.message}`,
        { htmlBody: htmlBody }
    );
}

/**
 * Send newsletter subscription notification email
 */
function sendNewsletterEmail(data) {
    const subject = `📬 New Newsletter Subscriber: ${data.email}`;
    
    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Newsletter Subscription</title>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
    </head>
    <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%); min-height: 100vh; font-family: 'Space Grotesk', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        
        <!-- Main Container -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="min-height: 100vh;">
            <tr>
                <td align="center" style="padding: 40px 20px;">
                    
                    <!-- Glass Card -->
                    <table cellpadding="0" cellspacing="0" border="0" width="500" style="max-width: 500px;">
                        <tr>
                            <td style="background: linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%); backdrop-filter: blur(20px); border-radius: 24px; border: 1px solid rgba(6, 182, 212, 0.3); box-shadow: 0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);">
                                
                                <!-- Header -->
                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td style="padding: 40px 40px 0 40px;">
                                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                                <tr>
                                                    <td>
                                                        <div style="font-size: 24px; font-weight: 700; color: white; letter-spacing: -0.5px;">
                                                            Adhirat<span style="background: linear-gradient(90deg, #8b5cf6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">.Tech</span>
                                                        </div>
                                                    </td>
                                                    <td align="right">
                                                        <span style="background: linear-gradient(90deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2)); border: 1px solid rgba(6, 182, 212, 0.4); border-radius: 999px; padding: 8px 16px; font-size: 11px; font-weight: 600; color: #22d3ee; text-transform: uppercase; letter-spacing: 1px;">
                                                            📬 New Subscriber
                                                        </span>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Content -->
                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td align="center" style="padding: 48px 40px;">
                                            
                                            <!-- Icon -->
                                            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(139, 92, 246, 0.2)); border: 2px solid rgba(6, 182, 212, 0.3); border-radius: 20px; margin: 0 auto 24px auto; display: flex; align-items: center; justify-content: center;">
                                                <span style="font-size: 40px;">✨</span>
                                            </div>
                                            
                                            <h1 style="margin: 0 0 12px 0; font-size: 24px; font-weight: 700; color: white;">
                                                New <span style="background: linear-gradient(90deg, #06b6d4, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Subscriber</span>
                                            </h1>
                                            
                                            <p style="margin: 0 0 32px 0; font-size: 15px; color: rgba(148, 163, 184, 0.9);">
                                                Someone just subscribed to your newsletter!
                                            </p>
                                            
                                            <!-- Email Badge -->
                                            <div style="background: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.3); border-radius: 12px; padding: 20px 28px; display: inline-block;">
                                                <div style="font-size: 10px; font-weight: 600; color: #22d3ee; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">SUBSCRIBER EMAIL</div>
                                                <a href="mailto:${data.email}" style="font-size: 18px; font-weight: 600; color: white; text-decoration: none;">${data.email}</a>
                                            </div>
                                            
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Divider -->
                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td style="padding: 0 40px;">
                                            <div style="height: 1px; background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.5), rgba(139, 92, 246, 0.5), transparent);"></div>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Footer -->
                                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                    <tr>
                                        <td align="center" style="padding: 24px 40px;">
                                            <p style="margin: 0; font-size: 12px; color: rgba(148, 163, 184, 0.6);">
                                                📍 ${new Date(data.timestamp).toLocaleString('en-AU', { 
                                                    dateStyle: 'medium', 
                                                    timeStyle: 'short',
                                                    timeZone: 'Australia/Sydney'
                                                })}
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                                
                            </td>
                        </tr>
                    </table>
                    
                    <!-- Bottom Text -->
                    <table cellpadding="0" cellspacing="0" border="0" width="500" style="max-width: 500px;">
                        <tr>
                            <td align="center" style="padding: 24px 20px;">
                                <p style="margin: 0; font-size: 11px; color: rgba(148, 163, 184, 0.4);">
                                    © ${new Date().getFullYear()} ${COMPANY_NAME} • <a href="https://adhirat.com" style="color: #8b5cf6; text-decoration: none;">adhirat.com</a>
                                </p>
                            </td>
                        </tr>
                    </table>
                    
                </td>
            </tr>
        </table>
        
    </body>
    </html>
    `;
    
    GmailApp.sendEmail(ADMIN_EMAIL, subject, 
        `New Newsletter Subscription\n\nEmail: ${data.email}\nTime: ${data.timestamp}`,
        { htmlBody: htmlBody }
    );
}

/**
 * Test function - Run this to verify the script works
 */
function testContactEmail() {
    sendContactEmail({
        name: 'Test User',
        email: 'test@example.com',
        service: 'Web Development',
        message: 'This is a test message to verify the email template looks correct.',
        timestamp: new Date().toISOString()
    });
}

function testNewsletterEmail() {
    sendNewsletterEmail({
        email: 'test@example.com',
        timestamp: new Date().toISOString()
    });
}
