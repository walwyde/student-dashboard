import "@/src/styles/globals.css";
import type { AppProps } from "next/app";
import { TooltipProvider } from "@/src/components/ui/tooltip";
import { Toaster } from "@/src/components/ui/toaster";
import {Toaster as Sonner} from '@/src/components/ui/sonner'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <TooltipProvider>
      <Toaster/>
      <Sonner />
      <Component {...pageProps} />
    </TooltipProvider>
  )
 
}
