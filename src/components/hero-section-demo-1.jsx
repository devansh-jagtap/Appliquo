import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  HiCheckCircle,
  HiChartBar,
  HiSparkles,
  HiBriefcase,
} from "react-icons/hi2";
import { Faq } from "./faq";

const Navbar = () => {
  return (
    <nav className="relative z-50 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <HiBriefcase className="h-8 w-8 text-blue-600" />
            <Link
              to="/"
              className="text-2xl font-bold text-gray-900 dark:text-white"
            >
              Appliquo
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              to="/assistant"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              AI Assistant
            </Link>
            <Link
              to="/auth"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Login / SignUp
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default function HeroSectionOne() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-white dark:bg-gray-900">
      <Navbar />
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-100 opacity-20 blur-3xl dark:bg-blue-900" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-100 opacity-20 blur-3xl dark:bg-blue-900" />
      </div>

      {/* Main hero content */}
      <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-32">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Main heading with animation */}
          <h1 className="relative z-10 mx-auto max-w-5xl text-4xl font-bold tracking-tight text-gray-900 md:text-6xl lg:text-7xl dark:text-white">
            {"Track Every Application. Land Your Dream Job."
              .split(" ")
              .map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                    ease: "easeInOut",
                  }}
                  className="mr-3 inline-block"
                >
                  {word}
                </motion.span>
              ))}
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="relative z-10 mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 md:text-xl dark:text-gray-300"
          >
            Organize your job search with our intelligent tracking system.
            Monitor application status, prepare with AI-powered resume
            optimization, and never miss a follow-up.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="relative z-10 mt-10 flex flex-col gap-4 sm:flex-row sm:gap-6"
          >
            <Link to="/dashboard">
              <button className="rounded-lg bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5">
                Start Tracking Applications
              </button>
            </Link>
            <Link to="/assistant">
              <button className="rounded-lg border-2 border-gray-300 bg-white px-8 py-4 font-semibold text-gray-700 transition-all duration-300 hover:border-blue-600 hover:bg-gray-50 hover:-translate-y-0.5 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-blue-600 dark:hover:bg-gray-700">
                Try AI Assistant
              </button>
            </Link>
          </motion.div>

          {/* Feature badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="relative z-10 mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400"
          >
            <div className="flex items-center gap-2">
              <HiCheckCircle className="h-5 w-5 text-blue-600" />
              <span>Free forever</span>
            </div>
            <div className="flex items-center gap-2">
              <HiCheckCircle className="h-5 w-5 text-blue-600" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <HiCheckCircle className="h-5 w-5 text-blue-600" />
              <span>AI-powered insights</span>
            </div>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.2 }}
            className="relative z-10 mt-20 grid w-full max-w-5xl gap-6 md:grid-cols-3"
          >
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-800">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <HiBriefcase className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Application Tracking
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Keep all your job applications organized in one place. Track
                status, deadlines, and follow-ups effortlessly.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-800">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <HiSparkles className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                AI Resume Builder
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get personalized suggestions to improve your resume and cover
                letter for each job application.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-800">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <HiChartBar className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Progress Analytics
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Visualize your job search progress with insightful analytics and
                success metrics.
              </p>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <Faq />
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200 bg-white py-12 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <HiBriefcase className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Appliquo
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2024 Appliquo. AI-powered job application tracking.
            </p>
            <div className="flex gap-6">
              <Link
                to="/dashboard"
                className="text-sm text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
              >
                Dashboard
              </Link>
              <Link
                to="/assistant"
                className="text-sm text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
              >
                AI Assistant
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
