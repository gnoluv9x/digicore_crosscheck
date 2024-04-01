import { Schema, checkSchema } from 'express-validator';
import { validate as customValidate } from '@/validators/validate';

export default class SchemaValidatorMiddleware {
  static validate(validatorSchema: Schema) {
    return customValidate(checkSchema(validatorSchema));
  }
}
