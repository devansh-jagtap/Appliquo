"use client";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";

import React, { useRef, useState } from "react";

export const Navbar = ({ children, className }) => {
  const ref = useRef(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <div ref={ref} className="relative w-full">
      <motion.div
        // IMPORTANT: Change this to class of `fixed` if you want the navbar to be fixed
        className={cn("sticky inset-x-0 top-20 z-40 w-full", className)}
      >
        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(child, { visible })
            : child,
        )}
      </motion.div>
    </div>
  );
};

export const NavBody = ({ children, className, visible }) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        width: visible ? "40%" : "100%",
        y: visible ? 20 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      style={{
        minWidth: "800px",
      }}
      className={cn(
        "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full bg-transparent px-4 py-2 lg:flex dark:bg-transparent",
        visible &&
          "backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 border-2 border-white/70 dark:border-gray-700/50 shadow-2xl",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const NavItems = ({ items, className, onItemClick }) => {
  const [hovered, setHovered] = useState(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium text-zinc-600 transition duration-200 hover:text-zinc-800 lg:flex lg:space-x-2",
        className,
      )}
    >
      {items.map((item, idx) => (
        <a
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className="relative px-4 py-2 text-neutral-600 dark:text-neutral-300"
          key={`link-${idx}`}
          href={item.link}
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered"
              className="absolute inset-0 h-full w-full rounded-full bg-gray-100 dark:bg-neutral-800"
            />
          )}
          <span className="relative z-20">{item.name}</span>
        </a>
      ))}
    </motion.div>
  );
};

export const MobileNav = ({ children, className, visible }) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        width: visible ? "90%" : "100%",
        paddingRight: visible ? "12px" : "0px",
        paddingLeft: visible ? "12px" : "0px",
        borderRadius: visible ? "4px" : "2rem",
        y: visible ? 20 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      className={cn(
        "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-0 py-2 lg:hidden",
        visible &&
          "backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 border-2 border-white/70 dark:border-gray-700/50 shadow-2xl rounded-full",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({ children, className }) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavMenu = ({ children, className, isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-3xl backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-2 border-white/80 dark:border-gray-700/50 px-4 py-8 shadow-2xl",
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({ isOpen, onClick }) => {
  return isOpen ? (
    <X className="text-black dark:text-white" onClick={onClick} />
  ) : (
    <Menu className="text-black dark:text-white" onClick={onClick} />
  );
};

export const NavbarLogo = () => {
  return (
    <a
      href="#"
      className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black"
    >
      <img
        src="https://assets.aceternity.com/logo-dark.png"
        alt="logo"
        width={30}
        height={30}
      />
      <span className="font-medium text-black dark:text-white">Startup</span>
    </a>
  );
};

export const NavbarButton = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  ...props
}) => {
  const baseStyles =
    "px-4 py-2 rounded-xl backdrop-blur-lg bg-white/70 dark:bg-gray-800/70 text-black dark:text-white text-sm font-semibold relative cursor-pointer hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 inline-block text-center border-2 border-white/80 dark:border-gray-700/50";

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 dark:from-emerald-600 dark:via-teal-600 dark:to-green-600 text-white border-transparent shadow-xl hover:shadow-2xl",
    secondary:
      "bg-transparent shadow-none border-transparent hover:bg-white/50 dark:hover:bg-gray-800/50",
    dark: "bg-gray-900 dark:bg-gray-700 text-white shadow-xl",
    gradient:
      "bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 text-white shadow-xl border-transparent",
  };

  return (
    <Tag
      href={href || undefined}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
};
