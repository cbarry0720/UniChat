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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mongodb_1 = require("mongodb");
var body_parser_1 = __importDefault(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
var app = (0, express_1.default)();
app.use(body_parser_1.default.json());
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
app.get("/users/all", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var mongo, users, allUsers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, connectDB()];
            case 1:
                mongo = _a.sent();
                users = mongo.db("users").collection('users');
                return [4 /*yield*/, users.find({}).toArray()];
            case 2:
                allUsers = _a.sent();
                res.send(allUsers.map(function (user) {
                    return {
                        userID: user.userID,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        tagName: user.tagName,
                        posts: user.posts,
                        comments: user.comments,
                        upvotes: user.upvotes,
                        downvotes: user.downvotes,
                        courses: user.courses,
                        deadlines: user.deadlines
                    };
                }));
                return [2 /*return*/];
        }
    });
}); });
app.get("/users/:userID", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var mongo, users, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, connectDB()];
            case 1:
                mongo = _a.sent();
                users = mongo.db("users").collection('users');
                console.log(req.params.userID);
                return [4 /*yield*/, users.findOne({ userID: req.params.userID })];
            case 2:
                user = _a.sent();
                if (!user) {
                    res.status(404).send("User Not Found!");
                    return [2 /*return*/];
                }
                res.send({
                    userID: user.userID,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    tagName: user.tagName,
                    posts: user.posts,
                    comments: user.comments,
                    upvotes: user.upvotes,
                    downvotes: user.downvotes,
                    courses: user.courses,
                    deadlines: user.deadlines
                });
                return [2 /*return*/];
        }
    });
}); });
app.post("/users/events", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, type, data, mongo, users, reformattedData, id, mongo, users, user, updatedUser, mongo, users, user, updatedUser, mongo, users, user, updatedUser, mongo, users, user, updatedUser, mongo, users, user, updatedUser, mongo, users, user, updatedUser;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!req.body.type || !req.body.data) {
                    res.status(400).send("Invalid Details!");
                    return [2 /*return*/];
                }
                _a = req.body, type = _a.type, data = _a.data;
                if (!(type === "UserCreated")) return [3 /*break*/, 3];
                return [4 /*yield*/, connectDB()];
            case 1:
                mongo = _b.sent();
                users = mongo.db("users").collection('users');
                reformattedData = {
                    userID: data._id,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    tagName: data.tagName,
                    posts: [],
                    comments: [],
                    upvotes: [],
                    downvotes: [],
                    courses: [],
                    deadlines: []
                };
                return [4 /*yield*/, users.insertOne(reformattedData)];
            case 2:
                id = _b.sent();
                if (id) {
                    res.send("User Created!");
                }
                else {
                    res.status(400).send("User Creation Failed!");
                }
                return [3 /*break*/, 40];
            case 3:
                if (!(type === "PostCreated")) return [3 /*break*/, 9];
                return [4 /*yield*/, connectDB()];
            case 4:
                mongo = _b.sent();
                users = mongo.db("users").collection('users');
                return [4 /*yield*/, users.findOne({ _id: data.userID })];
            case 5:
                user = _b.sent();
                if (!user) return [3 /*break*/, 7];
                return [4 /*yield*/, users.updateOne({ _id: data.userID }, { $push: { posts: data.postID } })];
            case 6:
                updatedUser = _b.sent();
                if (updatedUser) {
                    res.send("Post Created!");
                }
                else {
                    res.status(400).send("Post Creation Failed!");
                }
                return [3 /*break*/, 8];
            case 7:
                res.status(400).send("User Not Found!");
                _b.label = 8;
            case 8: return [3 /*break*/, 40];
            case 9:
                if (!(type === "CommentCreated")) return [3 /*break*/, 15];
                return [4 /*yield*/, connectDB()];
            case 10:
                mongo = _b.sent();
                users = mongo.db("users").collection('users');
                return [4 /*yield*/, users.findOne({ _id: data.userID })];
            case 11:
                user = _b.sent();
                if (!user) return [3 /*break*/, 13];
                return [4 /*yield*/, users.updateOne({ _id: data.userID }, { $push: { comments: data.commentID } })];
            case 12:
                updatedUser = _b.sent();
                if (updatedUser) {
                    res.send("Comment Created!");
                }
                else {
                    res.status(400).send("Comment Creation Failed!");
                }
                return [3 /*break*/, 14];
            case 13:
                res.status(400).send("User Not Found!");
                _b.label = 14;
            case 14: return [3 /*break*/, 40];
            case 15:
                if (!(type === "UpvoteCreated")) return [3 /*break*/, 21];
                return [4 /*yield*/, connectDB()];
            case 16:
                mongo = _b.sent();
                users = mongo.db("users").collection('users');
                return [4 /*yield*/, users.findOne({ _id: data.userID })];
            case 17:
                user = _b.sent();
                if (!user) return [3 /*break*/, 19];
                return [4 /*yield*/, users.updateOne({ _id: data.userID }, { $push: { upvotes: data.postID } })];
            case 18:
                updatedUser = _b.sent();
                if (updatedUser) {
                    res.send("Upvote Created!");
                }
                else {
                    res.status(400).send("Upvote Creation Failed!");
                }
                return [3 /*break*/, 20];
            case 19:
                res.status(400).send("User Not Found!");
                _b.label = 20;
            case 20: return [3 /*break*/, 40];
            case 21:
                if (!(type === "DownvoteCreated")) return [3 /*break*/, 27];
                return [4 /*yield*/, connectDB()];
            case 22:
                mongo = _b.sent();
                users = mongo.db("users").collection('users');
                return [4 /*yield*/, users.findOne({ _id: data.userID })];
            case 23:
                user = _b.sent();
                if (!user) return [3 /*break*/, 25];
                return [4 /*yield*/, users.updateOne({ _id: data.userID }, { $push: { downvotes: data.postID } })];
            case 24:
                updatedUser = _b.sent();
                if (updatedUser) {
                    res.send("Downvote Created!");
                }
                else {
                    res.status(400).send("Downvote Creation Failed!");
                }
                return [3 /*break*/, 26];
            case 25:
                res.status(400).send("User Not Found!");
                _b.label = 26;
            case 26: return [3 /*break*/, 40];
            case 27:
                if (!(type === "CourseAdded")) return [3 /*break*/, 33];
                return [4 /*yield*/, connectDB()];
            case 28:
                mongo = _b.sent();
                users = mongo.db("users").collection('users');
                return [4 /*yield*/, users.findOne({ _id: data.userID })];
            case 29:
                user = _b.sent();
                if (!user) return [3 /*break*/, 31];
                return [4 /*yield*/, users.updateOne({ _id: data.userID }, { $push: { courses: data.courseID } })];
            case 30:
                updatedUser = _b.sent();
                if (updatedUser) {
                    res.send("Course Added!");
                }
                else {
                    res.status(400).send("Course Addition Failed!");
                }
                return [3 /*break*/, 32];
            case 31:
                res.status(400).send("User Not Found!");
                _b.label = 32;
            case 32: return [3 /*break*/, 40];
            case 33:
                if (!(type === "DeadlineAdded")) return [3 /*break*/, 39];
                return [4 /*yield*/, connectDB()];
            case 34:
                mongo = _b.sent();
                users = mongo.db("users").collection('users');
                return [4 /*yield*/, users.findOne({ _id: data.userID })];
            case 35:
                user = _b.sent();
                if (!user) return [3 /*break*/, 37];
                return [4 /*yield*/, users.updateOne({ _id: data.userID }, { $push: { deadlines: data.deadlineID } })];
            case 36:
                updatedUser = _b.sent();
                if (updatedUser) {
                    res.send("Deadline Added!");
                }
                else {
                    res.status(400).send("Deadline Addition Failed!");
                }
                return [3 /*break*/, 38];
            case 37:
                res.status(400).send("User Not Found!");
                _b.label = 38;
            case 38: return [3 /*break*/, 40];
            case 39:
                res.status(400).send("Invalid Event!");
                _b.label = 40;
            case 40: return [2 /*return*/];
        }
    });
}); });
app.listen(4001, function () {
    console.log("Server listening on port 4001");
});
