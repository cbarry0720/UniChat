"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var bodyParser = __importStar(require("body-parser"));
var axios_1 = __importDefault(require("axios"));
var cors_1 = __importDefault(require("cors"));
var app = (0, express_1.default)();
app.use(bodyParser.json());
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
app.get("/votes/all", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var mongo, votes, allVotes;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, connectDB()];
            case 1:
                mongo = _a.sent();
                votes = mongo.db("votes").collection('votes');
                return [4 /*yield*/, votes.find({}).toArray()];
            case 2:
                allVotes = _a.sent();
                res.send(allVotes);
                return [2 /*return*/];
        }
    });
}); });
app.get("/votes/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var mongo, votes, vote;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, connectDB()];
            case 1:
                mongo = _a.sent();
                votes = mongo.db("votes").collection('votes');
                return [4 /*yield*/, votes.findOne({ _id: req.params.id })];
            case 2:
                vote = _a.sent();
                if (!vote) {
                    res.status(404).send("votes Not Found!");
                    return [2 /*return*/];
                }
                res.send(vote);
                return [2 /*return*/];
        }
    });
}); });
//this will handle the votes
app.post("/votes/create", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userID, voteType, postID, mongo, votes, id;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!req.body.userID || !req.body.voteType || !req.body.postID) {
                    res.status(400).send("Invalid Group!");
                    return [2 /*return*/];
                }
                _a = req.body, userID = _a.userID, voteType = _a.voteType, postID = _a.postID;
                return [4 /*yield*/, connectDB()];
            case 1:
                mongo = _b.sent();
                votes = mongo.db("votes").collection('votes');
                return [4 /*yield*/, votes.insertOne({
                        voter: userID,
                        postID: postID,
                        voteType: voteType,
                    })];
            case 2:
                id = _b.sent();
                if (!id) return [3 /*break*/, 4];
                return [4 /*yield*/, axios_1.default.post('http://eventbus:4010/events', {
                        type: 'VoteCreated',
                        data: {
                            voteID: id.insertedId,
                            voter: userID,
                            postID: postID,
                            voteType: voteType,
                        },
                    })];
            case 3:
                _b.sent();
                res.status(201).send({
                    voteID: id.insertedId,
                    voter: userID,
                    postID: postID,
                    voteType: voteType,
                });
                return [2 /*return*/];
            case 4:
                res.status(500).send("Internal Server Error!");
                return [2 /*return*/];
        }
    });
}); });
app.listen(4006, function () {
    console.log("Running on ".concat(4006, "."));
});
