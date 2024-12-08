
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
  console.dir(webhookBody.entry[0].changes[0].value);

return new NextResponse(JSON.stringify(webhookBody));
}
  