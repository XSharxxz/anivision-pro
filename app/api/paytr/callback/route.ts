import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Supabase Admin istemcisi (RLS'i aşmak için Service Role Key kullanılmalı)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // .env dosmanda bu anahtar olmalı
);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());

    // TypeScript Hatalarını Giderme (Hatanın Çözümü Burada)
    const merchant_key = process.env.PAYTR_MERCHANT_KEY || "";
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT || "";

    if (!merchant_key || !merchant_salt) {
        return new Response("API Anahtarları Eksik", { status: 500 });
    }

    // 1. Hash Doğrulama (Güvenlik için şart)
    const hashStr = data.merchant_oid + merchant_salt + data.status + data.total_amount;
    const expected_hash = crypto
      .createHmac('sha256', merchant_key)
      .update(hashStr)
      .digest('base64');

    if (data.hash !== expected_hash) {
      return new Response("PAYTR HASH HATASI", { status: 400 });
    }

    // 2. Ödeme Başarılı mı?
    if (data.status === 'success') {
      // merchant_oid içinde sakladığımız user_id'yi çekelim
      // Sipariş numarasını "USERID_TIMESTAMP" formatında gönderdiğini varsayıyorum
      const [userId] = (data.merchant_oid as string).split('_');

      // SUPABASE GÜNCELLEME: Kullanıcıyı Premium Yap
      const { error } = await supabaseAdmin
        .from('profiles')
        .update({ 
            is_premium: true,
            premium_since: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error("Supabase Güncelleme Hatası:", error);
        return new Response("Veritabanı Hatası", { status: 500 });
      }

      console.log(`Kullanıcı ${userId} başarıyla Premium yapıldı.`);
    }

    // PayTR'a işlemin başarılı alındığını bildirmek zorunludur
    return new Response("OK");

  } catch (err) {
    console.error("Callback Hatası:", err);
    return new Response("Sunucu Hatası", { status: 500 });
  }
}