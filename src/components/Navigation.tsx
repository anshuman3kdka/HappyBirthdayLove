import { motion } from 'framer-motion';
import type { SceneId } from '../App';
import navContent from '../content/navigation.json';

type NavigationProps = {
  activeScene: SceneId;
  onSceneChange: (scene: SceneId) => void;
};

const sceneByContentPath: Record<string, SceneId> = {
  '/': 'home',
  '/journal': 'journal',
  '/archive': 'archive',
  '/projection': 'projection',
};

export function Navigation({ activeScene, onSceneChange }: NavigationProps) {
  const links = navContent.links;

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 1 }}
      className="fixed top-0 left-0 w-full z-40 p-8 flex justify-between items-start pointer-events-none"
    >
      <div className="flex flex-col space-y-1">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-50">{navContent.title}</span>
        <div className="h-[1px] w-12 bg-white/30"></div>
      </div>
      <nav className="flex space-x-12 text-[11px] uppercase tracking-[0.2em] font-sans pointer-events-auto">
        {links.map((link) => {
          const scene = sceneByContentPath[link.to] ?? 'home';
          const isActive = activeScene === scene;

          return (
            <button
              key={link.to}
              type="button"
              onClick={() => onSceneChange(scene)}
              aria-current={isActive ? 'page' : undefined}
              className={`transition-colors duration-300 uppercase tracking-[0.2em] ${isActive ? 'text-white border-b border-white pb-1' : 'opacity-40 hover:text-white hover:opacity-100'}`}
            >
              {link.label}
            </button>
          );
        })}
      </nav>
      <div className="text-right hidden sm:block">
        <p className="font-mono text-[10px] tracking-widest opacity-60 uppercase">{navContent.coord1}</p>
        <p className="font-mono text-[10px] tracking-widest opacity-60 uppercase">{navContent.coord2}</p>
      </div>
    </motion.header>
  );
}
