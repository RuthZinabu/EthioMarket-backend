export declare const errorHandler: (error: any) => {
    success: boolean;
    statusCode: any;
    error: any;
};
export declare const successResponse: <T>(data: T, statusCode?: number) => {
    success: boolean;
    data: T;
    statusCode: number;
};
export declare const validateEmail: (email: string) => boolean;
export declare const validatePhoneNumber: (phone: string) => boolean;
//# sourceMappingURL=helpers.d.ts.map