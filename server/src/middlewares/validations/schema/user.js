import joi, { boolean, date, number, string } from 'joi';

export const signupSchema = joi.object().keys({
  firstName: joi.string().min(3).required().label('firstName').required(),
  lastName: joi.string().min(3).required().label('lastName').required(),
  gender: joi.any().valid('Male', 'Female', 'Other'),
  age: joi.number().min(1).max(200).message('invalid age'),
  dob:joi.date(),
  maritalStatus: joi.any().valid('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED').required(),
  nationality: joi.string(),
  profilePicture: joi.any(),
  email: joi.string().email().required(),
  password: joi
    .string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
    .message('password must contain atleast 8 characters(upper/lower case, number & symbol)!')
    .label('password').required(),
  confirmPassword: joi.any().valid(joi.ref('password')),
});

export const additionalUserDetails = joi.object().keys({
   identificationNumber: joi.number().required(),
});

export const signInSchema = joi.object().keys({
  email: joi
    .string()
    .regex(/^\S+$/)
    .message('please remove spaces!')
    .min(9)
    .required()
    .label('email'),
  password: joi.string().required().label('password'),
});

export const passwordResetSchema = joi.object().keys({
  password: joi
    .string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
    .message('password must contain atleast 8 characters(upper/lower case, number & symbol)!')
    .required()
    .label('password'),
  confirmPassword: joi.string().required(),
  usercode: joi.string().required(),
});

export const verifyUserSchema = joi.object().keys({
  status: joi.any().valid('UNVERIFIED', 'PENDING VERIFICATION', 'VERIFIED')
});

export const verifyResetPasswordSchema = joi.object().keys({
  newPassword: joi
    .string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
    .message('password must contain atleast 8 characters(upper/lower case, number & symbol)!')
    .label('newPassword').required(),
  confirmPassword: joi.any().valid(joi.ref('newPassword')).required(),
 });
