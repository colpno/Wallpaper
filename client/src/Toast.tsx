import { memo } from 'react';
import { ToastContainer } from 'react-toastify';

import { useAppStore } from '~/stores/index.ts';

function Toast() {
  const theme = useAppStore((state) => state.theme);

  return (
    <ToastContainer
      position="top-right"
      autoClose={2000}
      hideProgressBar={false}
      closeOnClick
      draggable={false}
      pauseOnHover
      pauseOnFocusLoss
      rtl={false}
      theme={theme}
    />
  );
}

export default memo(Toast);
