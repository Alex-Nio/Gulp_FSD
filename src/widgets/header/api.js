//* Widget Feature imports
import { counterFeature } from './../../features/counter/api';

//* Widget core API imports
import * as styles from './_widget/header.scss';

//! Exports
export const headerWidget = {
  ...styles,
  ...counterFeature,
};
