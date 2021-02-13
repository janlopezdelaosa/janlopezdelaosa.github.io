import React, { Suspense, useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import InputBox from "./components/InputBox";
import WeeklyForecast from "./components/WeeklyForecast";
import { QueryClient, QueryClientProvider } from "react-query";
import ErrorBoundary from "./components/ErrorBoundary";

const App: React.FC = () => {
  const [city, setCity] = useState("");
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        suspense: true,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <div className="fixed top-0 left-0 right-0 bg-white z-10">
        <Header />

        <div className="py-4 px-4 md:px-20 w-full flex justify-center">
          <ErrorBoundary>
            <Suspense fallback={<div>loading</div>}>
              <InputBox setCity={setCity} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>

      <div className="pt-32 pb-16 flex flex-col w-full items-center">
        <ErrorBoundary>
          <Suspense fallback={<div>loading</div>}>
            {city !== "" && <WeeklyForecast city={city} />}
          </Suspense>
        </ErrorBoundary>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white z-10">
        <Footer />
      </div>
    </QueryClientProvider>
  );
};

export default App;
