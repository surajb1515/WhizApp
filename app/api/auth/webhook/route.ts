import { api } from "@/convex/_generated/api";
import { WebhookEvent } from "@clerk/nextjs/server";
import { fetchMutation } from "convex/nextjs";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";



export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new SVIX instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }



  // written by us ---------------->

  const eventType = evt.type;

  switch (eventType) {
    case "user.created":
      try {
        // let us see what data we got from the clerk
        console.log("payload in route.ts file line:66", payload);

        const userData = {
          userId: payload?.data?.id,
          email: payload?.data?.email_addresses?.[0]?.email_address,
          name: `${payload?.data?.first_name ? payload?.data?.first_name : ""}`,
          createdAt: Date.now(),
          profileImage: payload?.data?.profile_image_url,
        };

        await fetchMutation(api.users.createUser, userData);

        return NextResponse.json({
          status: 200,
          message: "User info inserted",
        });
      } catch (error) {
        return NextResponse.json({
          status: 400,
          error,
        });
      }


    case "user.updated":
      try {
        return NextResponse.json({
          status: 200,
          message: "User info updated",
        });
      } catch (error) {
        return NextResponse.json({
          status: 400,
          error,
        });
      }

    default:
      return new Response("Error occured -- unhandeled event type", {
        status: 400,
      });
  }
}


/*

payload {
  data: {
    birthday: '',
      created_at: 1654012591514,
        email_addresses: [[Object]],
          external_accounts: [],
            external_id: '567772',
              first_name: 'Example',
                gender: '',
                  id: 'user_29w83sxmDNGwOuEthce5gg56FcC',
                    image_url: 'https://img.clerk.com/xxxxxx',
                      last_name: 'Example',
                        last_sign_in_at: 1654012591514,
                          object: 'user',
                            password_enabled: true,
                              phone_numbers: [],
                                primary_email_address_id: 'idn_29w83yL7CwVlJXylYLxcslromF1',
                                  primary_phone_number_id: null,
                                    primary_web3_wallet_id: null,
                                      private_metadata: { },
    profile_image_url: 'https://www.gravatar.com/avatar?d=mp',
      public_metadata: { },
    two_factor_enabled: false,
      unsafe_metadata: { },
    updated_at: 1654012591835,
      username: null,
        web3_wallets: []
  },
  event_attributes: {
    http_request: {
      client_ip: '0.0.0.0',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
    }

*/