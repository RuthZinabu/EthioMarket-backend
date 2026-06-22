"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var jsonwebtoken_1 = require("jsonwebtoken");
var bcryptjs_1 = require("bcryptjs");
var dotenv_1 = require("dotenv");
var shared_utils_1 = require("@emacare/shared-utils");
dotenv_1.default.config();
var app = (0, express_1.default)();
var PORT = process.env.PORT || 3001;
var JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
app.use(express_1.default.json());
// Mock user database
var users = [];
// Register endpoint
app.post('/register', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, name_1, hashedPassword, user, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, email = _a.email, password = _a.password, name_1 = _a.name;
                if (!email || !password || !name_1) {
                    return [2 /*return*/, res.status(400).json((0, shared_utils_1.errorHandler)({ message: 'Missing required fields' }))];
                }
                return [4 /*yield*/, bcryptjs_1.default.hash(password, 10)];
            case 1:
                hashedPassword = _b.sent();
                user = {
                    id: Date.now().toString(),
                    email: email,
                    password: hashedPassword,
                    name: name_1,
                    createdAt: new Date(),
                };
                users.push(user);
                res.status(201).json((0, shared_utils_1.successResponse)({ id: user.id, email: user.email, name: user.name }, 201));
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                res.status(500).json((0, shared_utils_1.errorHandler)(error_1));
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Login endpoint
app.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email_1, password, user, isPasswordValid, token, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, email_1 = _a.email, password = _a.password;
                user = users.find(function (u) { return u.email === email_1; });
                if (!user) {
                    return [2 /*return*/, res.status(401).json((0, shared_utils_1.errorHandler)({ message: 'Invalid credentials' }))];
                }
                return [4 /*yield*/, bcryptjs_1.default.compare(password, user.password)];
            case 1:
                isPasswordValid = _b.sent();
                if (!isPasswordValid) {
                    return [2 /*return*/, res.status(401).json((0, shared_utils_1.errorHandler)({ message: 'Invalid credentials' }))];
                }
                token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
                res.json((0, shared_utils_1.successResponse)({ token: token, user: { id: user.id, email: user.email, name: user.name } }));
                return [3 /*break*/, 3];
            case 2:
                error_2 = _b.sent();
                res.status(500).json((0, shared_utils_1.errorHandler)(error_2));
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Verify token endpoint
app.post('/verify', function (req, res) {
    var _a;
    try {
        var token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            return res.status(401).json((0, shared_utils_1.errorHandler)({ message: 'No token provided' }));
        }
        var decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        res.json((0, shared_utils_1.successResponse)(decoded));
    }
    catch (error) {
        res.status(401).json((0, shared_utils_1.errorHandler)(error));
    }
});
// Health check
app.get('/health', function (req, res) {
    res.json({ status: 'Auth Service is running' });
});
app.listen(PORT, function () {
    console.log("\uD83D\uDD10 Auth Service running on http://localhost:".concat(PORT));
});
exports.default = app;
