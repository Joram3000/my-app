import "./styles/globals.css";

import { type Metadata } from "next";
import { cookies } from "next/headers";
import styles from "./layout.module.css";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { DevOutlineToggle } from "./components/DevOutlineToggle";
import { RocketCursor } from "./ui/rocket-cursor";
import { GlobalSound } from "./ui/global-sound";
import { SplashScreen } from "./ui/splash-screen";
import { UIProvider } from "./context/ui-context";

const isDev = process.env.NODE_ENV === "development";

export const metadata: Metadata = {
  title: "Rick & Morty App",
  description:
    "Browse characters, locations, and episodes from the Rick & Morty universe.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const splashDismissed = cookieStore.get("splashDismissed")?.value === "true";
  const soundActive = cookieStore.get("splashSound")?.value === "true";

  return (
    <html lang="en">
      <body className={styles.body}>
        <UIProvider initialSplashDismissed={splashDismissed} initialSoundActive={soundActive}>
          <SplashScreen />
          {isDev && <DevOutlineToggle />}
          <RocketCursor />
          <GlobalSound />
          <Header />
          <main className={styles.main}>{children}</main>
          <Footer />
        </UIProvider>
      </body>
    </html>
  );
}
