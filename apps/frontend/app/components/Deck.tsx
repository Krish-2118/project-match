"use client";

import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import { Heart, X } from "lucide-react";
import { useEffect, useState } from "react";

interface DeckProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  onSwipe: (item: T, direction: "left" | "right") => void;
  emptyState: React.ReactNode;
}

export default function Deck<T extends { id: string }>({
  items,
  renderItem,
  onSwipe,
  emptyState,
}: DeckProps<T>) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [localItems, setLocalItems] = useState(items);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);

  // Sync local items when items prop changes
  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  // Reset index when items change significantly
  useEffect(() => {
    if (items.length === 0 || currentIndex >= items.length) {
      setCurrentIndex(0);
    }
  }, [items.length, currentIndex]);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 250], [-25, 25]);
  const likeOpacity = useTransform(x, [20, 120], [0, 1]);
  const passOpacity = useTransform(x, [-20, -120], [0, 1]);

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const threshold = 100;
    const velocity = info.velocity.x;

    if (info.offset.x > threshold || velocity > 300) {
      setExitDirection("right");
      onSwipe(localItems[currentIndex], "right");
      setCurrentIndex((prev) => prev + 1);
    } else if (info.offset.x < -threshold || velocity < -300) {
      setExitDirection("left");
      onSwipe(localItems[currentIndex], "left");
      setCurrentIndex((prev) => prev + 1);
    }
    x.set(0);
  };

  return (
    <div className="relative w-full max-w-md mx-auto h-[600px] flex items-center justify-center perspective-[1500px]">
      {/* Empty State Layer - Always rendered behind */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-0 animate-in fade-in duration-700">
        {emptyState}
      </div>

      {/* Card Stack - Rendered on top */}
      <AnimatePresence mode="popLayout">
        {currentIndex < localItems.length &&
          localItems
            .slice(currentIndex, currentIndex + 3)
            .reverse()
            .map((item, index) => {
              const stackIndex =
                localItems.slice(currentIndex, currentIndex + 3).length - 1 - index;
              const isTop = stackIndex === 0;

              const scale = isTop ? 1 : 1 - stackIndex * 0.04;
              const yOffset = isTop ? 0 : stackIndex * 12;

              return (
                <motion.div
                  key={item.id}
                  drag={isTop ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.6}
                  dragMomentum={false}
                  onDragEnd={handleDragEnd}
                  style={{
                    x: isTop ? x : 0,
                    rotate: isTop ? rotate : 0,
                    zIndex: 100 - stackIndex,
                    transformOrigin: "bottom center",
                    touchAction: "none",
                  }}
                  initial={{ scale: scale - 0.05, opacity: 1, y: yOffset + 20 }}
                  animate={{
                    scale: scale,
                    opacity: 1,
                    y: yOffset,
                    transition: { type: "spring", stiffness: 500, damping: 35, mass: 0.8 },
                  }}
                  exit={{
                    x: exitDirection === "right" ? 1500 : -1500,
                    rotate: exitDirection === "right" ? 45 : -45,
                    opacity: 1,
                    transition: { duration: 0.35, ease: "easeIn" },
                  }}
                  className="absolute w-full h-full cursor-grab active:cursor-grabbing"
                >
                  {isTop && (
                    <>
                      <motion.div
                        style={{ opacity: likeOpacity }}
                        className="absolute top-16 left-10 z-[110] px-6 py-2 border-8 border-emerald-500 rounded-xl -rotate-12 pointer-events-none bg-neutral-900 shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                      >
                        <span className="text-5xl font-black text-emerald-500 uppercase tracking-widest flex items-center gap-3">
                          <Heart className="fill-emerald-500 w-10 h-10" /> YES
                        </span>
                      </motion.div>
                      <motion.div
                        style={{ opacity: passOpacity }}
                        className="absolute top-16 right-10 z-[110] px-6 py-2 border-8 border-rose-500 rounded-xl rotate-12 pointer-events-none bg-neutral-900 shadow-[0_0_30px_rgba(244,63,94,0.4)]"
                      >
                        <span className="text-5xl font-black text-rose-500 uppercase tracking-widest flex items-center gap-3">
                          <X className="w-12 h-12" /> NOPE
                        </span>
                      </motion.div>
                    </>
                  )}
                  <div
                    className={`w-full h-full transition-all duration-300 ${isTop ? "shadow-[0_20px_50px_rgba(0,0,0,0.5)]" : "shadow-none"}`}
                  >
                    {renderItem(item)}
                  </div>
                </motion.div>
              );
            })}
      </AnimatePresence>
    </div>
  );
}
