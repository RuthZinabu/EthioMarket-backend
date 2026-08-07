export function generateOTP() {
  // Generate a random number between 100000 and 999999 for otp
  const otp = Math.floor(Math.random() * 900000) + 100000;
  return otp;
}

export function generateWalletId() {
  // Generate a random 12-digit number as a string
  const digits = "0123456789";
  let walletId = "";
  for (let i = 0; i < 12; i++) {
    walletId += digits.charAt(Math.floor(Math.random() * 10));
  }
  return walletId;
}

export function generateCode() {
  return String(Date.now()) + String(Math.floor(Math.random() * 1000));
}
