"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lead_controller_1 = require("../controllers/lead.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.use(auth_middleware_1.protect); // All lead routes require authentication
router.get('/export/csv', lead_controller_1.exportLeadsCsv);
router.route('/')
    .get(lead_controller_1.getLeads)
    .post(lead_controller_1.createLead);
router.route('/:id')
    .get(lead_controller_1.getLead)
    .put(lead_controller_1.updateLead)
    .delete((0, auth_middleware_1.authorize)('admin'), lead_controller_1.deleteLead);
exports.default = router;
