# Complete Landing Page Code

## Project Setup

### package.json
```json
{
  "name": "launch-ui",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@radix-ui/react-accordion": "^1.2.0",
    "@radix-ui/react-avatar": "^1.1.0",
    "@radix-ui/react-dialog": "^1.1.1",
    "@radix-ui/react-dropdown-menu": "^2.1.1",
    "@radix-ui/react-icons": "^1.3.2",
    "@radix-ui/react-navigation-menu": "^1.2.0",
    "@radix-ui/react-slot": "^1.1.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "lenis": "^1.3.15",
    "lucide-react": "^0.441.0",
    "next": "16.0.7",
    "next-themes": "^0.4.4",
    "react": "19.2.1",
    "react-dom": "19.2.1",
    "tailwind-merge": "^2.5.3",
    "tw-animate-css": "^1.0.7"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.14",
    "@types/node": "^20",
    "@types/react": "19.2.7",
    "@types/react-dom": "19.2.3",
    "eslint": "^9",
    "eslint-config-next": "16.0.7",
    "postcss": "^8",
    "prettier": "^3.3.3",
    "prettier-plugin-tailwindcss": "^0.6.11",
    "tailwindcss": "^4.1.14",
    "typescript": "^5.9.3"
  },
  "overrides": {
    "@types/react": "19.2.7",
    "@types/react-dom": "19.2.3"
  }
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] },
    "target": "ES2017"
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### next.config.mjs
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {};
export default nextConfig;
```

### postcss.config.mjs
```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
export default config;
```

---

## Config Files

### config/site.ts
```typescript
export const siteConfig = {
  name: "ReText",
  url: "https://launchuicomponents.com",
  getStartedUrl: "https://launchuicomponents.com/docs/getting-started/introduction",
  ogImage: "https://launchuicomponents.com/og.jpg",
  description: "Landing page components built with React, Shadcn/ui and Tailwind that will make your website feel premium.",
  links: {
    twitter: "https://twitter.com/mikolajdobrucki",
    github: "https://github.com/launch-ui/launch-ui",
    email: "mailto:contact@mikolajdobrucki.com",
  },
  pricing: {
    pro: "https://launchui.lemonsqueezy.com/buy/b4798c68-c858-4c34-860b-069b5a0d6c4e",
    team: "https://launchui.lemonsqueezy.com/buy/130d8cfe-e123-464b-9f67-c74c5fedfb45",
  },
  stats: {
    figma: 6949,
    github: 1701,
    cli: 15972,
    total: "24.6k+",
    updated: "4 Dec 2025",
    sections: 74,
    illustrations: 23,
    animations: 15,
    templates: 7,
  },
};
export type SiteConfig = typeof siteConfig;
```

---

## Lib Files

### lib/fonts.ts
```typescript
import { Inter } from "next/font/google";
export const inter = Inter({ subsets: ["latin"] });
```

### lib/utils.ts
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## Styles

### styles/utils.css
```css
/* Glass effects */
@utility glass-1 {
  @apply border-border from-card/80 to-card/40 dark:border-border/10 dark:border-b-border/5 dark:border-t-border/20 dark:from-card/5 dark:to-card/0 border bg-linear-to-b;
}
@utility glass-2 {
  @apply border-border from-card/100 to-card/80 dark:border-border/10 dark:border-b-border/5 dark:border-t-border/20 dark:from-card/10 dark:to-card/5 border bg-linear-to-b;
}
@utility glass-3 {
  @apply border-border from-card/30 to-card/20 dark:border-border/10 dark:border-t-border/20 dark:border-b-border/5 dark:from-primary/5 dark:to-primary/2 border bg-linear-to-b;
}
@utility glass-4 {
  @apply border-border border-b-input/90 from-card/60 to-card/20 dark:border-border/10 dark:border-t-border/30 dark:from-primary/10 dark:to-primary/5 border bg-linear-to-b dark:border-b-0;
}
@utility glass-5 {
  @apply border-border border-b-input from-card/100 to-card/20 dark:border-border/10 dark:border-t-border/30 dark:from-primary/15 dark:to-primary/5 border bg-linear-to-b dark:border-b-0;
}

/* Fade effects */
@utility fade-x {
  mask-image: linear-gradient(to right, transparent 0%, black 25%, black 75%, transparent 100%);
}
@utility fade-y {
  mask-image: linear-gradient(to top, transparent 0%, black 25%, black 75%, transparent 100%);
}
@utility fade-top {
  mask-image: linear-gradient(to bottom, transparent 0%, black 35%);
}
@utility fade-bottom {
  mask-image: linear-gradient(to top, transparent 0%, black 35%);
}
@utility fade-top-lg {
  mask-image: linear-gradient(to bottom, transparent 15%, black 100%);
}
@utility fade-bottom-lg {
  mask-image: linear-gradient(to top, transparent 15%, black 100%);
}
@utility fade-left {
  mask-image: linear-gradient(to right, transparent 0%, black 35%);
}
@utility fade-right {
  mask-image: linear-gradient(to left, transparent 0%, black 35%);
}
@utility fade-left-lg {
  mask-image: linear-gradient(to right, transparent 15%, black 100%);
}
@utility fade-right-lg {
  mask-image: linear-gradient(to left, transparent 15%, black 100%);
}

@utility line-y {
  @apply border-border dark:border-border/10;
  border-width: 0 var(--line-width, 0);
}
@utility line-x {
  @apply border-border dark:border-border/10;
  border-width: var(--line-width, 0) 0;
}
@utility line-b {
  @apply border-border dark:border-border/10;
  border-width: 0 0 var(--line-width, 0);
}
@utility line-t {
  @apply border-border dark:border-border/10;
  border-width: var(--line-width, 0) 0;
}
@utility line-dashed {
  @apply border-dashed;
}

.falling-line {
  animation: falling 3s ease-in-out infinite;
}
@keyframes falling {
  0% { top: -6rem; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

.falling-line-horizontal {
  animation: falling-horizontal 4s ease-in-out infinite;
}
@keyframes falling-horizontal {
  0% { left: -6rem; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { left: 100%; opacity: 0; }
}
```


