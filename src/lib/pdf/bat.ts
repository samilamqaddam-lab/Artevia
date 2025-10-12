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

export interface BatPdfOptions {
  productName: string;
  customerNote?: string;
  methodLabel: string;
  zoneLabel: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  setupFee: string;
  leadTimeLabel: string;
  previewDataUrl: string;
  locale: 'fr' | 'ar';
  canvasWidth: number;
  canvasHeight: number;
}

function dataUrlToUint8Array(dataUrl: string) {
  const [, encoded] = dataUrl.split(',');
  if (!encoded) {
    throw new Error('Invalid data URL');
  }
  const binary = typeof atob === 'function' ? atob(encoded) : Buffer.from(encoded, 'base64').toString('binary');
  const buffer = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    buffer[i] = binary.charCodeAt(i);
  }
  return buffer;
}

export function generateBatPdf(options: BatPdfOptions) {
  const {
    productName,
    methodLabel,
    zoneLabel,
    quantity,
    unitPrice,
    totalPrice,
    setupFee,
    leadTimeLabel,
    previewDataUrl,
    customerNote,
    locale,
    canvasWidth,
    canvasHeight
  } = options;

  const previewBytes = dataUrlToUint8Array(previewDataUrl);
  const pageWidth = 595; // A4 portrait
  const pageHeight = 842;
  const contentMargin = 48;
  const maxImageWidth = pageWidth - contentMargin * 2;
  const maxImageHeight = 420;
  const sourceWidth = Math.max(1, Math.round(canvasWidth));
  const sourceHeight = Math.max(1, Math.round(canvasHeight));
  const canvasAspect = Math.max(0.1, sourceHeight / sourceWidth);

  const builder = new PdfBuilder();
  builder.pushText('%PDF-1.4\n');

  builder.addObject(1, () => {
    builder.pushText('<< /Type /Catalog /Pages 2 0 R >>\n');
  });

  builder.addObject(2, () => {
    builder.pushText('<< /Type /Pages /Kids [3 0 R] /Count 1 >>\n');
  });

  builder.addObject(3, () => {
    builder.pushText(
      `<< /Type /Page /Parent 2 0 R /Resources << /ProcSet [/PDF /Text /ImageC] /Font << /F1 5 0 R >> /XObject << /Im0 4 0 R >> >> /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents 6 0 R >>\n`
    );
  });

  builder.addObject(4, () => {
    builder.pushText(
      `<< /Type /XObject /Subtype /Image /Width ${sourceWidth} /Height ${sourceHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${previewBytes.length} >>\n`
    );
    builder.pushText('stream\n');
    builder.pushBinary(previewBytes);
    builder.pushText('\nendstream\n');
  });

  builder.addObject(5, () => {
    builder.pushText('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\n');
  });

  const qtyLabel = locale === 'ar' ? 'قطعة' : 'pcs';
  const unitLabel = locale === 'ar' ? 'سعر الوحدة' : 'Prix unitaire';
  const setupLabel = locale === 'ar' ? 'رسوم الإعداد' : 'Frais de calage';
  const totalLabel = locale === 'ar' ? 'الإجمالي الكلي' : 'Total';
  const noteLabel = locale === 'ar' ? 'ملاحظة' : 'Note';

  builder.addObject(6, () => {
    const headerLines = [
      {value: productName, size: 18},
      {value: `${methodLabel} | ${zoneLabel}`, size: 13},
      {value: `${quantity} ${qtyLabel} | ${leadTimeLabel}`, size: 13},
      {value: `${unitLabel}: ${unitPrice} | ${setupLabel}: ${setupFee}`, size: 13},
      {value: `${totalLabel}: ${totalPrice}`, size: 13}
    ];

    const lineHeight = 24;
    let cursorY = pageHeight - 72;
    let stream = '';

    headerLines.forEach((line) => {
      stream += `BT /F1 ${line.size} Tf ${contentMargin} ${cursorY} Td (${escapePdfText(line.value)}) Tj ET\n`;
      cursorY -= lineHeight;
    });

    if (customerNote) {
      stream += `BT /F1 12 Tf ${contentMargin} ${cursorY} Td (${escapePdfText(`${noteLabel}: ${customerNote}`)}) Tj ET\n`;
      cursorY -= lineHeight;
    }

    cursorY -= 36;
    const availableHeight = Math.max(160, cursorY - (contentMargin + 80));
    let scaledHeight = Math.min(availableHeight, maxImageHeight, sourceHeight);
    let scaledWidth = scaledHeight / canvasAspect;
    if (scaledWidth > maxImageWidth) {
      scaledWidth = maxImageWidth;
      scaledHeight = scaledWidth * canvasAspect;
    }

    const imageX = (pageWidth - scaledWidth) / 2;
    const imageY = Math.max(contentMargin + 100, cursorY - scaledHeight);

    const caption = locale === 'ar' ? 'معاينة التصميم' : 'Aperçu design';
    const captionY = imageY - 14;
    stream += `BT /F1 11 Tf ${contentMargin} ${captionY} Td (${escapePdfText(caption)}) Tj ET\n`;
    stream += `q ${scaledWidth} 0 0 ${scaledHeight} ${imageX} ${imageY} cm /Im0 Do Q\n`;

    builder.pushText(`<< /Length ${stream.length} >>\nstream\n`);
    builder.pushText(stream);
    builder.pushText('endstream\n');
  });

  return new Blob([builder.build() as BlobPart], {type: 'application/pdf'});
}
