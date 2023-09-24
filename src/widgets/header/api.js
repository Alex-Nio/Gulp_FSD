//* Shared components imports
import {
  increaseButton,
  decreaseButton,
  counterInput,
} from '../../shared/api.js';

//* Widget Feature imports
import * as counterFeature from './../../features/counter/api.js';
import * as counter1Feature from './../../features/counter1/api.js';
import * as counter2Feature from './../../features/counter2/api.js';
import * as counter3Feature from './../../features/counter3/api.js';
import * as counter4Feature from './../../features/counter4/api.js';

//* Widget core API imports
import * as styles from './_widget/header.scss';
import { headerActions } from './header-actions/index.js';
import { headerCart } from './header-cart/index.js';

//! Exports
export const headerWidget = {
  ...styles,
  ...headerActions,
  ...headerCart,
};
