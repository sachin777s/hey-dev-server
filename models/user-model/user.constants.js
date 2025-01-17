export const URL_REGEX =
  /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,}$/;
export const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
export const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

export const VALIDATION_MESSAGES = {
  URL: "Invalid URL",
  EMAIL: "Invalid email format",
  PASSWORD:
    "Password should contain numbers, small and capital alphabet and special character",
  USERNAME: "Username can only contain letters, numbers and underscore",
};
