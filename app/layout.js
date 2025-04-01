import "./globals.css";
import { AuthProvider } from "../context/authContext";
import { StoreProvider } from "../context/storeContext";
import Navigation from "../components/Navigation";
import { Source_Sans_3 } from 'next/font/google';

const sourceSans3 = Source_Sans_3({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata = {
  title: "Scribble",
  description: "A platform for sharing and discovering scribbles",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={sourceSans3.className}>
        <AuthProvider>
          <StoreProvider>
            <Navigation />
            <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
