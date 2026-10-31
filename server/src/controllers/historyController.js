import { Case } from '../models/Case.js';
import { serializeCaseHistory } from '../services/caseSerializer.js';

export async function getCaseHistory(req, res, next) {
  try {
    const cases = await Case.find({ ownerId: req.guestId })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      cases: serializeCaseHistory(cases),
    });
  } catch (err) {
    next(err);
  }
}

