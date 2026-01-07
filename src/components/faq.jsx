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
        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">
          Frequently Asked Questions
        </h2>
        <p className="mt-3 text-gray-600 dark:text-gray-400">
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
          className="rounded-lg border border-gray-200 bg-white px-6 dark:border-gray-800 dark:bg-gray-900"
        >
          <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline dark:text-white">
            What is Appliquo and how does it help me?
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-3 text-gray-600 dark:text-gray-400">
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
          className="rounded-lg border border-gray-200 bg-white px-6 dark:border-gray-800 dark:bg-gray-900"
        >
          <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline dark:text-white">
            Is Appliquo really free? Are there any hidden costs?
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-3 text-gray-600 dark:text-gray-400">
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
          className="rounded-lg border border-gray-200 bg-white px-6 dark:border-gray-800 dark:bg-gray-900"
        >
          <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline dark:text-white">
            How does the AI Assistant work?
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-3 text-gray-600 dark:text-gray-400">
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

        <AccordionItem
          value="item-4"
          className="rounded-lg border border-gray-200 bg-white px-6 dark:border-gray-800 dark:bg-gray-900"
        >
          <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline dark:text-white">
            Is my data secure and private?
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-3 text-gray-600 dark:text-gray-400">
            <p>
              Absolutely. Your privacy and data security are our top priorities.
              All your application data is stored locally in your browser,
              giving you complete control over your information.
            </p>
            <p>
              We don't store your personal information, resumes, or application
              details on our servers. Your data stays on your device and is
              never shared with third parties.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="item-5"
          className="rounded-lg border border-gray-200 bg-white px-6 dark:border-gray-800 dark:bg-gray-900"
        >
          <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline dark:text-white">
            Can I access Appliquo on multiple devices?
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-3 text-gray-600 dark:text-gray-400">
            <p>
              Currently, Appliquo stores data locally in your browser's storage.
              This means your applications are device-specific and won't
              automatically sync across multiple devices.
            </p>
            <p>
              We're working on cloud sync features for future updates, which
              will allow you to access your applications from any device while
              maintaining the same level of security and privacy.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
