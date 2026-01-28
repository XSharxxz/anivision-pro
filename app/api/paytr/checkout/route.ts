import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  const { plan, userEmail, userName } = await req.json();

  const merchant_id = process.env.PAYTR_MERCHANT_ID;
  const merchant_key = process.env.PAYTR_MERCHANT_KEY;
  const merchant_salt = process.env.PAYTR_MERCHANT_SALT;

  const merchant_oid = "SP-" + Date.now(); // Benzersiz sipariş numarası
  const payment_amount = Math.round(parseFloat(plan.price) * 100); // Kuruş cinsinden
  const merchant_ok_url = "http://localhost:3000/payment/success";
  const merchant_fail_url = "http://localhost:3000/payment/fail";
  const user_basket = JSON.stringify([[plan.name, plan.price, 1]]);
  const user_ip = "127.0.0.1"; // Canlıda kullanıcının gerçek IP'sini almalısın

  // PayTR Hash Oluşturma
  const hash_str = merchant_id + user_ip + merchant_oid + userEmail + payment_amount + user_basket + "0" + "0" + "TL" + "0";
  const paytr_token = crypto.createHmac('sha256', merchant_key!).update(hash_str + merchant_salt).digest('base64');

  const params = {
    merchant_id,
    user_ip,
    merchant_oid,
    email: userEmail,
    payment_amount,
    paytr_token,
    user_basket,
    user_name: userName,
    user_address: "Istanbul", // Zorunlu alan
    user_phone: "05000000000", // Zorunlu alan
    merchant_ok_url,
    merchant_fail_url,
    currency: "TL",
    test_mode: "1", // Test için 1, canlı için 0
  };

  try {
    const response = await fetch("https://www.paytr.com/odeme/api/get-token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(params as any),
    });
    const result = await response.json();
    
    if (result.status === "success") {
      return NextResponse.json({ token: result.token });
    } else {
      return NextResponse.json({ error: result.reason }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ error: "PayTR bağlantı hatası" }, { status: 500 });
  }
}