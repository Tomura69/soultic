export const userValidation = {
  firstname: {
    minLength: 3,
    maxLength: 60,
  },
  lastname: {
    minLength: 3,
    maxLength: 60,
  },
  password: {
    minLength: 6,
    matchRegex: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])/,
  },
};
