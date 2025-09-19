import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HelmetProvider } from 'react-helmet-async';

import './configs/dayjsConf.ts';
import queryClient from './configs/reactQueryConf.ts';

interface Props {
  children: React.ReactNode;
}

function Providers({ children }: Props) {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default Providers;
