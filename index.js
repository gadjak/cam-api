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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const digest_fetch_1 = __importDefault(require("digest-fetch"));
const cors_1 = __importDefault(require("cors"));
require("dotenv").config();
const requestTimeout = 8;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const PORT = process.env.PORT || 8000;
app.get("/", (req, res) => {
    return res.send("Hello World!");
});
app.get("/api/camera/:ip/:user/:password", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = new digest_fetch_1.default(req.params.user, req.params.password, { algorithm: "MD5" });
        const ip = req.params.ip;
        const response = yield client.fetch(`http://${ip}/ISAPI/System/Status`, {
            method: "GET",
            signal: AbortSignal.timeout(requestTimeout * 1000),
        });
        const data = yield response.text();
        if (response.status >= 400) {
            res.status(400);
            return res.json({ message: "server is offline" });
        }
        res.send(data);
    }
    catch (_a) {
        res.status(400);
        res.json({ message: "server is offline" });
    }
}));
app.put("/api/camera/:ip/reboot/:user/:password", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = new digest_fetch_1.default(req.params.user, req.params.password, { algorithm: "MD5" });
        const ip = req.params.ip;
        const response = yield client.fetch(`http://${ip}/ISAPI/System/Reboot`, {
            method: "PUT",
            signal: AbortSignal.timeout(requestTimeout * 1000),
        });
        if (response.status >= 400) {
            res.status(400);
            return res.json({ message: "server is offline" });
        }
        const data = yield response.text();
        res.send(data);
    }
    catch (_b) {
        res.status(400);
        res.json({ message: "server is offline" });
    }
}));
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
module.exports = app;
//   "start": "tsc -p . && node dist/index.js",
//# sourceMappingURL=index.js.map