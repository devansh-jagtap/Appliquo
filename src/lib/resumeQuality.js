import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

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

const IDEAL_LENGTH_THRESHOLD = 1500;
const MIN_LENGTH_THRESHOLD = 500;
const IDEAL_LENGTH_SCORE = 15;
const MIN_LENGTH_SCORE = 10;
const POINTS_PER_ACTION_VERB = 2;
const MAX_ACTION_VERB_POINTS = 20;
const hasWholeWord = (text, word) =>
  new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(
    text,
  );

export const calculateResumeQualityScore = (text = "") => {
  const lower = text.toLowerCase();
  const breakdown = {
    structure: { earned: 0, total: 25 },
    sections: { earned: 0, total: 30 },
    contact: { earned: 0, total: 15 },
    actionVerbs: { earned: 0, total: 20 },
    results: { earned: 0, total: 10 },
  };

  if (text.length > IDEAL_LENGTH_THRESHOLD) {
    breakdown.structure.earned = IDEAL_LENGTH_SCORE;
  } else if (
    text.length > MIN_LENGTH_THRESHOLD &&
    text.length <= IDEAL_LENGTH_THRESHOLD
  ) {
    breakdown.structure.earned = MIN_LENGTH_SCORE;
  }

  const sections = ["experience", "education", "skills"];
  sections.forEach((section) => {
    if (hasWholeWord(lower, section)) {
      breakdown.sections.earned += 10;
    }
  });

  const hasEmail =
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/.test(text);
  const hasPhone = /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text);
  if (hasEmail) breakdown.contact.earned += 8;
  if (hasPhone) breakdown.contact.earned += 7;

  const verbCount = ACTION_VERBS.filter((verb) =>
    hasWholeWord(lower, verb),
  ).length;
  breakdown.actionVerbs.earned = Math.min(
    verbCount * POINTS_PER_ACTION_VERB,
    MAX_ACTION_VERB_POINTS,
  );

  const hasQuantifiableResults = /\d+%|\d+x|\$\d+/.test(text);
  if (hasQuantifiableResults) breakdown.results.earned = 10;

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

export const extractTextFromPdfBlob = async (pdfBlob) => {
  return extractTextFromPdfArrayBuffer(await pdfBlob.arrayBuffer());
};

export const extractTextFromPdfFile = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  return extractTextFromPdfArrayBuffer(arrayBuffer);
};
