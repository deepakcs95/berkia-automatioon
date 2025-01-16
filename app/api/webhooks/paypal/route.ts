import { headers } from 'next/headers';
import { type NextRequest } from 'next/server';
import crypto from 'crypto';
import { crc32 } from 'zlib';
import { unstable_cache } from 'next/cache';
import { createPaypalCertificate, getExistingPaypalCertificate } from '@/lib/db/billing';

 
const WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID;

const getCert = unstable_cache(
  async (certUrl: string) => {
      return await getExistingPaypalCertificate(certUrl);
  },
  [`cert`],
  {
    tags: ['cert'],
    revalidate: 60,
  }
);


async function verifySignature(
  rawBody: string,
  headers: Headers
): Promise<boolean> {
  try {
    if (!WEBHOOK_ID) {
      throw new Error('PayPal Webhook ID is not configured');
    }

    // Validate cert URL is from PayPal
    const certUrl = headers.get('paypal-cert-url');
    if (!certUrl || !certUrl.startsWith('https://api.paypal.com') && 
        !certUrl.startsWith('https://api.sandbox.paypal.com')) {
      throw new Error('Invalid PayPal certificate URL');
    }

    const transmissionId = headers.get('paypal-transmission-id');
    const timeStamp = headers.get('paypal-transmission-time');
    const crc = parseInt("0x" + crc32(Buffer.from(rawBody)).toString(16));

    const message = `${transmissionId}|${timeStamp}|${WEBHOOK_ID}|${crc}`;
    console.log('Webhook verification message:', message);

    const certPem = await downloadAndCache(certUrl);
    console.log(certPem);
    
    const signature =  headers.get('paypal-transmission-sig')
    if (!signature) {
      throw new Error('Missing PayPal signature');
    }
    const signatureBuffer = Buffer.from(signature, 'base64');

    const verifier = crypto.createVerify('SHA256');
    verifier.update(message);

   return verifier.verify(certPem, signatureBuffer);
     
  } catch (error) {
    console.error('PayPal webhook signature verification failed:', error);
    return false;
  }
}

async function downloadAndCache(url: string) {
 
  const cachedCert = await getCert(url);
  if (cachedCert) {
    return cachedCert.certPem;
  }
 
  // Download the file if not cached
  const response = await fetch(url);
  const data = await response.text()
  
  const savedCert = await createPaypalCertificate(url,data);
 

  return savedCert.certPem;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headersList =await headers();
    const paypalSignature =  headersList.get('paypal-transmission-sig');
    
    if (!paypalSignature) {
      throw new Error('Missing PayPal signature' );

    }

    // Verify webhook signature
    // const isValid =await verifySignature(
    //   body,
    //   headersList 
    // );

    // if (!isValid) {
    //   throw new Error('Invalid signature' );

    // }

    const event = JSON.parse(body) 
    const { event_type, resource } = event;

    console.log(body);
    
    // Extract userId from custom_id
    const userId = resource.custom_id;
    if (!userId) {
    throw new Error('Missing user ID' );
    }

    switch (event_type) {
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        // Update user's subscription status to active
        await updateSubscriptionStatus(userId, resource.id, 'ACTIVE');
        break;

      case 'BILLING.SUBSCRIPTION.CANCELLED':
        // Update user's subscription status to cancelled
        await updateSubscriptionStatus(userId, resource.id, 'CANCELLED');
        break;

      case 'BILLING.SUBSCRIPTION.SUSPENDED':
        // Update user's subscription status to suspended
        await updateSubscriptionStatus(userId, resource.id, 'SUSPENDED');
        break;

      case 'BILLING.SUBSCRIPTION.EXPIRED':
        // Update user's subscription status to expired
        await updateSubscriptionStatus(userId, resource.id, 'EXPIRED');
        break;
    }

    return new Response('Webhook processed successfully', { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Webhook processing failed', { status: 200 });
  }
}

async function updateSubscriptionStatus(
  userId: string,
  subscriptionId: string,
  status: string
) {
  // Update the subscription status in your database
  // Implementation depends on your database setup
  // Example using Supabase:
  /*
  await supabase
    .from('subscriptions')
    .update({ status })
    .match({ user_id: userId, subscription_id: subscriptionId });
  */
}