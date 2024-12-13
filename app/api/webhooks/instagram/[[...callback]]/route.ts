
import { processWebhook } from '@/app/actions/webhooks';
import { CommentWebhook, matchWebhookTriggerType, MessageWebhook } from '@/lib/utils/webhook';
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {

const searchParams = request.nextUrl.searchParams;

const hubMode = searchParams.get("hub.mode");
const verifyToken = searchParams.get("hub.verify_token");
const challenge = searchParams.get("hub.challenge");

  console.log(verifyToken, challenge);

  return new NextResponse(challenge);
}


export async function POST(request: NextRequest) {
  const webhookBody = await request.json();
  console.dir(JSON.stringify(webhookBody.entry[0]), { depth: null });

    const data = matchWebhookTriggerType(webhookBody.entry[0])

    if(!data) {
      console.log('No trigger found');
      return new NextResponse("No trigger found", { status: 200 });
 
    } 
      try {
        
        await processWebhook(data );
      } catch (error) {
        console.log(error);
        
      }


return new NextResponse(JSON.stringify(webhookBody), { status: 200 });
}
  