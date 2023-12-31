import Head from 'next/head'

/**
 * Meta component.
 *
 * Global metadata for the <head>.
 */
export default function Meta() {
  return (
    <Head>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width"
      />
      <link
        rel="preconnect"
        href={`${process.env.NEXT_PUBLIC_WORDPRESS_URL}`}
      />
      <link
        rel="dns-prefetch"
        href={`${process.env.NEXT_PUBLIC_WORDPRESS_URL}`}
      />
      <link rel="shortcut icon" href="/favicon.ico" />
    </Head>
  )
}
