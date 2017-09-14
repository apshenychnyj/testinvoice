AccountsTemplates.configure({
  overrideLoginErrors: false,
  confirmPassword: true,
  enablePasswordChange: true,
  forbidClientAccountCreation: true,
  sendVerificationEmail: true,
  lowercaseUsername: false,
  focusFirstInput: true,
  hideSignInLink: true,
  hideSignUpLink: true,
  // // Appearance
  showAddRemoveServices: false,
  showForgotPasswordLink: false,
  showLabels: true,
  showPlaceholders: true,
  showResendVerificationEmailLink: false,
  // // Client-side Validation
  continuousValidation: true,
  negativeFeedback: true,
  negativeValidation: true,
  positiveValidation: true,
  positiveFeedback: true,
  showValidating: true,
});

Accounts.config({
  loginExpirationInDays: 1,
});
