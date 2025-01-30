import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import "./globals.css"

const montserrat = Montserrat({
    variable: "--font-montserrat",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "SkyWMS",
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${montserrat.variable} antialiased`}>
        <NextThemesProvider attribute="class" defaultTheme="light">
            {children}
        </NextThemesProvider>
        </body>
        </html>
    )
}