import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Routes from "./Route";
import { AuthProvider } from "./Components/Login/AuthContext";
// import 'bootstrap/dist/css/bootstrap.min.css';
import "simplebar-react/dist/simplebar.min.css";
import "./scss/style.scss";
import "./scss/responsive.scss";
import Loader from "./Components/Loader";

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
            cacheTime: 1000 * 60 * 10, // Cache is kept for 10 minutes
            refetchOnWindowFocus: true, // Auto-refetch when user comes back to the tab
            retry: 1, // Only retry failed requests once to avoid infinite loops
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Suspense fallback={<Loader />}>
                <BrowserRouter basename="/neoticketsystem/">
                    <AuthProvider>
                        <Routes />
                    </AuthProvider>
                </BrowserRouter>
            </Suspense>
        </QueryClientProvider>
    );
}

export default App;
