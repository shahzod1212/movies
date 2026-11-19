package com.movie.movie.service.Impl;

import com.movie.movie.dtos.CustomerSupportRequest;
import com.movie.movie.service.CustomerSupportService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomerSupportServiceImpl implements CustomerSupportService {
    private final JavaMailSender javaMailSender;

    @Value("${inbox.email}")
    private String inbox;

    @Override
    public void sendMessage(CustomerSupportRequest customerSupportRequest) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(inbox);
            helper.setReplyTo(customerSupportRequest.getEmail());
            helper.setSubject("New Support Message: " + customerSupportRequest.getSubject());
            helper.setText(buildHtmlContent(customerSupportRequest), true);

            javaMailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send support message.", e);
        }
    }

    @Override
    public void sendTicketEmail(String email, String username, String movieTitle, String bookingRef, byte[] pdfFile) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject("Your Ticket for " + movieTitle + " is Ready");
            helper.setText(buildTicketHtmlContent(username, movieTitle, bookingRef), true);
            helper.addAttachment("ticket-" + bookingRef + ".pdf", new ByteArrayResource(pdfFile));

            javaMailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send ticket email.", e);
        }
    }

    private String buildHtmlContent(CustomerSupportRequest request) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="UTF-8">
                </head>
                <body style="margin:0; padding:0; background-color:#eef1f5; font-family:'Segoe UI', Roboto, Arial, sans-serif;">
                  <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="background-color:#eef1f5; padding:48px 16px;">
                    <tr>
                      <td align="center">
                        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 8px 24px rgba(31,28,44,0.10);">

                          <tr>
                            <td style="background:linear-gradient(135deg, #2b2560, #6c4fd1); padding:36px 40px;">
                              <p style="margin:0 0 6px 0; color:#c9c1f7; font-size:12px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase;">Movie Support</p>
                              <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:600;">New message received</h1>
                            </td>
                          </tr>

                          <tr>
                            <td style="padding:36px 40px 8px 40px;">
                              <table role="presentation" width="100%%" cellpadding="0" cellspacing="0">
                                <tr>
                                  <td width="50%%" style="padding:0 12px 20px 0; vertical-align:top;">
                                    <p style="margin:0 0 4px 0; color:#9b9ba8; font-size:11px; font-weight:600; letter-spacing:0.8px; text-transform:uppercase;">From</p>
                                    <p style="margin:0; color:#201d3a; font-size:15px; font-weight:600;">%s</p>
                                  </td>
                                  <td width="50%%" style="padding:0 0 20px 12px; vertical-align:top;">
                                    <p style="margin:0 0 4px 0; color:#9b9ba8; font-size:11px; font-weight:600; letter-spacing:0.8px; text-transform:uppercase;">Email</p>
                                    <p style="margin:0; font-size:15px;">
                                      <a href="mailto:%s" style="color:#6c4fd1; text-decoration:none; font-weight:600;">%s</a>
                                    </p>
                                  </td>
                                </tr>
                              </table>

                              <div style="height:1px; background-color:#eeeef2; margin:4px 0 24px 0;"></div>

                              <p style="margin:0 0 4px 0; color:#9b9ba8; font-size:11px; font-weight:600; letter-spacing:0.8px; text-transform:uppercase;">Subject</p>
                              <p style="margin:0 0 20px 0; color:#201d3a; font-size:17px; font-weight:700;">%s</p>

                              <p style="margin:0 0 8px 0; color:#9b9ba8; font-size:11px; font-weight:600; letter-spacing:0.8px; text-transform:uppercase;">Message</p>
                              <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="background-color:#f7f6fc; border-radius:10px;">
                                <tr>
                                  <td style="padding:20px 22px; color:#3a374f; font-size:15px; line-height:1.7; white-space:pre-wrap; border-left:3px solid #6c4fd1; border-radius:10px;">%s</td>
                                </tr>
                              </table>
                            </td>
                          </tr>

                          <tr>
                            <td style="padding:28px 40px 32px 40px;">
                              <a href="mailto:%s" style="display:inline-block; background-color:#6c4fd1; color:#ffffff; text-decoration:none; font-size:14px; font-weight:600; padding:12px 24px; border-radius:8px;">Reply to %s</a>
                            </td>
                          </tr>

                          <tr>
                            <td style="padding:20px 40px; background-color:#faf9fc; text-align:center; border-top:1px solid #eeeef2;">
                              <p style="margin:0; color:#b0b0bc; font-size:12px;">Sent automatically from the Movie website contact form</p>
                            </td>
                          </tr>

                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
                </html>
                """.formatted(
                request.getUsername(),
                request.getEmail(),
                request.getEmail(),
                request.getSubject(),
                request.getMessage(),
                request.getEmail(),
                request.getUsername()
        );
    }

    private String buildTicketHtmlContent(String username, String movieTitle, String bookingRef) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="UTF-8">
                </head>
                <body style="margin:0; padding:0; background-color:#1a0a0d; font-family:'Segoe UI', Roboto, Arial, sans-serif;">
                  <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="background-color:#1a0a0d; padding:48px 16px;">
                    <tr>
                      <td align="center">
                        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background-color:#2b0a0f; border-radius:16px; overflow:hidden; border:1px solid #4a1620; box-shadow:0 12px 32px rgba(0,0,0,0.4);">

                          <tr>
                            <td style="background:linear-gradient(135deg, #3c080e, #6b1220); padding:40px 40px 32px 40px; text-align:center; border-bottom:1px solid #d4af37;">
                              <p style="margin:0 0 8px 0; color:#e1b4b4; font-size:12px; font-weight:600; letter-spacing:2px; text-transform:uppercase;">Booking Confirmed</p>
                              <h1 style="margin:0; color:#d4af37; font-size:26px; font-weight:700; letter-spacing:1px;">%s</h1>
                            </td>
                          </tr>

                          <tr>
                            <td style="padding:36px 40px 8px 40px;">
                              <p style="margin:0 0 24px 0; color:#e8d9d9; font-size:15px; line-height:1.6;">
                                Hi %s, your seats are booked and payment has been confirmed. Your ticket is attached to this email as a PDF — just show it at the entrance.
                              </p>

                              <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="background-color:#3c141a; border-radius:10px; border-left:3px solid #d4af37;">
                                <tr>
                                  <td style="padding:20px 22px;">
                                    <p style="margin:0 0 4px 0; color:#e1b4b4; font-size:11px; font-weight:600; letter-spacing:0.8px; text-transform:uppercase;">Booking Reference</p>
                                    <p style="margin:0; color:#ffffff; font-size:18px; font-weight:700; letter-spacing:1px;">%s</p>
                                  </td>
                                </tr>
                              </table>

                              <div style="margin:28px 0; text-align:center;">
                                <span style="display:inline-block; width:100%%; border-top:1px dashed #6b3a42;"></span>
                              </div>

                              <p style="margin:0; color:#c9a5a5; font-size:13px; text-align:center; line-height:1.6;">
                                Enjoy the show. See you at the cinema.
                              </p>
                            </td>
                          </tr>

                          <tr>
                            <td style="padding:24px 40px; background-color:#22070b; text-align:center; border-top:1px solid #4a1620;">
                              <p style="margin:0; color:#8a6666; font-size:12px;">This is an automated confirmation from the Movie booking system</p>
                            </td>
                          </tr>

                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
                </html>
                """.formatted(movieTitle, username, bookingRef);
    }
}