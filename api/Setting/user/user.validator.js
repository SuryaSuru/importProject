import Joi from 'joi';

const userSchema = Joi.object({
  company_id: Joi.string().required().messages({
    'any.required': 'Company ID is required.',
    'string.base': 'Company ID must be a string.',
    'string.objectId': 'Company ID must be a valid ObjectId.',
  }),
  fromSponsorId: Joi.string(),
  userName: Joi.string().required().messages({
    'any.required': 'User Name is required.',
    'string.base': 'User Name must be a string.',
  }),
  contactNumber: Joi.number().messages({
    'number.base': 'Contact Number must be a number.',
  }),
  location: Joi.string().messages({
    'string.base': 'Location must be a string.',
  }),
  emailAddress: Joi.string().email().required().messages({
    'any.required': 'Email Address is required.',
    'string.base': 'Email Address must be a string.',
    'string.email': 'Email Address must be a valid email.',
  }),
  position: Joi.string().valid('Left', 'Right').messages({
    'any.required': 'Type is required.',
    'string.base': 'Type must be a string.',
    'any.only': 'Type must be either Left or Right.',
  }),
  type: Joi.string().valid('Admin', 'User').required().messages({
    'any.required': 'Type is required.',
    'string.base': 'Type must be a string.',
    'any.only': 'Type must be either Admin or User.',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required.',
    'string.base': 'Password must be a string.',
  }),
  disabled: Joi.boolean().default(false).messages({
    'boolean.base': 'Disabled must be a boolean.',
  }),
});

// Validate the user data
function validateUser(userData) {
  return userSchema.validate(userData);
}

// Validate the update data
function validateUpdate(updateData) {
  return userSchema.validate(updateData);
}

export { validateUser, validateUpdate };
