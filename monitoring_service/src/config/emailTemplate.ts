export function getEmailTemplate(type:"UP"|"DOWN",domain:string) {
    const upTemplate =`<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Site Recovery Alert</title>
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
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                background-color: #28a745;
                color: white;
                text-align: center;
                padding: 15px;
                font-size: 24px;
                border-radius: 10px 10px 0 0;
            }
            .content {
                padding: 20px;
                text-align: center;
            }
            .content p {
                font-size: 16px;
                color: #333;
            }
            .button {
                display: inline-block;
                background-color: #28a745;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                font-size: 16px;
                border-radius: 5px;
                margin-top: 20px;
            }
            .footer {
                text-align: center;
                font-size: 12px;
                color: #888;
                padding-top: 15px;
                border-top: 1px solid #ddd;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                ✅ Website is Back Online
            </div>
            <div class="content">
                <p><strong>Your website is now accessible.</strong></p>
                <p>We have detected that <strong>${domain}</strong> is up and running again.</p>
                <p>Checked at: <strong>${new Date()}</strong></p>
                <a href="https://sitewatch/dashboard" class="button">View Dashboard</a>
            </div>
            <div class="footer">
           
        </div>
        </div>
    </body>
    </html>`

    const downTemplate = `<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Site Down Alert</title>
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
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #ff4d4d;
            color: white;
            text-align: center;
            padding: 15px;
            font-size: 24px;
            border-radius: 10px 10px 0 0;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
        .content p {
            font-size: 16px;
            color: #333;
        }
        .button {
            display: inline-block;
            background-color: #ff4d4d;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            font-size: 16px;
            border-radius: 5px;
            margin-top: 20px;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #888;
            padding-top: 15px;
            border-top: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            🚨 Website Down Alert
        </div>
        <div class="content">
            <p><strong>Your website is currently unreachable.</strong></p>
            <p>We have detected downtime on <strong>${domain}</strong>.</p>
            <p>Checked at: <strong>${new Date()}</strong></p>
            <a href="https:sitewatch.tech" class="button">View Dashboard</a>
        </div>
        <div class="footer">
           
        </div>
    </div>
</body>
</html>`

return type == "UP" ? upTemplate :downTemplate
    
}

