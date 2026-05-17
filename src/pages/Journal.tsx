import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ENTRIES = [
  {
    id: 1,
    coord: "RA 14h 29m · Dec +18° 11'",
    date: "march 4, 2025",
    text: "i remember you ordered the same thing twice because you were distracted talking and didn't notice. i didn't tell you. i just watched you explain your theory about clouds being proof the sky has moods.",
    image: "/assets/journal-bg-1.jpg"
  },
  {
    id: 2,
    coord: "RA 09h 14m · Dec -43° 22'",
    date: "july 12, 2024",
    text: "you fell asleep during the movie we planned for weeks to watch. i paused it. i ended up just watching the city lights hit your face through the window. it was a better movie anyway.",
    image: "/assets/journal-bg-2.jpg"
  },
  {
    id: 3,
    coord: "RA 19h 50m · Dec +08° 52'",
    date: "november 18, 2024",
    text: "it was raining so hard we stepped into that tiny bookstore. you bought a book you fully admitted you would never read, just because you liked the texture of the cover. i still think about that.",
    image: "/assets/journal-bg-3.jpg"
  }
];

function WordFade({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <p className="font-serif text-2xl md:text-[32px] lg:text-[40px] leading-relaxed md:leading-[1.6] opacity-70 italic font-light max-w-4xl mx-auto drop-shadow-lg space-x-[0.3em]">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, delay: i * 0.05 }}
          className="inline-block"
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </p>
  );
}

function JournalEntry({ entry }: { entry: typeof ENTRIES[0] }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  return (
    <div ref={ref} className="relative min-h-[120vh] w-full flex items-center justify-center overflow-hidden py-32 px-6">
      
      {/* Background Parallax */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 w-full h-[140%] -top-[20%] z-0"
      >
        <img 
          src={entry.image} 
          alt="" 
          className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-[#050505]/70" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col pt-24 px-4 md:px-0 border-l border-white/20 pl-6 py-2">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1 }}
          className="mb-12 font-mono text-[10px] uppercase tracking-[0.2em] opacity-40 flex flex-col gap-2"
        >
          <span>{entry.coord} / {entry.date}</span>
        </motion.div>

        <WordFade text={entry.text} />
      </div>
    </div>
  );
}

export function Journal() {
  return (
    <div className="w-full bg-[#050505] text-[#E0D8D0]">
      <div className="pt-32 pb-16 px-6 max-w-5xl mx-auto text-center z-10 relative">
         <motion.h1 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1 }}
           className="font-serif text-3xl italic opacity-50"
         >
           the archive of small moments
         </motion.h1>
      </div>

      {ENTRIES.map((entry) => (
        <JournalEntry key={entry.id} entry={entry} />
      ))}

      {/* The Final Star */}
      <div className="min-h-screen w-full flex items-center justify-center relative bg-[#050505]">
        <motion.div
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true, margin: "-30%" }}
           transition={{ duration: 2, delay: 0.5 }}
           className="text-center flex flex-col items-center gap-8"
        >
          {/* Final Star svg */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white opacity-80 animate-pulse">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
          </svg>
          <p className="font-serif text-2xl md:text-[32px] italic opacity-80">
            there's one more thing i should have said sooner...
          </p>
          <p className="font-serif text-xl md:text-3xl opacity-50 mt-4 italic">
            i love you.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
