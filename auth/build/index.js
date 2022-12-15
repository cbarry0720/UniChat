"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var express_session_1 = __importDefault(require("express-session"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var axios_1 = __importDefault(require("axios"));
var mongodb_1 = require("mongodb");
var cors_1 = __importDefault(require("cors"));
var app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({ secret: "Your secret key" }));
app.use((0, cors_1.default)());
function connectDB() {
    return __awaiter(this, void 0, void 0, function () {
        var uri, mongo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    uri = process.env.DATABASE_URL || 'mongodb://localhost:27017';
                    if (uri === undefined) {
                        throw Error('DATABASE_URL environment variable is not specified');
                    }
                    mongo = new mongodb_1.MongoClient(uri);
                    return [4 /*yield*/, mongo.connect()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, Promise.resolve(mongo)];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function addUser(mongo, user) {
    return __awaiter(this, void 0, void 0, function () {
        var users, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    users = mongo.db("auth").collection('users');
                    return [4 /*yield*/, users.insertOne(user)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.insertedId];
            }
        });
    });
}
function getUser(mongo, tagName) {
    return __awaiter(this, void 0, void 0, function () {
        var users, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    users = mongo.db("auth").collection('users');
                    return [4 /*yield*/, users.findOne({ tagName: tagName })];
                case 1:
                    user = (_a.sent());
                    if (user) {
                        return [2 /*return*/, user];
                    }
                    return [2 /*return*/, undefined];
            }
        });
    });
}
app.post("/auth/signup", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, firstName, lastName, tagName, password, mongo, salt, hashedPassword, newUser, id, user;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!req.body.firstName || !req.body.lastName || !req.body.tagName || !req.body.password) {
                    res.status(400).send("Invalid Details!");
                    return [2 /*return*/];
                }
                _a = req.body, firstName = _a.firstName, lastName = _a.lastName, tagName = _a.tagName, password = _a.password;
                return [4 /*yield*/, connectDB()];
            case 1:
                mongo = _b.sent();
                return [4 /*yield*/, bcrypt_1.default.genSalt(5)];
            case 2:
                salt = _b.sent();
                return [4 /*yield*/, bcrypt_1.default.hash(password, salt)];
            case 3:
                hashedPassword = _b.sent();
                newUser = { firstName: firstName, lastName: lastName, tagName: tagName, password: hashedPassword };
                return [4 /*yield*/, addUser(mongo, newUser)];
            case 4:
                id = _b.sent();
                user = __assign(__assign({}, newUser), { userID: id });
                console.log(user);
                return [4 /*yield*/, axios_1.default.post("http://localhost:4010/events", {
                        type: "UserCreated",
                        data: user
                    })];
            case 5:
                _b.sent();
                res.json(user);
                return [2 /*return*/];
        }
    });
}); });
app.post("/auth/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, tagName, password, mongo, user, validPassword;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!req.body.tagName || !req.body.password) {
                    res.status(400).send("Invalid Details!");
                    return [2 /*return*/];
                }
                _a = req.body, tagName = _a.tagName, password = _a.password;
                return [4 /*yield*/, connectDB()];
            case 1:
                mongo = _b.sent();
                return [4 /*yield*/, getUser(mongo, tagName)];
            case 2:
                user = _b.sent();
                if (!user) {
                    res.status(404).send("User not found!");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
            case 3:
                validPassword = _b.sent();
                if (!validPassword) {
                    res.status(400).send("Invalid password!");
                    return [2 /*return*/];
                }
                console.log({ userID: user._id, message: "Logged in!" });
                res.json({ userID: user._id, message: "Logged in!" });
                return [2 /*return*/];
        }
    });
}); });
app.post("/auth/events", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, type, data, tagName, password, newPassword, mongo, user, validPassword, salt, hashedPassword, users, result, tagName, firstName, mongo, user, users, result, tagName, lastName, mongo, user, users, result;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!req.body.type || !req.body.data) {
                    res.status(400).send("Invalid Details!");
                    return [2 /*return*/];
                }
                _a = req.body, type = _a.type, data = _a.data;
                if (!(type == "UpdatePassword")) return [3 /*break*/, 7];
                tagName = data.tagName, password = data.password, newPassword = data.newPassword;
                return [4 /*yield*/, connectDB()];
            case 1:
                mongo = _b.sent();
                return [4 /*yield*/, getUser(mongo, tagName)];
            case 2:
                user = _b.sent();
                if (!user) {
                    res.status(404).send("User not found!");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
            case 3:
                validPassword = _b.sent();
                if (!validPassword) {
                    res.status(400).send("Invalid password!");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, bcrypt_1.default.genSalt(5)];
            case 4:
                salt = _b.sent();
                return [4 /*yield*/, bcrypt_1.default.hash(newPassword, salt)];
            case 5:
                hashedPassword = _b.sent();
                users = mongo.db("auth").collection('users');
                return [4 /*yield*/, users.updateOne({ _id: user._id }, { $set: { password: hashedPassword } })];
            case 6:
                result = _b.sent();
                res.send("Password updated!");
                return [3 /*break*/, 16];
            case 7:
                if (!(type == "UpdateFirstName")) return [3 /*break*/, 11];
                tagName = data.tagName, firstName = data.firstName;
                return [4 /*yield*/, connectDB()];
            case 8:
                mongo = _b.sent();
                return [4 /*yield*/, getUser(mongo, tagName)];
            case 9:
                user = _b.sent();
                if (!user) {
                    res.status(404).send("User not found!");
                    return [2 /*return*/];
                }
                users = mongo.db("auth").collection('users');
                return [4 /*yield*/, users.updateOne({ _id: user._id }, { $set: { firstName: firstName } })];
            case 10:
                result = _b.sent();
                res.send("First name updated!");
                return [3 /*break*/, 16];
            case 11:
                if (!(type == "UpdateLastName")) return [3 /*break*/, 15];
                tagName = data.tagName, lastName = data.lastName;
                return [4 /*yield*/, connectDB()];
            case 12:
                mongo = _b.sent();
                return [4 /*yield*/, getUser(mongo, tagName)];
            case 13:
                user = _b.sent();
                if (!user) {
                    res.status(404).send("User not found!");
                    return [2 /*return*/];
                }
                users = mongo.db("auth").collection('users');
                return [4 /*yield*/, users.updateOne({ _id: user._id }, { $set: { lastName: lastName } })];
            case 14:
                result = _b.sent();
                res.send("Last name updated!");
                return [3 /*break*/, 16];
            case 15:
                res.status(400).send("Invalid event type!");
                _b.label = 16;
            case 16: return [2 /*return*/];
        }
    });
}); });
app.listen(4000, function () { return console.log("Listening on port 4000"); });
