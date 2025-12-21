import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN as string });

export async function POST(request: Request) {
  console.log("🔵 INICIANDO CREACIÓN DE PREFERENCIA..."); // Log para ver si entra
  
  try {
    const body = await request.json();
    const { discordUserId } = body;

    if (!discordUserId) {
      return NextResponse.json({ message: 'Falta ID' }, { status: 400 });
    }

    const preference = new Preference(client);

    // Definimos el objeto ANTES de enviarlo para asegurar estructura
    const preferenceData = {
      body: {
        items: [
          {
            id: 'vip_monthly',
            title: 'Charlie Bot VIP (Mensual)',
            quantity: 1,
            unit_price: 3500,
            currency_id: 'ARS',
          },
        ],
        external_reference: discordUserId,
        

         notification_url: "https://botcharlie.vercel.app/api/webhook", 

        // PRUEBA DE FUEGO: Usamos Google para descartar problemas con localhost
        back_urls: {
          success: "https://botcharlie.vercel.app/",
          failure: "https://botcharlie.vercel.app/",
          pending: "https://botcharlie.vercel.app/",
        },
        auto_return: "approved",
        statement_descriptor: "CHARLIE BOT",
      }
    };

    console.log("🔵 ENVIANDO A MERCADO PAGO:", JSON.stringify(preferenceData, null, 2));

    const result = await preference.create(preferenceData);

    console.log("🟢 RESPUESTA MP:", result.init_point);
    
    return NextResponse.json({ init_point: result.init_point });

  } catch (error: any) {
    console.error("🔴 ERROR MP:", error); // Ver el error completo en consola
    return NextResponse.json({ 
      message: 'Error MP', 
      error: error.message || String(error),
      details: error.cause || "Sin detalles"
    }, { status: 500 });
  }
}