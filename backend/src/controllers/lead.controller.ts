import { Request, Response } from 'express';
import { Lead } from '../models/Lead';
import { io } from '../server';

// Helper to simulate AI Lead Scoring
const generateAiScore = (status: string, source: string): { score: number; probability: number } => {
  let score = Math.floor(Math.random() * 40) + 20; // Base score 20-60
  
  if (status === 'Qualified') score += 30;
  if (status === 'Contacted') score += 15;
  if (source === 'Referral') score += 20;
  if (source === 'Website') score += 10;
  
  score = Math.min(100, score);
  const probability = Math.min(100, Math.floor(score * 0.9 + (Math.random() * 10)));
  
  return { score, probability };
};

export const createLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const aiData = generateAiScore(req.body.status || 'New', req.body.source);
    
    const lead = await Lead.create({
      ...req.body,
      aiScore: aiData.score,
      conversionProbability: aiData.probability,
    });

    io.emit('lead_created', lead);

    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const getLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const startIndex = (page - 1) * limit;

    const query: any = {};

    // Filtering
    if (req.query.status) query.status = req.query.status;
    if (req.query.source) query.source = req.query.source;
    
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
    const sortParams: any = {};
    if (req.query.sort === 'oldest') {
      sortParams.createdAt = 1;
    } else {
      sortParams.createdAt = -1; // Default to latest
    }

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
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
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const getLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate('assignedTo', 'name email');
    if (!lead) {
      res.status(404).json({ success: false, error: 'Lead not found' });
      return;
    }
    
    // @ts-ignore
    if (req.user.role === 'sales' && lead.assignedTo?._id.toString() !== req.user.id.toString()) {
      res.status(403).json({ success: false, error: 'Not authorized to access this lead' });
      return;
    }

    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const updateLead = async (req: Request, res: Response): Promise<void> => {
  try {
    let lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404).json({ success: false, error: 'Lead not found' });
      return;
    }

    // @ts-ignore
    if (req.user.role === 'sales' && lead.assignedTo?.toString() !== req.user.id.toString()) {
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

    lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    io.emit('lead_updated', lead);

    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const deleteLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
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

    await lead.deleteOne();

    io.emit('lead_deleted', req.params.id);

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const exportLeadsCsv = async (req: Request, res: Response): Promise<void> => {
  try {
    const query: any = {};
    if (req.query.status) query.status = req.query.status;
    if (req.query.source) query.source = req.query.source;
    
    // @ts-ignore
    if (req.user && req.user.role === 'sales') {
      // @ts-ignore
      query.assignedTo = req.user.id;
    }

    const leads = await Lead.find(query).lean();

    const csvHeaders = 'Name,Email,Status,Source,AI Score,Probability,Created At\n';
    const csvRows = leads.map(lead => 
      `"${lead.name}","${lead.email}","${lead.status}","${lead.source}",${lead.aiScore},${lead.conversionProbability},"${lead.createdAt}"`
    ).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.status(200).send(csvHeaders + csvRows);
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};
