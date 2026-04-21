"use client";

import { useEffect, useRef, useState } from "react"

interface TextGlitchProps {
  text: string
  hoverText?: string
  className?: string
  delay?: number
  as?: "h1" | "h2" | "h3" | "p" | "span"
}

export function TextGlitch({ text, hoverText, className = "", delay = 0, as: Tag = "p" }: TextGlitchProps) {
  // Use a broader ref type to avoid the mismatch with the polymorphic dynamic tag
  const textRef = useRef<HTMLElement | null>(null)
  const spanRef = useRef<HTMLSpanElement>(null)
  const [displayText] = useState(text)
  const [displayHoverText, setDisplayHoverText] = useState(hoverText || text)
  const hoverIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

  useEffect(() => {
    const loadGSAP = async () => {
      const { gsap } = await import("gsap")
      if (textRef.current) {
        gsap.set(textRef.current, { opacity: 0.5, scale: 0.97 })
        gsap.to(textRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          delay,
          ease: "back.out(1.7)",
        })
      }
    }
    loadGSAP()
  }, [delay])

  const handleMouseEnter = () => {
    if (!hoverText) return
    let iteration = 0
    if (hoverIntervalRef.current) clearInterval(hoverIntervalRef.current)

    hoverIntervalRef.current = setInterval(() => {
      setDisplayHoverText(
        hoverText
          .split("")
          .map((letter, index) => {
            if (index < iteration) return hoverText[index]
            return letters[Math.floor(Math.random() * 26)]
          })
          .join(""),
      )
      if (iteration >= hoverText.length) clearInterval(hoverIntervalRef.current!)
      iteration += 1 / 3
    }, 30)

    if (spanRef.current) {
      spanRef.current.style.clipPath = "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
    }
  }

  const handleMouseLeave = () => {
    if (hoverIntervalRef.current) clearInterval(hoverIntervalRef.current)
    setDisplayHoverText(hoverText || text)
    if (spanRef.current) {
      spanRef.current.style.clipPath = "polygon(0 50%, 100% 50%, 100% 50%, 0 50%)"
    }
  }

  useEffect(() => {
    return () => {
      if (hoverIntervalRef.current) clearInterval(hoverIntervalRef.current)
    }
  }, [])

  // Cast to any to allow the dynamic Tag + broader ref type
  const El = Tag as any;

  return (
    <El
      ref={textRef}
      className={`relative inline-block cursor-pointer overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayText}
      {hoverText && (
        <span
          ref={spanRef}
          className="absolute inset-0 flex items-center justify-center font-inherit pointer-events-none transition-all duration-300 ease-out bg-white text-black"
          style={{
            clipPath: "polygon(0 50%, 100% 50%, 100% 50%, 0 50%)",
          }}
        >
          {displayHoverText}
        </span>
      )}
    </El>
  )
}
