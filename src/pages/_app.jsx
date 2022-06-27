import { useRouter } from 'next/router';
import useStore from '@/store';
import { useEffect } from 'react';
import Header from '@/config';
import Dom from '@/components/layout/dom';
import '@/styles/index.scss';
import dynamic from 'next/dynamic';

const LCanvas = dynamic(() => import('@/components/layout/canvas'), {
  ssr: false,
});

function App({ Component, pageProps = { title: 'index' } }) {
  const router = useRouter();

  useEffect(() => {
    useStore.setState({
      router,
      debug: window.location.hash.includes('debug'),
    });
  }, [router]);

  return (
    <>
      <Header title={pageProps.title} />
      <Dom>
        <Component {...pageProps} />
      </Dom>
      {Component?.r3f && <LCanvas>{Component.r3f(pageProps)}</LCanvas>}
    </>
  );
}

export default App;
