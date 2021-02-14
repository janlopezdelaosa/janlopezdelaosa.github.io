import React, { Suspense, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import Header from "./components/Header";
import Footer from "./components/Footer";
import InputBox from "./components/InputBox";
import WeeklyForecast from "./components/WeeklyForecast";
import ErrorBoundary from "./components/ErrorBoundary";
import Loading from "./components/Loading";

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

        <div className="p-4 md:px-20 w-full flex justify-center">
          <ErrorBoundary>
            <Suspense fallback={<Loading resource="locations" />}>
              <InputBox setCity={setCity} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>

      <div className="pt-32 pb-16 flex flex-col w-full items-center">
        <ErrorBoundary>
          <Suspense
            fallback={<Loading className="p-8 md:p-14" resource="forecasts" />}
          >
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
