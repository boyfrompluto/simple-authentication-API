const Joi = require('@hapi/joi');

//SIGNUP VALIDATION
const registerValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string()
            .min(6)
            .required(),
        email: Joi.string().
            min(6).
            required()
            .email(),
        password: Joi.string()
            .min(6)
            .required(),
        photo: Joi.string()
    });
    return schema.validate(data)
};

//LOGIN VALIDATION
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().
            min(6).
            required().email(),
        password: Joi.string()
            .min(6)
            .required(),
        token: 
            Joi.string(),
      
    });
    return schema.validate(data)
};

const editprofile = (data )=>{
    const schema = Joi.object({
        username: Joi.string()
            .min(6),
    email: Joi.string().
            min(6).
            email(),
        fullname: Joi.string().
            min(6),
        age: Joi.string(),
        phonenumber: Joi.string(),
        photo:Joi.object()


    });
    return schema.validate(data)
}


module.exports.editprofile = editprofile;
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;