### app/globals.css
```css
@import "tailwindcss";
@import "../styles/utils.css";
@import "tw-animate-css";

@custom-variant dark (&:where(.dark, .dark *));

@theme inline {
  --color-brand: var(--brand);
  --color-brand-foreground: var(--brand-foreground);
  --color-light: var(--light);
  --color-light-foreground: var(--light-foreground);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);

  --font-sans: var(--font-inter);
  --font-mono: var(--font-ibm-plex-mono);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);

  --spacing-container: 1280px;
  --spacing-container-lg: 1536px;

  --shadow-md: 0 4px 6px -1px var(--shadow), 0 2px 4px -2px var(--shadow);
  --shadow-xl: 0 20px 25px -5px var(--shadow), 0 8px 10px -6px var(--shadow);
  --shadow-2xl: 0 25px 50px -12px var(--shadow);
  --shadow-mockup: -12px 16px 48px var(--shadow-strong);

  --line-width: 1px;

  --animate-accordion-down: accordion-down 0.2s ease-out;
  --animate-accordion-up: accordion-up 0.2s ease-out;
  --animate-appear: appear 0.6s forwards ease-out;
  --animate-appear-zoom: appear-zoom 0.6s forwards ease-out;

  @keyframes accordion-down {
    from { height: 0; }
    to { height: var(--radix-accordion-content-height); }
  }
  @keyframes accordion-up {
    from { height: var(--radix-accordion-content-height); }
    to { height: 0; }
  }
  @keyframes appear {
    0% { opacity: 0; transform: translateY(1rem); filter: blur(0.5rem); }
    50% { filter: blur(0); }
    100% { opacity: 1; transform: translateY(0); filter: blur(0); }
  }
  @keyframes appear-zoom {
    0% { opacity: 0; transform: scale(0.5); }
    100% { opacity: 1; transform: scale(1); }
  }
}

:root {
  --brand: oklch(66.5% 0.1804 47.04);
  --brand-foreground: oklch(75.77% 0.159 55.91);
  --background: oklch(97.65% 0.001 17.18);
  --foreground: oklch(0.141 0.005 285.823);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.141 0.005 285.823);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.141 0.005 285.823);
  --primary: oklch(66.5% 0.1804 47.04);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.967 0.001 286.375);
  --secondary-foreground: oklch(0.21 0.006 285.885);
  --muted: oklch(0.967 0.001 286.375);
  --muted-foreground: oklch(0.552 0.016 285.938);
  --accent: oklch(0.927 0.001 286.375);
  --accent-foreground: oklch(0.21 0.006 285.885);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.577 0.245 27.325);
  --border: oklch(0.92 0.004 286.32);
  --input: oklch(0.92 0.004 286.32);
  --ring: oklch(0.705 0.015 286.067);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --radius: 0.625rem;
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.141 0.005 285.823);
  --sidebar-primary: oklch(0.21 0.006 285.885);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.967 0.001 286.375);
  --sidebar-accent-foreground: oklch(0.21 0.006 285.885);
  --sidebar-border: oklch(0.92 0.004 286.32);
  --sidebar-ring: oklch(0.705 0.015 286.067);
  --light: var(--brand);
  --light-foreground: var(--brand-foreground);
  --shadow: #00000008;
  --shadow-strong: #00000008;
}

.dark {
  --brand: oklch(83.6% 0.1177 66.87);
  --brand-foreground: oklch(75.77% 0.159 55.91);
  --background: oklch(0.141 0.005 285.823);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.141 0.005 285.823);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.141 0.005 285.823);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.21 0.006 285.885);
  --secondary: oklch(0.274 0.006 286.033);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.274 0.006 286.033);
  --muted-foreground: oklch(0.705 0.015 286.067);
  --accent: oklch(0.274 0.006 286.033);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.396 0.141 25.723);
  --destructive-foreground: oklch(0.637 0.237 25.331);
  --border: oklch(0.885 0.006 286.033);
  --input: oklch(0.274 0.006 286.033);
  --ring: oklch(0.442 0.017 285.786);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.21 0.006 285.885);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.274 0.006 286.033);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(0.274 0.006 286.033);
  --sidebar-ring: oklch(0.442 0.017 285.786);
  --light: var(--foreground);
  --light-foreground: var(--foreground);
  --shadow: #00000020;
  --shadow-strong: #00000088;
}

@layer base {
  * { @apply border-border; }
  body { @apply bg-background text-foreground; }
}
```

---

## App Files

### app/layout.tsx
```tsx
import "@/app/globals.css";
import type { Metadata } from "next";
import { LenisProvider } from "@/components/contexts/lenis-provider";
import { ThemeProvider } from "@/components/contexts/theme-provider";
import { inter } from "@/lib/fonts";
import { siteConfig } from "../config/site";

export const metadata: Metadata = {
  title: { default: siteConfig.name, template: `%s - ${siteConfig.name}` },
  metadataBase: new URL(siteConfig.getStartedUrl),
  description: siteConfig.description,
  keywords: ["Landing page template", "Components", "Shadcn", "Next.js", "React", "Tailwind CSS", "Radix UI"],
  authors: [{ name: "Mikolaj Dobrucki", url: "https://mikolajdobrucki.com" }],
  creator: "mikolajdobrucki",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.getStartedUrl,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@mikolajdobrucki",
  },
  icons: { icon: "/favicon.svg", apple: "/apple-touch-icon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" style={{ colorScheme: "dark" }} className="dark">
      <body className={`${inter.className} bg-background antialiased`}>
        <LenisProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
```

### app/page.tsx
```tsx
import CTA from "../components/sections/cta/default";
import FAQ from "../components/sections/faq/default";
import Footer from "../components/sections/footer/default";
import Hero from "../components/sections/hero/default";
import Items from "../components/sections/items/default";
import Logos from "../components/sections/logos/default";
import Navbar from "../components/sections/navbar/default";
import Pricing from "../components/sections/pricing/default";
import Stats from "../components/sections/stats/default";
import { LayoutLines } from "../components/ui/layout-lines";

export default function Home() {
  return (
    <main className="bg-background text-foreground min-h-screen w-full">
      <LayoutLines />
      <Navbar />
      <Hero />
      <Logos />
      <Items />
      <Stats />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
```


---

## Context Providers

### components/contexts/lenis-provider.tsx
```tsx
"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useState } from "react";

const LenisContext = createContext<Lenis | null>(null);

export const useLenis = () => useContext(LenisContext);

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    setLenis(lenisInstance);
    function raf(time: number) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => { lenisInstance.destroy(); };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
```

### components/contexts/theme-provider.tsx
```tsx
"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <>{children}</>;
  return (
    <NextThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
    </NextThemeProvider>
  );
}
```

---

## Logo Components

### components/logos/figma.tsx
```tsx
const Figma = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2.00021V16M12 16V19.5C12 21.4331 10.433 23 8.5 23C6.567 23 5 21.4331 5 19.5C5 17.567 6.567 16 8.5 16M12 16H8.5M8.5 16C6.567 16 5 14.433 5 12.5C5 10.567 6.567 9 8.5 9M8.5 9H12M8.5 9H15.5M8.5 9C6.567 9 5 7.433 5 5.5C5 3.567 6.567 2 8.5 2H15.5C17.433 2 19 3.567 19 5.5C19 7.433 17.433 9 15.5 9M15.5 9C17.433 9 19 10.567 19 12.5C19 14.433 17.433 16 15.5 16C13.567 16 12 14.433 12 12.5C12 10.567 13.567 9 15.5 9Z" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" />
  </svg>
);
export default Figma;
```

### components/logos/github.tsx
```tsx
const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} viewBox="0 0 438.549 438.549" {...props}>
    <path fill="currentColor" d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"></path>
  </svg>
);
export default Github;
```

### components/logos/launch-ui.tsx
```tsx
const LaunchUI = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M10.5 12.75H3L6 9.75H9L15.75 3H20.25L10.5 12.75Z" fill="currentColor" />
    <path d="M11.25 15V13.5L21 3.75V5.25L11.25 15Z" fill="currentColor" />
    <path d="M11.25 18V16.5L21 6.75V8.25L11.25 18Z" fill="currentColor" />
    <path d="M11.25 21V19.5L15 15.75V17.25L11.25 21Z" fill="currentColor" />
  </svg>
);
export default LaunchUI;
```

### components/logos/react.tsx
```tsx
const React = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 14.1164C13.1572 14.1164 14.0952 13.1689 14.0952 12C14.0952 10.8311 13.1572 9.8836 12 9.8836C10.8428 9.8836 9.90476 10.8311 9.90476 12C9.90476 13.1689 10.8428 14.1164 12 14.1164Z" fill="currentColor" />
    <path d="M12 16.7619C17.7858 16.7619 22.4762 14.6299 22.4762 12C22.4762 9.37007 17.7858 7.2381 12 7.2381C6.21416 7.2381 1.52381 9.37007 1.52381 12C1.52381 14.6299 6.21416 16.7619 12 16.7619Z" stroke="currentColor" strokeWidth={1.5} />
    <path d="M7.91731 14.381C10.8102 19.4423 14.9833 22.4793 17.2381 21.1643C19.4929 19.8493 18.9756 14.6803 16.0827 9.61905C13.1898 4.55775 9.01671 1.52075 6.7619 2.83571C4.5071 4.15067 5.02439 9.31965 7.91731 14.381Z" stroke="currentColor" strokeWidth={1.5} />
    <path d="M7.91731 9.61905C5.02439 14.6803 4.5071 19.8493 6.7619 21.1643C9.01671 22.4793 13.1898 19.4423 16.0827 14.381C18.9756 9.31965 19.4929 4.15067 17.2381 2.83571C14.9833 1.52075 10.8102 4.55775 7.91731 9.61905Z" stroke="currentColor" strokeWidth={1.5} />
  </svg>
);
export default React;
```

### components/logos/shadcn-ui.tsx
```tsx
const ShadcnUi = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M19.5 12L12 19.5" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 3.75L3.75 18" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export default ShadcnUi;
```

