"use client";

import { type ReactNode } from "react";

export function HeroMockupFloat({ children }: { children: ReactNode }) {
  return (
    <div
      className="relative hidden lg:flex lg:items-center"
      style={{ animation: "mockupSlideIn 700ms 320ms cubic-bezier(0.23,1,0.32,1) both" }}
    >
      {/* Float layer — continuous gentle bob */}
      <div style={{ animation: "mockupFloat 7s ease-in-out infinite" }} className="w-full">
        {/* Hover layer — lift + scale on pointer */}
        <div
          className="w-full transition-[transform,box-shadow] duration-500 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-2 hover:scale-[1.015] hover:shadow-[0_40px_80px_rgba(0,0,0,0.55)]"
        >
          {children}
        </div>
      </div>

      <style>{`
        @keyframes mockupSlideIn {
          from {
            opacity: 0;
            transform: translateX(2.5rem);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes mockupFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
