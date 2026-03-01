import { Link } from "react-router-dom";

const footerColumns = [
  {
    title: "Pages",
    links: [
      { label: "Dashboard", to: "/dashboard" },
      { label: "Assistant", to: "/assistant" },
      { label: "Resumes", to: "/resumes" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  },
  {
    title: "Register",
    links: [
      { label: "Sign Up", to: "/auth" },
      { label: "Login", to: "/auth" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative min-h-[420px] border-t border-border bg-card/50 py-24 text-card-foreground mt-5">
      {/* Watermark - larger and centered for a nicer look */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
        aria-hidden
      >
        <span className="select-none text-[18rem] font-bold leading-none tracking-tighter text-muted/10 sm:text-[22rem]">
          Appliquo
        </span>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-14 lg:flex-row lg:items-start lg:justify-between">
          {/* Left: Branding & copyright */}
          <div className="flex flex-col gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold text-foreground"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground shadow-lg">
                AQ
              </span>
              Appliquo
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              © copyright Appliquo 2024. All rights reserved.
            </p>
          </div>

          {/* Right: Columns */}
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {footerColumns.map((col) => (
              <div key={col.title}>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
                  {col.title}
                </h3>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.to !== undefined ? (
                        <Link
                          to={link.to}
                          className="text-sm text-muted-foreground transition-colors hover:text-primary"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          target={link.external ? "_blank" : undefined}
                          rel={
                            link.external ? "noopener noreferrer" : undefined
                          }
                          className="text-sm text-muted-foreground transition-colors hover:text-primary"
                        >
                          {link.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
