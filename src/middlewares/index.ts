import { Schema, checkSchema } from 'express-validator';
import { validate as customValidate } from '../validators';

export default class ValidatorMiddleWare {
  static validate(validatorSchema: Schema) {
    return customValidate(checkSchema(validatorSchema));
  }
}
