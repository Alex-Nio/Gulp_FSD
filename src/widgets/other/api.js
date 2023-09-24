//* Shared components imports
import {
  increaseButton,
  decreaseButton,
  counterInput,
} from '../../shared/api.js';

//* Widget Feature imports
import * as counter1Feature from './../../features/counter1/api.js';
import * as counter2Feature from './../../features/counter2/api.js';

//* Widget core API imports
import * as styles from './_widget/other.scss';
import { headerActions } from './header-actions/index.js';
import { headerCart } from './header-cart/index.js';

//! Exports
export const otherWidget = {
  ...styles,
  ...headerActions,
  ...headerCart,
};
