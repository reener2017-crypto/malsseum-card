"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import bibleData from "@/data/bible.json";

interface Verse {
  id: number;
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

const CATEGORIES = [
  // 절기
  { id: "lent",         label: "사순절",     ids: [10, 11, 13, 17, 7] },
  { id: "passion",      label: "고난주간",   ids: [17, 19, 35, 7] },
  { id: "easter",       label: "부활절",     ids: [19, 21, 32, 22] },
  { id: "pentecost",    label: "성령강림절", ids: [27, 28, 23, 30] },
  { id: "thanksgiving", label: "추수감사절", ids: [28, 29, 23, 16] },
  { id: "advent",       label: "대강절",     ids: [12, 14, 35, 19] },
  { id: "christmas",    label: "성탄절",     ids: [1, 19, 3, 15] },
  { id: "newyear",      label: "신년",       ids: [14, 10, 23, 30] },
  // 주제
  { id: "love",         label: "사랑",       ids: [25, 26, 34, 19] },
  { id: "gospel",       label: "복음",       ids: [19, 21, 18, 31] },
  { id: "faith",        label: "믿음",       ids: [32, 30, 12, 5] },
  { id: "peace",        label: "평안",       ids: [29, 14, 7, 8] },
  { id: "hope",         label: "소망",       ids: [14, 23, 32, 12] },
  { id: "strength",     label: "힘과 용기",  ids: [30, 12, 13, 8] },
  { id: "wisdom",       label: "지혜",       ids: [10, 11, 33, 9] },
  { id: "comfort",      label: "위로",       ids: [17, 7, 35, 29] },
];

const TEXT_COLORS = [
  { id: "white",   label: "흰색",   hex: "#FFFFFF" },
  { id: "black",   label: "검정",   hex: "#1A1A1A" },
  { id: "cream",   label: "크림",   hex: "#FFF8E7" },
  { id: "gold",    label: "골드",   hex: "#F5C842" },
  { id: "skyblue", label: "하늘",   hex: "#B8E0FF" },
  { id: "sage",    label: "세이지", hex: "#B7D9B0" },
  { id: "rose",    label: "로즈",   hex: "#FFB5B5" },
];

const FONTS = [
  { id: "noto-sans",    label: "노토 고딕",  family: "'Noto Sans KR', sans-serif" },
  { id: "noto-serif",   label: "노토 명조",  family: "'Noto Serif KR', serif" },
  { id: "gowun-dodum",  label: "고운 돋움",  family: "'Gowun Dodum', sans-serif" },
  { id: "gowun-batang", label: "고운 바탕",  family: "'Gowun Batang', serif" },
  { id: "black-han",    label: "블랙한산스", family: "'Black Han Sans', sans-serif" },
  { id: "do-hyeon",     label: "도현",       family: "'Do Hyeon', sans-serif" },
  { id: "jua",          label: "주아",       family: "'Jua', sans-serif" },
  { id: "gaegu",        label: "개구",        family: "'Gaegu', cursive" },
  { id: "nanum-brush",  label: "나눔 붓체",  family: "'Nanum Brush Script', cursive" },
  { id: "nanum-pen",    label: "나눔 펜체",  family: "'Nanum Pen Script', cursive" },
  { id: "single-day",   label: "싱글데이",   family: "'Single Day', cursive" },
  { id: "poor-story",   label: "푸어스토리", family: "'Poor Story', cursive" },
];

// 성경 분위기 테마별 이미지 풀 (loremflickr 키워드 기반)
const BG_IMAGES = [
  "/backgrounds/a-c-NqXqLPhdbvU-unsplash.jpg",
  "/backgrounds/aaron-burden-09AhDCedXF8-unsplash.jpg",
  "/backgrounds/aaron-burden-9npCsdGQ4qU-unsplash.jpg",
  "/backgrounds/aaron-burden-BxmJUeJrlp4-unsplash.jpg",
  "/backgrounds/adrien-olichon-VzRKG0piEp8-unsplash.jpg",
  "/backgrounds/alex-perez-wEgR12N01Tk-unsplash.jpg",
  "/backgrounds/alexander-grey-NkQD-RHhbvY-unsplash.jpg",
  "/backgrounds/andrea-ferrario-3WgPZbsDSkE-unsplash.jpg",
  "/backgrounds/ann-savchenko-H0h_89iFsWs-unsplash.jpg",
  "/backgrounds/annie-spratt-reU05EIlNCQ-unsplash.jpg",
  "/backgrounds/annie-spratt-yI3weKNBRTc-unsplash.jpg",
  "/backgrounds/annie-spratt-zA7I5BtFbvw-unsplash.jpg",
  "/backgrounds/anurag-challa-wA-hpHErU_I-unsplash.jpg",
  "/backgrounds/augustine-wong-T0BYurbDK_M-unsplash.jpg",
  "/backgrounds/augustine-wong-oebTM5wHTfw-unsplash.jpg",
  "/backgrounds/bing-hui-yau-Y2VbSbX49R0-unsplash.jpg",
  "/backgrounds/boris-baldinger-eUFfY6cwjSU-unsplash.jpg",
  "/backgrounds/casey-horner-4rDCa5hBlCs-unsplash.jpg",
  "/backgrounds/casey-horner-RmoWqDCqN2E-unsplash.jpg",
  "/backgrounds/clay-banks-8SXaMMWCTGc-unsplash.jpg",
  "/backgrounds/clement-m-igX2deuD9lc-unsplash.jpg",
  "/backgrounds/cole-keister-xMMh-VFGL9M-unsplash.jpg",
  "/backgrounds/damiano-baschiera-d4feocYfzAM-unsplash.jpg",
  "/backgrounds/dave-hoefler-1Zgn-Xg1xGg-unsplash.jpg",
  "/backgrounds/dave-hoefler-D-FI-GHZeVc-unsplash.jpg",
  "/backgrounds/dave-hoefler-lsoogGC_5dg-unsplash.jpg",
  "/backgrounds/david-kovalenko-rkkr6-2I4sg-unsplash.jpg",
  "/backgrounds/dev-benjamin-voIzq8LEdlo-unsplash.jpg",
  "/backgrounds/diego-ph-5LOhydOtTKU-unsplash.jpg",
  "/backgrounds/elif-koyuturk-uNliRqlmBdg-unsplash.jpg",
  "/backgrounds/elyssa-MF16lGb95WY-unsplash.jpg",
  "/backgrounds/eric-terrade-eQs-KUxW-uU-unsplash.jpg",
  "/backgrounds/fabrice-villard-Jrl_UQcZqOc-unsplash.jpg",
  "/backgrounds/filip-baotic-6s3J4RVGOl0-unsplash.jpg",
  "/backgrounds/filip-zrnzevic-_EMkxLdko9k-unsplash.jpg",
  "/backgrounds/frantisek-g-XXuVXLy5gHU-unsplash.jpg",
  "/backgrounds/goutham-krishna-h5wvMCdOV3w-unsplash.jpg",
  "/backgrounds/hans-iEKg9h5_hd4-unsplash.jpg",
  "/backgrounds/ibrahim-rifath-NJ7CaVfWYaw-unsplash.jpg",
  "/backgrounds/ivana-cajina-DuiPYwz3CBA-unsplash.jpg",
  "/backgrounds/jei-lee-5WFfI63aEBo-unsplash.jpg",
  "/backgrounds/jessica-mangano-c7YYeMemTzw-unsplash.jpg",
  "/backgrounds/johny-goerend-Oz2ZQ2j8We8-unsplash.jpg",
  "/backgrounds/jon-r8AFUpRp0J0-unsplash.jpg",
  "/backgrounds/kazuend-2KXEb_8G5vo-unsplash.jpg",
  "/backgrounds/kelis-HH8Sk2LfeCk-unsplash.jpg",
  "/backgrounds/linus-nylund-JP23z_-dA74-unsplash.jpg",
  "/backgrounds/linus-nylund-UCIZh0-OYPw-unsplash.jpg",
  "/backgrounds/luciano-paris-5L4dJCLTixA-unsplash.jpg",
  "/backgrounds/mahdi-soheili-3wxiKqC9KSA-unsplash.jpg",
  "/backgrounds/martin-de-arriba-Mi6iic32OoA-unsplash.jpg",
  "/backgrounds/massimiliano-morosinotto-pv7hY0HYPC4-unsplash.jpg",
  "/backgrounds/max-saeling-ef0sXQtnCYU-unsplash.jpg",
  "/backgrounds/mona-eendra-vC8wj_Kphak-unsplash.jpg",
  "/backgrounds/mymind-XUlsF9LYeVk-unsplash.jpg",
  "/backgrounds/nareeta-martin-pEWtWnDgGLs-unsplash.jpg",
  "/backgrounds/nathan-dumlao-ciO5L8pin8A-unsplash.jpg",
  "/backgrounds/neom-i60yUhfWeYI-unsplash.jpg",
  "/backgrounds/nick-nice-gPm8h3DS1s4-unsplash.jpg",
  "/backgrounds/patrick-hendry-yQIMVSwePtk-unsplash.jpg",
  "/backgrounds/pawel-czerwinski-ISgDx2aOAB8-unsplash.jpg",
  "/backgrounds/pawel-czerwinski-Ih3-ww0fBHM-unsplash.jpg",
  "/backgrounds/pawel-czerwinski-LS0CWcXo1dw-unsplash.jpg",
  "/backgrounds/pawel-czerwinski-YsFk8hGFhrw-unsplash.jpg",
  "/backgrounds/pisit-heng-ci1F55HaVWQ-unsplash.jpg",
  "/backgrounds/quentin-zwzeorQPepo-unsplash.jpg",
  "/backgrounds/resul-mentes-DbwYNr8RPbg-unsplash.jpg",
  "/backgrounds/rodion-kutsaiev-049M_crau5k-unsplash.jpg",
  "/backgrounds/romello-williams-P8VMwYFY-Es-unsplash.jpg",
  "/backgrounds/sanjoy-saha-9Q8flQBapPU-unsplash.jpg",
  "/backgrounds/sixteen-miles-out-Uc6kiKdW2_g-unsplash.jpg",
  "/backgrounds/sj-objio-XFWiZTa2Ub0-unsplash.jpg",
  "/backgrounds/stacey-koenitz-kSY5T6js2KE-unsplash.jpg",
  "/backgrounds/taylor-van-riper-yQorCngxzwI-unsplash.jpg",
  "/backgrounds/teemu-paananen-OoE4xAnBhKo-unsplash.jpg",
  "/backgrounds/thom-milkovic-qPPWNeFVLFQ-unsplash.jpg",
  "/backgrounds/thomas-kelley-JoH60FhTp50-unsplash.jpg",
  "/backgrounds/valeria-reverdo-dwy2meBFqW8-unsplash.jpg",
  "/backgrounds/vanilla-panda-OdBFUurPHjo-unsplash.jpg",
  "/backgrounds/wolf-zimmermann-6sf5rf8QYFE-unsplash.jpg",
];

const OVERLAY_ALPHAS = [0.45, 0.42, 0.48, 0.40];

function pick4Images(excludeUrls: string[] = []): string[] {
  const pool = BG_IMAGES.filter(img => !excludeUrls.includes(img));
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4);
}

