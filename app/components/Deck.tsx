"use client";

import {
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronUp, Heart, X } from "lucide-react";

interface DeckProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  onSwipe: (item: T, direction: "left" | "right") => void | Promise<void>;
  emptyState: React.ReactNode;
  onSwipeUp?: (item: T) => void;
}

interface PendingSwipe<T> {
  item: T;
  direction: "left" | "right";
  startX: number;
  startY: number;
  startRotate: number;
}

export default function Deck<T extends { id: string }>({
  items,
  renderItem,
  onSwipe,
  emptyState,
  onSwipeUp,
}: DeckProps<T>) {
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [pendingSwipe, setPendingSwipe] = useState<PendingSwipe<T> | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-280, 280], [-11, 11]);
  const likeOpacity = useTransform(x, [18, 110], [0, 1]);
  const passOpacity = useTransform(x, [-110, -18], [1, 0]);
  const detailOpacity = useTransform(y, [-170, -50], [1, 0]);
  const detailScale = useTransform(y, [-170, -50], [1.06, 0.92]);
  const removalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTopItemIdRef = useRef<string | null>(null);
  const activeHiddenIdSet = useMemo(
    () => new Set(hiddenIds.filter((id) => items.some((item) => item.id === id))),
    [hiddenIds, items],
  );

  const visibleItems = items
    .filter(
      (item) =>
        !activeHiddenIdSet.has(item.id) && item.id !== pendingSwipe?.item.id,
    )
    .slice(0, 3);

  const activeTopItemId = visibleItems[0]?.id ?? null;
  const isSwiping = pendingSwipe !== null;

  useEffect(() => {
    if (pendingSwipe) {
      return;
    }

    if (lastTopItemIdRef.current === activeTopItemId) {
      return;
    }

    lastTopItemIdRef.current = activeTopItemId;
    x.set(0);
    y.set(0);
  }, [activeTopItemId, pendingSwipe, x, y]);

  useEffect(() => {
    return () => {
      if (removalTimerRef.current) {
        clearTimeout(removalTimerRef.current);
      }
    };
  }, []);

  const resetCardPosition = () => {
    const spring = {
      type: "spring" as const,
      stiffness: 340,
      damping: 30,
      mass: 0.78,
    };

    void animate(x, 0, spring);
    void animate(y, 0, spring);
  };

  const completeSwipe = (itemId: string) => {
    setHiddenIds((current) =>
      current.includes(itemId) ? current : [...current, itemId],
    );
    setPendingSwipe(null);
    x.set(0);
    y.set(0);
    removalTimerRef.current = null;
  };

  const restoreSwipe = (itemId: string) => {
    if (removalTimerRef.current) {
      clearTimeout(removalTimerRef.current);
      removalTimerRef.current = null;
    }

    setHiddenIds((current) => current.filter((id) => id !== itemId));
    setPendingSwipe(null);
    resetCardPosition();
  };

  const handleDragEnd = (
    _: unknown,
    info: { offset: { x: number; y: number }; velocity: { x: number; y: number } },
  ) => {
    const horizontalThreshold = 138;
    const horizontalVelocity = 760;
    const minimumTravelForFlick = 64;
    const upwardThreshold = -110;
    const upwardVelocity = -520;

    if (isSwiping) {
      resetCardPosition();
      return;
    }

    const currentItem = visibleItems[0];

    if (!currentItem) {
      resetCardPosition();
      return;
    }

    const isUpSwipe =
      onSwipeUp &&
      Math.abs(info.offset.x) < 110 &&
      (info.offset.y < upwardThreshold || info.velocity.y < upwardVelocity);

    if (isUpSwipe) {
      onSwipeUp(currentItem);
      resetCardPosition();
      return;
    }

    let nextDirection: "left" | "right" | null = null;

    if (
      info.offset.x > horizontalThreshold ||
      (info.offset.x > minimumTravelForFlick &&
        info.velocity.x > horizontalVelocity)
    ) {
      nextDirection = "right";
    } else if (
      info.offset.x < -horizontalThreshold ||
      (info.offset.x < -minimumTravelForFlick &&
        info.velocity.x < -horizontalVelocity)
    ) {
      nextDirection = "left";
    }

    if (!nextDirection) {
      resetCardPosition();
      return;
    }

    setPendingSwipe({
      item: currentItem,
      direction: nextDirection,
      startX: x.get(),
      startY: y.get(),
      startRotate: rotate.get(),
    });
    x.set(0);
    y.set(0);

    removalTimerRef.current = setTimeout(() => {
      completeSwipe(currentItem.id);
    }, 320);

    void Promise.resolve(onSwipe(currentItem, nextDirection)).catch(
      (swipeError) => {
        console.error(swipeError);
        restoreSwipe(currentItem.id);
      },
    );
  };

  return (
    <div className="relative mx-auto flex h-[calc(100dvh-12rem)] max-h-[44rem] min-h-[31rem] w-full max-w-[23rem] items-center justify-center perspective-[1500px] sm:h-[min(74dvh,41rem)] sm:max-h-none sm:min-h-[34rem] sm:max-w-[29rem] md:h-[min(78dvh,46rem)] md:min-h-[38rem] md:max-w-[33rem]">
      <div className="absolute inset-0 z-0 flex animate-in flex-col items-center justify-center fade-in duration-700">
        {emptyState}
      </div>

      {visibleItems
        .slice()
        .reverse()
        .map((item, index) => {
          const stackIndex = visibleItems.length - 1 - index;
          const isTop = stackIndex === 0;

          return (
            <motion.div
              key={item.id}
              initial={false}
              drag={isTop && !isSwiping}
              dragDirectionLock
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.16}
              dragMomentum={false}
              onDragEnd={handleDragEnd}
              whileDrag={{ scale: 1.02 }}
              style={{
                scale: 1,
                x: isTop ? x : 0,
                y: isTop ? y : 0,
                rotate: isTop ? rotate : 0,
                zIndex: 100 - stackIndex,
                transformOrigin: "bottom center",
                touchAction: "none",
                willChange: isTop ? "transform" : "auto",
              }}
              animate={false}
              transition={{ duration: 0 }}
              className="absolute h-full w-full cursor-grab touch-none transform-gpu [backface-visibility:hidden] active:cursor-grabbing"
            >
              {isTop && (
                <>
                  <motion.div
                    style={{ opacity: likeOpacity }}
                    className="pointer-events-none absolute left-6 top-8 z-[110] rounded-lg border-4 border-emerald-500/80 bg-neutral-900/40 px-4 py-1.5 shadow-sm backdrop-blur-sm -rotate-12"
                  >
                    <span className="flex items-center gap-2 text-xl font-bold uppercase tracking-widest text-emerald-500">
                      <Heart className="h-5 w-5 fill-emerald-500" /> YES
                    </span>
                  </motion.div>
                  <motion.div
                    style={{ opacity: passOpacity }}
                    className="pointer-events-none absolute right-6 top-8 z-[110] rotate-12 rounded-lg border-4 border-rose-500/80 bg-neutral-900/40 px-4 py-1.5 shadow-sm backdrop-blur-sm"
                  >
                    <span className="flex items-center gap-2 text-xl font-bold uppercase tracking-widest text-rose-500">
                      <X className="h-6 w-6" /> NOPE
                    </span>
                  </motion.div>
                  {onSwipeUp ? (
                    <motion.div
                      style={{ opacity: detailOpacity, scale: detailScale }}
                      className="pointer-events-none absolute inset-x-0 bottom-8 z-[110] flex justify-center"
                    >
                      <span className="inline-flex items-center gap-2 rounded-full border-2 border-sky-400/75 bg-neutral-900/60 px-4 py-2 text-sm font-black uppercase tracking-[0.22em] text-sky-300 shadow-sm backdrop-blur-sm">
                        <ChevronUp className="h-4 w-4" />
                        DETAILS
                      </span>
                    </motion.div>
                  ) : null}
                </>
              )}
              <div
                className={`h-full w-full ${
                  isTop ? "shadow-[0_20px_50px_rgba(0,0,0,0.5)]" : "shadow-none"
                }`}
              >
                {renderItem(item)}
              </div>
            </motion.div>
          );
        })}

      {pendingSwipe ? (
        <motion.div
          key={`exiting-${pendingSwipe.item.id}`}
          initial={false}
          animate={{
            x:
              pendingSwipe.startX +
              (pendingSwipe.direction === "left" ? -1000 : 1000),
            y: pendingSwipe.startY,
            rotate:
              pendingSwipe.startRotate +
              (pendingSwipe.direction === "left" ? -18 : 18),
            scale: 1.03,
          }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 26,
            mass: 0.82,
          }}
          style={{
            x: pendingSwipe.startX,
            y: pendingSwipe.startY,
            rotate: pendingSwipe.startRotate,
            zIndex: 200,
            transformOrigin: "bottom center",
            touchAction: "none",
            willChange: "transform",
          }}
          className="pointer-events-none absolute h-full w-full transform-gpu [backface-visibility:hidden]"
        >
          <div className="h-full w-full shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {renderItem(pendingSwipe.item)}
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}
