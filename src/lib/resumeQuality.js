import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const ACTION_VERBS = [
  "developed",
  "created",
  "led",
  "managed",
  "increased",
  "reduced",
  "implemented",
  "designed",
  "achieved",
];

export const calculateResumeQualityScore = (text = "") => {
  const lower = text.toLowerCase();
  const breakdown = {
    structure: { earned: 0, total: 25 },
    sections: { earned: 0, total: 30 },
    contact: { earned: 0, total: 15 },
    actionVerbs: { earned: 0, total: 20 },
    results: { earned: 0, total: 10 },
  };

  if (text.length > 1500) {
    breakdown.structure.earned = 15;
  } else if (text.length > 500 && text.length <= 1500) {
    breakdown.structure.earned = 10;
  }

  const sections = ["experience", "education", "skills"];
  sections.forEach((section) => {
    if (lower.includes(section)) {
      breakdown.sections.earned += 10;
    }
  });

  const hasEmail =
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/.test(text);
  const hasPhone = /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text);
  if (hasEmail) breakdown.contact.earned += 8;
  if (hasPhone) breakdown.contact.earned += 7;

  const verbCount = ACTION_VERBS.filter((verb) => lower.includes(verb)).length;
  breakdown.actionVerbs.earned = Math.min(verbCount * 2, 20);

  const hasNumbers = /\d+%|\d+x|\$\d+/.test(text);
  if (hasNumbers) breakdown.results.earned = 10;

  const score = Math.min(
    breakdown.structure.earned +
      breakdown.sections.earned +
      breakdown.contact.earned +
      breakdown.actionVerbs.earned +
      breakdown.results.earned,
    100,
  );

  return { score, breakdown };
};

export const extractTextFromPdfArrayBuffer = async (arrayBuffer) => {
  const typedArray = new Uint8Array(arrayBuffer);
  const pdf = await pdfjs.getDocument({ data: typedArray }).promise;
  let text = "";

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str || "").join(" ");
    text += ` ${pageText}`;
  }

  return text.trim();
};

export const extractTextFromPdfFile = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  return extractTextFromPdfArrayBuffer(arrayBuffer);
};
