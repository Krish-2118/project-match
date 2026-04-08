'use client';

import React from 'react';
import useCursorStyle from '../../hooks/useCursorStyle';

const StickyChild = ({ 
  child, 
  lockCursorPosition 
}: { 
  child: React.ReactElement<React.HTMLAttributes<HTMLElement>>; 
  lockCursorPosition: (pos: { x: number; y: number } | null) => void 
}) => {
  const childRef = React.useRef<HTMLElement | null>(null);

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    if (!childRef.current) return;
    const position = childRef.current.getBoundingClientRect();
    lockCursorPosition({ x: position.width / 2 + position.left, y: position.height / 2 + position.top });
    if (child.props.onMouseEnter) child.props.onMouseEnter(event);
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLElement>) => {
    lockCursorPosition(null);
    if (child.props.onMouseLeave) child.props.onMouseLeave(event);
  };

  const handleRef = (node: HTMLElement | null) => {
    childRef.current = node;
    const { ref } = child as unknown as { ref: React.Ref<HTMLElement> };
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref && 'current' in ref) {
      // eslint-disable-next-line react-hooks/immutability
      (ref as React.MutableRefObject<HTMLElement | null>).current = node;
    }
  };

  return React.cloneElement(child, {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    ref: handleRef,
  } as React.Attributes & React.HTMLAttributes<HTMLElement>);
};

const StickyCursor = ({ children: childrenProp, sticky = true }: { children: React.ReactNode; sticky?: boolean }) => {
  const { lockCursorPosition } = useCursorStyle();

  const children = React.Children.map(childrenProp, child => {
    if (!React.isValidElement(child)) return null;
    return <StickyChild child={child as React.ReactElement<React.HTMLAttributes<HTMLElement>>} lockCursorPosition={lockCursorPosition} />;
  });

  return sticky ? <>{children}</> : <>{childrenProp}</>;
};

export default React.memo(StickyCursor);
