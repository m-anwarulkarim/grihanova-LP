import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    const saleecomPayload = {
      user: null,
      orderType: "anonymous",
      carts: [body.product_id],
      cartData: [{
        product: body.product_id,
        selectedQty: body.quantity || 1,
        isSelected: true,
        isWholesale: false,
      }],
      name: body.name,
      phoneNo: body.phone_no,
      shippingAddress: body.shipping_address,
      division: body.division,
      deliveryCharge: body.deliveryCharge || 120,
      deliveryType: "regular",
      providerName: "Cash on Delivery",
      orderFrom: "Website",
      needSaveAddress: true,
      email: null,
      coupon: null,
      transactionAmount: null,
      paymentTransactionId: "",
      customerPaymentNo: null,
      incompleteOrderId: (Math.floor(Date.now() / 1000)).toString(16) + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => (Math.random() * 16 | 0).toString(16)),
      zone: "",
      area: "",
      addressType: "",
      deliveryNote: body.note || "",
    };

    const saleecomUrl = "https://api-client.saleecom.com/api/order/add-order-by-anonymous?shop=6a65db6332bce96d47df0fea";

    const response = await fetch(saleecomUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(saleecomPayload)
    });

    const result = await response.json();
    console.log("=== Saleecom Payload ===", JSON.stringify(saleecomPayload, null, 2));
    console.log("=== Saleecom Response ===", JSON.stringify(result, null, 2));

    if (!response.ok) {
      return new Response(JSON.stringify({ success: false, message: "Saleecom API Error", error: result }), {
        status: response.status,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Backend Proxy Error:", error);
    return new Response(JSON.stringify({ success: false, message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
