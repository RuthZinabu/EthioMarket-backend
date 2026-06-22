export const errorHandler = (error: any) => {
  console.error('Error:', error);
  return {
    success: false,
    statusCode: error.statusCode || 500,
    error: error.message || 'Internal Server Error',
  };
};

export const successResponse = <T>(data: T, statusCode: number = 200) => {
  return {
    success: true,
    data,
    statusCode,
  };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};
