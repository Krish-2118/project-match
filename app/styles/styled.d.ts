import 'styled-components';
import { MediaFn } from './media';

declare module 'styled-components' {
  export interface DefaultTheme {
    cursor: string;
    text: string;
    background: string;
    colors: {
      white: string;
      black: string;
      red: string;
    };
    zIndex: {
      cursor: number;
      menu: number;
      appBar: number;
    };
    breakpoints: {
      sizes: Record<string, number>;
      mobile: MediaFn;
      tablet: MediaFn;
      small: MediaFn;
      medium: MediaFn;
    };
  }
}
