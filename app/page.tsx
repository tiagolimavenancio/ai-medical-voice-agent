"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";

const BentoF = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white text-neutral-800 rounded-3xl mt-20 border border-neutral-200 shadow-lg">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
          Key Features of MediAI
        </h2>
        <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2">
          {[
            {
              title: "Instant Diagnosis",
              desc: "Get immediate preliminary diagnoses based on your symptoms.",
              iconColor: "text-blue-600",
              iconPath: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.001 12.001 0 002 12c0 2.757 1.125 5.228 2.938 7.072M18 10a8 8 0 11-16 0 8 8 0 0116 0z"
            },
            {
              title: "Personalized Insights",
              desc: "Receive tailored health recommendations and insights for your well-being.",
              iconColor: "text-green-600",
              iconPath: "M7 8h10M7 12h10m-9 4h4M8 10l4-4 4 4m0 0l-4 4-4-4"
            },
            {
              title: "24/7 Availability",
              desc: "Your AI assistant is always ready to answer your health queries.",
              iconColor: "text-purple-600",
              iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            }
          ].map(({ title, desc, iconColor, iconPath }, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-xl border border-neutral-200 shadow-md transition-transform duration-300 hover:scale-105">
              <svg className={`h-12 w-12 ${iconColor} mb-4`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconPath} />
              </svg>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-center text-neutral-600">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Navbar = () => {
  const { user } = useUser();
  return (
    <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 bg-white text-neutral-800 rounded-xl shadow-lg z-20 relative">
      <div className="flex items-center gap-2">
        <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        <h1 className="text-lg font-bold md:text-2xl text-blue-700">MediAI</h1>
      </div>
      {!user ? (
        <Link href="/sign-in">
          <button className="w-24 transform rounded-full bg-blue-600 px-6 py-2 font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-700 md:w-32">
            Login
          </button>
        </Link>
      ) : (
        <div className="flex items-center gap-6">
          <UserButton afterSignOutUrl="/" />
          <Link href="/dashboard">
            <Button className="hidden md:inline-block bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-full shadow-lg">
              Dashboard
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default function HeroSectionOne() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current.children,
        { opacity: 0, y: 20, filter: "blur(4px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
          delay: 0.5
        }
      );
    }

    gsap.fromTo(
      paragraphRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 1.5 }
    );

    if (ctaRef.current) {
      gsap.fromTo(
        ctaRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1, delay: 1.8 }
      );
    }

    gsap.fromTo(
      imageCardRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 1, ease: "power3.out", delay: 2.2 }
    );
  }, []);

  // Optional: Redirect logged-in users to dashboard
  useEffect(() => {
    if (isLoaded && user) {
      router.push("/dashboard");
    }
  }, [isLoaded, user, router]);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center px-4 py-10 bg-gray-50 text-neutral-800 font-inter">
      <style jsx global>{`
        body {
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      <Navbar />

      <div className="absolute inset-y-0 left-0 h-full w-px bg-gradient-to-b from-transparent via-blue-300 to-transparent opacity-50">
        <div className="absolute top-0 h-40 w-px bg-blue-400 animate-pulse" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-gradient-to-b from-transparent via-cyan-300 to-transparent opacity-50">
        <div className="absolute h-40 w-px bg-cyan-400 animate-pulse" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-gradient-to-r from-transparent via-purple-300 to-transparent opacity-50">
        <div className="absolute mx-auto h-px w-40 bg-purple-400 animate-pulse" />
      </div>

      <div className="px-4 py-10 md:py-20 max-w-7xl mx-auto">
        <h1 ref={titleRef} className="relative z-10 mx-auto max-w-5xl text-center text-3xl font-extrabold text-neutral-800 md:text-5xl lg:text-7xl leading-tight">
          {"Your AI Medical Assistant: Intelligent Health Guidance"
            .split(" ")
            .map((word, index) => (
              <span key={index} className="mr-2 inline-block">
                {word}
              </span>
            ))}
        </h1>

        <p ref={paragraphRef} className="relative z-10 mx-auto max-w-2xl py-6 text-center text-lg font-light text-neutral-600">
          Leveraging advanced AI, MediAI provides personalized health insights, instant symptom analysis, and reliable medical information, empowering you to make informed decisions about your well-being.
        </p>

        <div ref={ctaRef} className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-6">
          <Link href="/chat-with-ai">
            <button className="w-60 transform rounded-full bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-700">
              Chat with AI
            </button>
          </Link>
          <Link href="/learn-more">
            <button className="w-60 transform rounded-full border border-neutral-300 bg-white px-8 py-3 font-semibold text-neutral-700 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-gray-100 hover:border-neutral-400">
              Learn More
            </button>
          </Link>
        </div>

        <div ref={imageCardRef} className="relative z-10 mt-28 rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl overflow-hidden">
          <div className="w-full rounded-2xl overflow-hidden border border-neutral-300">
            <img
              src="https://placehold.co/1200x675/f0f0f0/333333?text=AI+Medical+Interface"
              alt="AI Medical Interface"
              className="aspect-[16/9] h-auto w-full object-cover rounded-xl"
              height={675}
              width={1200}
            />
          </div>
          <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{
            background: 'radial-gradient(circle at center, rgba(0,128,255,0.05) 0%, transparent 70%)',
            zIndex: -1
          }}></div>
        </div>
      </div>

      <BentoF />
    </div>
  );
}
