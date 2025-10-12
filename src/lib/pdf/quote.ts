const encoder = new TextEncoder();

function escapePdfText(text: string) {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

class PdfBuilder {
  private chunks: Uint8Array[] = [];
  private offsets: number[] = [];
  private length = 0;

  pushText(text: string) {
    const bytes = encoder.encode(text);
    this.chunks.push(bytes);
    this.length += bytes.length;
  }

  pushBinary(data: Uint8Array) {
    this.chunks.push(data);
    this.length += data.length;
  }

  addObject(id: number, content: () => void) {
    this.offsets[id] = this.length;
    this.pushText(`${id} 0 obj\n`);
    content();
    this.pushText('endobj\n');
  }

  build(): Uint8Array {
    const xrefStart = this.length;
    this.pushText(`xref\n0 ${this.offsets.length}\n`);
    this.pushText('0000000000 65535 f \n');
    for (let i = 1; i < this.offsets.length; i += 1) {
      const offset = this.offsets[i] ?? 0;
      this.pushText(`${offset.toString().padStart(10, '0')} 00000 n \n`);
    }
    this.pushText(`trailer\n<< /Size ${this.offsets.length} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`);

    const totalLength = this.chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const output = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of this.chunks) {
      output.set(chunk, offset);
      offset += chunk.length;
    }
    return output;
  }
}

export interface QuotePdfOptions {
  headerLines: string[];
  customerLines: string[];
  itemLines: string[];
  discountLines?: string[];
  totalLine: string;
  notesLines?: string[];
  footerLines?: string[];
}

export function generateQuotePdf(options: QuotePdfOptions) {
  const {headerLines, customerLines, itemLines, discountLines = [], totalLine, notesLines = [], footerLines = []} = options;

  const builder = new PdfBuilder();
  builder.pushText('%PDF-1.4\n');

  const pageWidth = 595; // A4 portrait
  const pageHeight = 842;
  const margin = 54;

  builder.addObject(1, () => {
    builder.pushText('<< /Type /Catalog /Pages 2 0 R >>\n');
  });

  builder.addObject(2, () => {
    builder.pushText('<< /Type /Pages /Kids [3 0 R] /Count 1 >>\n');
  });

  builder.addObject(3, () => {
    builder.pushText(
      `<< /Type /Page /Parent 2 0 R /Resources << /ProcSet [/PDF /Text] /Font << /F1 4 0 R >> >> /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents 5 0 R >>\n`
    );
  });

  builder.addObject(4, () => {
    builder.pushText('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\n');
  });

  builder.addObject(5, () => {
    const lineHeight = 20;
    let cursorY = pageHeight - margin;
    let stream = '';

    const writeLines = (lines: string[], fontSize = 12, extraSpacing = 0) => {
      lines.forEach((line) => {
        stream += `BT /F1 ${fontSize} Tf ${margin} ${cursorY} Td (${escapePdfText(line)}) Tj ET\n`;
        cursorY -= lineHeight + extraSpacing;
      });
    };

    writeLines(headerLines, 16, 4);
    cursorY -= 8;

    writeLines(customerLines, 12);
    cursorY -= 12;

    writeLines(itemLines, 12);

    if (discountLines.length > 0) {
      cursorY -= 12;
      writeLines(discountLines, 12);
    }

    cursorY -= 6;
    writeLines([totalLine], 13);

    if (notesLines.length > 0) {
      cursorY -= 12;
      writeLines(notesLines, 11);
    }

    if (footerLines.length > 0) {
      cursorY -= 18;
      writeLines(footerLines, 11);
    }

    builder.pushText(`<< /Length ${stream.length} >>\nstream\n`);
    builder.pushText(stream);
    builder.pushText('endstream\n');
  });

  return new Blob([builder.build() as BlobPart], {type: 'application/pdf'});
}
