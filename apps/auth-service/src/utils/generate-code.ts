export const generateUserCode = (): string => {
  return String(Date.now() * 1000 + Math.floor(Math.random() * 1000));
};
