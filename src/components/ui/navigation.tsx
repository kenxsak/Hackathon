import * as React from "react";
import { ReactNode } from "react";
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
    { title: "AI Tools", content: "default" },
    { title: "Writing Tools", content: "components" },
    { title: "Contact", isLink: true, href: "/contact" },
  ],
  components = [
    { title: "Paraphraser", href: "/paraphraser", description: "Rewrite content in multiple styles while preserving meaning and improving clarity." },
    { title: "Grammar Checker", href: "/grammar-checker", description: "Advanced grammar, spelling, and punctuation correction with explanations." },
    { title: "Plagiarism Checker", href: "/plagiarism-checker", description: "Scan your content for potential plagiarism and ensure originality." },
    { title: "Summarizer", href: "/summarizer", description: "Condense long texts into concise summaries in various formats." },
    { title: "Translator", href: "/translate", description: "Translate content between 50+ languages with AI accuracy." },
    { title: "AI Image Generator", href: "/ai-image-generator", description: "Create stunning images from text descriptions using Pollinations AI." },
  ],
  logo = <LaunchUI />,
  logoTitle = "ReText",
  logoDescription = "AI-powered writing assistant with  AI detection, humanizer, and comprehensive writing tools.",
  logoHref = "/",
  introItems = [
    { title: "AI Detector", href: "/ai-detector", description: "Detect AI-generated content with 98% accuracy using  analysis." },
    { title: "AI Humanizer", href: "/ai-humanizer", description: "Transform AI text into natural, human-like writing." },
    { title: "AI Chat", href: "/ai-chat", description: "Get instant help with writing and research using Gemini 3 Pro." },
  ],
}: NavigationProps) {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {menuItems.map((item, index) => (
          <NavigationMenuItem key={index}>
            {item.isLink ? (
              <NavigationMenuLink className={navigationMenuTriggerStyle()} href={item.href}>
                {item.title}
              </NavigationMenuLink>
            ) : (
              <>
                <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  {item.content === "default" && (
                    <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a className="flex h-full w-full flex-col justify-end rounded-lg bg-zinc-900 border border-zinc-800/50 p-6 no-underline outline-hidden select-none hover:bg-zinc-800/50 transition-colors" href={logoHref}>
                            {logo}
                            <div className="mt-4 mb-2 text-lg font-medium text-white">{logoTitle}</div>
                            <p className="text-zinc-400 text-sm leading-tight">{logoDescription}</p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      {introItems.map((introItem, introIndex) => (
                        <ListItem key={introIndex} href={introItem.href} title={introItem.title}>
                          {introItem.description}
                        </ListItem>
                      ))}
                    </ul>
                  )}
                  {item.content === "components" && (
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {components.map((component) => (
                        <ListItem key={component.title} title={component.title} href={component.href}>
                          {component.description}
                        </ListItem>
                      ))}
                    </ul>
                  )}
                </NavigationMenuContent>
              </>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({ className, title, children, href, ...props }: React.ComponentProps<"a"> & { title: string }) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a href={href} className={cn("hover:bg-zinc-800/80 focus:bg-zinc-800/80 block space-y-1 rounded-lg p-3 leading-none no-underline outline-hidden transition-colors select-none", className)} {...props}>
          <div className="text-sm leading-none font-medium text-white">{title}</div>
          <p className="text-zinc-400 line-clamp-2 text-sm leading-snug">{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  );
}
