import { css, RuleSet } from 'styled-components';

export const breakpoints: Record<string, number> = {
  mobile: 360,
  tablet: 767,
  small: 1023,
  medium: 1200,
};

export type MediaFn = (...args: Parameters<typeof css>) => RuleSet<object>;

const media = (Object.keys(breakpoints) as Array<keyof typeof breakpoints>).reduce(
  (acc: Record<string, MediaFn>, label) => {
    acc[label] = (...args) => css`
      @media screen and (max-width: ${breakpoints[label]}px) {
        ${css(...args)};
      }
    `;
    return acc;
  },
  {}
);

export default media;
