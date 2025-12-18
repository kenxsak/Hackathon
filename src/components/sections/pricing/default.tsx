import { User, Users } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { PricingColumn, PricingColumnProps } from "../../ui/pricing-column";
import { Section } from "../../ui/section";

interface PricingProps { title?: string | false; description?: string | false; plans?: PricingColumnProps[] | false; className?: string; }

export default function Pricing({
  title = "Start Writing Better with AI",
  description = "Access all our powerful AI writing tools completely free. No credit card required.",
  plans = [
    {
      name: "Free",
      description: "Perfect for students and casual users",
      price: 0,
      priceNote: "Free forever. No credit card required.",
      cta: { variant: "glow", label: "Get Started Free", href: "/signup" },
      features: ["AI Content Detection", "Basic Paraphrasing", "Grammar Checker", "50+ Language Translation"],
      variant: "default",
      className: "hidden lg:flex",
    },
    {
      name: "Standard",
      icon: <User className="size-4" />,
      description: "For content creators and professionals",
      price: 0,
      priceNote: "Currently free during beta!",
      cta: { variant: "default", label: "Start Free Trial", href: "/signup" },
      features: ["Everything in Free", "AI Humanizer", "Plagiarism Checker", "AI Chat Assistant", "AI Image Generator"],
      variant: "glow-brand",
    },
    {
      name: "Team",
      icon: <Users className="size-4" />,
      description: "For teams and organizations",
      price: 0,
      priceNote: "Coming soon!",
      cta: { variant: "default", label: "Join Waitlist", href: "/signup" },
      features: ["Everything in Standard", "Team collaboration", "Priority support", "Custom integrations"],
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
