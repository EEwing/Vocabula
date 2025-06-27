import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import { ClerkProvider } from "@clerk/nextjs"
import ClientSidebarDropdown from "@/components/ClientSidebarDropdown"
import { Card } from "@/components/ui/card"
import SidebarNav from "@/components/SidebarNav"
import { auth, clerkClient, User } from "@clerk/nextjs/server"
import { PropsWithChildren } from "react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Vocabula",
  description: "Learn vocabulary with AI",
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const { userId } = await auth();
  let user:User | null = null;
  if (userId) {
    const clerk = await clerkClient();
    user = await clerk.users.getUser(userId);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            {/* Mobile sidebar dropdown (client component) */}
            <ClientSidebarDropdown>
              <SidebarNav user={user} />
            </ClientSidebarDropdown>
            <div className="flex flex-row w-full min-h-screen">
              {/* Sidebar container (1/4 width), sidebar sticks to right edge with max width */}
              <div className="hidden lg:flex w-1/4 bg-background/80 min-h-screen flex-col justify-end">
                <aside className="ml-auto max-w-xs w-full flex flex-col h-full p-2">
                  <Card className="h-full flex flex-col">
                    <SidebarNav user={user} />
                  </Card>
                </aside>
              </div>
              {/* Main content */}
              <main className="flex-1 w-full px-4 md:px-8 py-4 xl:max-w-1/2">
                {children}
              </main>
            </div>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
