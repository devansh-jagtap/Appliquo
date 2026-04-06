import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles, Zap, Target } from "lucide-react";
import { Faq } from "@/components/landing/FAQ";
import Footer from "@/components/layout/Footer";

export default function HeroSection() {
  return (
    <>
      <header className="fixed inset-x-0 top-3 z-50 mx-auto w-fit">
        <div className="flex items-center gap-4 rounded-full py-2 pl-5 pr-2 backdrop-blur-xl bg-card/80 border border-border shadow-lg">
          Appliquo
          <Button asChild className="pr-1.5 rounded-full" size="sm">
            <Link to="/auth">
              <span className="text-nowrap">Get started</span>
              <ChevronRight className="opacity-50" />
            </Link>
          </Button>
        </div>
      </header>
      <main className="overflow-hidden">
        <section className="relative min-h-screen flex items-center justify-center">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="/bg-img.png"
              alt="Background"
              className="w-full h-full object-cover"
            />
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background/95"></div>
            {/* Additional blur overlay for glassmorphism effect */}
            <div className="absolute inset-0 backdrop-blur-[2px]"></div>
          </div>

          <div className="relative pb-8 pt-20 z-10">
            <div className="relative z-10 mx-auto w-full max-w-5xl px-6">
              <div className="pointer-events-none relative mx-auto max-w-xl opacity-75">
                <div className="absolute inset-0 bg-primary/20 blur-3xl"></div>
              </div>
              <div className="mx-auto mt-6 max-w-md text-center">
                <h1 className="text-balance font-serif text-4xl font-medium sm:text-5xl text-foreground drop-shadow-lg">
                  Your Dream Job Awaits. Track It Better.
                </h1>
                <p className="mt-4 text-balance text-muted-foreground drop-shadow-md">
                  Appliquo helps you organize, track, and ace every job
                  application with AI-powered insights.
                </p>

                <Button
                  asChild
                  className="mt-6 pr-1.5 rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  <Link to="/auth">
                    <span className="text-nowrap">Get Started Free</span>
                    <ChevronRight className="opacity-50" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Glass Cards Section */}
        <section className="relative -mt-24 pb-16 px-4 z-10">
          {/* Background for cards section */}
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-background"></div>

          <div className="mx-auto max-w-7xl relative z-10">
            <div className="grid gap-8 md:grid-cols-3">
              {/* Card 1 */}
              <div className="group relative rounded-3xl backdrop-blur-xl bg-card/70 border border-border p-8 shadow-lg transition-all hover:shadow-2xl hover:bg-card/90">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  AI-Powered Insights
                </h3>
                <p className="text-muted-foreground">
                  Get intelligent recommendations and insights to optimize your
                  job applications with our advanced AI assistant.
                </p>
              </div>

              {/* Card 2 */}
              <div className="group relative rounded-3xl backdrop-blur-xl bg-card/70 border border-border p-8 shadow-lg transition-all hover:shadow-2xl hover:bg-card/90">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <Zap className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  Lightning Fast
                </h3>
                <p className="text-muted-foreground">
                  Track unlimited applications with real-time updates. Never
                  miss a deadline or follow-up opportunity.
                </p>
              </div>

              {/* Card 3 */}
              <div className="group relative rounded-3xl backdrop-blur-xl bg-card/70 border border-border p-8 shadow-lg transition-all hover:shadow-2xl hover:bg-card/90">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  Stay Organized
                </h3>
                <p className="text-muted-foreground">
                  Centralize your entire job search in one beautiful, intuitive
                  dashboard. No more scattered spreadsheets.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <Faq />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
