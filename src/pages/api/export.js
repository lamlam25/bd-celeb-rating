import * as XLSX from 'xlsx';
import { getRatings } from '../../lib/storage';
import { generateDataset } from '../../lib/celebrities';
import { getUserFromRequest } from '../../lib/auth';

export default function handler(req, res) {
  const user = getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  const type = req.query.type;
  const wb = XLSX.utils.book_new();

  if (type === 'dataset') {
    const ws = XLSX.utils.json_to_sheet(generateDataset());
    XLSX.utils.book_append_sheet(wb, ws, 'Dataset');
  } else {
    const ratings = getRatings();
    const ws = XLSX.utils.json_to_sheet(ratings);
    XLSX.utils.book_append_sheet(wb, ws, 'Ratings');
  }

  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${type}.xlsx"`);
  res.send(buffer);
}
