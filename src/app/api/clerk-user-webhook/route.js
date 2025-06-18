import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyWebhook } from "@clerk/nextjs/webhooks";

const prisma = new PrismaClient();

export async function POST(req) {
    const evt = await verifyWebhook(req);

    // Clerk sends the user object in the webhook payload
    const { id, email_addresses, first_name, last_name } = evt.data;

    if (evt.type === "user.created") {
        // Insert the user into your database (if not already present)
        const test = await prisma.user.upsert({
            where: { id },
            update: {},
            create: {
            id,
            email: email_addresses[0]?.email_address || "",
            name: [first_name, last_name].filter(Boolean).join(" ") || null,
            },
        });
    }
    return NextResponse.json({ success: true });
}