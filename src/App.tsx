import { ThemeProvider } from "./components/theme-provider";
import NavBar from "./components/navbar";
import { useEffect, useState } from "react";
import SplitText from "./components/splittext";
import { Button } from "./components/ui/button";
import Wallet from "./components/wallet";

function App() {
  const [path, setPath] = useState<string | null>();
  const [localPath, setLocalPath] = useState();

  useEffect(() => {
    const path: any = localStorage.getItem("Path");
    console.log(path);
    setLocalPath(path);
  }, [path]);

  function updateWallets(data: any) {
    setPath(data);
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="pl-6 pr-6 pt-10 pb-10 md:pl-32 md:pr-32 z-10">
        <NavBar />
        <div>
          {localPath ? (
            <Wallet sendData={updateWallets} />
          ) : (
            <div className="mt-8">
              <div>
                <SplitText
                  text="Create HD Wallets"
                  className="text-3xl md:text-4xl font-semibold text-center"
                  delay={100}
                  duration={0.6}
                  ease="power2.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 40 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-100px"
                  textAlign="center"
                />
              </div>
              <div className="text-md md:text-lg opacity-80">
                Create Mulitple Public and Private keys From a Single Seed
                Phrase{" "}
              </div>
              <div className="space-x-3 mt-3">
                <Button
                  className="text-md w-32 h-12"
                  onClick={() => {
                    localStorage.setItem("Path", "501");
                    setPath("501");
                  }}
                >
                  Solana
                </Button>
                <Button
                  className="text-md w-32 h-12"
                  onClick={() => {
                    localStorage.setItem("Path", "60");
                    setPath("60");
                  }}
                >
                  Ethereum
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