function getTodayTemplates() {
  return pick4Images().map((url, i) => ({
    id: i + 1,
    label: "",
    url,
    overlayAlpha: OVERLAY_ALPHAS[i],
  }));
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  // 1단계: 쉼표/마침표 기준으로 먼저 청크 분리
  const chunks = text.split(/(?<=[,，。])\s*/).map((s) => s.trim()).filter(Boolean);
  const lines: string[] = [];

  for (const chunk of chunks) {
    // 청크가 maxWidth 이내면 그대로 한 줄
    if (ctx.measureText(chunk).width <= maxWidth) {
      lines.push(chunk);
    } else {
      // 너무 길면 단어 단위로 추가 분리
      const words = chunk.split(" ");
      let line = "";
      for (const word of words) {
        const test = line ? line + " " + word : word;
        if (line && ctx.measureText(test).width > maxWidth) {
          lines.push(line);
          line = word;
        } else {
          line = test;
        }
      }
      if (line) lines.push(line);
    }
  }
  return lines;
}

// 카드를 canvas에 그리는 공통 함수
async function drawCard(
  canvas: HTMLCanvasElement,
  bgUrl: string,
  overlayAlpha: number,
  verse: Verse,
  fontFamily: string,
  churchName: string,
  logoUrl: string | null,
  textColor = "#FFFFFF",
  fontScale = 1.0,
  textY = 50,
  logoScale = 1.0,
) {
  const W = canvas.width;
  const H = canvas.height;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, W, H);

  // 배경
  await new Promise<void>((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const scale = Math.max(W / img.width, H / img.height);
      const sw = img.width * scale;
      const sh = img.height * scale;
      ctx.drawImage(img, (W - sw) / 2, (H - sh) / 2, sw, sh);
      resolve();
    };
    img.onerror = () => resolve();
    img.src = bgUrl;
  });

  // 오버레이
  ctx.fillStyle = `rgba(0,0,0,${overlayAlpha})`;
  ctx.fillRect(0, 0, W, H);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // 구절 - 줄바꿈은 기준 폰트로 측정, 렌더링은 선택 폰트로
  const fontSize = Math.round(W * 0.062 * fontScale);

  // 폰트 로딩 대기 (모바일에서 아직 로드 안 됐을 수 있음)
  try {
    await document.fonts.load(`bold ${fontSize}px ${fontFamily}`);
    await document.fonts.load(`bold ${fontSize}px 'Noto Serif KR', serif`);
  } catch (_) { /* ignore */ }
  const refCtx = document.createElement("canvas").getContext("2d")!;
  refCtx.font = `bold ${fontSize}px 'Noto Serif KR', serif`;
  // 줄바꿈이 있으면 사용자 입력 그대로, 없으면 자동 줄바꿈
  const lines = verse.text.includes("\n")
    ? verse.text.split("\n").map((l) => l.trim()).filter(Boolean)
    : wrapText(refCtx, verse.text, W - W * 0.15);
  ctx.fillStyle = textColor;
  ctx.font = `bold ${fontSize}px ${fontFamily}`;
  const lineHeight = fontSize * 1.6;
  const totalH = lines.length * lineHeight;
  const startY = H * (textY / 100) - totalH / 2 + lineHeight / 2;
  lines.forEach((line, i) => {
    ctx.fillText(line, W / 2, startY + i * lineHeight);
  });

  // 출처
  const refFontSize = Math.round(W * 0.037);
  ctx.font = `${refFontSize}px ${fontFamily}`;
  ctx.fillStyle = textColor + "AA";
  const refLabel = verse.chapter > 0
    ? `${verse.book} ${verse.chapter}:${verse.verse}`
    : verse.book;
  if (refLabel) ctx.fillText(refLabel, W / 2, startY + totalH + refFontSize * 1.5);

  // 교회 이름 + 로고
  let bottomY = H - H * 0.06;
  if (churchName) {
    const churchFontSize = Math.round(W * 0.037);
    ctx.font = `${churchFontSize}px ${fontFamily}`;
    ctx.fillStyle = textColor + "CC";
    ctx.fillText(churchName, W / 2, bottomY);
    bottomY -= churchFontSize * 2;
  }
  if (logoUrl) {
    await new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const maxW = W * 0.28 * logoScale;
        const maxH = H * 0.065 * logoScale;
        const scale = Math.min(maxW / img.width, maxH / img.height);
        const lw = img.width * scale;
        const lh = img.height * scale;
        ctx.drawImage(img, (W - lw) / 2, bottomY - lh, lw, lh);
        resolve();
      };
      img.onerror = () => resolve();
      img.src = logoUrl;
    });
  }
}

