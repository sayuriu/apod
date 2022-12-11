import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { Provider } from 'jotai'

function MyApp({ Component, pageProps }: AppProps) {
  return <Provider>
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  </Provider>
}

export default MyApp