### components/logos/tailwind.tsx
```tsx
const Tailwind = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M11.9997 5C9.93208 5 8.41053 5.82843 7.43594 7.48502C7.15487 7.96278 7.94335 8.41626 8.45604 8.20554C9.04899 7.96182 9.68017 7.93517 10.3497 8.12585C11.1873 8.36282 11.7845 9.0526 12.4469 9.81601C13.5249 11.0599 14.7735 12.5 17.5002 12.5C19.5669 12.5 21.0877 11.6726 22.0622 10.0181C22.3436 9.54035 21.554 9.08597 21.0409 9.29611C20.4488 9.53864 19.8185 9.56489 19.1501 9.37488C18.3138 9.13791 17.7154 8.4474 17.0529 7.68326C15.9749 6.44006 14.7263 5 11.9997 5ZM6.49984 12.5C4.43307 12.5 2.91232 13.3274 1.9378 14.9819C1.65642 15.4597 2.44604 15.914 2.95911 15.7039C3.55123 15.4614 4.18151 15.4351 4.84989 15.6251C5.68617 15.8621 6.28463 16.5526 6.94706 17.3167C8.02506 18.5599 9.27367 20 11.9997 20C14.0676 20 15.5889 19.172 16.5634 17.5163C16.8446 17.0386 16.0556 16.5847 15.5427 16.7952C14.95 17.0386 14.3192 17.0651 13.6503 16.8749C12.8133 16.6372 12.2155 15.9474 11.5531 15.1833C10.4745 13.9401 9.22714 12.5 6.49984 12.5Z" fill="currentColor" />
  </svg>
);
export default Tailwind;
```

### components/logos/typescript.tsx
```tsx
const TypeScript = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M21 1C22.1046 1 23 1.89232 23 2.99689C23 8.68454 23 17.1774 23 21.0041C23 22.1086 22.1077 23 21.0031 23C15.3155 23 6.82263 23 2.99595 23C1.89137 23 1.00001 22.108 1.00002 21.0034C1.00007 15.2015 1.00003 6.79323 1.00002 2.99497C1.00001 1.8904 1.89544 1 3.00002 1L21 1ZM13.2297 12.7043V10.9H5.4V12.7043H8.19532V20.7382H10.4206V12.7043H13.2297ZM14.1168 20.5261C14.4757 20.709 14.9001 20.8463 15.39 20.9378C15.8801 21.0292 16.3964 21.075 16.9393 21.075C17.4684 21.075 17.971 21.0247 18.4472 20.924C18.9234 20.8234 19.3409 20.6576 19.6997 20.4266C20.0585 20.1956 20.3427 19.8938 20.552 19.521C20.7613 19.1481 20.866 18.6873 20.866 18.1384C20.866 17.7405 20.8062 17.3918 20.6865 17.0922C20.567 16.7925 20.3944 16.5261 20.169 16.2928C19.9436 16.0595 19.6733 15.8503 19.3581 15.665C19.0429 15.4798 18.6876 15.3048 18.292 15.1402C18.0021 15.0212 17.7421 14.9057 17.5121 14.7937C17.282 14.6816 17.0865 14.5672 16.9255 14.4506C16.7645 14.3339 16.6403 14.2105 16.5529 14.0801C16.4655 13.9498 16.4218 13.8022 16.4218 13.6376C16.4218 13.4866 16.4609 13.3505 16.5391 13.2294C16.6173 13.1081 16.7277 13.004 16.8703 12.9171C17.013 12.8302 17.1877 12.7628 17.3948 12.7147C17.6018 12.6668 17.8319 12.6427 18.0849 12.6427C18.2689 12.6427 18.4633 12.6564 18.668 12.6839C18.8728 12.7114 19.0787 12.7537 19.2856 12.8108C19.4927 12.868 19.694 12.94 19.8895 13.027C20.0851 13.1139 20.2656 13.2145 20.4313 13.3288V11.2774C20.0953 11.1493 19.7285 11.0543 19.3305 10.9927C18.9326 10.9309 18.4759 10.9 17.9606 10.9C17.4362 10.9 16.9393 10.956 16.4701 11.0681C16.0008 11.1802 15.5879 11.3551 15.2313 11.593C14.8748 11.8309 14.593 12.1339 14.386 12.502C14.1789 12.8703 14.0754 13.3105 14.0754 13.8228C14.0754 14.4769 14.2652 15.035 14.6448 15.4969C15.0244 15.9589 15.6005 16.35 16.3734 16.6702C16.6771 16.7937 16.96 16.9149 17.2223 17.0339C17.4845 17.1527 17.7111 17.2763 17.902 17.4043C18.0929 17.5324 18.2436 17.6719 18.354 17.8228C18.4645 17.9738 18.5197 18.1453 18.5197 18.3374C18.5197 18.4793 18.4851 18.6107 18.4161 18.7319C18.3471 18.8532 18.2424 18.9583 18.1021 19.0475C17.9618 19.1367 17.787 19.2065 17.5777 19.2568C17.3684 19.3071 17.1233 19.3323 16.8427 19.3323C16.3642 19.3323 15.8904 19.2488 15.4211 19.0819C14.9519 18.9149 14.5171 18.6645 14.1168 18.3306V20.5261Z" fill="currentColor" />
  </svg>
);
export default TypeScript;
```


---

## UI Components

### components/ui/accordion.tsx
```tsx
"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

function Accordion({ ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item data-slot="accordion-item" className={cn("border-border dark:border-border/15 border-b", className)} {...props} />;
}

function AccordionTrigger({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger data-slot="accordion-trigger" className={cn("focus-visible:border-ring focus-visible:ring-ring/50 text-md flex flex-1 items-center justify-between py-4 text-left font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180", className)} {...props}>
        {children}
        <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content data-slot="accordion-content" className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm" {...props}>
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
```

### components/ui/badge.tsx
```tsx
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-border/100 dark:border-border/20 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 gap-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground dark:shadow-sm dark:border-transparent",
        brand: "border-transparent bg-brand text-primary-foreground dark:shadow-sm dark:border-transparent",
        "brand-secondary": "border-transparent bg-brand-foreground/20 text-brand dark:border-transparent",
        secondary: "border-transparent bg-secondary text-secondary-foreground dark:shadow-sm dark:border-transparent",
        destructive: "border-transparent bg-destructive/30 text-destructive-foreground dark:shadow-sm dark:border-transparent",
        outline: "text-foreground",
      },
      size: {
        default: "px-2.5 py-1",
        sm: "px-1",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

function Badge({ className, variant, size, asChild = false, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";
  return <Comp data-slot="badge" className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
```

### components/ui/beam.tsx
```tsx
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const beamVariants = cva(
  "relative after:content-[''] after:absolute after:inset-0 after:rounded-full after:scale-200",
  {
    variants: {
      tone: {
        default: "after:bg-radial after:from-foreground/30 after:from-10% after:to-foreground/0 after:to-60%",
        brand: "after:bg-radial after:from-brand/10 dark:after:from-brand/30 after:from-10% after:to-brand/0 after:to-60%",
        brandLight: "after:bg-radial dark:after:from-brand-foreground/30 after:from-brand-foreground/10 after:from-10% after:to-brand-foreground/0 after:to-60%",
      },
    },
    defaultVariants: { tone: "default" },
  }
);

export interface BeamProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof beamVariants> {}

function Beam({ className, tone, ...props }: BeamProps) {
  return <div data-slot="beam" className={cn(beamVariants({ tone, className }))} {...props} />;
}

export { Beam, beamVariants };
```

### components/ui/button.tsx
```tsx
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "text-primary-foreground shadow-sm dark:hover:from-primary/80 hover:from-primary/70 dark:hover:to-primary/70 hover:to-primary/90 bg-linear-to-b from-primary/60 to-primary/100 dark:from-primary/100 dark:to-primary/70 border-t-primary",
        destructive: "bg-destructive/30 text-destructive-foreground shadow-xs hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        glow: "glass-4 hover:glass-5 shadow-md",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-foreground underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        xs: "h-7 rounded-md px-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-5",
        icon: "size-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

function Button({ className, variant, size, asChild = false, ...props }: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
```

### components/ui/card.tsx
```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card" className={cn("bg-card text-card-foreground rounded-xl border shadow-sm", className)} {...props} />;
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-header" className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />;
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 data-slot="card-title" className={cn("leading-none font-semibold tracking-tight", className)} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="card-description" className={cn("text-muted-foreground text-sm", className)} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("p-6 pt-0", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-footer" className={cn("flex items-center p-6 pt-0", className)} {...props} />;
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
```

