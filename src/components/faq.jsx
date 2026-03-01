import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Faq() {
  return (
    <div className="relative z-10 mx-auto mt-32 w-full max-w-4xl px-4">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-foreground md:text-4xl">
          Frequently Asked Questions
        </h2>
        <p className="mt-3 text-muted-foreground">
          Everything you need to know about Appliquo
        </p>
      </div>
      <Accordion
        type="single"
        collapsible
        className="w-full space-y-4"
        defaultValue="item-1"
      >
        <AccordionItem
          value="item-1"
          className="rounded-lg border border-border bg-card px-6"
        >
          <AccordionTrigger className="text-left font-semibold text-card-foreground hover:no-underline">
            What is Appliquo and how does it help me?
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-3 text-muted-foreground">
            <p>
              Appliquo is an AI-powered job application tracking platform
              designed to streamline your job search process. It helps you
              organize all your applications in one place, track their status,
              and never miss important follow-ups.
            </p>
            <p>
              With built-in AI assistance, you can optimize your resume and
              cover letters for each application, analyze skill gaps, and get
              personalized suggestions to improve your success rate.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="item-2"
          className="rounded-lg border border-border bg-card px-6"
        >
          <AccordionTrigger className="text-left font-semibold text-card-foreground hover:no-underline">
            Is Appliquo really free? Are there any hidden costs?
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-3 text-muted-foreground">
            <p>
              Yes, Appliquo is completely free to use. There are no hidden
              costs, subscription fees, or credit card requirements. You can
              track unlimited job applications and use the AI assistant without
              any charges.
            </p>
            <p>
              Our mission is to make job searching easier and more organized for
              everyone, which is why we keep our core features free for all
              users.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="item-3"
          className="rounded-lg border border-border bg-card px-6"
        >
          <AccordionTrigger className="text-left font-semibold text-card-foreground hover:no-underline">
            How does the AI Assistant work?
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-3 text-muted-foreground">
            <p>
              Our AI Assistant analyzes job descriptions and your resume to
              provide tailored suggestions. Simply paste the job description and
              your resume, and the AI will generate personalized improvements
              for your resume, create a customized cover letter, and identify
              any skill gaps.
            </p>
            <p>
              The AI uses advanced natural language processing to understand job
              requirements and match them with your qualifications, helping you
              present your best self to potential employers.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
