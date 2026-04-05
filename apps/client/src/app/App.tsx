import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";

import queryClient from "@/lib/react-query/client";

import routes from "./routes";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={routes} />
    </QueryClientProvider>
  );
}

export default App;
