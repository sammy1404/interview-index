import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as Blob | null;

        if (!file) {
            return NextResponse.json({ error: 'No file found in request' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);
        const usnColumn = data.map((row: any) => row["USN"]);
        console.log(usnColumn);

        return NextResponse.json(usnColumn);

    }
    catch(error) {
        console.log(error);
        return NextResponse.json({ error: error }, { status: 400 });
    }
}
