import Image from "next/image";

import { fetchMetadata } from "frames.js/next";
import type { Metadata } from "next";
import { Bolt, CodeSquare, Github } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "PhishFrame",
    // provide a full URL to your /frames endpoint
    other: await fetchMetadata(
      new URL(
        "/frames",
        process.env.NEXT_PUBLIC_HOST ?? "http://localhost:3001"
      )
    ),
  };
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-12 p-8 md:p-24">
      <nav className="w-full max-w-3xl">
        <ul className="flex justify-center gap-12">
          <li>
            <a
              href="https://ethglobal.com/showcase/phishframe-5ihsk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex gap-2 items-center text-sm font-semibold tracking-tight hover:underline underline-offset-4 text-neutral-800 dark:text-neutral-400 hover:text-teal-600"
            >
              <CodeSquare size={16} />
              EthGlobal Showcase
            </a>
          </li>
          <li>
            <a
              href="https://github.com/chainpatrol/phishframe"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex gap-2 items-center text-sm font-semibold tracking-tight hover:underline underline-offset-4 text-neutral-800 dark:text-neutral-400 hover:text-teal-600"
            >
              <Github size={16} />
              GitHub
            </a>
          </li>
          <li>
            <a
              href="https://warpcast.com/umariomaker/0x60217f41"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex gap-2 items-center text-sm font-semibold tracking-tight hover:underline underline-offset-4 text-neutral-800 dark:text-neutral-400 hover:text-teal-600"
            >
              <Bolt size={16} />
              Try it out!
            </a>
          </li>
        </ul>
      </nav>

      <Image
        src="/images/phishy.png"
        alt="PhishFrame"
        className="scale-100 hover:scale-110 transition-transform duration-300 ease-in-out"
        width={300}
        height={300}
      />

      <div className="flex flex-col items-center gap-3">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
          PhishFrame
        </h1>
        <p className="text-lg md:text-xl text-center font-light text-neutral-700 dark:text-neutral-500">
          A security-focused Farcaster Frame by ChainPatrol
        </p>
      </div>

      <div className="text-lg max-w-3xl text-neutral-800 dark:text-neutral-400 font-light">
        <p className="leading-relaxed mb-8">
          PhishFrame is here to give our Farcaster friends a simple and
          convenient set of security tools to ensure your safety in the world of
          Web3. Got a URL that&apos;s looking a bit fishy? No problem! Just pop
          it into PhishFrame and with a single click, you can see if it&apos;s
          on ChainPatrol&apos;s scam blocklist. It&apos;s as easy as that!
        </p>
        <p className="leading-relaxed mb-8">
          What&apos;s more, PhishFrame empowers all Farcaster users to report
          any suspicious URLs. Each URL you submit gets a thorough review and,
          if found to be shady, it&apos;s swiftly added to a blocklist of
          domains. This blocklist is used by more than 20 wallets, including big
          names like Metamask, Coinbase Wallet, and Phantom.
        </p>
        <p className="leading-relaxed mb-8">
          So, with PhishFrame, every Farcaster user gets to play detective with
          the links they come across. Together, we&apos;re harnessing the power
          of the Farcaster community to boost phishing detection and brand
          protection. Stay safe out there, friends!
        </p>
      </div>
    </main>
  );
}
