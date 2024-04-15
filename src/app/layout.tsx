"use client";

import { ChakraProvider } from "@chakra-ui/react"
import { CacheProvider } from '@chakra-ui/next-js'
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <CacheProvider>
          <ChakraProvider>
            {children}
          </ChakraProvider>
        </CacheProvider>

      </body>
    </html>
  )
}
