import { RouterProvider } from 'react-router-dom';

import Providers from './Providers.tsx';
import router from './routes/index.ts';

function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}

export default App;
