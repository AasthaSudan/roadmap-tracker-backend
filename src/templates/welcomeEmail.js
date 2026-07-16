function welcomeEmailTemplate(name) {
    return `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Welcome</title>
</head>

<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">

    <table width="100%" cellspacing="0" cellpadding="0" style="padding:40px 0;">
        <tr>
            <td align="center">

                <table width="600" cellspacing="0" cellpadding="0"
                    style="background:#ffffff;border-radius:10px;padding:40px;">

                    <tr>
                        <td align="center">

                            <h1 style="color:#2563eb;">
                                🚀 Roadmap Tracker
                            </h1>

                            <h2>
                                Welcome, ${name}! 👋
                            </h2>

                            <p style="font-size:16px;color:#555;">
                                Thank you for joining Roadmap Tracker.
                            </p>

                            <p style="font-size:16px;color:#555;">
                                We're excited to help you track your learning journey.
                            </p>

                            <a href="http://localhost:3000"
                                style="
                                    display:inline-block;
                                    margin-top:20px;
                                    padding:12px 24px;
                                    background:#2563eb;
                                    color:white;
                                    text-decoration:none;
                                    border-radius:6px;
                                ">
                                Start Learning
                            </a>

                            <p style="margin-top:40px;color:#888;font-size:14px;">
                                Happy Coding ❤️
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
}

module.exports = {
    welcomeEmailTemplate,
};