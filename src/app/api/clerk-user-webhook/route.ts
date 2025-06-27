import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { faker } from '@faker-js/faker';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

function getRandomReadableUsername(targetUsername: string | null, attempt = 0) {
  if (targetUsername) {
    // If a base username is provided, append a number for uniqueness
    return attempt === 0
      ? targetUsername.toLowerCase()
      : `${targetUsername.toLowerCase()}${Math.floor(Math.random() * 10000)}`;
  } else {
    // Otherwise, generate a readable username with faker
    if (Math.random() < 0.5) {
      // AdverbAdjective
      return `${faker.word.adverb()}-${faker.word.adjective()}`;
    } else {
      // AdjectiveNoun
      return `${faker.word.adjective()}-${faker.word.noun()}`;
    }
  }
}

export async function POST(req: NextRequest) {
    const evt = await verifyWebhook(req);

    if (evt.type === "user.created") {
      // Clerk sends the user object in the webhook payload
      const { id, email_addresses, first_name, last_name, username } = evt.data;
      let uniqueUsername;
      let attempt = 0;
      let maxAttempts = 10;
      let created = null;
      while (attempt < maxAttempts && !created) {
          uniqueUsername = getRandomReadableUsername(username, attempt);
          try {
              created = await prisma.user.create({
                  data: {
                      id,
                      email: email_addresses[0]?.email_address || "",
                      name: [first_name, last_name].filter(n => n !== null).join(" "),
                      username: uniqueUsername,
                  }
              });
          } catch (err: unknown) {
            if(err instanceof PrismaClientKnownRequestError) {
              const target = err.meta?.target as string;
              if (err.code === 'P2002' && target.includes('username')) {
                  attempt++;
              } else {
                  throw err;
              }
            }
          }
      }
      return NextResponse.json({ success: created });
    }
    return NextResponse.json({ success: true });
}