### components/ui/footer.tsx
```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

function Footer({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="footer" className={cn("bg-background text-foreground pt-12 pb-4", className)} {...props} />;
}

function FooterContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="footer-content" className={cn("grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5", className)} {...props} />;
}

function FooterColumn({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="footer-column" className={cn("flex flex-col gap-4", className)} {...props} />;
}

function FooterBottom({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="footer-bottom" className={cn("border-border dark:border-border/15 text-muted-foreground mt-8 flex flex-col items-center justify-between gap-4 border-t pt-4 text-xs sm:flex-row", className)} {...props} />;
}

export { Footer, FooterBottom, FooterColumn, FooterContent };
```

### components/ui/glow.tsx
```tsx
import { cva, VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "@/lib/utils";

const glowVariants = cva("absolute w-full", {
  variants: {
    variant: {
      top: "top-0",
      above: "-top-[128px]",
      bottom: "bottom-0",
      below: "-bottom-[128px]",
      center: "top-[50%]",
    },
  },
  defaultVariants: { variant: "top" },
});

function Glow({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof glowVariants>) {
  return (
    <div data-slot="glow" className={cn(glowVariants({ variant }), className)} {...props}>
      <div className={cn("from-brand-foreground/50 to-brand-foreground/0 absolute left-1/2 h-[256px] w-[60%] -translate-x-1/2 scale-[2.5] rounded-[50%] bg-radial from-10% to-60% opacity-20 sm:h-[512px] dark:opacity-100", variant === "center" && "-translate-y-1/2")} />
      <div className={cn("from-brand/30 to-brand-foreground/0 absolute left-1/2 h-[128px] w-[40%] -translate-x-1/2 scale-200 rounded-[50%] bg-radial from-10% to-60% opacity-20 sm:h-[256px] dark:opacity-100", variant === "center" && "-translate-y-1/2")} />
    </div>
  );
}

export default Glow;
```

### components/ui/item.tsx
```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

function Item({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="item" className={cn("text-foreground flex flex-col gap-4 p-4", className)} {...props} />;
}

function ItemTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 data-slot="item-title" className={cn("text-sm leading-none font-semibold tracking-tight sm:text-base", className)} {...props} />;
}

function ItemDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="item-description" className={cn("text-muted-foreground flex max-w-[240px] flex-col gap-2 text-sm text-balance", className)} {...props} />;
}

function ItemIcon({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="item-icon" className={cn("flex items-center self-start", className)} {...props} />;
}

export { Item, ItemDescription, ItemIcon, ItemTitle };
```

### components/ui/layout-lines.tsx
```tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function FallingLine({ side }: { side: "left" | "right" }) {
  return (
    <div className={cn("absolute top-0 h-full w-px", side === "left" ? "left-0" : "right-0")}>
      <div className="falling-line absolute h-24 w-px bg-gradient-to-b from-transparent via-white/80 to-transparent" />
    </div>
  );
}

function LayoutLines({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section className={cn("pointer-events-none fixed inset-0 top-0", className)} {...props}>
      <div className="max-w-container line-y line-dashed relative mx-auto flex h-full flex-col">
        <FallingLine side="left" />
        <FallingLine side="right" />
      </div>
    </section>
  );
}

export { LayoutLines };
```

### components/ui/logo.tsx
```tsx
import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  image: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  name: string;
  version?: string;
  width?: number;
  height?: number;
  showName?: boolean;
  badge?: string;
}

export default function Logo({ className, image: SvgImage, name, version, width = 24, height = 24, showName = true, badge, ...props }: LogoProps) {
  return (
    <div data-slot="logo" className={cn("flex items-center gap-2 text-sm font-medium", className)} {...props}>
      <SvgImage width={width} height={height} aria-hidden="true" className="max-h-full max-w-full opacity-70" />
      <span className={cn(!showName && "sr-only")}>{name}</span>
      {version && <span className="text-muted-foreground">{version}</span>}
      {badge && <Badge variant="brand" size="sm">{badge}</Badge>}
    </div>
  );
}
```

### components/ui/mockup.tsx
```tsx
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "@/lib/utils";

const mockupVariants = cva(
  "flex relative z-10 overflow-hidden shadow-2xl border border-border/70 dark:border-border/5 dark:border-t-border/15",
  {
    variants: {
      type: {
        mobile: "rounded-[48px] max-w-[350px]",
        responsive: "rounded-md",
      },
    },
    defaultVariants: { type: "responsive" },
  }
);

export interface MockupProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof mockupVariants> {}

function Mockup({ className, type, ...props }: MockupProps) {
  return <div data-slot="mockup" className={cn(mockupVariants({ type, className }))} {...props} />;
}

const frameVariants = cva(
  "bg-border/50 flex relative z-10 overflow-hidden rounded-2xl dark:bg-border/10",
  {
    variants: {
      size: {
        small: "p-2",
        large: "p-4",
      },
    },
    defaultVariants: { size: "small" },
  }
);

export interface MockupFrameProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof frameVariants> {}

function MockupFrame({ className, size, ...props }: MockupFrameProps) {
  return <div data-slot="mockup-frame" className={cn(frameVariants({ size, className }))} {...props} />;
}

export { Mockup, MockupFrame };
```

### components/ui/mode-toggle.tsx
```tsx
"use client";

import { ChevronsUpDownIcon } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";
import { useEffect, useState } from "react";
import { Button } from "./button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";

export function ModeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-1 px-2 py-0 text-xs">
          <span className="capitalize">{theme}</span>
          <span className="inline"> theme</span>
          <ChevronsUpDownIcon className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### components/ui/navbar.tsx
```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

function Navbar({ className, ...props }: React.ComponentProps<"nav">) {
  return <nav data-slot="navbar" className={cn("flex items-center justify-between py-4", className)} {...props} />;
}

function NavbarLeft({ className, ...props }: React.ComponentProps<"nav">) {
  return <nav data-slot="navbar-left" className={cn("flex items-center justify-start gap-4", className)} {...props} />;
}

function NavbarRight({ className, ...props }: React.ComponentProps<"nav">) {
  return <nav data-slot="navbar-right" className={cn("flex items-center justify-end gap-4", className)} {...props} />;
}

function NavbarCenter({ className, ...props }: React.ComponentProps<"nav">) {
  return <nav data-slot="navbar-center" className={cn("flex items-center justify-center gap-4", className)} {...props} />;
}

export { Navbar, NavbarCenter, NavbarLeft, NavbarRight };
```

### components/ui/section.tsx
```tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function HorizontalFallingLine() {
  return (
    <div className="absolute bottom-0 left-0 h-px w-full overflow-hidden">
      <div className="falling-line-horizontal absolute h-px w-24 bg-gradient-to-r from-transparent via-white/80 to-transparent" />
    </div>
  );
}

function Section({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section data-slot="section" className={cn("line-b relative px-4 py-12 sm:py-24 md:py-32", className)} {...props}>
      {props.children}
      <HorizontalFallingLine />
    </section>
  );
}

export { Section };
```

### components/ui/screenshot.tsx
```tsx
"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ScreenshotProps {
  srcLight: string;
  srcDark?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export default function Screenshot({ srcLight, srcDark, alt, width, height, className }: ScreenshotProps) {
  const { resolvedTheme } = useTheme();
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (resolvedTheme) {
      setSrc(resolvedTheme === "light" ? srcLight : srcDark || srcLight);
    }
  }, [resolvedTheme, srcLight, srcDark]);

  if (!src) {
    return <div style={{ width, height }} className={cn("bg-muted", className)} aria-label={alt} />;
  }

  return <Image src={src} alt={alt} width={width} height={height} className={className} />;
}
```


### components/ui/dropdown-menu.tsx
```tsx
"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

