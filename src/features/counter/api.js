//* Shared components import
import {
  increaseButton,
  decreaseButton,
  counterInput,
} from '../../shared/api.js';

//* Feature Model
import * as model from './model/model.js';

//! Exports
export const counterFeature = {
  ...model,
};
