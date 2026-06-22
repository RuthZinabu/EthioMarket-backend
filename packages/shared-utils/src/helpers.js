"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePhoneNumber = exports.validateEmail = exports.successResponse = exports.errorHandler = void 0;
const errorHandler = (error) => {
    console.error('Error:', error);
    return {
        success: false,
        statusCode: error.statusCode || 500,
        error: error.message || 'Internal Server Error',
    };
};
exports.errorHandler = errorHandler;
const successResponse = (data, statusCode = 200) => {
    return {
        success: true,
        data,
        statusCode,
    };
};
exports.successResponse = successResponse;
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.validateEmail = validateEmail;
const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
};
exports.validatePhoneNumber = validatePhoneNumber;
//# sourceMappingURL=helpers.js.map