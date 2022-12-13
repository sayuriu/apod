import '@styles/globals.css'
import '@styles/_util.scss'
import '@styles/_orders.scss'
import '@styles/_anims.scss'
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
