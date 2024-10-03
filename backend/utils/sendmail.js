import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendEmail = async (recipient_email, password, name) => {
    return new Promise(async (resolve, reject) => {
        var transporter = await nodemailer.createTransport({
            service: "gmail",
            port: 465,
            secure: true,
            logger: true,
            secureConnection: false,
            auth: {
                user: process.env.MY_EMAIL,
                pass: process.env.MY_PASSWORD,
            },
            tls: {
                rejectUnauthorized: true,
            },
        });

        const mail_configs = {
            from: process.env.MY_EMAIL,
            to: recipient_email,
            subject: "Welcome to VCET Hackathon 2024 - Here Are Your Login Details",
            html: `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Your VCET Hackathon Login Credentials</title>
                        <style>
                            body, html {
                                margin: 0;
                                padding: 0;
                                font-family: Arial, sans-serif;
                                line-height: 1.6;
                                color: #FFFFFF;
                                background-color: #000000;
                            }
                            .container {
                                max-width: 600px;
                                margin: 0 auto;
                                background-image: url('https://vcet-hackathon.s3.ap-south-1.amazonaws.com/Email.back2+(1).png');
                                background-size: cover;
                                background-repeat: no-repeat;
                            }
                            .header img {
                                width: 100%;
                                display: block;
                            }
                            .content {
                                padding: 20px;
                                background-color: rgba(0, 0, 0, 0.6);
                                border-radius: 10px;
                            }
                            h1 {
                                color: #F2A657;
                                text-align: center;
                                font-size: 24px;
                                margin-bottom: 20px;
                                text-transform: uppercase;
                                letter-spacing: 2px;
                            }
                            .credentials {
                                background-color: rgba(242, 166, 87, 0.1);
                                padding: 15px;
                                border-radius: 5px;
                                margin-bottom: 20px;
                            }
                            .credentials p {
                                margin: 5px 0;
                            }
                            .button {
                                display: inline-block;
                                background-color: #E8766F;
                                color: #FCFCFC;
                                padding: 12px 25px;
                                text-decoration: none;
                                border-radius: 25px;
                                margin-top: 20px;
                                font-weight: bold;
                                text-transform: uppercase;
                                letter-spacing: 1px;
                                transition: background-color 0.3s ease;
                            }
                            .button:hover {
                                background-color: #F2A657;
                            }
                            .footer {
                                background-color: rgba(0, 0, 0, 0.8);
                                color: #F2A657;
                                text-align: center;
                                padding: 15px;
                                font-size: 12px;
                                border-top: 2px solid #F2A657;
                            }
                            .highlight {
                                color: #F2A657;
                                font-weight: bold;
                            }
                            .easter-egg {
                                font-size: 8px;
                                color: rgba(252, 252, 252, 0.3);
                                text-align: center;
                                margin-top: 10px;
                            }
                            
                            /* Mobile Styles */
                            @media screen and (max-width: 600px) {
                                .container {
                                    max-width: 100%;
                                    padding: 10px;
                                    background-size: contain;
                                }
                                .content {
                                    padding: 15px;
                                }
                                h1 {
                                    font-size: 20px;
                                }
                                .button {
                                    padding: 10px 20px;
                                    font-size: 14px;
                                }
                                .footer {
                                    font-size: 10px;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <img src="https://vcet-hackathon.s3.ap-south-1.amazonaws.com/Email.Header+.png" alt="VCET Hackathon 2024: Code the Cosmos" />
                            </div>
                            <div class="content">
                                <h1>Your Hackathon Login Credentials</h1>
                                <p>Dear <span class="highlight">${name}</span>,</p>
                                <p>Welcome to <span class="highlight">VCET Hackathon 2024: Code the Cosmos!</span> Your account has been created successfully. Please find your login credentials below:</p>
                                <div class="credentials">
                                    <p><strong>Email:</strong> <span class="highlight">${recipient_email}</span></p>
                                    <p><strong>Password:</strong> <span class="highlight">${password}</span></p>
                                </div>
                                <center><a href="http://meal.vcet-hackathon.com/" class="button">Access Hackathon Portal</a></center>
                                <p>If you need assistance, contact our support team:</p>
                                <p>QR code-related issues: Pavan Rasal (+91 87664 32949), Sridhar Pillai (+91 84217 86901)</p>
                                <p>Technical issues: Karan Gandhi (+91 88309 79209), Sahil Chalke (+91 90225 16901)</p>
                                <p>Best of luck in the hackathon!<br><span class="highlight">VCET Hackathon Team</span></p>
                                <div class="easter-egg">
                                    <span style="font-size: 1.5px; color: rgba(0, 0, 0, 0.01);">Crafted with cosmic coding power by Pavan and Sridhar</span>
                                </div>
                            </div>
                            <div class="footer">
                                <p>&copy; 2024 Vidyavardhini's College of Engineering and Technology. All rights reserved.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                    `,
        };

        transporter.sendMail(mail_configs, function (error) {
            if (error) {
                return reject({ message: `An error has occured` });
            }
            return resolve({ message: "Email sent succesfully" });
        });
    });
};

export { sendEmail };
