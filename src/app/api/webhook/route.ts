import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { Pool } from 'pg';
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN as string });
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const topic = url.searchParams.get("topic") || url.searchParams.get("type");
    const paymentId = url.searchParams.get("id") || url.searchParams.get("data.id");
    if (topic === 'payment' && paymentId) {
      console.log(`💸 Webhook recibido: ${paymentId}`);
      
      const payment = new Payment(client);
      const paymentData = await payment.get({ id: paymentId });
      
      if (paymentData.status === 'approved') {
        const userId = paymentData.external_reference;
        
        if (userId) {
          const now = Math.floor(Date.now() / 1000);
          const expiresAt = now + (30 * 24 * 60 * 60); // +30 días
          const clientDB = await pool.connect();
          try {
            await clientDB.query(`
              INSERT INTO users (user_id, premium_expires_at)
              VALUES ($1, $2)
              ON CONFLICT (user_id) 
              DO UPDATE SET premium_expires_at = $2
            `, [userId, expiresAt]);
            
            console.log(`✅ Usuario ${userId} actualizado en DB`);
          } finally {
            clientDB.release();
          }
        }
      }
    }
    return NextResponse.json({ status: 'OK' });
  } catch (error) {
    console.error("❌ Error webhook:", error);
    return NextResponse.json({ status: 'Error' }, { status: 500 });
  }
}