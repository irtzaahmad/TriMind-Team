import { Language } from '@/types';

export interface TranslationDictionary {
  appTitle: string;
  appSubtitle: string;
  safetyBannerText: string;
  safetyBannerTitle: string;
  easyMode: string;
  easyModeActive: string;
  standardMode: string;
  languages: {
    en: string;
    ur: string;
    roman: string;
  };
  nav: {
    medicine: string;
    report: string;
    assistant: string;
    history: string;
  };
  common: {
    change: string;
    cancel: string;
    close: string;
    overview: string;
    meaning: string;
    whatThisMeans: string;
    scanAnotherMedicine: string;
    uploadAnotherReport: string;
    analyzeReportBtn: string;
    callEmergency: string;
    emergencyTitle: string;
    suggestedQuestions: string;
    voiceOn: string;
    voiceMuted: string;
    pregnancyTitle: string;
    drivingTitle: string;
    alcoholTitle: string;
  };
  hero: {
    badge: string;
    title: string;
    highlight: string;
    desc: string;
    startMedicine: string;
    startReport: string;
    startAssistant: string;
    sdgBadge: string;
  };
  howItWorks: {
    title: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
  };
  medicine: {
    title: string;
    subtitle: string;
    uploadTab: string;
    searchTab: string;
    uploadPrompt: string;
    uploadSub: string;
    searchPlaceholder: string;
    searchButton: string;
    analyzing: string;
    stepReading: string;
    stepExtracting: string;
    stepTranslating: string;
    confirmTitle: string;
    confirmDesc: string;
    confirmButton: string;
    addMedicinePlaceholder: string;
    addBtn: string;
    unreadableTitle: string;
    unreadableDesc: string;
    genericName: string;
    category: string;
    uses: string;
    benefits: string;
    howToTake: string;
    sideEffects: string;
    commonSideEffects: string;
    seriousSideEffects: string;
    whenToSeeDoctor: string;
    safetyWarnings: string;
    antibioticsNotice: string;
    questionsForDoctor: string;
    noPersonalDoseNote: string;
  };
  report: {
    title: string;
    subtitle: string;
    uploadPrompt: string;
    uploadSub: string;
    analyzing: string;
    stepReading: string;
    stepValidating: string;
    stepTranslating: string;
    summaryTitle: string;
    testsFound: string;
    testTable: {
      name: string;
      value: string;
      range: string;
      status: string;
    };
    statusLabels: {
      normal: string;
      high: string;
      low: string;
      unknown: string;
      not_provided: string;
      unclear: string;
    };
    plainMeaningTitle: string;
    questionsTitle: string;
    urgentCareTitle: string;
    urgentCareSubtitle: string;
    validationBadge: string;
  };
  assistant: {
    title: string;
    subtitle: string;
    badge: string;
    contextActive: string;
    noContext: string;
    micPrompt: string;
    listening: string;
    thinking: string;
    typePrompt: string;
    send: string;
    speechFallbackNote: string;
    emergencyWarning: string;
    quickPrompts: string[];
    muteVoice: string;
    unmuteVoice: string;
  };
  tts: {
    listen: string;
    pause: string;
    resume: string;
    stop: string;
    speed: string;
    playing: string;
    unavailable: string;
  };
  history: {
    title: string;
    empty: string;
    clear: string;
    view: string;
    savedAlert: string;
    inspectionTitle: string;
  };
  footer: {
    tagline: string;
    disclaimer: string;
    hackathon: string;
  };
  errors: {
    generic: string;
    rateLimit: string;
    timeout: string;
    fileTooLarge: string;
    invalidType: string;
    retry: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appTitle: 'OmniPlus',
    appSubtitle: 'Accessible AI Healthcare Companion for Pakistan',
    safetyBannerTitle: 'Medical Disclaimer',
    safetyBannerText: 'This app explains information in simple terms. It does not diagnose, treat, or replace consultation with a qualified doctor.',
    easyMode: 'Easy Mode (Elderly)',
    easyModeActive: 'Easy Mode Active',
    standardMode: 'Standard Mode',
    languages: {
      en: 'English',
      ur: 'اردو',
      roman: 'Roman Urdu',
    },
    nav: {
      medicine: 'Medicine Guide',
      report: 'Lab Reports',
      assistant: 'Sehat Dost (Voice)',
      history: 'History',
    },
    common: {
      change: 'Change',
      cancel: 'Cancel',
      close: 'Close',
      overview: 'Overview',
      meaning: 'Meaning',
      whatThisMeans: 'What this means for your body',
      scanAnotherMedicine: 'Scan Another Medicine',
      uploadAnotherReport: 'Upload Another Report',
      analyzeReportBtn: 'Analyze Lab Report',
      callEmergency: 'Call 1122',
      emergencyTitle: 'Medical Emergency Warning',
      suggestedQuestions: 'Suggested Questions:',
      voiceOn: 'Voice: On',
      voiceMuted: 'Voice: Muted',
      pregnancyTitle: 'Pregnancy & Nursing',
      drivingTitle: 'Driving & Alertness',
      alcoholTitle: 'Alcohol Caution',
    },
    hero: {
      badge: 'UN SDG 3 · Good Health & Well-Being',
      title: 'Healthcare Made Simple,',
      highlight: 'In Your Own Language.',
      desc: 'Understand prescriptions, unpack confusing lab reports, and talk naturally to your voice health companion in Urdu, Roman Urdu, or English.',
      startMedicine: 'Scan Medicine',
      startReport: 'Explain Report',
      startAssistant: 'Talk to Sehat Dost',
      sdgBadge: 'AI for Accessible Healthcare',
    },
    howItWorks: {
      title: 'How OmniPlus Helps You',
      step1Title: 'Snap or Type',
      step1Desc: 'Upload a medicine box, strip, prescription, or lab test PDF/photo.',
      step2Title: 'Live AI Analysis',
      step2Desc: 'Multimodal Gemini breaks down medical jargon into simple, fact-checked explanations.',
      step3Title: 'Read & Listen',
      step3Desc: 'View clean visual cards or tap Listen to hear answers read out loud at your own speed.',
    },
    medicine: {
      title: 'Medicine Explainer',
      subtitle: 'Scan any medicine strip, box, or prescription to know what it is for, how to take it safely, and side effects.',
      uploadTab: 'Upload Photo',
      searchTab: 'Type Name',
      uploadPrompt: 'Click or drop a medicine photo here',
      uploadSub: 'Supports JPG, PNG, WebP (Max 4MB). We automatically compress images for quick loading.',
      searchPlaceholder: 'e.g., Panadol, Augmentin 625mg, Glucophage 500mg...',
      searchButton: 'Explain Medicine',
      analyzing: 'Analyzing medicine with live Gemini AI...',
      stepReading: 'Reading medicine packaging...',
      stepExtracting: 'Identifying generic formula and benefits...',
      stepTranslating: 'Translating into selected language...',
      confirmTitle: 'Detected Medicine Names',
      confirmDesc: 'Please confirm or edit the detected medicine names before generating the complete explanation:',
      confirmButton: 'Confirm & Generate Explanation',
      addMedicinePlaceholder: 'Add or correct medicine name...',
      addBtn: 'Add',
      unreadableTitle: 'Image Could Not Be Read',
      unreadableDesc: 'The medicine name or text is blurry, cut off, or not clearly visible. Please upload a clear photo with good lighting.',
      genericName: 'Formula / Generic Name',
      category: 'Medicine Category',
      uses: 'What is this used for?',
      benefits: 'Expected Benefits',
      howToTake: 'How and When to Take',
      sideEffects: 'Possible Side Effects',
      commonSideEffects: 'Common Effects (Mild)',
      seriousSideEffects: 'Serious Warnings (Seek Medical Attention)',
      whenToSeeDoctor: 'When to Contact Your Doctor',
      safetyWarnings: 'Important Safety Warnings',
      antibioticsNotice: 'Antibiotic Caution: Always finish the complete prescribed course even if you feel better.',
      questionsForDoctor: '3 Important Questions to Ask Your Doctor or Pharmacist',
      noPersonalDoseNote: 'Note: Always follow the specific dose written on your prescription or packaging. Never alter doses without medical advice.',
    },
    report: {
      title: 'Medical Report Explainer',
      subtitle: 'Upload any lab test report (Blood test, CBC, LFT, Lipid, HbA1c, etc.) for a strict, fact-checked breakdown.',
      uploadPrompt: 'Click or drop your Lab Report (PDF or Photo)',
      uploadSub: 'Supports PDF, PNG, JPG (Max 8MB). Patient privacy is preserved — files are not saved to any server.',
      analyzing: 'Reviewing lab report with strict AI validation...',
      stepReading: 'Extracting documented test numbers and units...',
      stepValidating: 'Performing second-pass validation against printed ranges...',
      stepTranslating: 'Generating plain-language breakdown...',
      summaryTitle: 'Plain Language Report Summary',
      testsFound: 'Tests Extracted from Document',
      testTable: {
        name: 'Test Name',
        value: 'Your Value',
        range: 'Printed Reference Range',
        status: 'Status & Meaning',
      },
      statusLabels: {
        normal: 'Normal',
        high: 'Higher than range',
        low: 'Lower than range',
        unknown: 'Needs review',
        not_provided: 'Range not on report',
        unclear: 'Not clearly readable',
      },
      plainMeaningTitle: 'What Out-of-Range Values Mean',
      questionsTitle: 'Questions for Your Next Doctor Visit',
      urgentCareTitle: 'When to Seek Urgent Medical Care',
      urgentCareSubtitle: 'If you or your family member experience any of these symptoms, seek emergency medical help immediately.',
      validationBadge: 'Verified by 2-Pass Gemini Strict Extraction (Zero Hallucinated Numbers)',
    },
    assistant: {
      title: 'Sehat Dost (Voice Health Companion)',
      subtitle: 'Talk naturally in Urdu, Roman Urdu, or English. Built especially for elderly and low-literacy patients.',
      badge: 'Live Voice AI',
      contextActive: 'Aware of your latest scanned medicine/report',
      noContext: 'General Health & Well-being Mode',
      micPrompt: 'Tap the microphone and speak',
      listening: 'Listening... Tap again when finished speaking',
      thinking: 'Thinking in your language...',
      typePrompt: 'Or type your health question here...',
      send: 'Send',
      speechFallbackNote: 'Voice speech synthesis ready. If device audio is muted, responses remain visible as large text.',
      emergencyWarning: 'Emergency signs (chest pain, breathing trouble, severe bleeding)? Call 1122 or go to the nearest ER immediately.',
      quickPrompts: [
        'Yeh dawai khane se pehle leni hai ya baad mein?',
        'Mera sugar level normal kitna hona chahiye?',
        'High blood pressure ke dauran kya ehtiyat karein?',
        'Dawai lene ka sahi tareeqa kya hai?',
      ],
      muteVoice: 'Mute Voice',
      unmuteVoice: 'Enable Voice Output',
    },
    tts: {
      listen: 'Listen Aloud',
      pause: 'Pause',
      resume: 'Resume',
      stop: 'Stop',
      speed: 'Speed',
      playing: 'Speaking...',
      unavailable: 'Speech audio not supported on this browser, but text is available above.',
    },
    history: {
      title: 'Recent Explanations (Last 5)',
      empty: 'No recent explanations yet. Scanned medicines or reports will appear here.',
      clear: 'Clear History',
      view: 'View Result',
      savedAlert: 'Stored privately in your browser storage only.',
      inspectionTitle: 'Inspection',
    },
    footer: {
      tagline: 'OmniPlus — Empowering Pakistan with Accessible AI Healthcare',
      disclaimer: 'Strictly an educational and health-literacy tool. In medical emergencies, contact Rescue 1122 or your nearest hospital.',
      hackathon: 'Built at Minhaj University AI Hackathon · SDG 3 (Good Health & Well-Being)',
    },
    errors: {
      generic: 'An unexpected issue occurred. Please try again.',
      rateLimit: 'Too many requests. Please wait a minute before trying again.',
      timeout: 'The request took too long. Please ensure your network is stable and retry.',
      fileTooLarge: 'File is too large. Please upload an image under 4MB or PDF under 8MB.',
      invalidType: 'Unsupported file type. Please upload a JPG, PNG, WebP image or PDF document.',
      retry: 'Try Again',
    },
  },
  ur: {
    appTitle: 'اومنی پلس',
    appSubtitle: 'پاکستان کے لیے آسان اور باآواز اے آئی طبی رہبر',
    safetyBannerTitle: 'ضروری طبی وضاحت',
    safetyBannerText: 'یہ ایپ صرف معلومات کو آسان الفاظ میں سمجھاتی ہے۔ یہ ڈاکٹر کی تشخیص، نسخے یا معائنے کا متبادل ہرگز نہیں ہے۔',
    easyMode: 'آسان موڈ (بزرگوں کے لیے)',
    easyModeActive: 'آسان موڈ آن ہے',
    standardMode: 'عام موڈ',
    languages: {
      en: 'English',
      ur: 'اردو',
      roman: 'Roman Urdu',
    },
    nav: {
      medicine: 'دوائی سمجھیں',
      report: 'لیب رپورٹ سمجھیں',
      assistant: 'صحت دوست (باآواز)',
      history: 'سابقہ ریکارڈ',
    },
    common: {
      change: 'تبدیل کریں',
      cancel: 'منسوخ کریں',
      close: 'بند کریں',
      overview: 'خلاصہ',
      meaning: 'مطلب',
      whatThisMeans: 'جسم پر اس کا کیا اثر پڑتا ہے',
      scanAnotherMedicine: 'دوسری دوائی چیک کریں',
      uploadAnotherReport: 'دوسری رپورٹ لگائیں',
      analyzeReportBtn: 'رپورٹ کا معائنہ کریں',
      callEmergency: '۱۱۲۲ ملائیں',
      emergencyTitle: 'ہنگامی طبی وارننگ',
      suggestedQuestions: 'تجویز کردہ عام سوالات:',
      voiceOn: 'آواز: آن',
      voiceMuted: 'آواز: بند',
      pregnancyTitle: 'حمل اور دودھ پلانا',
      drivingTitle: 'گاڑی چلانا اور ہوش مندی',
      alcoholTitle: 'نشہ آور اشیاء سے پرہیز',
    },
    hero: {
      badge: 'اقوامِ متحدہ کا ہدف ۳ · صحت اور تندرستی',
      title: 'صحت کی معلومات اب آسان،',
      highlight: 'آپ کی اپنی مادری زبان میں۔',
      desc: 'نسخے اور دوائیاں سمجھیں، پیچیدہ لیب رپورٹس کو آسان بنائیں، اور اپنی زبان میں باآواز صحت دوست سے گفتگو کریں۔',
      startMedicine: 'دوائی کی تصویر لیں',
      startReport: 'رپورٹ سمجھائیں',
      startAssistant: 'صحت دوست سے بات کریں',
      sdgBadge: 'سب کے لیے باآسانی قابلِ فہم صحت',
    },
    howItWorks: {
      title: 'اومنی پلس کیسے مدد کرتا ہے؟',
      step1Title: 'تصویر لیں یا نام لکھیں',
      step1Desc: 'دوائی کے پتے، ڈبے، نسخے یا لیب رپورٹ کی تصویر یا پی ڈی ایف منتخب کریں۔',
      step2Title: 'حقیقی اے آئی کا تجزیہ',
      step2Desc: 'گوگل جیمنائی مشکل طبی اصطلاحات کو آسان، مستند اور عام فہم اردو میں بدل دیتا ہے۔',
      step3Title: 'پڑھیں اور سنیں',
      step3Desc: 'صاف کارڈز میں تفصیل دیکھیں یا "سنیں" کا بٹن دبا کر باآواز سنیں۔',
    },
    medicine: {
      title: 'دوائی کی آسان معلومات',
      subtitle: 'دوائی کے پتے، ڈبے یا نسخے کی تصویر بھیجیں اور جانیں کہ یہ کس مرض کی ہے، کیسے لینی ہے اور کیا احتیاط ضروری ہے۔',
      uploadTab: 'تصویر لگائیں',
      searchTab: 'نام لکھیں',
      uploadPrompt: 'دوائی کے ڈبے یا پتے کی تصویر یہاں لگائیں',
      uploadSub: 'جے پی جی، پی این جی یا ویب پی (زیادہ سے زیادہ ۴ ایم بی)۔ تصویر خود بخود ہلکی کر لی جاتی ہے۔',
      searchPlaceholder: 'مثلاً پیناڈول، اگمینٹن، گلوکوفیج وغیرہ...',
      searchButton: 'دوائی سمجھائیں',
      analyzing: 'جیمنائی اے آئی دوائی کا معائنہ کر رہا ہے...',
      stepReading: 'دوائی کا ڈبہ پڑھا جا رہا ہے...',
      stepExtracting: 'فارمولا اور فوائد نکالے جا رہے ہیں...',
      stepTranslating: 'اردو میں ترجمہ کیا جا رہا ہے...',
      confirmTitle: 'پڑھے گئے ادویات کے نام',
      confirmDesc: 'مکمل تفصیل حاصل کرنے سے پہلے تصدیق کر لیں کہ کیا دوائی کا نام درست پڑھا گیا ہے:',
      confirmButton: 'تصدیق کریں اور مکمل تفصیل دکھائیں',
      addMedicinePlaceholder: 'دوائی کا نام درست یا شامل کریں...',
      addBtn: 'شامل کریں',
      unreadableTitle: 'تصویر صاف نہیں پڑھی جا سکی',
      unreadableDesc: 'دوائی کا نام یا لکھائی دھندلی یا کٹی ہوئی ہے۔ براہِ کرم اچھی روشنی میں واضح تصویر دوبارہ کھینچ کر بھیجیں۔',
      genericName: 'فارمولا / اصل نام',
      category: 'دوائی کی قسم',
      uses: 'یہ دوائی کس مقصد کے لیے ہے؟',
      benefits: 'اس کے متوقع فوائد',
      howToTake: 'لینے کا طریقہ اور وقت',
      sideEffects: 'ممکنہ اثرات (سائیڈ ایفیکٹس)',
      commonSideEffects: 'عام اور ہلکے اثرات',
      seriousSideEffects: 'سنگین علامات (فوری توجہ درکار)',
      whenToSeeDoctor: 'ڈاکٹر سے کب رجوع کریں؟',
      safetyWarnings: 'ضروری حفاظتی ہدایات',
      antibioticsNotice: 'اینٹی بائیوٹک احتیاط: طبیعت بہتر ہونے کے باوجود ڈاکٹر کا بتایا گیا کورس ہمیشہ پورا کریں۔',
      questionsForDoctor: 'ڈاکٹر یا فارماسسٹ سے پوچھنے والے ۳ اہم سوالات',
      noPersonalDoseNote: 'یاد رکھیں: ہمیشہ وہی مقدار لیں جو آپ کے ڈاکٹر نے نسخے پر لکھی ہے۔ بغیر مشورے خوراک نہ بدلیں۔',
    },
    report: {
      title: 'میڈیکل رپورٹ کا آسان خلاصہ',
      subtitle: 'خون، جگر، گردے یا شوگر کی لیب رپورٹ کی تصویر یا پی ڈی ایف لگائیں اور ہر ٹیسٹ کا آسان مطلب جانیں۔',
      uploadPrompt: 'لیب رپورٹ کی تصویر یا پی ڈی ایف فائل یہاں لگائیں',
      uploadSub: 'پی ڈی ایف یا تصویر (زیادہ سے زیادہ ۸ ایم بی)۔ فائل محفوظ نہیں رکھی جاتی، آپ کی پرائیویسی مکمل محفوظ ہے۔',
      analyzing: 'رپورٹ کی جانچ کی جا رہی ہے...',
      stepReading: 'رپورٹ کے تمام ٹیسٹ اور اعداد و شمار پڑھے جا رہے ہیں...',
      stepValidating: 'نارمل رینج کے ساتھ تقابل کی تصدیق کی جا رہی ہے...',
      stepTranslating: 'آسان الفاظ میں خلاصہ تیار کیا جا رہا ہے...',
      summaryTitle: 'رپورٹ کا آسان فہم خلاصہ',
      testsFound: 'رپورٹ سے ملے ٹیسٹ کے نتائج',
      testTable: {
        name: 'ٹیسٹ کا نام',
        value: 'آپ کی ویلیو',
        range: 'نارمل رینج',
        status: 'حالت اور معنی',
      },
      statusLabels: {
        normal: 'نارمل',
        high: 'نارمل سے زیادہ',
        low: 'نارمل سے کم',
        unknown: 'ڈاکٹر سے چیک کروائیں',
        not_provided: 'رینج درج نہیں',
        unclear: 'واضح نہیں پڑھا گیا',
      },
      plainMeaningTitle: 'غیر متوازن رزلٹس کا کیا مطلب ہے؟',
      questionsTitle: 'ڈاکٹر سے پوچھنے والے سوالات',
      urgentCareTitle: 'فوری ہسپتال جانے کی علامات',
      urgentCareSubtitle: 'اگر مریض میں یہ علامات ظاہر ہوں تو فوراً ریسکیو ۱۱۲۲ کال کریں یا قریبی ایمرجنسی جائیں۔',
      validationBadge: 'دوہری پڑتال شدہ: بغیر کسی من گھڑت عدد کے صرف اصل دستاویز سے تصدیق شدہ',
    },
    assistant: {
      title: 'صحت دوست (آواز سے بات کریں)',
      subtitle: 'اردو یا رومن اردو میں بات کریں۔ بزرگوں اور ناخواندہ مریضوں کے لیے خصوصی آسان ڈیزائن۔',
      badge: 'براہِ راست صوتی اے آئی',
      contextActive: 'آپ کی آخری چیک کی گئی دوائی یا رپورٹ سے باخبر ہے',
      noContext: 'عمومی صحت و تندرستی کی رہنمائی',
      micPrompt: 'مائیک دبائیں اور بولیں',
      listening: 'سن رہا ہوں... بات مکمل ہونے پر دوبارہ مائیک دبائیں',
      thinking: 'جواب تیار ہو رہا ہے...',
      typePrompt: 'یا اپنا سوال یہاں لکھیں...',
      send: 'بھیجیں',
      speechFallbackNote: 'آواز سے سنانے کا فیچر آن ہے۔ اگر موبائل کا والیم بند ہو تو لکھا ہوا بڑا نظر آئے گا۔',
      emergencyWarning: 'ایمرجنسی علامات (سینے میں شدید درد، سانس بند ہونا، فالج کا اثر)؟ فوراً ۱۱۲۲ ملائیں۔',
      quickPrompts: [
        'یہ دوائی کھانے سے پہلے لینی ہے یا بعد میں؟',
        'شوگر کا نارمل لیول کتنا ہونا چاہیے؟',
        'ہائی بلڈ پریشر میں کیا پرہیز ضروری ہے؟',
        'اینٹی بائیوٹک لینے کے کیا اصول ہیں؟',
      ],
      muteVoice: 'آواز بند کریں',
      unmuteVoice: 'آواز آن کریں',
    },
    tts: {
      listen: 'آواز میں سنیں',
      pause: 'روکیں',
      resume: 'جاری رکھیں',
      stop: 'بند کریں',
      speed: 'رفتار',
      playing: 'بول رہا ہے...',
      unavailable: 'اس براؤزر میں آڈیو سپورٹ دستیاب نہیں، اوپر متن پڑھیں۔',
    },
    history: {
      title: 'حالیہ رپورٹس اور ادویات (آخری ۵)',
      empty: 'ابھی کوئی سابقہ ریکارڈ موجود نہیں۔',
      clear: 'ریکارڈ ختم کریں',
      view: 'دوبارہ دیکھیں',
      savedAlert: 'یہ معلومات صرف آپ کے اپنے براؤزر میں محفوظ ہیں۔',
      inspectionTitle: 'تفصیلات دیکھیں',
    },
    footer: {
      tagline: 'اومنی پلس — پاکستان میں سب کے لیے آسان اور قابلِ فہم صحت کا نظام',
      disclaimer: 'یہ صرف تعلیمی اور آگاہی ایپ ہے۔ ہنگامی صورتحال میں فوراً ریسکیو ۱۱۲۲ یا قریبی ہسپتال پہنچیں۔',
      hackathon: 'منہاج یونیورسٹی اے آئی ہیکاتھون میں تیار کردہ · ہدف ۳ (اچھی صحت اور تندرستی)',
    },
    errors: {
      generic: 'کوئی مسئلہ پیش آ گیا ہے۔ براہِ کرم دوبارہ کوشش کریں۔',
      rateLimit: 'بہت زیادہ درخواستیں بھیجی گئی ہیں۔ براہِ مہربانی ایک منٹ انتظار کریں۔',
      timeout: 'درخواست کا وقت ختم ہو گیا۔ انٹرنیٹ چیک کر کے دوبارہ کوشش کریں۔',
      fileTooLarge: 'فائل کا سائز بڑا ہے۔ ۴ ایم بی تصویر یا ۸ ایم بی سے کم پی ڈی ایف لگائیں۔',
      invalidType: 'یہ فائل سپورٹڈ نہیں ہے۔ تصویر یا پی ڈی ایف فائل لگائیں۔',
      retry: 'دوبارہ کوشش کریں',
    },
  },
  roman: {
    appTitle: 'OmniPlus',
    appSubtitle: 'Pakistan ke liye Asaan aur Ba-Awaaz AI Sehat Rehnuma',
    safetyBannerTitle: 'Zaroori Medical Wazahat',
    safetyBannerText: 'Yeh app sirf maloomat ko aasan alfaaz mein samjhati hai. Yeh doctor ke tashkhees, nuskhey ya ilaj ka badal hargiz nahi hai.',
    easyMode: 'Asaan Mode (Buzurgon ke liye)',
    easyModeActive: 'Asaan Mode On Hai',
    standardMode: 'Normal Mode',
    languages: {
      en: 'English',
      ur: 'اردو',
      roman: 'Roman Urdu',
    },
    nav: {
      medicine: 'Dawai Samjhein',
      report: 'Lab Report Samjhein',
      assistant: 'Sehat Dost (Awaaz)',
      history: 'Pichla Record',
    },
    common: {
      change: 'Badlein',
      cancel: 'Cancel',
      close: 'Band Karein',
      overview: 'Khulasa',
      meaning: 'Matlab',
      whatThisMeans: 'Jism par iska kya asar padta hai',
      scanAnotherMedicine: 'Doosri Dawai Check Karein',
      uploadAnotherReport: 'Doosri Report Lagayein',
      analyzeReportBtn: 'Report Check Karein',
      callEmergency: '1122 Milayein',
      emergencyTitle: 'Emergency Medical Warning',
      suggestedQuestions: 'Aam Poochhe Jane Wale Sawal:',
      voiceOn: 'Voice: On',
      voiceMuted: 'Voice: Muted',
      pregnancyTitle: 'Hamal aur Doodh Pilana',
      drivingTitle: 'Gaari Chalana aur Hosh Mandi',
      alcoholTitle: 'Nasha Aawar Ashya se Parhez',
    },
    hero: {
      badge: 'UN SDG 3 · Achi Sehat aur Tandurusti',
      title: 'Sehat ki Maloomat Ab Asaan,',
      highlight: 'Aap ki Apni Zuban Mein.',
      desc: 'Nuskhe aur dawaiyan samjhein, mushkil lab reports ko asaan banayein, aur apni zuban mein ba-awaaz Sehat Dost se guftagu karein.',
      startMedicine: 'Dawai Scan Karein',
      startReport: 'Report Samjhein',
      startAssistant: 'Sehat Dost se Baat Karein',
      sdgBadge: 'AI for Accessible Healthcare in Pakistan',
    },
    howItWorks: {
      title: 'OmniPlus Kaise Madad Karta Hai?',
      step1Title: 'Tasweer Lein ya Naam Likhein',
      step1Desc: 'Dawai ke pattey, dabbey, nuskhey ya report ki photo ya PDF lagayein.',
      step2Title: 'Live AI Analysis',
      step2Desc: 'Google Gemini mushkil medical terms ko asaan, sachhi aur mustanad zuban mein badal deta hai.',
      step3Title: 'Padhein aur Sunein',
      step3Desc: 'Saaf cards mein dekhein ya "Sunein" ka button daba kar apni marzi ki raftaar par sunein.',
    },
    medicine: {
      title: 'Dawai ki Asaan Maloomat',
      subtitle: 'Dawai ke pattey ya dabbey ki photo upload karein aur janein yeh kis beemari ki hai, kaise leni hai aur kya ehtiyat zaroori hai.',
      uploadTab: 'Photo Upload Karein',
      searchTab: 'Naam Likhein',
      uploadPrompt: 'Dawai ke dabbe ya pattey ki photo yahan dalein',
      uploadSub: 'JPG, PNG ya WebP (Zyada se zyada 4MB). Photo automatically optimize ho jati hai.',
      searchPlaceholder: 'Maslan Panadol, Augmentin, Glucophage waghaira...',
      searchButton: 'Dawai Samjhein',
      analyzing: 'Gemini AI dawai ki jaanch kar raha hai...',
      stepReading: 'Dawai ka dabba padha ja raha hai...',
      stepExtracting: 'Formula aur fawaid nikale ja rahe hain...',
      stepTranslating: 'Roman Urdu mein asaan alfaaz banaye ja rahe hain...',
      confirmTitle: 'Padhe Gaye Dawaiyon ke Naam',
      confirmDesc: 'Mukammal tafseel se pehle tasdeeq kar lein ke kya dawai ka naam theek padha gaya hai:',
      confirmButton: 'Tasdeeq Karein aur Tafseel Dekhein',
      addMedicinePlaceholder: 'Dawai ka naam theek ya add karein...',
      addBtn: 'Add Karein',
      unreadableTitle: 'Photo Saaf Nahi Padhi Ja Saki',
      unreadableDesc: 'Dawai ka naam ya likhayi dhundli ya cut hai. Barah-e-karam achi roshni mein saaf tasweer dobara upload karein.',
      genericName: 'Formula / Generic Naam',
      category: 'Dawai ki Qisam',
      uses: 'Yeh dawai kis maqsad ke liye hai?',
      benefits: 'Iske Faidey',
      howToTake: 'Lene ka Tareeqa aur Waqt',
      sideEffects: 'Mumkinah Side Effects',
      commonSideEffects: 'Aam aur Halke Asraat',
      seriousSideEffects: 'Sangeen Asraat (Doctor se rabta karein)',
      whenToSeeDoctor: 'Doctor se Kab Milein?',
      safetyWarnings: 'Zaroori Hifazati Ehtiyat',
      antibioticsNotice: 'Antibiotic Ehtiyat: Tabiyat behtar hone ke bawajood doctor ka bataya hua poora course khatam karein.',
      questionsForDoctor: 'Doctor ya Pharmacist se Poochne Wale 3 Zaroori Sawal',
      noPersonalDoseNote: 'Yaad rakhein: Hamesha wohi dose lein jo aapke doctor ne likhi hai. Apni marzi se dose na badlein.',
    },
    report: {
      title: 'Medical Report ka Asaan Khulasa',
      subtitle: 'Khoon, jigar, gurde ya sugar ki lab report ki photo ya PDF lagayein aur har test ka asaan matlab samjhein.',
      uploadPrompt: 'Lab report ki photo ya PDF yahan dalein',
      uploadSub: 'PDF ya Photo (Zyada se zyada 8MB). Aapki files server par save nahi hoti, privacy mehfooz hai.',
      analyzing: 'Report ki jaanch ki ja rahi hai...',
      stepReading: 'Report ke saare tests aur numbers padhe ja rahe hain...',
      stepValidating: 'Normal ranges ke saath second-pass verification ho rahi hai...',
      stepTranslating: 'Asaan Roman Urdu khulasa tayar kiya ja raha hai...',
      summaryTitle: 'Report ka Asaan Khulasa',
      testsFound: 'Report se Nikale Gaye Test Results',
      testTable: {
        name: 'Test ka Naam',
        value: 'Aapki Value',
        range: 'Normal Range',
        status: 'Haalat aur Matlab',
      },
      statusLabels: {
        normal: 'Normal',
        high: 'Normal se Zyada',
        low: 'Normal se Kam',
        unknown: 'Doctor se check karwayein',
        not_provided: 'Range report par nahi thi',
        unclear: 'Saaf padha nahi gaya',
      },
      plainMeaningTitle: 'Ghair Mamooli (Abnormal) Results ka Kya Matlab Hai?',
      questionsTitle: 'Doctor se Agli Mulaqat Par Poochne Wale Sawal',
      urgentCareTitle: 'Emergency Hospital Jane ki Alamaat',
      urgentCareSubtitle: 'Agar mareez mein yeh alamaat nazar aayein toh foran Rescue 1122 milayein ya emergency jayein.',
      validationBadge: '2-Pass Strict Verification: Sirf report mein mojood sachhe numbers',
    },
    assistant: {
      title: 'Sehat Dost (Voice Companion)',
      subtitle: 'Roman Urdu ya aam bol-chal mein baat karein. Buzurgon ke liye khaas asaan audio interface.',
      badge: 'Live Voice AI',
      contextActive: 'Aapki aakhri check ki gayi dawai ya report se bakhabar hai',
      noContext: 'Aam Sehat aur Rehnumai Mode',
      micPrompt: 'Mic dabayein aur bolein',
      listening: 'Sun raha hoon... Baat poori hone par dobara mic dabayein',
      thinking: 'Jawab tayar ho raha hai...',
      typePrompt: 'Ya apna sawal yahan type karein...',
      send: 'Bhejein',
      speechFallbackNote: 'Voice speech feature tayar hai. Awaaz band ho toh text bada nazar aayega.',
      emergencyWarning: 'Emergency alamaat (seenay mein dard, saans band hona, khoon behna)? Foran 1122 milayein.',
      quickPrompts: [
        'Yeh dawai khane se pehle leni hai ya baad mein?',
        'Mera sugar level normal kitna hona chahiye?',
        'High blood pressure ke dauran kya ehtiyat karein?',
        'Dawai lene ka sahi tareeqa kya hai?',
      ],
      muteVoice: 'Awaaz Band Karein',
      unmuteVoice: 'Awaaz On Karein',
    },
    tts: {
      listen: 'Awaaz mein Sunein',
      pause: 'Rokein',
      resume: 'Jari Rakhein',
      stop: 'Band Karein',
      speed: 'Speed',
      playing: 'Bol raha hai...',
      unavailable: 'Is browser mein audio playback dastiyab nahi, upar text padhein.',
    },
    history: {
      title: 'Pichli Check ki Gayi Cheezein (Aakhri 5)',
      empty: 'Abhi tak koi record nahi hai.',
      clear: 'Record Saaf Karein',
      view: 'Dobara Dekhein',
      savedAlert: 'Yeh sirf aapke apne browser mein mehfooz hai.',
      inspectionTitle: 'Tafseelat Dekhein',
    },
    footer: {
      tagline: 'OmniPlus — Har Pakistani ke liye Asaan Sehat ki Samajh',
      disclaimer: 'Yeh sirf maloomati app hai. Emergency mein Rescue 1122 ya qareebi hospital jayein.',
      hackathon: 'Minhaj University AI Hackathon mein tayar kardah · SDG 3 (Good Health & Well-Being)',
    },
    errors: {
      generic: 'Koi masla pesh aya hai. Barah-e-karam dobara koshish karein.',
      rateLimit: 'Requests zyada ho gayi hain. Ek minute baad koshish karein.',
      timeout: 'Request ka time khatam ho gaya. Internet check kar ke dobara koshish karein.',
      fileTooLarge: 'File ka size bada hai. 4MB photo ya 8MB se choti PDF lagayein.',
      invalidType: 'File format theek nahi hai. JPG, PNG ya PDF lagayein.',
      retry: 'Dobara Koshish Karein',
    },
  },
};
