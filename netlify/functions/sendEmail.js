exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { to, cc, subject, html, attachments } = JSON.parse(event.body);

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'onboarding@resend.dev',
                to: to,
                cc: cc,
                subject: subject,
                html: html,
                attachments: attachments
            })
        });

        const data = await response.json();

        if (data.id) {
            return {
                statusCode: 200,
                body: JSON.stringify({ success: true, id: data.id })
            };
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, error: data.message })
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error: error.message })
        };
    }
};
