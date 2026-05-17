import express from 'express';
import { createLead, getLeads, getLead, updateLead, deleteLead, exportLeadsCsv } from '../controllers/lead.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = express.Router();

router.use(protect); // All lead routes require authentication

router.get('/export/csv', exportLeadsCsv);

router.route('/')
  .get(getLeads)
  .post(createLead);

router.route('/:id')
  .get(getLead)
  .put(updateLead)
  .delete(authorize('admin'), deleteLead);

export default router;
