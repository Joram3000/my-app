import "./styles/globals.css";

import { type Metadata } from "next";
import styles from "./layout.module.css";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { DevOutlineToggle } from "./components/DevOutlineToggle";
import { RocketCursor } from "./ui/rocket-cursor";
import { GlobalSound } from "./ui/global-sound";
import { UIProvider } from "./context/ui-context";

const isDev = process.env.NODE_ENV === "development";

export const metadata: Metadata = {
  title: "Rick & Morty App",
  description:
    "Browse characters, locations, and episodes from the Rick & Morty universe.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={styles.body}>
        <UIProvider>
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
