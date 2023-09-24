//* Shared components imports
import {
  increaseButton,
  decreaseButton,
  counterInput,
} from '../../shared/api.js';

//* Widget Feature imports
import * as counterFeature from './../../features/counter/api.js';

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