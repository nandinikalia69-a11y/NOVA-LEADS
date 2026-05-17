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
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportLeadsCsv = exports.deleteLead = exports.updateLead = exports.getLead = exports.getLeads = exports.createLead = void 0;
const Lead_1 = require("../models/Lead");
const server_1 = require("../server");
// Helper to simulate AI Lead Scoring
const generateAiScore = (status, source) => {
    let score = Math.floor(Math.random() * 40) + 20; // Base score 20-60
    if (status === 'Qualified')
        score += 30;
    if (status === 'Contacted')
        score += 15;
    if (source === 'Referral')
        score += 20;
    if (source === 'Website')
        score += 10;
    score = Math.min(100, score);
    const probability = Math.min(100, Math.floor(score * 0.9 + (Math.random() * 10)));
    return { score, probability };
};
const createLead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const aiData = generateAiScore(req.body.status || 'New', req.body.source);
        const lead = yield Lead_1.Lead.create(Object.assign(Object.assign({}, req.body), { aiScore: aiData.score, conversionProbability: aiData.probability }));
        server_1.io.emit('lead_created', lead);
        res.status(201).json({ success: true, data: lead });
    }
    catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});
exports.createLead = createLead;
const getLeads = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const query = {};
        // Filtering
        if (req.query.status)
            query.status = req.query.status;
        if (req.query.source)
            query.source = req.query.source;
        // Search
        if (req.query.search) {
            query.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } }
            ];
        }
        // Role Based Access: If sales user, only show assigned leads
        // @ts-ignore
        if (req.user && req.user.role === 'sales') {
            // @ts-ignore
            query.assignedTo = req.user.id;
        }
        // Sorting
        const sortParams = {};
        if (req.query.sort === 'oldest') {
            sortParams.createdAt = 1;
        }
        else {
            sortParams.createdAt = -1; // Default to latest
        }
        const total = yield Lead_1.Lead.countDocuments(query);
        const leads = yield Lead_1.Lead.find(query)
            .sort(sortParams)
            .skip(startIndex)
            .limit(limit)
            .populate('assignedTo', 'name email');
        res.status(200).json({
            success: true,
            count: leads.length,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
            data: leads
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.getLeads = getLeads;
const getLead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const lead = yield Lead_1.Lead.findById(req.params.id).populate('assignedTo', 'name email');
        if (!lead) {
            res.status(404).json({ success: false, error: 'Lead not found' });
            return;
        }
        // @ts-ignore
        if (req.user.role === 'sales' && ((_a = lead.assignedTo) === null || _a === void 0 ? void 0 : _a._id.toString()) !== req.user.id.toString()) {
            res.status(403).json({ success: false, error: 'Not authorized to access this lead' });
            return;
        }
        res.status(200).json({ success: true, data: lead });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.getLead = getLead;
const updateLead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let lead = yield Lead_1.Lead.findById(req.params.id);
        if (!lead) {
            res.status(404).json({ success: false, error: 'Lead not found' });
            return;
        }
        // @ts-ignore
        if (req.user.role === 'sales' && ((_a = lead.assignedTo) === null || _a === void 0 ? void 0 : _a.toString()) !== req.user.id.toString()) {
            res.status(403).json({ success: false, error: 'Not authorized to update this lead' });
            return;
        }
        // Recalculate AI score if status or source changes
        if (req.body.status || req.body.source) {
            const status = req.body.status || lead.status;
            const source = req.body.source || lead.source;
            const aiData = generateAiScore(status, source);
            req.body.aiScore = aiData.score;
            req.body.conversionProbability = aiData.probability;
        }
        lead = yield Lead_1.Lead.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        server_1.io.emit('lead_updated', lead);
        res.status(200).json({ success: true, data: lead });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.updateLead = updateLead;
const deleteLead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lead = yield Lead_1.Lead.findById(req.params.id);
        if (!lead) {
            res.status(404).json({ success: false, error: 'Lead not found' });
            return;
        }
        // Only admins can delete leads
        // @ts-ignore
        if (req.user.role !== 'admin') {
            res.status(403).json({ success: false, error: 'Not authorized to delete leads' });
            return;
        }
        yield lead.deleteOne();
        server_1.io.emit('lead_deleted', req.params.id);
        res.status(200).json({ success: true, data: {} });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.deleteLead = deleteLead;
const exportLeadsCsv = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = {};
        if (req.query.status)
            query.status = req.query.status;
        if (req.query.source)
            query.source = req.query.source;
        // @ts-ignore
        if (req.user && req.user.role === 'sales') {
            // @ts-ignore
            query.assignedTo = req.user.id;
        }
        const leads = yield Lead_1.Lead.find(query).lean();
        const csvHeaders = 'Name,Email,Status,Source,AI Score,Probability,Created At\n';
        const csvRows = leads.map(lead => `"${lead.name}","${lead.email}","${lead.status}","${lead.source}",${lead.aiScore},${lead.conversionProbability},"${lead.createdAt}"`).join('\n');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
        res.status(200).send(csvHeaders + csvRows);
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
exports.exportLeadsCsv = exportLeadsCsv;
