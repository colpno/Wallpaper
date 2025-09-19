import { Suspense as Sus } from 'react';
import { Outlet } from 'react-router-dom';

import Loading from '~/Loading.tsx';

function Suspense() {
  return (
    <Sus fallback={<Loading />}>
      <Outlet />
    </Sus>
  );
}

export default Suspense;
