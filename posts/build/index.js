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
var axios_1 = __importDefault(require("axios"));
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
app.get("/posts/all", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var mongo, posts, allPosts;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, connectDB()];
            case 1:
                mongo = _a.sent();
                posts = mongo.db("posts").collection('posts');
                return [4 /*yield*/, posts.find({}).toArray()];
            case 2:
                allPosts = _a.sent();
                res.send(allPosts);
                return [2 /*return*/];
        }
    });
}); });
app.get("/posts/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var mongo, posts, id, post;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, connectDB()];
            case 1:
                mongo = _a.sent();
                posts = mongo.db("posts").collection('posts');
                id = new mongodb_1.ObjectId(req.params.id);
                return [4 /*yield*/, posts.findOne({ _id: id })];
            case 2:
                post = _a.sent();
                if (!post) {
                    res.status(404).send("Post Not Found!");
                    return [2 /*return*/];
                }
                res.send(post);
                return [2 /*return*/];
        }
    });
}); });
app.post("/posts/create", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userID, postText, postMedia, groupID, mongo, posts, id, post;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!req.body.userID || !req.body.postText || !req.body.postMedia || !req.body.groupID) {
                    res.status(400).send("Invalid Details!");
                    return [2 /*return*/];
                }
                _a = req.body, userID = _a.userID, postText = _a.postText, postMedia = _a.postMedia, groupID = _a.groupID;
                return [4 /*yield*/, connectDB()];
            case 1:
                mongo = _b.sent();
                posts = mongo.db("posts").collection('posts');
                return [4 /*yield*/, posts.insertOne({
                        userID: userID,
                        groupID: groupID,
                        postText: postText,
                        postMedia: postMedia,
                        postUpvotes: [],
                        postDownvotes: [],
                        postComments: []
                    })];
            case 2:
                id = _b.sent();
                post = {
                    postID: id.insertedId,
                    userID: userID,
                    groupID: groupID,
                    postText: postText,
                    postMedia: postMedia,
                    postUpvotes: [],
                    postDownvotes: [],
                    postComments: []
                };
                if (!id) return [3 /*break*/, 4];
                return [4 /*yield*/, axios_1.default.post("http://eventbus:4010/events", {
                        type: "PostCreated",
                        data: post
                    })];
            case 3:
                _b.sent();
                res.status(201).send({ post: post });
                return [2 /*return*/];
            case 4:
                res.status(500).send("Internal Server Error!");
                return [2 /*return*/];
        }
    });
}); });
app.post("/posts/events", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, type, data, mongo, posts, post, upvoted, downvoted, commented;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!req.body.type || !req.body.data) {
                    res.status(400).send("Invalid Details!");
                    return [2 /*return*/];
                }
                _a = req.body, type = _a.type, data = _a.data;
                return [4 /*yield*/, connectDB()];
            case 1:
                mongo = _b.sent();
                posts = mongo.db("posts").collection('posts');
                return [4 /*yield*/, posts.findOne({ _id: data.postID })];
            case 2:
                post = _b.sent();
                if (!post) {
                    res.status(404).send("Post Not Found!");
                    return [2 /*return*/];
                }
                if (!(type === "PostUpvoted")) return [3 /*break*/, 4];
                return [4 /*yield*/, posts.updateOne({ _id: data.postID }, { $push: { postUpvotes: data.userID } })];
            case 3:
                upvoted = _b.sent();
                if (upvoted) {
                    res.status(200).send("Post Upvoted!");
                    return [2 /*return*/];
                }
                res.status(500).send("Internal Server Error!");
                return [2 /*return*/];
            case 4:
                if (!(type === "PostDownvoted")) return [3 /*break*/, 6];
                return [4 /*yield*/, posts.updateOne({ _id: data.postID }, { $push: { postDownvotes: data.userID } })];
            case 5:
                downvoted = _b.sent();
                if (downvoted) {
                    res.status(200).send("Post Downvoted!");
                    return [2 /*return*/];
                }
                res.status(500).send("Internal Server Error!");
                return [2 /*return*/];
            case 6:
                if (!(type === "PostCommented")) return [3 /*break*/, 8];
                return [4 /*yield*/, posts.updateOne({ _id: data.postID }, { $push: { postComments: data.commentID } })];
            case 7:
                commented = _b.sent();
                if (commented) {
                    res.status(200).send("Post Commented!");
                    return [2 /*return*/];
                }
                res.status(500).send("Internal Server Error!");
                return [2 /*return*/];
            case 8:
                res.status(400).send("Invalid Details!");
                return [2 /*return*/];
        }
    });
}); });
app.listen(4002, function () {
    console.log("Listening on port 4002");
});