function DropdownMenu({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}

function DropdownMenuTrigger({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

function DropdownMenuGroup({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

function DropdownMenuContent({ className, sideOffset = 4, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content data-slot="dropdown-menu-content" sideOffset={sideOffset} className={cn("border-border dark:border-border/15 bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md", className)} {...props} />
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuItem({ className, inset, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & { inset?: boolean }) {
  return <DropdownMenuPrimitive.Item data-slot="dropdown-menu-item" data-inset={inset} className={cn("focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className)} {...props} />;
}

function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return <DropdownMenuPrimitive.Separator data-slot="dropdown-menu-separator" className={cn("bg-border -mx-1 my-1 h-px", className)} {...props} />;
}

export { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuTrigger };
```

### components/ui/sheet.tsx
```tsx
"use client";

import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({ ...props }: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({ ...props }: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({ ...props }: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return <SheetPrimitive.Overlay data-slot="sheet-overlay" className={cn("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80", className)} {...props} />;
}

function SheetContent({ className, children, side = "right", ...props }: React.ComponentProps<typeof SheetPrimitive.Content> & { side?: "top" | "right" | "bottom" | "left" }) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content data-slot="sheet-content" className={cn("border-border dark:border-border/15 bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 gap-4 p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500", side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm", side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm", side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 border-b", side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 border-t", className)} {...props}>
        {children}
        <SheetPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-6 right-6 z-[100] rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none">
          <XIcon className="size-5" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

export { Sheet, SheetClose, SheetContent, SheetTrigger };
```


### components/ui/navigation-menu.tsx
```tsx
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

function NavigationMenu({ className, children, viewport = true, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & { viewport?: boolean }) {
  return (
    <NavigationMenuPrimitive.Root data-slot="navigation-menu" data-viewport={viewport} className={cn("group/navigation-menu relative z-10 flex max-w-max flex-1 items-center justify-center", className)} {...props}>
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return <NavigationMenuPrimitive.List data-slot="navigation-menu-list" className={cn("group flex flex-1 list-none items-center justify-center gap-1", className)} {...props} />;
}

function NavigationMenuItem({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return <NavigationMenuPrimitive.Item data-slot="navigation-menu-item" className={cn("relative", className)} {...props} />;
}

const navigationMenuTriggerStyle = cva("group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium hover:bg-foreground/5 hover:text-accent-foreground focus:bg-foreground/10 focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-foreground/10 data-[state=open]:text-accent-foreground data-[state=open]:focus:bg-foreground/10 data-[state=open]:bg-foreground/50 focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1");

function NavigationMenuTrigger({ className, children, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger data-slot="navigation-menu-trigger" className={cn(navigationMenuTriggerStyle(), "group", className)} {...props}>
      {children}{" "}
      <ChevronDownIcon className="relative top-[1px] ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180" aria-hidden="true" />
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return <NavigationMenuPrimitive.Content data-slot="navigation-menu-content" className={cn("data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 top-0 left-0 w-full p-2 pr-2.5 md:absolute md:w-auto", "group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none", className)} {...props} />;
}

function NavigationMenuLink({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return <NavigationMenuPrimitive.Link data-slot="navigation-menu-link" className={cn("data-[active=true]:focus:bg-foreground/10 data-[active=true]:hover:bg-foreground/10 data-[active=true]:bg-foreground/10 data-[active=true]:text-accent-foreground hover:bg-foreground/10 hover:text-accent-foreground focus:bg-foreground/10 focus:text-accent-foreground focus-visible:ring-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4", className)} {...props} />;
}

function NavigationMenuViewport({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div className={cn("absolute top-full left-0 isolate z-50 flex justify-center")}>
      <NavigationMenuPrimitive.Viewport data-slot="navigation-menu-viewport" className={cn("origin-top-center bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 border-border dark:border-border/15 relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border shadow-sm md:w-[var(--radix-navigation-menu-viewport-width)]", className)} {...props} />
    </div>
  );
}

export { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport };
```


### components/ui/navigation.tsx
```tsx
"use client";

import Link from "next/link";
import * as React from "react";
import { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import LaunchUI from "../logos/launch-ui";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "./navigation-menu";

interface ComponentItem { title: string; href: string; description: string; }
interface MenuItem { title: string; href?: string; isLink?: boolean; content?: ReactNode; }
interface NavigationProps {
  menuItems?: MenuItem[];
  components?: ComponentItem[];
  logo?: ReactNode;
  logoTitle?: string;
  logoDescription?: string;
  logoHref?: string;
  introItems?: { title: string; href: string; description: string; }[];
}

export default function Navigation({
  menuItems = [
    { title: "Getting started", content: "default" },
    { title: "Components", content: "components" },
    { title: "Documentation", isLink: true, href: "#" },
  ],
  components = [
    { title: "Alert Dialog", href: "/docs/primitives/alert-dialog", description: "A modal dialog that interrupts the user with important content and expects a response." },
    { title: "Hover Card", href: "/docs/primitives/hover-card", description: "For sighted users to preview content available behind a link." },
    { title: "Progress", href: "/docs/primitives/progress", description: "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar." },
    { title: "Scroll-area", href: "/docs/primitives/scroll-area", description: "Visually or semantically separates content." },
    { title: "Tabs", href: "/docs/primitives/tabs", description: "A set of layered sections of content—known as tab panels—that are displayed one at a time." },
    { title: "Tooltip", href: "/docs/primitives/tooltip", description: "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it." },
  ],
  logo = <LaunchUI />,
  logoTitle = "ReText",
  logoDescription = "Landing page template built with React, Shadcn/ui and Tailwind that you can copy/paste into your project.",
  logoHref = "#",
  introItems = [
    { title: "Introduction", href: "#", description: "Re-usable components built using Radix UI and Tailwind CSS." },
    { title: "Installation", href: "#", description: "How to install dependencies and structure your app." },
    { title: "Typography", href: "#", description: "Styles for headings, paragraphs, lists...etc" },
  ],
}: NavigationProps) {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {menuItems.map((item, index) => (
          <NavigationMenuItem key={index}>
            {item.isLink ? (
              <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                <Link href={item.href || ""}>{item.title}</Link>
              </NavigationMenuLink>
            ) : (
              <>
                <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  {item.content === "default" ? (
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a className="from-muted/30 to-muted/10 flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md" href={logoHref}>
                            {logo}
                            <div className="mt-4 mb-2 text-lg font-medium">{logoTitle}</div>
                            <p className="text-muted-foreground text-sm leading-tight">{logoDescription}</p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      {introItems.map((intro, i) => (
                        <ListItem key={i} href={intro.href} title={intro.title}>{intro.description}</ListItem>
                      ))}
                    </ul>
                  ) : item.content === "components" ? (
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {components.map((component) => (
                        <ListItem key={component.title} title={component.title} href={component.href}>{component.description}</ListItem>
                      ))}
                    </ul>
                  ) : item.content}
                </NavigationMenuContent>
              </>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({ className, title, children, ...props }: React.ComponentProps<"a"> & { title: string }) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a data-slot="list-item" className={cn("hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors select-none", className)} {...props}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  );
}
```

### components/ui/pricing-column.tsx
```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { CircleCheckBig } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";

const pricingColumnVariants = cva(
  "max-w-container relative flex flex-col gap-6 overflow-hidden rounded-2xl p-8 shadow-xl",
  {
    variants: {
      variant: {
        default: "glass-1 to-transparent dark:glass-3",
        glow: "glass-2 to-trasparent dark:glass-3 after:content-[''] after:absolute after:-top-[128px] after:left-1/2 after:h-[128px] after:w-[100%] after:max-w-[960px] after:-translate-x-1/2 after:rounded-[50%] dark:after:bg-foreground/30 after:blur-[72px]",
        "glow-brand": "glass-3 from-card/100 to-card/100 dark:glass-4 after:content-[''] after:absolute after:-top-[128px] after:left-1/2 after:h-[128px] after:w-[100%] after:max-w-[960px] after:-translate-x-1/2 after:rounded-[50%] after:bg-brand-foreground/70 after:blur-[72px]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface PricingColumnProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof pricingColumnVariants> {
  name: string;
  icon?: ReactNode;
  description: string;
  price: number;
  showDiscounts?: boolean;
  originalPrice?: number;
  discountCode?: string;
  priceNote: string;
  cta: { variant: "glow" | "default"; label: string; href: string; };
  features: string[];
}

export function PricingColumn({ name, icon, description, price, showDiscounts = false, originalPrice, discountCode, priceNote, cta, features, variant, className, ...props }: PricingColumnProps) {
  const discountPercentage = originalPrice && price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <div className={cn(pricingColumnVariants({ variant, className }))} {...props}>
      <hr className={cn("via-foreground/60 absolute top-0 left-[10%] h-[1px] w-[80%] border-0 bg-linear-to-r from-transparent to-transparent", variant === "glow-brand" && "via-brand")} />
      <div className="flex flex-col gap-7">
        <header className="flex flex-col gap-2">
          <h2 className="flex items-center gap-2 font-bold">
            {icon && <div className="text-muted-foreground flex items-center gap-2">{icon}</div>}
            {name}
          </h2>
          <p className="text-muted-foreground max-w-[220px] text-sm">{description}</p>
        </header>
        <section className="flex flex-col gap-3">
          {showDiscounts && <div className="flex h-6 items-baseline gap-1">{originalPrice && <span className="text-muted-foreground text-lg font-medium line-through">${originalPrice}</span>}</div>}
          <div className="flex items-center gap-3 lg:flex-col lg:items-start xl:flex-row xl:items-center">
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-1">
                <span className="text-muted-foreground text-2xl font-bold">$</span>
                <span className="text-6xl font-bold">{price}</span>
              </div>
            </div>
            <div className="flex min-h-[40px] flex-col">
              {price > 0 && (<><span className="text-sm">one-time payment</span><span className="text-muted-foreground text-sm">plus local taxes</span></>)}
            </div>
          </div>
          {showDiscounts && <div className="h-6">{discountCode && <p className="text-brand-foreground text-sm font-medium">{discountPercentage}% off with code <Badge variant="brand-secondary">{discountCode}</Badge></p>}</div>}
        </section>
        <Button variant={cta.variant} size="lg" asChild><Link href={cta.href}>{cta.label}</Link></Button>
        <p className="text-muted-foreground min-h-[40px] max-w-[220px] text-sm">{priceNote}</p>
        <hr className="border-input" />
      </div>
      <div>
        <ul className="flex flex-col gap-2">
          {features.map((feature) => (<li key={feature} className="flex items-center gap-2 text-sm"><CircleCheckBig className="text-muted-foreground size-4 shrink-0" />{feature}</li>))}
        </ul>
      </div>
    </div>
  );
}

export { pricingColumnVariants };
```


---

## Section Components

### components/sections/navbar/default.tsx
```tsx
import { type VariantProps } from "class-variance-authority";
import { Menu } from "lucide-react";
import { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import LaunchUI from "../../logos/launch-ui";
import { Button, buttonVariants } from "../../ui/button";
import { Navbar as NavbarComponent, NavbarLeft, NavbarRight } from "../../ui/navbar";
import Navigation from "../../ui/navigation";
import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet";

interface NavbarLink { text: string; href: string; }
interface NavbarActionProps { text: string; href: string; variant?: VariantProps<typeof buttonVariants>["variant"]; icon?: ReactNode; iconRight?: ReactNode; isButton?: boolean; }
interface NavbarProps { logo?: ReactNode; name?: string; homeUrl?: string; mobileLinks?: NavbarLink[]; actions?: NavbarActionProps[]; showNavigation?: boolean; customNavigation?: ReactNode; className?: string; }

export default function Navbar({
  logo = <LaunchUI />,
  name = "ReText",
  homeUrl = "#",
  mobileLinks = [
    { text: "Getting Started", href: "#" },
    { text: "Components", href: "#" },
    { text: "Documentation", href: "#" },
  ],
  actions = [
    { text: "Sign in", href: "#", isButton: false },
    { text: "Get Started", href: "#", isButton: true, variant: "default" },
  ],
  showNavigation = true,
  customNavigation,
  className,
}: NavbarProps) {
  return (
    <header className={cn("sticky top-0 z-50 -mb-4 px-4 pb-4", className)}>
      <div className="fade-bottom bg-background/15 absolute left-0 h-24 w-full backdrop-blur-lg"></div>
      <div className="max-w-container relative mx-auto">
        <NavbarComponent>
          <NavbarLeft>
            <a href={homeUrl} className="flex items-center gap-2 text-xl font-bold">{logo}{name}</a>
            {showNavigation && (customNavigation || <Navigation />)}
          </NavbarLeft>
          <NavbarRight>
            {actions.map((action, index) =>
              action.isButton ? (
                <Button key={index} variant={action.variant || "default"} asChild>
                  <a href={action.href}>{action.icon}{action.text}{action.iconRight}</a>
                </Button>
              ) : (
                <a key={index} href={action.href} className="hidden text-sm md:block">{action.text}</a>
              )
            )}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0 md:hidden">
                  <Menu className="size-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="grid gap-6 text-lg font-medium">
                  <a href={homeUrl} className="flex items-center gap-2 text-xl font-bold"><span>{name}</span></a>
                  {mobileLinks.map((link, index) => (
                    <a key={index} href={link.href} className="text-muted-foreground hover:text-foreground">{link.text}</a>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </NavbarRight>
        </NavbarComponent>
      </div>
    </header>
  );
}
```

### components/sections/hero/default.tsx
```tsx
import { type VariantProps } from "class-variance-authority";
import { ArrowRightIcon } from "lucide-react";
import { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import Github from "../../logos/github";
import { Badge } from "../../ui/badge";
import { Button, buttonVariants } from "../../ui/button";
import Glow from "../../ui/glow";
import { Mockup, MockupFrame } from "../../ui/mockup";
import Screenshot from "../../ui/screenshot";
import { Section } from "../../ui/section";

interface HeroButtonProps { href: string; text: string; variant?: VariantProps<typeof buttonVariants>["variant"]; icon?: ReactNode; iconRight?: ReactNode; }
interface HeroProps { title?: string; description?: string; mockup?: ReactNode | false; badge?: ReactNode | false; buttons?: HeroButtonProps[] | false; className?: string; }

export default function Hero({
  title = "Give your big idea the design it deserves",
  description = "Professionally designed blocks and templates built with React, Shadcn/ui and Tailwind that will help your product stand out.",
  mockup = <Screenshot srcLight="/dashboard-light.png" srcDark="/dashboard-dark.png" alt="ReText app screenshot" width={1248} height={765} className="w-full" />,
  badge = <Badge variant="outline" className="animate-appear"><span className="text-muted-foreground">New version of ReText is out!</span><a href="#" className="flex items-center gap-1">Get started<ArrowRightIcon className="size-3" /></a></Badge>,
  buttons = [
    { href: "#", text: "Get Started", variant: "default" },
    { href: "#", text: "Github", variant: "glow", icon: <Github className="mr-2 size-4" /> },
  ],
  className,
}: HeroProps) {
  return (
    <Section className={cn("fade-bottom overflow-hidden pb-0 sm:pb-0 md:pb-0", className)}>
      <div className="max-w-container mx-auto flex flex-col gap-12 pt-16 sm:gap-24">
        <div className="flex flex-col items-center gap-6 text-center sm:gap-12">
          {badge !== false && badge}
          <h1 className="animate-appear from-foreground to-foreground dark:to-muted-foreground relative z-10 inline-block bg-linear-to-r bg-clip-text text-4xl leading-tight font-semibold text-balance text-transparent drop-shadow-2xl sm:text-6xl sm:leading-tight md:text-8xl md:leading-tight">{title}</h1>
          <p className="text-md animate-appear text-muted-foreground relative z-10 max-w-[740px] font-medium text-balance opacity-0 delay-100 sm:text-xl">{description}</p>
          {buttons !== false && buttons.length > 0 && (
            <div className="animate-appear relative z-10 flex justify-center gap-4 opacity-0 delay-300">
              {buttons.map((button, index) => (
                <Button key={index} variant={button.variant || "default"} size="lg" asChild>
                  <a href={button.href}>{button.icon}{button.text}{button.iconRight}</a>
                </Button>
              ))}
            </div>
          )}
          {mockup !== false && (
            <div className="relative w-full pt-12">
              <MockupFrame className="animate-appear opacity-0 delay-700" size="small">
                <Mockup type="responsive" className="bg-background/90 w-full rounded-xl border-0">{mockup}</Mockup>
              </MockupFrame>
              <Glow variant="top" className="animate-appear-zoom opacity-0 delay-1000" />
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
```

### components/sections/logos/default.tsx
```tsx
import { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import Figma from "../../logos/figma";
import React from "../../logos/react";
import ShadcnUi from "../../logos/shadcn-ui";
import Tailwind from "../../logos/tailwind";
import TypeScript from "../../logos/typescript";
import { Badge } from "../../ui/badge";
import Logo from "../../ui/logo";
import { Section } from "../../ui/section";

interface LogosProps { title?: string; badge?: ReactNode | false; logos?: ReactNode[] | false; className?: string; }

export default function Logos({
  title = "Built with industry-standard tools and best practices",
  badge = <Badge variant="outline" className="border-brand/30 text-brand">Last updated: {siteConfig.stats.updated}</Badge>,
  logos = [
    <Logo key="figma" image={Figma} name="Figma" />,
    <Logo key="react" image={React} name="React" version="19.2.1" />,
    <Logo key="typescript" image={TypeScript} name="TypeScript" version="5.9.3" />,
    <Logo key="shadcn" image={ShadcnUi} name="Shadcn/ui" version="3.5.1" badge="New" />,
    <Logo key="tailwind" image={Tailwind} name="Tailwind" version="4.1.14" />,
  ],
  className,
}: LogosProps) {
  return (
    <Section className={className}>
      <div className="max-w-container mx-auto flex flex-col items-center gap-8 text-center">
        <div className="flex flex-col items-center gap-6">
          {badge !== false && badge}
          <h2 className="text-md font-semibold sm:text-2xl">{title}</h2>
        </div>
        {logos !== false && logos.length > 0 && <div className="flex flex-wrap items-center justify-center gap-8">{logos}</div>}
      </div>
    </Section>
  );
}
```

### components/sections/items/default.tsx
```tsx
import { BlocksIcon, EclipseIcon, FastForwardIcon, LanguagesIcon, MonitorSmartphoneIcon, RocketIcon, ScanFaceIcon, SquarePenIcon } from "lucide-react";
import { ReactNode } from "react";
import { Item, ItemDescription, ItemIcon, ItemTitle } from "../../ui/item";
import { Section } from "../../ui/section";

interface ItemProps { title: string; description: string; icon: ReactNode; }
interface ItemsProps { title?: string; items?: ItemProps[] | false; className?: string; }

export default function Items({
  title = "Everything you need. Nothing you don't.",
  items = [
    { title: "Accessibility first", description: "Fully WCAG 2.0 compliant, made with best a11y practices", icon: <ScanFaceIcon className="size-5 stroke-1" /> },
    { title: "Responsive design", description: "Looks and works great on any device and screen size", icon: <MonitorSmartphoneIcon className="size-5 stroke-1" /> },
    { title: "Light and dark mode", description: "Seamless switching between color schemes, 6 themes included", icon: <EclipseIcon className="size-5 stroke-1" /> },
    { title: "Easy to customize", description: "Flexible options to match your product or brand", icon: <BlocksIcon className="size-5 stroke-1" /> },
    { title: "Top-level performance", description: "Made for lightning-fast load times and smooth interactions", icon: <FastForwardIcon className="size-5 stroke-1" /> },
    { title: "Production ready", description: "Thoroughly tested and launch-prepared", icon: <RocketIcon className="size-5 stroke-1" /> },
    { title: "Made for localisation", description: "Easy to implement support for multiple languages and regions", icon: <LanguagesIcon className="size-5 stroke-1" /> },
    { title: "CMS friendly", description: "Built to work with your any headless content management system", icon: <SquarePenIcon className="size-5 stroke-1" /> },
  ],
  className,
}: ItemsProps) {
  return (
    <Section className={className}>
      <div className="max-w-container mx-auto flex flex-col items-center gap-6 sm:gap-20">
        <h2 className="max-w-[560px] text-center text-3xl leading-tight font-semibold sm:text-5xl sm:leading-tight">{title}</h2>
        {items !== false && items.length > 0 && (
          <div className="grid auto-rows-fr grid-cols-2 gap-0 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {items.map((item, index) => (
              <Item key={index}>
                <ItemTitle className="flex items-center gap-2"><ItemIcon>{item.icon}</ItemIcon>{item.title}</ItemTitle>
                <ItemDescription>{item.description}</ItemDescription>
              </Item>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
```


### components/sections/stats/default.tsx
```tsx
import { siteConfig } from "@/config/site";
import { Section } from "../../ui/section";

interface StatItemProps { label?: string; value: string | number; suffix?: string; description?: string; }
interface StatsProps { items?: StatItemProps[] | false; className?: string; }

export default function Stats({
  items = [
    { label: "used by", value: Math.round(siteConfig.stats.figma / 100) / 10, suffix: "k", description: "designers on Figma Community" },
    { label: "over", value: siteConfig.stats.github, description: "clones and forks of the template on Github" },
    { label: "already", value: Math.round(siteConfig.stats.cli / 100) / 10, suffix: "k", description: "installations with shadcn/ui CLI" },
    { label: "includes", value: siteConfig.stats.sections, description: "blocks and sections" },
  ],
  className,
}: StatsProps) {
  return (
    <Section className={className}>
      <div className="container mx-auto max-w-[960px]">
        {items !== false && items.length > 0 && (
          <div className="grid grid-cols-2 gap-12 sm:grid-cols-4">
            {items.map((item, index) => (
              <div key={index} className="flex flex-col items-start gap-3 text-left">
                {item.label && <div className="text-muted-foreground text-sm font-semibold">{item.label}</div>}
                <div className="flex items-baseline gap-2">
                  <div className="from-foreground to-foreground dark:to-brand bg-linear-to-r bg-clip-text text-4xl font-medium text-transparent drop-shadow-[2px_1px_24px_var(--brand-foreground)] transition-all duration-300 sm:text-5xl md:text-6xl">{item.value}</div>
                  {item.suffix && <div className="text-brand text-2xl font-semibold">{item.suffix}</div>}
                </div>
                {item.description && <div className="text-muted-foreground text-sm font-semibold text-pretty">{item.description}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
```

### components/sections/pricing/default.tsx
```tsx
import { User, Users } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { PricingColumn, PricingColumnProps } from "../../ui/pricing-column";
import { Section } from "../../ui/section";

interface PricingProps { title?: string | false; description?: string | false; plans?: PricingColumnProps[] | false; className?: string; }

export default function Pricing({
  title = "Build your dream landing page, today.",
  description = "Get lifetime access to all the components. No recurring fees. Just simple, transparent pricing.",
  plans = [
    {
      name: "Free",
      description: "For everyone starting out on a website for their big idea",
      price: 0,
      priceNote: "Free and open-source forever.",
      cta: { variant: "glow", label: "Get started for free", href: "#" },
      features: ["1 website template", "9 blocks and sections", "4 custom animations"],
      variant: "default",
      className: "hidden lg:flex",
    },
    {
      name: "Pro",
      icon: <User className="size-4" />,
      description: "For early-stage founders, solopreneurs and indie devs",
      price: 149,
      priceNote: "Lifetime access. Free updates. No recurring fees.",
      cta: { variant: "default", label: "Get all-access", href: "#" },
      features: [`${siteConfig.stats.templates} templates`, `${siteConfig.stats.sections} blocks and sections`, `${siteConfig.stats.illustrations} illustrations`, `${siteConfig.stats.animations} custom animations`],
      variant: "glow-brand",
    },
    {
      name: "Pro Team",
      icon: <Users className="size-4" />,
      description: "For teams and agencies working on cool products together",
      price: 749,
      priceNote: "Lifetime access. Free updates. No recurring fees.",
      cta: { variant: "default", label: "Get all-access for your team", href: "#" },
      features: ["All the templates, components and sections available for your entire team"],
      variant: "glow",
    },
  ],
  className = "",
}: PricingProps) {
  return (
    <Section className={cn(className)}>
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12">
        {(title || description) && (
          <div className="flex flex-col items-center gap-4 px-4 text-center sm:gap-8">
            {title && <h2 className="text-3xl leading-tight font-semibold sm:text-5xl sm:leading-tight">{title}</h2>}
            {description && <p className="text-md text-muted-foreground max-w-[600px] font-medium sm:text-xl">{description}</p>}
          </div>
        )}
        {plans !== false && plans.length > 0 && (
          <div className="max-w-container mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <PricingColumn key={plan.name} name={plan.name} icon={plan.icon} description={plan.description} price={plan.price} priceNote={plan.priceNote} cta={plan.cta} features={plan.features} variant={plan.variant} className={plan.className} />
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
```

### components/sections/faq/default.tsx
```tsx
import Link from "next/link";
import { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion";
import { Section } from "../../ui/section";

interface FAQItemProps { question: string; answer: ReactNode; value?: string; }
interface FAQProps { title?: string; items?: FAQItemProps[] | false; className?: string; }

export default function FAQ({
  title = "Questions and Answers",
  items = [
    {
      question: "Why building a great landing page is critical for your business?",
      answer: (<><p className="text-muted-foreground mb-4 max-w-[640px] text-balance">In today&apos;s AI-driven world, standing out is harder than ever. While anyone can build a product, a professional landing page makes the difference between success and failure.</p><p className="text-muted-foreground mb-4 max-w-[640px] text-balance">ReText helps you ship faster without compromising on quality.</p></>),
    },
    {
      question: "Why use ReText instead of a no-code tool?",
      answer: (<><p className="text-muted-foreground mb-4 max-w-[600px]">No-code tools lock you into their ecosystem with recurring fees and limited control. They often come with performance issues and make it difficult to integrate with your product.</p><p className="text-muted-foreground mb-4 max-w-[600px]">You can&apos;t even change your hosting provider and basic things like web analytics come as extra costs and paid add-ons.</p><p className="text-muted-foreground mb-4 max-w-[600px]">What might seem like a convenient solution today could paint you into a corner tomorrow, limiting your ability to scale and adapt. ReText gives you full control of your code while maintaining professional quality.</p></>),
    },
    {
      question: "How ReText is different from other components libraries and templates?",
      answer: (<><p className="text-muted-foreground mb-4 max-w-[580px]">ReText stands out with premium design quality and delightful touches of custom animations and illustrations.</p><p className="text-muted-foreground mb-4 max-w-[580px]">All components are carefully crafted to help position your product as a professional tool, avoiding the generic template look.</p><p className="text-muted-foreground mb-4 max-w-[640px] text-balance">Unlike many libraries that rely on outdated CSS practices and old dependencies, ReText is built with modern technologies and best practices in mind.</p></>),
    },
    {
      question: 'Why exactly does it mean that "The code is yours"?',
      answer: (<><p className="text-muted-foreground mb-4 max-w-[580px]">The basic version of ReText is open-source and free forever, under a do-whatever-you-want license.</p><p className="text-muted-foreground mb-4 max-w-[580px]">The pro version that contains more components and options is a one-time purchase that gives you lifetime access to all current and future content. Use it for unlimited personal and commercial projects - no recurring fees or restrictions.</p><p className="text-muted-foreground mb-4 max-w-[580px]">For complete details about licensing and usage rights, check out <Link href="/pricing" className="text-foreground underline">the pricing page</Link>.</p></>),
    },
    {
      question: "Are Figma files included?",
      answer: (<p className="text-muted-foreground mb-4 max-w-[580px]">Yes! The complete ReText template is available for free on the <Link href="https://www.figma.com/community/file/1420131743903900629/launch-ui-landing-page-components-ui-kit" className="text-foreground underline">Figma community</Link>.</p>),
    },
    {
      question: "Can I get a discount?",
      answer: (<p className="text-muted-foreground mb-4 max-w-[580px]">Actually, yes! I&apos;m always acively looking for beta testers of new features. If you are interested in exchanging feedback for a discount, please contact me via <a href={siteConfig.links.email} className="underline underline-offset-2">email</a>.</p>),
    },
  ],
  className,
}: FAQProps) {
  return (
    <Section className={className}>
      <div className="max-w-container mx-auto flex flex-col items-center gap-8">
        <h2 className="text-center text-3xl font-semibold sm:text-5xl">{title}</h2>
        {items !== false && items.length > 0 && (
          <Accordion type="single" collapsible className="w-full max-w-[800px]">
            {items.map((item, index) => (
              <AccordionItem key={index} value={item.value || `item-${index + 1}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </Section>
  );
}
```

### components/sections/cta/default.tsx
```tsx
import { type VariantProps } from "class-variance-authority";
import { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "../../ui/button";
import Glow from "../../ui/glow";
import { Section } from "../../ui/section";

interface CTAButtonProps { href: string; text: string; variant?: VariantProps<typeof buttonVariants>["variant"]; icon?: ReactNode; iconRight?: ReactNode; }
interface CTAProps { title?: string; buttons?: CTAButtonProps[] | false; className?: string; }

export default function CTA({
  title = "Start building",
  buttons = [{ href: "#", text: "Get Started", variant: "default" }],
  className,
}: CTAProps) {
  return (
    <Section className={cn("group relative overflow-hidden", className)}>
      <div className="max-w-container relative z-10 mx-auto flex flex-col items-center gap-6 text-center sm:gap-8">
        <h2 className="max-w-[640px] text-3xl leading-tight font-semibold sm:text-5xl sm:leading-tight">{title}</h2>
        {buttons !== false && buttons.length > 0 && (
          <div className="flex justify-center gap-4">
            {buttons.map((button, index) => (
              <Button key={index} variant={button.variant || "default"} size="lg" asChild>
                <a href={button.href}>{button.icon}{button.text}{button.iconRight}</a>
              </Button>
            ))}
          </div>
        )}
      </div>
      <div className="absolute top-0 left-0 h-full w-full translate-y-[1rem] opacity-80 transition-all duration-500 ease-in-out group-hover:translate-y-[-2rem] group-hover:opacity-100">
        <Glow variant="bottom" />
      </div>
    </Section>
  );
}
```

### components/sections/footer/default.tsx
```tsx
import { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import LaunchUI from "../../logos/launch-ui";
import { Footer, FooterBottom, FooterColumn, FooterContent } from "../../ui/footer";
import { ModeToggle } from "../../ui/mode-toggle";

interface FooterLink { text: string; href: string; }
interface FooterColumnProps { title: string; links: FooterLink[]; }
interface FooterProps { logo?: ReactNode; name?: string; columns?: FooterColumnProps[]; copyright?: string; policies?: FooterLink[]; showModeToggle?: boolean; className?: string; }

export default function FooterSection({
  logo = <LaunchUI />,
  name = "ReText",
  columns = [
    { title: "Product", links: [{ text: "Changelog", href: "#" }, { text: "Documentation", href: "#" }] },
    { title: "Company", links: [{ text: "About", href: "#" }, { text: "Careers", href: "#" }, { text: "Blog", href: "#" }] },
    { title: "Contact", links: [{ text: "Discord", href: "#" }, { text: "Twitter", href: "#" }, { text: "Github", href: "#" }] },
  ],
  copyright = "© 2025 ReText. All rights reserved",
  policies = [{ text: "Privacy Policy", href: "#" }, { text: "Terms of Service", href: "#" }],
  showModeToggle = true,
  className,
}: FooterProps) {
  return (
    <footer className={cn("bg-background w-full px-4", className)}>
      <div className="max-w-container mx-auto">
        <Footer>
          <FooterContent>
            <FooterColumn className="col-span-2 sm:col-span-3 md:col-span-1">
              <div className="flex items-center gap-2">{logo}<h3 className="text-xl font-bold">{name}</h3></div>
            </FooterColumn>
            {columns.map((column, index) => (
              <FooterColumn key={index}>
                <h3 className="text-md pt-1 font-semibold">{column.title}</h3>
                {column.links.map((link, linkIndex) => (
                  <a key={linkIndex} href={link.href} className="text-muted-foreground text-sm">{link.text}</a>
                ))}
              </FooterColumn>
            ))}
          </FooterContent>
          <FooterBottom>
            <div>{copyright}</div>
            <div className="flex items-center gap-4">
              {policies.map((policy, index) => (<a key={index} href={policy.href}>{policy.text}</a>))}
              {showModeToggle && <ModeToggle />}
            </div>
          </FooterBottom>
        </Footer>
      </div>
    </footer>
  );
}
```

---

## Public Assets

You'll need to add these images to your `public/` folder:
- `dashboard-light.png` - Light mode screenshot
- `dashboard-dark.png` - Dark mode screenshot  
- `favicon.svg` - Your favicon

---

## Installation Steps

1. Create a new Next.js project or use existing one
2. Copy all the files above to their respective locations
3. Run `npm install` to install dependencies
4. Add your images to the `public/` folder
5. Update `config/site.ts` with your own content
6. Run `npm run dev` to start the development server

That's it! You now have the complete landing page code.
