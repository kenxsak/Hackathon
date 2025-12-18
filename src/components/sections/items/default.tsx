import { BlocksIcon, EclipseIcon, FastForwardIcon, LanguagesIcon, MonitorSmartphoneIcon, RocketIcon, ScanFaceIcon, SquarePenIcon } from "lucide-react";
import { ReactNode } from "react";
import { Item, ItemDescription, ItemIcon, ItemTitle } from "../../ui/item";
import { Section } from "../../ui/section";

interface ItemProps { title: string; description: string; icon: ReactNode; }
interface ItemsProps { title?: string; items?: ItemProps[] | false; className?: string; }

export default function Items({
  title = "Powerful AI Writing Tools at Your Fingertips",
  items = [
    { title: "AI Content Detection", description: " analysis to detect AI-generated text with 98% accuracy using advanced linguistic patterns", icon: <ScanFaceIcon className="size-5 stroke-1" /> },
    { title: "AI Humanizer", description: "Transform AI-generated content into natural, human-like writing that bypasses detection", icon: <MonitorSmartphoneIcon className="size-5 stroke-1" /> },
    { title: "Smart Paraphraser", description: "Rewrite content in multiple styles while preserving meaning and improving clarity", icon: <EclipseIcon className="size-5 stroke-1" /> },
    { title: "Grammar Checker", description: "Advanced grammar, spelling, and punctuation correction with detailed explanations", icon: <BlocksIcon className="size-5 stroke-1" /> },
    { title: "Plagiarism Checker", description: "Scan your content for potential plagiarism and ensure originality", icon: <FastForwardIcon className="size-5 stroke-1" /> },
    { title: "AI Chat Assistant", description: "Get instant help with writing, research, and creative tasks using Gemini 3 Pro", icon: <RocketIcon className="size-5 stroke-1" /> },
    { title: "Multi-Language Support", description: "Translate and work with content in 50+ languages seamlessly", icon: <LanguagesIcon className="size-5 stroke-1" /> },
    { title: "AI Image Generator", description: "Create stunning images from text descriptions using Pollinations AI", icon: <SquarePenIcon className="size-5 stroke-1" /> },
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
