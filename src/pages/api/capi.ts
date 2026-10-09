import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    const PIXEL_ID = "1601726641475061";
    const ACCESS_TOKEN = "EAAMuwZCSNfuQBSKEYOpSY4Ht3AZCMDT3t1hzEQksWy110Y8bxmbaujloDwMzRLF7oi6YEZBKZCBl283NqpGUWY7TRcMb3AM4mIZC8reWIttJbWCLBOX6tvpRZBZCHcqgr9tRNRAZBJNNdXBBW6b7Ckq9u9oYw9PzPa4kwKMrriMgSepq3BEl2EGsjlSUREP9QgZDZD";
    const TEST_CODE = "TEST51985";
    
    const url = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;
    
    let clientIp = request.headers.get("x-forwarded-for") || request.headers.get("cf-connecting-ip") || "127.0.0.1";
    if (clientIp.includes(',')) {
      clientIp = clientIp.split(',')[0].trim();
    }
    const userAgent = request.headers.get("user-agent") || "";

    const payload = {
      data: [
        {
          event_name: body.eventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: "website",
          event_source_url: body.sourceUrl,
          event_id: body.eventId,
          user_data: {
            client_ip_address: clientIp,
            client_user_agent: userAgent
          },
          custom_data: body.customData || {}
        }
      ],
      test_event_code: TEST_CODE
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    return new Response(JSON.stringify(result), { status: response.status });
  } catch (error) {
    return new Response(JSON.stringify({ error: "CAPI Error" }), { status: 500 });
  }
};
