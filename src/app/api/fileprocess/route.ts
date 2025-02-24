
import type { NextApiRequest, NextApiResponse } from 'next';
import * as XLSX from 'xlsx';

const checkUsnHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const file = req.body.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const buffer = Buffer.from(file, 'base64');
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    const sheet = workbook.Sheets['Sheet1'];
    const data = XLSX.utils.sheet_to_json(sheet);
    const usnColumn = data.map((col: any) => col.USN);

    return res.status(200).json({ usnColumn });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
};

export default checkUsnHandler;