// 미리보기용 CSS 카드 컴포넌트 (Canvas 없음 - 모바일 CORS 우회)
function CardPreview({
  template,
  verse,
  fontFamily,
  fontScale,
  churchName,
  logoUrl,
  logoScale,
  textColor,
  textY,
  selected,
  onClick,
}: {
  template: { id: number; url: string; overlayAlpha: number };
  verse: Verse;
  fontFamily: string;
  fontScale: number;
  churchName: string;
  logoUrl: string | null;
  logoScale: number;
  textColor: string;
  textY: number;
  selected: boolean;
  onClick: () => void;
}) {
  const baseSize = 4.5 * fontScale;
  const refSize = 3 * fontScale;
  return (
    <button
      onClick={onClick}
      className={`relative rounded-2xl overflow-hidden shadow-md transition-all ${
        selected ? "ring-4 ring-indigo-500 scale-[1.03]" : "hover:scale-[1.02] hover:shadow-xl"
      }`}
      style={{ aspectRatio: "9/16" }}
    >
      {/* 배경 이미지 - CSS로 로드 (CORS 불필요) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${template.url})` }}
      />
      {/* 어두운 오버레이 */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(0,0,0,${template.overlayAlpha})` }}
      />
      {/* 말씀 텍스트 */}
      <div className="absolute inset-x-0 px-[8%] text-center" style={{ top: `${textY}%`, transform: "translateY(-50%)" }}>
        <p
          className="font-bold leading-relaxed"
          style={{ fontFamily, color: textColor, fontSize: `clamp(8px, ${baseSize}cqw, 22px)`, whiteSpace: "pre-wrap" }}
        >
          {verse.text}
        </p>
        <p
          className="font-semibold"
          style={{ fontFamily, color: textColor + "AA", fontSize: `clamp(6px, ${refSize}cqw, 15px)` }}
        >
          {verse.chapter > 0 ? `${verse.book} ${verse.chapter}:${verse.verse}` : verse.book}
        </p>
      </div>
      {/* 교회 로고 + 이름 */}
      <div className="absolute bottom-[4%] w-full flex flex-col items-center gap-[1cqw]">
        {logoUrl && (
          <img src={logoUrl} alt="로고" style={{ height: `clamp(10px, ${6 * logoScale}cqw, 40px)`, objectFit: "contain" }} />
        )}
        {churchName && (
          <p style={{ fontFamily, color: textColor + "CC", fontSize: "clamp(8px, 3cqw, 13px)" }}>{churchName}</p>
        )}
      </div>
      {selected && (
        <div className="absolute top-2 right-2 bg-indigo-500 rounded-full w-6 h-6 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  );
}

const todayTemplates = getTodayTemplates();

export default function Home() {
  const [categoryId, setCategoryId] = useState("lent");
  const [catVerseIdx, setCatVerseIdx] = useState(0);
  const [seenIds, setSeenIds] = useState<number[]>([]);
  const [verseIndex, setVerseIndex] = useState(0);

  // 클라이언트에서만 초기화 (SSR 하이드레이션 오류 방지)
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("seenVerseIds") || "[]");
      setSeenIds(stored);
    } catch {}
    const now = new Date();
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
    setVerseIndex(dayOfYear % bibleData.length);
  }, []);

  const currentCatIds = CATEGORIES.find((c) => c.id === categoryId)?.ids ?? null;

  // 카테고리 내에서 아직 안 본 구절 ID 반환, 다 봤으면 초기화
  const getNextUnseenId = (catIds: number[], currentSeenIds: number[]): number => {
    const unseen = catIds.filter((id) => !currentSeenIds.includes(id));
    if (unseen.length === 0) return catIds[0]; // 다 봤으면 첫번째로
    return unseen[0];
  };

  const markAsSeen = (verseId: number) => {
    setSeenIds((prev) => {
      const updated = prev.includes(verseId) ? prev : [...prev, verseId];
      localStorage.setItem("seenVerseIds", JSON.stringify(updated));
      return updated;
    });
  };

  const handleSelectCategory = (catId: string) => {
    setCategoryId(catId);
    setCatVerseIdx(0);
    const cat = CATEGORIES.find((c) => c.id === catId);
    if (cat?.ids) {
      const nextId = getNextUnseenId(cat.ids, seenIds);
      const idx = (bibleData as Verse[]).findIndex((v) => v.id === nextId);
      if (idx !== -1) setVerseIndex(idx);
    }
  };

  const handleChangeVerse = () => {
    if (currentCatIds) {
      const unseenIds = currentCatIds.filter((id) => !seenIds.includes(id));
      const pool = unseenIds.length > 0 ? unseenIds : currentCatIds;
      const next = (catVerseIdx + 1) % pool.length;
      setCatVerseIdx(next);
      const idx = (bibleData as Verse[]).findIndex((v) => v.id === pool[next]);
      if (idx !== -1) setVerseIndex(idx);
      if (unseenIds.length === 0) {
        // 다 봤으면 seenIds에서 이 카테고리 구절 초기화
        setSeenIds((prev) => {
          const updated = prev.filter((id) => !currentCatIds.includes(id));
          localStorage.setItem("seenVerseIds", JSON.stringify(updated));
          return updated;
        });
      }
    } else {
      setVerseIndex((prev) => (prev + 1) % bibleData.length);
    }
  };
  const [templates, setTemplates] = useState(todayTemplates);

  useEffect(() => {
    setTemplates(pick4Images().map((url, i) => ({
      id: i + 1,
      label: "",
      url,
      overlayAlpha: OVERLAY_ALPHAS[i],
    })));
  }, []);

  const handleChangeTemplates = () => {
    const currentUrls = templates.map(t => t.url);
    setSelectedTemplateId(null);
    setTemplates(pick4Images(currentUrls).map((url, i) => ({
      id: i + 1,
      label: "",
      url,
      overlayAlpha: OVERLAY_ALPHAS[i],
    })));
  };
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [selectedFontId, setSelectedFontId] = useState("noto-serif");
  const [fontScale, setFontScale] = useState(1.0);
  const [textY, setTextY] = useState(50);
  const [logoScale, setLogoScale] = useState(1.0); // 0.7 ~ 1.4
  const [selectedColorId, setSelectedColorId] = useState("white");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [churchName, setChurchName] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [customText, setCustomText] = useState("");
  const [customRef, setCustomRef] = useState("");
  const logoInputRef = useRef<HTMLInputElement>(null);

  const todayVerse = bibleData[verseIndex] as Verse;
  // 직접 입력이 있으면 우선 사용
  const activeVerse: Verse = customText.trim()
    ? { id: 0, book: customRef.trim(), chapter: 0, verse: 0, text: customText.trim() }
    : todayVerse;
  const activeTemplate = templates.find((t) => t.id === selectedTemplateId);
  const activeFont = FONTS.find((f) => f.id === selectedFontId) ?? FONTS[1];
  const activeColor = TEXT_COLORS.find((c) => c.id === selectedColorId) ?? TEXT_COLORS[0];

  const today = new Date();
  const dateLabel = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUrl(URL.createObjectURL(file));
  };

  const handleDownload = useCallback(async () => {
    if (!activeTemplate) return;
    setDownloading(true);
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    // 다운로드 캔버스는 프록시 URL 사용 (canvas.toDataURL CORS 필요)
    const downloadBgUrl = `/api/proxy?url=${encodeURIComponent(activeTemplate.url)}`;
    await drawCard(canvas, downloadBgUrl, activeTemplate.overlayAlpha, activeVerse, activeFont.family, churchName, logoUrl, activeColor.hex, fontScale, textY, logoScale);
    const link = document.createElement("a");
    link.download = `말씀카드_${dateLabel}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    markAsSeen(activeVerse.id);
    setDownloading(false);
  }, [activeTemplate, todayVerse, activeFont, churchName, logoUrl, dateLabel]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* 헤더 */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-800 mb-1">말씀카드 제작소</h1>
          <p className="text-gray-400 text-sm">{dateLabel}</p>
        </div>

        {/* 오늘의 말씀 */}
        <div className="relative bg-white rounded-2xl shadow-sm px-6 py-5 text-center mb-6">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">오늘의 말씀</p>
          <p className="text-gray-800 text-base leading-relaxed font-medium mb-2" style={{ fontFamily: activeFont.family, whiteSpace: "pre-wrap" }}>
            {activeVerse.text}
          </p>
          <p className="text-indigo-400 text-xs font-semibold mb-2">
            {activeVerse.book}{activeVerse.chapter > 0 ? ` ${activeVerse.chapter}:${activeVerse.verse}` : ""}
          </p>
          <button
            onClick={() => {
              setCustomText(activeVerse.text);
              setCustomRef(activeVerse.chapter > 0 ? `${activeVerse.book} ${activeVerse.chapter}:${activeVerse.verse}` : activeVerse.book);
            }}
            className="text-xs text-indigo-400 border border-indigo-200 rounded-lg px-2 py-1 hover:bg-indigo-50 transition-colors"
          >
            줄바꿈 편집
          </button>
          <button
            onClick={handleChangeVerse}
            className="absolute top-4 right-4 text-xs text-indigo-400 border border-indigo-200 rounded-lg px-2 py-1 hover:bg-indigo-50 transition-colors"
          >
            말씀 교체
          </button>
        </div>

        {/* 카테고리 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                categoryId === cat.id
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-white text-indigo-500 border border-indigo-200 hover:bg-indigo-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 말씀 직접 입력 */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3">말씀 직접 입력 (선택)</p>
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="말씀을 직접 입력하세요&#10;예) 내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라"
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-indigo-200 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none mb-2"
            style={{ fontFamily: activeFont.family }}
          />
          <input
            type="text"
            value={customRef}
            onChange={(e) => setCustomRef(e.target.value)}
            placeholder="출처 입력 (예: 빌립보서 4:13)"
            className="w-full px-4 py-3 rounded-xl border border-indigo-200 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {customText.trim() && (
            <button
              onClick={() => { setCustomText(""); setCustomRef(""); }}
              className="mt-2 text-xs text-gray-400 hover:text-red-400"
            >
              직접 입력 초기화
            </button>
          )}
        </div>

        {/* 교회 로고 / 이름 */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3">교회 로고 / 교회 이름 (선택)</p>
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => logoInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 text-sm font-medium hover:bg-indigo-100 transition-colors"
            >
              {logoUrl ? "로고 변경" : "로고 업로드"}
            </button>
            {logoUrl && (
              <>
                <img src={logoUrl} alt="로고" className="h-8 object-contain" />
                <button onClick={() => setLogoUrl(null)} className="text-xs text-gray-400 hover:text-red-400">삭제</button>
              </>
            )}
            <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
          </div>
          {logoUrl && (
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs text-gray-400">작게</span>
              <input
                type="range"
                min={0.3}
                max={2.0}
                step={0.1}
                value={logoScale}
                onChange={(e) => setLogoScale(Number(e.target.value))}
                className="flex-1 accent-indigo-500"
              />
              <span className="text-xs text-gray-400">크게</span>
              {logoScale !== 1.0 && (
                <button onClick={() => setLogoScale(1.0)} className="text-xs text-gray-400 hover:text-indigo-400">초기화</button>
              )}
            </div>
          )}
          <input
            type="text"
            value={churchName}
            onChange={(e) => setChurchName(e.target.value)}
            placeholder="교회 이름 입력 (예: 웨이브교회)"
            className="w-full px-4 py-3 rounded-xl border border-indigo-200 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            style={{ fontFamily: activeFont.family }}
          />
        </div>

        {/* 카드 그리드 */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">마음에 드는 배경을 선택하세요</p>
          <button
            onClick={handleChangeTemplates}
            className="text-xs text-indigo-400 border border-indigo-200 rounded-lg px-2 py-1 hover:bg-indigo-50 transition-colors"
          >
            배경 교체
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {templates.map((t) => (
            <div key={t.id} className="flex flex-col gap-1" style={{ containerType: "inline-size" }}>
              <CardPreview
                template={t}
                verse={activeVerse}
                fontFamily={activeFont.family}
                fontScale={fontScale}
                churchName={churchName}
                logoUrl={logoUrl}
                textColor={activeColor.hex}
                textY={textY}
                logoScale={logoScale}
                selected={selectedTemplateId === t.id}
                onClick={() => setSelectedTemplateId(t.id)}
              />
              <p className="text-center text-xs text-indigo-400 font-medium">{t.label}</p>
            </div>
          ))}
        </div>

        {/* 말씀 위치 */}
        <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3">말씀 위치</p>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs text-gray-400">상단</span>
          <input
            type="range"
            min={15}
            max={85}
            value={textY}
            onChange={(e) => setTextY(Number(e.target.value))}
            className="flex-1 accent-indigo-500"
          />
          <span className="text-xs text-gray-400">하단</span>
          {textY !== 50 && (
            <button onClick={() => setTextY(50)} className="text-xs text-gray-400 hover:text-indigo-400">초기화</button>
          )}
        </div>

        {/* 글씨 크기 */}
        <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3">글씨 크기</p>
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setFontScale((s) => Math.max(0.6, +(s - 0.1).toFixed(1)))}
            className="w-9 h-9 rounded-full bg-white border border-indigo-200 text-indigo-500 text-lg font-bold hover:bg-indigo-50 transition-colors"
          >−</button>
          <span className="text-sm text-gray-500 w-8 text-center">{Math.round(fontScale * 100)}%</span>
          <button
            onClick={() => setFontScale((s) => Math.min(1.6, +(s + 0.1).toFixed(1)))}
            className="w-9 h-9 rounded-full bg-white border border-indigo-200 text-indigo-500 text-lg font-bold hover:bg-indigo-50 transition-colors"
          >+</button>
          {fontScale !== 1.0 && (
            <button
              onClick={() => setFontScale(1.0)}
              className="text-xs text-gray-400 hover:text-indigo-400 ml-1"
            >초기화</button>
          )}
        </div>

        {/* 글자 색상 */}
        <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3">글자 색상</p>
        <div className="flex gap-3 mb-6">
          {TEXT_COLORS.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedColorId(c.id)}
              title={c.label}
              className={`w-9 h-9 rounded-full border-2 transition-all ${
                selectedColorId === c.id ? "border-indigo-500 scale-110 shadow-md" : "border-gray-200 hover:scale-105"
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>

        {/* 글꼴 선택 */}
        <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3">글꼴 선택</p>
        <div className="grid grid-cols-4 gap-2 mb-8">
          {FONTS.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFontId(f.id)}
              className={`py-3 px-2 rounded-xl border text-sm transition-all ${
                selectedFontId === f.id
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-md"
                  : "bg-white border-indigo-100 text-gray-700 hover:border-indigo-300"
              }`}
              style={{ fontFamily: f.family }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* 다운로드 */}
        <button
          onClick={handleDownload}
          disabled={!selectedTemplateId || downloading}
          className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold text-base transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:bg-indigo-700"
        >
          {downloading ? "이미지 생성 중..." : "카드 다운로드 (PNG)"}
        </button>
      </div>
    </div>
  );
}
