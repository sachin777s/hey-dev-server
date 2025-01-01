export const URL_REGEX =
  /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,6}(\.[a-zA-Z]{2,6})?(\/[^\s]*)?$/;
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