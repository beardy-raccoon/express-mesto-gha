const mongoose = require('mongoose');
const validator = require('validator');
const { URL_REG_EXP } = require('../utils/consts');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(link) {
        return URL_REG_EXP.test(link);
      },
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(email) {
      if (!validator.isEmail(email)) {
        throw new Error('Invalid email');
      }
    },
  },
  password: {
    type: String,
    reqiured: true,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
