import { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion";
import { Section } from "../../ui/section";

interface FAQItemProps { question: string; answer: ReactNode; value?: string; }
interface FAQProps { title?: string; items?: FAQItemProps[] | false; className?: string; }

export default function FAQ({
  title = "Frequently Asked Questions",
  items = [
    {
      question: "How accurate is ReText's AI detection?",
      answer: (<><p className="text-muted-foreground mb-4 max-w-[640px] text-balance">ReText uses advanced  analysis powered by Gemini 3 Pro to detect AI-generated content with up to 98% accuracy. Our system analyzes lexical patterns, sentence structure, semantic consistency, and linguistic markers to provide reliable results.</p><p className="text-muted-foreground mb-4 max-w-[640px] text-balance">We highlight suspicious segments and provide detailed metrics including perplexity, burstiness, and repetitiveness scores.</p></>),
    },
    {
      question: "What AI models does ReText use?",
      answer: (<><p className="text-muted-foreground mb-4 max-w-[600px]">ReText is powered by Google&apos;s latest Gemini 3 Pro Preview model, which offers state-of-the-art language understanding and generation capabilities.</p><p className="text-muted-foreground mb-4 max-w-[600px]">For image generation, we use Pollinations AI, a free and powerful image generation service that creates stunning visuals from text descriptions.</p></>),
    },
    {
      question: "Can ReText humanize AI-generated content?",
      answer: (<><p className="text-muted-foreground mb-4 max-w-[580px]">Yes! Our AI Humanizer tool transforms AI-generated text into natural, human-like writing. It adds natural imperfections, varies sentence structure, and removes robotic patterns while preserving the original meaning.</p><p className="text-muted-foreground mb-4 max-w-[580px]">This is perfect for students, content creators, and professionals who want their AI-assisted content to sound more authentic.</p></>),
    },
    {
      question: "What writing tools are included?",
      answer: (<><p className="text-muted-foreground mb-4 max-w-[580px]">ReText includes a comprehensive suite of AI-powered writing tools:</p><ul className="text-muted-foreground mb-4 max-w-[580px] list-disc list-inside space-y-1"><li>AI Content Detector with  analysis</li><li>AI Humanizer to make text sound natural</li><li>Smart Paraphraser with multiple modes</li><li>Grammar & Spelling Checker</li><li>Plagiarism Checker</li><li>AI Chat Assistant</li><li>Multi-language Translator (50+ languages)</li><li>Text Summarizer</li><li>AI Image Generator</li></ul></>),
    },
    {
      question: "Is ReText free to use?",
      answer: (<p className="text-muted-foreground mb-4 max-w-[580px]">ReText offers free access to all core features. Simply create an account to start using our AI detection, paraphrasing, grammar checking, and other writing tools. No credit card required!</p>),
    },
    {
      question: "How many languages does ReText support?",
      answer: (<p className="text-muted-foreground mb-4 max-w-[580px]">ReText supports over 50 languages for translation and content analysis, including English, Spanish, French, German, Chinese, Japanese, Arabic, Hindi, and many more. Our AI detection works best with English content but supports multiple languages.</p>),
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
