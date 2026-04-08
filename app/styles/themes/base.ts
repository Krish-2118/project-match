import colors from '../colors';
import media, { breakpoints } from '../media';
import zIndex from '../zIndex';

const base = {
  cursor: colors.red,
  colors,
  zIndex,
  breakpoints: {
    sizes: breakpoints,
    mobile: media.mobile,
    tablet: media.tablet,
    small: media.small,
    medium: media.medium,
  },
};

export default base;
