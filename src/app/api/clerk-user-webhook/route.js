import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

function getRandomReadableUsername(targetUsername, attempt = 0) {
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

export async function POST(req) {
    const evt = await verifyWebhook(req);

    // Clerk sends the user object in the webhook payload
    const { id, email_addresses, first_name, last_name, username } = evt.data;

    if (evt.type === "user.created") {
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
                        name: [first_name, last_name].filter(Boolean).join(" ") || null,
                        username: uniqueUsername,
                    }
                });
            } catch (err) {
                if (err.code === 'P2002' && err.meta?.target?.includes('username')) {
                    attempt++;
                } else {
                    throw err;
                }
            }
        }
        return NextResponse.json({ success: created });
    }
    return NextResponse.json({ success: true });
}