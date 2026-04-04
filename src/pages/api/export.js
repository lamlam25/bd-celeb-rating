import { getRatings } from '../../lib/storage';
import { generateDataset } from '../../lib/celebrities';
import { getUserFromRequest } from '../../lib/auth';

// Helper function to convert JSON to CSV
function jsonToCSV(data) {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [];
  
  // Add header row
  csvRows.push(headers.join(','));
  
  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Escape commas and quotes in values
      const escaped = ('' + value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}

export default async function handler(req, res) {
  const user = getUserFromRequest(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  
  const type = req.query.type;
  let csvData = '';
  let filename = '';

  if (type === 'dataset') {
    const dataset = generateDataset();
    csvData = jsonToCSV(dataset);
    filename = 'dataset.csv';
  } else {
    const ratings = await getRatings();
    csvData = jsonToCSV(ratings);
    filename = 'ratings.csv';
  }

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(csvData);
}

