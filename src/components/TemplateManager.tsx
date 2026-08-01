import React, { useMemo, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import {
  PassTicket,
  TicketCanvasThemeId,
  TemplateCustomization,
  FontFamilyOption,
  BorderStyleOption,
  BadgeStyleOption,
  QRFrameStyleOption,
  CornerStyleOption,
  SponsorLogoPlacement,
  SecurityWatermarkStyle,
  ThemeMode,
  PassCategory,
  CanvasElement,
  CanvasElementType,
} from '../types';
import {
  getAllThemes,
  saveCustomTheme,
  deleteCustomTheme,
  getCustomThemes,
  CanvasThemeDefinition,
  DEFAULT_FALLBACK_THEME,
} from '../lib/ticketTemplateMap';
import { TicketRenderer } from './TicketRenderer';
import { downloadPng, downloadPdf, getPhysicalSizeIn } from '../lib/exportTicket';
import {
  Palette,
  Sparkles,
  Download,
  FileDown,
  Save,
  Trash2,
  Sun,
  Moon,
  Loader2,
  Check,
  RefreshCcw,
  LayoutGrid,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Eye,
  Type,
  Image as ImageIcon,
  Paintbrush,
  QrCode,
  Layers,
  Sliders,
  Plus,
  Search,
  Move,
  Trophy,
  X,
  SlidersHorizontal,
  BadgeCheck,
  Square,
  Circle,
  Minus,
  Copy,
  ChevronUp,
  ChevronDown,
  RotateCw,
  Upload,
  Shield,
  Award,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowLeft,
  Lock,
  Unlock,
  Smartphone,
  Maximize2,
  Minimize2,
} from 'lucide-react';

const FONT_OPTIONS: FontFamilyOption[] = ['sans', 'heading', 'serif', 'mono', 'display', 'stencil'];
const BORDER_OPTIONS: BorderStyleOption[] = ['solid_gold', 'neon_glow', 'double_metallic', 'dashed_stub', 'none', 'chamfer'];
const BADGE_OPTIONS: BadgeStyleOption[] = ['pill_stars', 'shield_crest', 'metallic_ribbon', 'gold_tag', 'minimal_block'];
const QR_FRAME_OPTIONS: QRFrameStyleOption[] = ['security_glow', 'gold_metallic', 'corner_crosshairs', 'glass_card', 'minimal'];
const CORNER_OPTIONS: CornerStyleOption[] = ['notch_cutouts', 'rounded_lg', 'sharp_square', 'pill_edges'];
const SPONSOR_OPTIONS: SponsorLogoPlacement[] = ['top_header', 'bottom_stub', 'footer', 'none'];
const WATERMARK_OPTIONS: SecurityWatermarkStyle[] = ['shield_logo', 'starburst_hologram', 'official_seal', 'none'];

const labelize = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());

type LeftToolCategory = 'themes' | 'text' | 'elements' | 'logos' | 'images' | 'barcode' | 'layers';
type RightTabCategory = 'inspector' | 'styling' | 'params';

export interface TemplateManagerProps {
  onExit?: () => void;
}

interface DesignHistoryState {
  selectedThemeId: TicketCanvasThemeId;
  customization: TemplateCustomization;
  ticketParams: Partial<PassTicket>;
}

// Generate complete set of interactive canvas elements for standard ticket layout
export function getInitialCanvasElements(ticketParams: Partial<PassTicket>): CanvasElement[] {
  const eventName = ticketParams.eventName || 'LBA Championship Finals 2026';
  const eventDate = ticketParams.eventDate || 'August 15, 2026';
  const eventTime = ticketParams.eventTime || '18:00 GMT';
  const venue = ticketParams.venue || 'SKD Sports Complex';
  const price = ticketParams.price !== undefined ? ticketParams.price : 75;
  const currency = ticketParams.currency || 'USD';
  const section = ticketParams.section || 'VIP Deck A';
  const row = ticketParams.row || '12';
  const seat = ticketParams.seatNumber || '25';

  return [
    {
      id: 'el_bg_card',
      type: 'rectangle',
      role: 'bgCard',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fill: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      stroke: '#f59e0b',
      strokeWidth: 2,
      rx: 16,
      zIndex: 1,
    },
    {
      id: 'el_header_banner',
      type: 'rectangle',
      role: 'headerBanner',
      x: 0,
      y: 0,
      width: 100,
      height: 28,
      fill: 'linear-gradient(90deg, #b45309 0%, #d97706 50%, #f59e0b 100%)',
      rx: 16,
      zIndex: 2,
    },
    {
      id: 'el_event_logo',
      type: 'logo',
      role: 'eventLogo',
      x: 3,
      y: 3,
      width: 16,
      height: 22,
      src: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&auto=format&fit=crop&q=80',
      borderRadius: 8,
      zIndex: 10,
    },
    {
      id: 'el_event_name',
      type: 'text',
      role: 'eventName',
      x: 21,
      y: 4,
      width: 55,
      height: 12,
      text: eventName,
      fontSize: 18,
      fontWeight: '900',
      fontColor: '#ffffff',
      textAlign: 'left',
      zIndex: 10,
    },
    {
      id: 'el_team_names',
      type: 'text',
      role: 'teamNames',
      x: 21,
      y: 17,
      width: 55,
      height: 8,
      text: 'LPRC OILERS vs MIGHTY BARROLLE',
      fontSize: 12,
      fontWeight: 'bold',
      fontColor: '#fef08a',
      textAlign: 'left',
      zIndex: 10,
    },
    {
      id: 'el_date_time',
      type: 'text',
      role: 'dateTime',
      x: 21,
      y: 34,
      width: 55,
      height: 7,
      text: `📅 ${eventDate} • ${eventTime}`,
      fontSize: 11,
      fontWeight: 'bold',
      fontColor: '#e2e8f0',
      textAlign: 'left',
      zIndex: 10,
    },
    {
      id: 'el_venue',
      type: 'text',
      role: 'venue',
      x: 21,
      y: 42,
      width: 55,
      height: 7,
      text: `📍 ${venue}`,
      fontSize: 11,
      fontWeight: 'bold',
      fontColor: '#cbd5e1',
      textAlign: 'left',
      zIndex: 10,
    },
    {
      id: 'el_stub_line',
      type: 'line',
      role: 'stubLine',
      x: 77,
      y: 0,
      width: 1,
      height: 100,
      stroke: '#f59e0b',
      strokeWidth: 2,
      strokeDasharray: '4 4',
      zIndex: 5,
    },
    {
      id: 'el_ticket_type',
      type: 'text',
      role: 'ticketType',
      x: 3,
      y: 52,
      width: 35,
      height: 9,
      text: 'VIP COURTIQ PASS',
      fontSize: 13,
      fontWeight: '900',
      fontColor: '#f59e0b',
      textAlign: 'left',
      zIndex: 10,
    },
    {
      id: 'el_price',
      type: 'text',
      role: 'price',
      x: 40,
      y: 52,
      width: 35,
      height: 9,
      text: `$${price} ${currency}`,
      fontSize: 13,
      fontWeight: '900',
      fontColor: '#10b981',
      textAlign: 'left',
      zIndex: 10,
    },
    {
      id: 'el_seat_info',
      type: 'text',
      role: 'seatInfo',
      x: 3,
      y: 65,
      width: 72,
      height: 8,
      text: `SECTION: ${section} | ROW: ${row} | SEAT: ${seat}`,
      fontSize: 11,
      fontWeight: 'bold',
      fontColor: '#94a3b8',
      textAlign: 'left',
      zIndex: 10,
    },
    {
      id: 'el_ticket_number',
      type: 'text',
      role: 'ticketNumber',
      x: 3,
      y: 76,
      width: 72,
      height: 7,
      text: 'TICKET NO: #LBA-2026-STUDIO-88',
      fontSize: 10,
      fontFamily: 'mono',
      fontColor: '#64748b',
      textAlign: 'left',
      zIndex: 10,
    },
    {
      id: 'el_qr_code',
      type: 'qr',
      role: 'qrCode',
      x: 80,
      y: 10,
      width: 16,
      height: 42,
      borderRadius: 8,
      zIndex: 10,
    },
    {
      id: 'el_barcode',
      type: 'barcode',
      role: 'barcode',
      x: 80,
      y: 55,
      width: 16,
      height: 38,
      borderRadius: 6,
      zIndex: 10,
    },
  ];
}

// Minimal blank canvas layout with background template image
export function getBlankCanvasElements(): CanvasElement[] {
  return [
    {
      id: 'el_bg_card',
      type: 'image',
      role: 'bgCard',
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      src: '/blank_ticket_bg.jpg',
      borderRadius: 16,
      zIndex: 1,
    },
    {
      id: 'el_stub_line',
      type: 'line',
      role: 'stubLine',
      x: 77,
      y: 0,
      width: 1,
      height: 100,
      stroke: '#3b82f6',
      strokeWidth: 2,
      strokeDasharray: '4 4',
      zIndex: 2,
    },
    {
      id: 'el_qr_code',
      type: 'qr',
      role: 'qrCode',
      x: 80,
      y: 10,
      width: 16,
      height: 42,
      borderRadius: 8,
      zIndex: 10,
    },
    {
      id: 'el_barcode',
      type: 'barcode',
      role: 'barcode',
      x: 80,
      y: 55,
      width: 16,
      height: 38,
      borderRadius: 6,
      zIndex: 10,
    },
  ];
}

export const TemplateManager: React.FC<TemplateManagerProps> = ({ onExit }) => {
  const [themesVersion, setThemesVersion] = useState(0);
  const allThemes = useMemo(() => getAllThemes(), [themesVersion]);
  const allThemesList = useMemo(() => Object.values(allThemes), [allThemes]);
  const customIds = useMemo(() => new Set(Object.values(getCustomThemes()).map((t: any) => t.id)), [themesVersion]);

  // Project / Design Title
  const [projectName, setProjectName] = useState('LBA Final Ticket Design Studio');
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // Layout Sidebars & Mobile Drawers State
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [activeLeftTool, setActiveLeftTool] = useState<LeftToolCategory>('themes');
  const [activeRightTab, setActiveRightTab] = useState<RightTabCategory>('inspector');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Search filter for template gallery
  const [templateSearch, setTemplateSearch] = useState('');

  // Core Ticket Design State
  const [selectedThemeId, setSelectedThemeId] = useState<TicketCanvasThemeId>('blank_canvas');
  const [customization, setCustomization] = useState<TemplateCustomization>({});

  // Canvas Interactive Selection State
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Mobile responsiveness detector
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Ticket Pass Sample Parameters
  const [ticketParams, setTicketParams] = useState<Partial<PassTicket>>({
    eventName: 'LBA Championship Finals 2026',
    eventDate: 'August 15, 2026',
    eventTime: '18:00 GMT',
    venue: 'SKD Sports Complex',
    holderName: 'Josephine Dennis',
    category: 'vip',
    section: 'VIP Deck A',
    row: '12',
    seatNumber: '25',
    gateEntry: 'Gate A-1',
    price: 75,
    currency: 'USD',
  });

  // Automatically initialize default interactive canvas elements if empty
  useEffect(() => {
    if (!customization.canvasElements || customization.canvasElements.length === 0) {
      setCustomization((prev) => ({
        ...prev,
        canvasElements: getBlankCanvasElements(),
      }));
    }
  }, []);

  // History Stack for Undo / Redo
  const [history, setHistory] = useState<DesignHistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const pushHistory = (newThemeId: TicketCanvasThemeId, newCustomization: TemplateCustomization, newParams: Partial<PassTicket>) => {
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIndex + 1);
      return [...sliced, { selectedThemeId: newThemeId, customization: newCustomization, ticketParams: newParams }];
    });
    setHistoryIndex((prev) => prev + 1);
  };

  useEffect(() => {
    if (history.length === 0) {
      const initialElements = customization.canvasElements || getBlankCanvasElements();
      const initCust = { ...customization, canvasElements: initialElements };
      setHistory([{ selectedThemeId, customization: initCust, ticketParams }]);
      setHistoryIndex(0);
    }
  }, []);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setSelectedThemeId(prev.selectedThemeId);
      setCustomization(prev.customization);
      setTicketParams(prev.ticketParams);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setSelectedThemeId(next.selectedThemeId);
      setCustomization(next.customization);
      setTicketParams(next.ticketParams);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const updateCustomization = (patch: Partial<TemplateCustomization>) => {
    setCustomization((prev) => {
      const updated = { ...prev, ...patch };
      pushHistory(selectedThemeId, updated, ticketParams);
      return updated;
    });
  };

  const updateTicketParams = (patch: Partial<PassTicket>) => {
    setTicketParams((prev) => {
      const updated = { ...prev, ...patch };
      pushHistory(selectedThemeId, customization, updated);
      return updated;
    });
  };

  const theme: CanvasThemeDefinition = allThemes[selectedThemeId] || DEFAULT_FALLBACK_THEME;
  const effectiveMode = customization.mode || theme.mode;

  // Zoom Level State
  const [zoom, setZoom] = useState(1);

  // Preview & Export State
  const previewRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState<'png' | 'pdf' | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState(false);

  // Construct current pass for renderer
  const sampleTicket: PassTicket = useMemo(() => {
    return {
      id: 'DESIGN-STUDIO-PREVIEW',
      ticketCode: 'LBA-2026-STUDIO-88',
      passType: 'ticket',
      eventName: ticketParams.eventName || 'LBA Championship Finals 2026',
      eventDate: ticketParams.eventDate || 'August 15, 2026',
      eventTime: ticketParams.eventTime || '18:00 GMT',
      venue: ticketParams.venue || 'SKD Sports Complex',
      holderName: ticketParams.holderName || 'Josephine Dennis',
      category: ticketParams.category || 'vip',
      section: ticketParams.section || 'VIP Deck A',
      row: ticketParams.row || '12',
      seatNumber: ticketParams.seatNumber || '25',
      gateEntry: ticketParams.gateEntry || 'Gate A-1',
      price: ticketParams.price ?? 75,
      currency: ticketParams.currency || 'USD',
      status: 'valid',
      issuedAt: new Date().toISOString(),
      qrCodeData: 'https://courtiq.app/verify/LBA-2026-STUDIO-88',
      themeId: selectedThemeId,
      customization,
    };
  }, [selectedThemeId, customization, ticketParams]);

  // Canvas elements array
  const canvasElements = customization.canvasElements || [];

  const updateCanvasElements = (newElements: CanvasElement[]) => {
    updateCustomization({ canvasElements: newElements });
  };

  // Add Element Function
  const addCanvasElement = (type: CanvasElementType, options: Partial<CanvasElement> = {}) => {
    const newId = `el_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    let defaultWidth = 30;
    let defaultHeight = 12;
    if (type === 'circle' || type === 'qr') {
      defaultWidth = 16;
      defaultHeight = 35;
    } else if (type === 'barcode') {
      defaultWidth = 16;
      defaultHeight = 35;
    } else if (type === 'line') {
      defaultWidth = 60;
      defaultHeight = 2;
    } else if (type === 'logo') {
      defaultWidth = 18;
      defaultHeight = 22;
    }

    const newEl: CanvasElement = {
      id: newId,
      type,
      x: options.x ?? 30,
      y: options.y ?? 30,
      width: options.width ?? defaultWidth,
      height: options.height ?? defaultHeight,
      rotation: options.rotation ?? 0,
      zIndex: (canvasElements.length + 1) * 10,
      text: type === 'text' ? options.text || 'New Text Element' : undefined,
      fontSize: type === 'text' ? options.fontSize || 16 : undefined,
      fontWeight: type === 'text' ? options.fontWeight || 'bold' : undefined,
      fontColor: type === 'text' ? options.fontColor || '#ffffff' : undefined,
      fontFamily: type === 'text' ? options.fontFamily || 'sans' : undefined,
      textAlign: type === 'text' ? options.textAlign || 'left' : undefined,
      src: type === 'image' || type === 'logo' ? options.src || 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&auto=format&fit=crop&q=80' : undefined,
      fill: type === 'rectangle' || type === 'circle' ? options.fill || '#f59e0b' : undefined,
      stroke: options.stroke || undefined,
      strokeWidth: options.strokeWidth || undefined,
      rx: type === 'rectangle' ? options.rx || 8 : undefined,
      borderRadius: options.borderRadius || undefined,
      opacity: options.opacity ?? 1,
      ...options,
    };

    const updated = [...canvasElements, newEl];
    updateCanvasElements(updated);
    setSelectedElementId(newId);
    setActiveRightTab('inspector');
  };

  const duplicateElement = (id: string) => {
    const target = canvasElements.find((el) => el.id === id);
    if (!target) return;
    const cloneId = `el_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const clone: CanvasElement = {
      ...target,
      id: cloneId,
      x: Math.min(80, target.x + 4),
      y: Math.min(80, target.y + 4),
      zIndex: (canvasElements.length + 1) * 10,
    };
    const updated = [...canvasElements, clone];
    updateCanvasElements(updated);
    setSelectedElementId(cloneId);
  };

  const deleteElement = (id: string) => {
    const updated = canvasElements.filter((el) => el.id !== id);
    updateCanvasElements(updated);
    if (selectedElementId === id) setSelectedElementId(null);
  };

  const bringForward = (id: string) => {
    const idx = canvasElements.findIndex((el) => el.id === id);
    if (idx < 0 || idx >= canvasElements.length - 1) return;
    const copy = [...canvasElements];
    const temp = copy[idx];
    copy[idx] = copy[idx + 1];
    copy[idx + 1] = temp;
    updateCanvasElements(copy);
  };

  const sendBackward = (id: string) => {
    const idx = canvasElements.findIndex((el) => el.id === id);
    if (idx <= 0) return;
    const copy = [...canvasElements];
    const temp = copy[idx];
    copy[idx] = copy[idx - 1];
    copy[idx - 1] = temp;
    updateCanvasElements(copy);
  };

  const toggleLockElement = (id: string) => {
    updateCanvasElements(
      canvasElements.map((el) => (el.id === id ? { ...el, isLocked: !el.isLocked } : el))
    );
  };

  // Pointer Interaction Logic for Drag, Resize, and Rotate
  const activeInteractionRef = useRef<{
    elementId: string;
    mode: 'move' | 'resize-nw' | 'resize-ne' | 'resize-se' | 'resize-sw' | 'rotate';
    startX: number;
    startY: number;
    initX: number;
    initY: number;
    initWidth: number;
    initHeight: number;
    initRotation: number;
    canvasWidth: number;
    canvasHeight: number;
    canvasLeft: number;
    canvasTop: number;
  } | null>(null);

  const handlePointerDown = (
    e: React.PointerEvent,
    elementId: string,
    mode: 'move' | 'resize-nw' | 'resize-ne' | 'resize-se' | 'resize-sw' | 'rotate'
  ) => {
    e.stopPropagation();
    setSelectedElementId(elementId);
    const el = canvasElements.find((item) => item.id === elementId);
    const canvasEl = previewRef.current;
    if (!el || !canvasEl || el.isLocked) return;

    const rect = canvasEl.getBoundingClientRect();
    activeInteractionRef.current = {
      elementId,
      mode,
      startX: e.clientX,
      startY: e.clientY,
      initX: el.x,
      initY: el.y,
      initWidth: el.width ?? 100,
      initHeight: el.height ?? 50,
      initRotation: el.rotation || 0,
      canvasWidth: rect.width,
      canvasHeight: rect.height,
      canvasLeft: rect.left,
      canvasTop: rect.top,
    };

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!activeInteractionRef.current) return;
    const {
      elementId,
      mode,
      startX,
      startY,
      initX,
      initY,
      initWidth,
      initHeight,
      initRotation,
      canvasWidth,
      canvasHeight,
      canvasLeft,
      canvasTop,
    } = activeInteractionRef.current;

    if (canvasWidth <= 0 || canvasHeight <= 0) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    const pdx = (dx / canvasWidth) * 100;
    const pdy = (dy / canvasHeight) * 100;

    let newX = initX;
    let newY = initY;
    let newWidth = initWidth;
    let newHeight = initHeight;
    let newRotation = initRotation;

    if (mode === 'move') {
      newX = Math.max(0, Math.min(95, initX + pdx));
      newY = Math.max(0, Math.min(95, initY + pdy));
    } else if (mode === 'resize-se') {
      newWidth = Math.max(3, initWidth + pdx);
      newHeight = Math.max(3, initHeight + pdy);
    } else if (mode === 'resize-sw') {
      newWidth = Math.max(3, initWidth - pdx);
      newX = initX + (initWidth - newWidth);
      newHeight = Math.max(3, initHeight + pdy);
    } else if (mode === 'resize-ne') {
      newWidth = Math.max(3, initWidth + pdx);
      newY = Math.max(0, initY + pdy);
      newHeight = Math.max(3, initHeight - pdy);
    } else if (mode === 'resize-nw') {
      newWidth = Math.max(3, initWidth - pdx);
      newX = initX + (initWidth - newWidth);
      newHeight = Math.max(3, initHeight - pdy);
      newY = initY + (initHeight - newHeight);
    } else if (mode === 'rotate') {
      const centerX = canvasLeft + ((initX + initWidth / 2) / 100) * canvasWidth;
      const centerY = canvasTop + ((initY + initHeight / 2) / 100) * canvasHeight;
      const rad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      let deg = Math.round((rad * 180) / Math.PI) + 90;
      if (deg < 0) deg += 360;
      newRotation = deg % 360;
    }

    updateCanvasElements(
      canvasElements.map((el) =>
        el.id === elementId
          ? {
              ...el,
              x: Math.round(newX * 10) / 10,
              y: Math.round(newY * 10) / 10,
              width: Math.round(newWidth * 10) / 10,
              height: Math.round(newHeight * 10) / 10,
              rotation: newRotation,
            }
          : el
      )
    );
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (activeInteractionRef.current) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      activeInteractionRef.current = null;
    }
  };

  // Keyboard shortcut for deleting elements
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedElementId) return;
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        deleteElement(selectedElementId);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, canvasElements]);

  // Handle file upload for Image or Logo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'image') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        addCanvasElement(type, {
          src: result,
          width: type === 'logo' ? 18 : 30,
          height: type === 'logo' ? 22 : 30,
        });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Save current template to local custom themes
  const handleSaveAsTemplate = () => {
    const id = `custom_${Date.now()}`;
    const customTheme: CanvasThemeDefinition = {
      id: id as unknown as TicketCanvasThemeId,
      name: projectName,
      categoryDefault: 'vip',
      mode: effectiveMode,
      borderStyle: customization.borderStyle || theme.borderStyle,
      badgeStyle: customization.badgeStyle || theme.badgeStyle,
      qrFrameStyle: customization.qrFrameStyle || theme.qrFrameStyle,
      defaultOrientation: customization.orientation || theme.defaultOrientation,
      cornerStyle: customization.cornerStyle || theme.cornerStyle,
      securityWatermark: customization.securityWatermark || theme.securityWatermark,
      sponsorLogoPosition: customization.sponsorLogoPosition || theme.sponsorLogoPosition,
      fontFamily: customization.fontFamily || theme.fontFamily,
      colors: {
        primary: customization.primaryColor || theme.colors.primary,
        secondary: customization.secondaryColor || theme.colors.secondary,
        accent: customization.accentColor || theme.colors.accent,
      },
      bgClass: theme.bgClass,
      accentClass: theme.accentClass,
      borderClass: theme.borderClass,
      previewGradient: theme.previewGradient,
      patternId: theme.patternId,
      badgeText: 'CUSTOM DESIGN',
      tagline: 'Custom Saved Template',
      description: 'Saved from Pass Studio',
      thumbnailStyle: theme.thumbnailStyle,
    };

    saveCustomTheme(customTheme);
    setThemesVersion((v) => v + 1);
    setSelectedThemeId(id as unknown as TicketCanvasThemeId);
    setSaveSuccessMessage(true);
    setTimeout(() => setSaveSuccessMessage(false), 3000);
  };

  const handleDeleteCustom = (id: string) => {
    deleteCustomTheme(id);
    setThemesVersion((v) => v + 1);
    if (selectedThemeId === id) {
      setSelectedThemeId('blank_canvas');
    }
  };

  const handleExportPng = async () => {
    if (!previewRef.current) return;
    setExporting('png');
    try {
      await downloadPng(previewRef.current, `${projectName.replace(/\s+/g, '_')}_Ticket.png`);
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(null);
    }
  };

  const handleExportPdf = async () => {
    if (!previewRef.current) return;
    setExporting('pdf');
    try {
      const size = getPhysicalSizeIn('ticket', customization.orientation || theme.defaultOrientation);
      await downloadPdf(
        previewRef.current,
        `${projectName.replace(/\s+/g, '_')}_300DPI_Print.pdf`,
        size
      );
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(null);
    }
  };

  // Filter templates
  const filteredThemes = useMemo(() => {
    if (!templateSearch.trim()) return allThemesList;
    const q = templateSearch.toLowerCase();
    return allThemesList.filter(
      (t: CanvasThemeDefinition) =>
        t.name.toLowerCase().includes(q) ||
        t.tagline?.toLowerCase().includes(q) ||
        t.badgeText?.toLowerCase().includes(q)
    );
  }, [allThemesList, templateSearch]);

  const selectedElement = canvasElements.find((el) => el.id === selectedElementId);

  return (
    <div className="fixed inset-0 z-[100] w-screen h-screen bg-slate-950 flex flex-col text-slate-100 overflow-hidden select-none animate-in fade-in duration-200">
      {/* 1. TOP MAIN STUDIO TOOLBAR */}
      <header className="h-16 bg-slate-900/95 border-b border-slate-800/80 px-3 sm:px-5 flex items-center justify-between gap-2 shrink-0 z-30 backdrop-blur-xl">
        {/* Left: Exit Studio & Title Editor */}
        <div className="flex items-center gap-3 min-w-0">
          {onExit && (
            <button
              type="button"
              onClick={onExit}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 border border-slate-700 hover:border-slate-600 transition-all shadow-md shrink-0"
              title="Return to Application Dashboard"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Exit Studio</span>
            </button>
          )}

          <div className="h-6 w-[1px] bg-slate-800 hidden sm:block" />

          {/* Project Title */}
          <div className="flex items-center gap-2 truncate">
            {isEditingTitle ? (
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                autoFocus
                className="bg-slate-950 border border-amber-500/80 rounded-lg px-2 py-0.5 text-xs font-bold font-heading text-white focus:outline-none max-w-[200px] sm:max-w-[280px]"
              />
            ) : (
              <h1
                onClick={() => setIsEditingTitle(true)}
                className="text-xs sm:text-sm font-heading font-extrabold text-white truncate cursor-pointer hover:text-amber-400 transition-colors flex items-center gap-1.5"
                title="Click to rename design project"
              >
                <span>{projectName}</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              </h1>
            )}
          </div>
        </div>

        {/* Center: Undo / Redo / Zoom / Reset */}
        <div className="hidden md:flex items-center gap-1 bg-slate-950/80 border border-slate-800 rounded-2xl p-1 shadow-inner">
          <button
            type="button"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-slate-800 mx-1" />

          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono font-bold text-slate-300 px-1 min-w-[42px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(1.8, z + 0.1))}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-slate-800 mx-1" />

          <button
            type="button"
            onClick={() =>
              updateCustomization({
                canvasElements: getInitialCanvasElements(ticketParams),
              })
            }
            className="px-2 py-1 rounded-xl text-[10px] font-bold text-amber-400 hover:bg-amber-500/10 transition-all flex items-center gap-1"
            title="Reset to default ticket elements layout"
          >
            <RefreshCcw className="w-3 h-3" />
            <span>Reset Layout</span>
          </button>
        </div>

        {/* Right Action Tools: Dark/Light, Save, Preview, Export */}
        <div className="flex items-center gap-2">
          {/* Light / Dark Canvas Toggle */}
          <button
            type="button"
            onClick={() =>
              updateCustomization({
                mode: effectiveMode === 'dark' ? 'light' : 'dark',
              })
            }
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title={`Toggle Theme Mode (Current: ${effectiveMode})`}
          >
            {effectiveMode === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
          </button>

          {/* Save Template Button */}
          <button
            type="button"
            onClick={handleSaveAsTemplate}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md"
          >
            {saveSuccessMessage ? <Check className="w-4 h-4 text-emerald-400 animate-in zoom-in" /> : <Save className="w-4 h-4 text-amber-400" />}
            <span className="hidden sm:inline">{saveSuccessMessage ? 'Saved!' : 'Save Template'}</span>
          </button>

          {/* Preview Modal Button */}
          <button
            type="button"
            onClick={() => setIsPreviewModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md"
          >
            <Eye className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">Preview</span>
          </button>

          {/* Export PNG */}
          <button
            type="button"
            onClick={handleExportPng}
            disabled={exporting !== null}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
          >
            {exporting === 'png' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span className="hidden md:inline">PNG</span>
          </button>

          {/* Export PDF 300DPI */}
          <button
            type="button"
            onClick={handleExportPdf}
            disabled={exporting !== null}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            {exporting === 'pdf' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
            <span className="hidden lg:inline">PDF</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE CONTAINER (3-COLUMN LAYOUT) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT TOOLBAR / SIDEBAR */}
        <aside
          className={`w-72 bg-slate-900/90 border-r border-slate-800/80 flex flex-col shrink-0 z-20 transition-all duration-200 ${
            showLeftSidebar ? 'translate-x-0' : '-translate-x-full absolute inset-y-0 left-0'
          } ${isMobile ? 'hidden' : 'flex'}`}
        >
          {/* Tool Selector Tabs Header */}
          <div className="grid grid-cols-4 gap-1 p-2 border-b border-slate-800 bg-slate-950/60">
            {[
              { id: 'themes' as LeftToolCategory, label: 'Themes', icon: Palette },
              { id: 'text' as LeftToolCategory, label: 'Text', icon: Type },
              { id: 'elements' as LeftToolCategory, label: 'Shapes', icon: Square },
              { id: 'logos' as LeftToolCategory, label: 'Media', icon: ImageIcon },
            ].map((tool) => {
              const Icon = tool.icon;
              const isActive = activeLeftTool === tool.id;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => setActiveLeftTool(tool.id)}
                  className={`p-2 rounded-xl text-center flex flex-col items-center justify-center gap-1 transition-all ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[10px] tracking-wider uppercase font-bold">{tool.label}</span>
                </button>
              );
            })}
          </div>

          {/* Subtool content area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-5">
            {/* TOOL 1: THEMES GALLERY & BLANK CANVAS */}
            {activeLeftTool === 'themes' && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateCustomization({
                        canvasElements: getBlankCanvasElements(),
                      })
                    }
                    className="flex-1 py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 transition-all shadow-md"
                  >
                    <Plus className="w-4 h-4 text-amber-400" />
                    <span>Blank Canvas</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updateCustomization({
                        canvasElements: getInitialCanvasElements(ticketParams),
                      })
                    }
                    className="flex-1 py-2.5 px-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-bold text-amber-400 flex items-center justify-center gap-1.5 transition-all shadow-md"
                  >
                    <RefreshCcw className="w-3.5 h-3.5" />
                    <span>Reset Default</span>
                  </button>
                </div>

                {/* Search Filter */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    value={templateSearch}
                    onChange={(e) => setTemplateSearch(e.target.value)}
                    placeholder="Search preset themes…"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Preset Themes List */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Preset Themes ({filteredThemes.length})
                  </span>

                  <div className="space-y-2 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
                    {filteredThemes.map((t) => {
                      const isSelected = selectedThemeId === t.id;
                      const isCustom = customIds.has(t.id);

                      return (
                        <div
                          key={t.id}
                          onClick={() => {
                            setSelectedThemeId(t.id as TicketCanvasThemeId);
                            setCustomization({});
                          }}
                          className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col gap-1.5 relative group ${
                            isSelected
                              ? 'bg-slate-800/90 border-amber-400 ring-2 ring-amber-400/40 shadow-xl'
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                          }`}
                        >
                          <div className={`h-2.5 w-full rounded-full ${t.previewGradient}`} />
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-bold text-white truncate">{t.name}</span>
                            {isCustom && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteCustom(t.id);
                                }}
                                className="p-1 rounded-md text-red-400 hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Delete saved template"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 line-clamp-1">{t.tagline}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TOOL 2: ADD TEXT ELEMENTS */}
            {activeLeftTool === 'text' && (
              <div className="space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Add Text Objects
                </span>

                <button
                  type="button"
                  onClick={() => addCanvasElement('text', { text: 'EVENT TITLE', fontSize: 22, fontWeight: '900', fontColor: '#ffffff' })}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400/60 text-left transition-all hover:scale-[1.02]"
                >
                  <p className="text-sm font-extrabold font-heading text-white">Add Heading Text</p>
                  <p className="text-[10px] text-slate-400">Large title font</p>
                </button>

                <button
                  type="button"
                  onClick={() => addCanvasElement('text', { text: 'Subheading Detail', fontSize: 14, fontWeight: 'bold', fontColor: '#fef08a' })}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400/60 text-left transition-all hover:scale-[1.02]"
                >
                  <p className="text-xs font-bold text-amber-300">Add Subheading</p>
                  <p className="text-[10px] text-slate-400">Medium section label</p>
                </button>

                <button
                  type="button"
                  onClick={() => addCanvasElement('text', { text: 'Sample description or pass holder details', fontSize: 11, fontWeight: 'normal', fontColor: '#cbd5e1' })}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400/60 text-left transition-all hover:scale-[1.02]"
                >
                  <p className="text-xs text-slate-300">Add Body Text</p>
                  <p className="text-[10px] text-slate-400">Small detail paragraph</p>
                </button>

                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Quick Preset Fields</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => addCanvasElement('text', { text: ticketParams.eventName || 'MATCH DAY EVENT', fontSize: 18, fontWeight: '900', fontColor: '#ffffff', role: 'eventName' })}
                      className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-400 text-left text-[11px] font-bold text-slate-200"
                    >
                      + Event Name
                    </button>
                    <button
                      type="button"
                      onClick={() => addCanvasElement('text', { text: 'TEAM A vs TEAM B', fontSize: 13, fontWeight: 'bold', fontColor: '#fef08a', role: 'teamNames' })}
                      className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-400 text-left text-[11px] font-bold text-amber-300"
                    >
                      + Team Names
                    </button>
                    <button
                      type="button"
                      onClick={() => addCanvasElement('text', { text: `📍 ${ticketParams.venue || 'SKD Arena'}`, fontSize: 11, fontColor: '#cbd5e1', role: 'venue' })}
                      className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-400 text-left text-[11px] font-bold text-slate-300"
                    >
                      + Venue Text
                    </button>
                    <button
                      type="button"
                      onClick={() => addCanvasElement('text', { text: `$${ticketParams.price || 75} USD`, fontSize: 14, fontWeight: '900', fontColor: '#10b981', role: 'price' })}
                      className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-400 text-left text-[11px] font-bold text-emerald-400"
                    >
                      + Price Tag
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TOOL 3: ADD SHAPES & LINES */}
            {activeLeftTool === 'elements' && (
              <div className="space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Add Shapes & Lines
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => addCanvasElement('rectangle', { fill: '#f59e0b', width: 25, height: 15, rx: 8 })}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400 flex flex-col items-center gap-2 text-center"
                  >
                    <Square className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-bold text-white">Rectangle</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => addCanvasElement('circle', { fill: '#ef4444', width: 16, height: 35 })}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400 flex flex-col items-center gap-2 text-center"
                  >
                    <Circle className="w-5 h-5 text-red-400" />
                    <span className="text-xs font-bold text-white">Circle</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => addCanvasElement('line', { stroke: '#f59e0b', strokeWidth: 3, width: 60, height: 2 })}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400 flex flex-col items-center gap-2 text-center"
                  >
                    <Minus className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-bold text-white">Line</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => addCanvasElement('rectangle', { fill: 'linear-gradient(90deg, #b45309, #f59e0b)', width: 100, height: 25, rx: 16 })}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-400 flex flex-col items-center gap-2 text-center"
                  >
                    <LayoutGrid className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-bold text-white">Banner</span>
                  </button>
                </div>
              </div>
            )}

            {/* TOOL 4: MEDIA & LOGOS */}
            {activeLeftTool === 'logos' && (
              <div className="space-y-4">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Logos & Images
                </span>

                <div className="space-y-2">
                  <label className="p-3 rounded-2xl bg-slate-950 border border-dashed border-amber-500/50 hover:border-amber-400 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center">
                    <Upload className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-bold text-white">Upload Custom Image / Logo</span>
                    <span className="text-[10px] text-slate-400">PNG, JPG, SVG supported</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'image')}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => addCanvasElement('qr', { width: 16, height: 42, borderRadius: 8 })}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-400 flex flex-col items-center gap-2 text-center"
                  >
                    <QrCode className="w-5 h-5 text-blue-400" />
                    <span className="text-xs font-bold text-white">+ System QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => addCanvasElement('barcode', { width: 16, height: 38, borderRadius: 6 })}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-400 flex flex-col items-center gap-2 text-center"
                  >
                    <BadgeCheck className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-bold text-white">+ Barcode</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* CENTER CANVAS WORKSPACE */}
        <main
          className="flex-1 bg-slate-950 overflow-auto flex items-center justify-center p-4 sm:p-8 relative select-none"
          onClick={() => setSelectedElementId(null)}
        >
          {/* Zoomable Container */}
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
              transition: 'transform 0.15s ease-out',
            }}
            className="relative"
          >
            {/* The Ticket Renderer Component Ref */}
            <div ref={previewRef} className="relative rounded-3xl overflow-hidden shadow-2xl">
              <TicketRenderer ticket={sampleTicket} />

              {/* OVERLAY INTERACTIVE CANVAS ELEMENT HANDLES & BORDER */}
              <div className="absolute inset-0 pointer-events-auto overflow-hidden">
                {canvasElements.map((el) => {
                  const isSelected = selectedElementId === el.id;

                  return (
                    <div
                      key={el.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedElementId(el.id);
                      }}
                      onPointerDown={(e) => handlePointerDown(e, el.id, 'move')}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      style={{
                        position: 'absolute',
                        left: `${el.x}%`,
                        top: `${el.y}%`,
                        width: `${el.width}%`,
                        height: `${el.height}%`,
                        transform: `rotate(${el.rotation || 0}deg)`,
                        zIndex: el.zIndex || 10,
                        opacity: el.opacity ?? 1,
                        cursor: el.isLocked ? 'not-allowed' : 'move',
                        touchAction: 'none',
                      }}
                      className={`group transition-shadow ${
                        isSelected
                          ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-950 shadow-2xl'
                          : 'hover:ring-1 hover:ring-amber-400/60'
                      }`}
                    >
                      {/* Render Element Visual Preview on Canvas */}
                      {el.type === 'text' && (
                        <div
                          style={{
                            fontSize: `${el.fontSize || 16}px`,
                            fontWeight: el.fontWeight || 'bold',
                            color: el.fontColor || '#ffffff',
                            textAlign: el.textAlign || 'left',
                            fontFamily: el.fontFamily || 'inherit',
                            whiteSpace: 'pre-wrap',
                            overflowWrap: 'break-word',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            lineHeight: 1.2,
                          }}
                        >
                          {el.text || 'Sample Text'}
                        </div>
                      )}

                      {(el.type === 'image' || el.type === 'logo') && (
                        <img
                          src={el.src || 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&auto=format&fit=crop&q=80'}
                          alt="Canvas Image"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            borderRadius: `${el.borderRadius || 0}px`,
                            pointerEvents: 'none',
                          }}
                        />
                      )}

                      {el.type === 'rectangle' && (
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            background: el.fill || 'transparent',
                            border: el.stroke ? `${el.strokeWidth || 2}px solid ${el.stroke}` : 'none',
                            borderRadius: `${el.rx || 0}px`,
                          }}
                        />
                      )}

                      {el.type === 'circle' && (
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            background: el.fill || 'transparent',
                            border: el.stroke ? `${el.strokeWidth || 2}px solid ${el.stroke}` : 'none',
                            borderRadius: '50%',
                          }}
                        />
                      )}

                      {el.type === 'line' && (
                        <div
                          style={{
                            width: '100%',
                            height: `${el.strokeWidth || 3}px`,
                            backgroundColor: el.stroke || '#ffffff',
                          }}
                        />
                      )}

                      {el.type === 'qr' && (
                        <div className="w-full h-full bg-white p-1 rounded-lg flex items-center justify-center pointer-events-none">
                          <QRCodeSVG value={sampleTicket.qrCodeData || sampleTicket.ticketCode} size={100} level="H" className="w-full h-full" />
                        </div>
                      )}

                      {el.type === 'barcode' && (
                        <div className="w-full h-full bg-white p-1.5 rounded-md flex flex-col items-center justify-between text-slate-900 font-mono pointer-events-none">
                          <span className="text-[8px] font-extrabold tracking-wider truncate max-w-full">{sampleTicket.ticketCode}</span>
                          <div className="w-full flex-1 bg-[repeating-linear-gradient(90deg,#000,#000_2px,#fff_2px,#fff_4px)] my-0.5" />
                          <span className="text-[6px] font-bold text-slate-500 uppercase">OFFICIAL BARCODE</span>
                        </div>
                      )}

                      {/* SELECTED STATE CONTROL HANDLES */}
                      {isSelected && !el.isLocked && (
                        <>
                          {/* Corner Resize Handles */}
                          <div
                            onPointerDown={(e) => handlePointerDown(e, el.id, 'resize-nw')}
                            className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nwse-resize shadow-md z-30"
                          />
                          <div
                            onPointerDown={(e) => handlePointerDown(e, el.id, 'resize-ne')}
                            className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nesw-resize shadow-md z-30"
                          />
                          <div
                            onPointerDown={(e) => handlePointerDown(e, el.id, 'resize-sw')}
                            className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nesw-resize shadow-md z-30"
                          />
                          <div
                            onPointerDown={(e) => handlePointerDown(e, el.id, 'resize-se')}
                            className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nwse-resize shadow-md z-30"
                          />

                          {/* Rotation Handle */}
                          <div
                            onPointerDown={(e) => handlePointerDown(e, el.id, 'rotate')}
                            className="absolute -top-7 left-1/2 -translate-x-1/2 w-5 h-5 bg-amber-400 border-2 border-slate-950 rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center text-slate-950 shadow-md z-30"
                            title="Drag to rotate element"
                          >
                            <RotateCw className="w-3 h-3" />
                          </div>

                          {/* Floating Quick Action Bar */}
                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-slate-700/80 rounded-xl p-1 flex items-center gap-1 shadow-2xl z-40 backdrop-blur-md">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                duplicateElement(el.id);
                              }}
                              className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
                              title="Duplicate"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                bringForward(el.id);
                              }}
                              className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
                              title="Bring Forward"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                sendBackward(el.id);
                              }}
                              className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
                              title="Send Backward"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLockElement(el.id);
                              }}
                              className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white"
                              title="Lock Position"
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteElement(el.id);
                              }}
                              className="p-1 rounded-lg hover:bg-red-500/20 text-red-400"
                              title="Delete Element"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT PROPERTIES INSPECTOR PANEL */}
        <aside
          className={`w-80 bg-slate-900/90 border-l border-slate-800/80 flex flex-col shrink-0 z-20 transition-all duration-200 ${
            showRightSidebar ? 'translate-x-0' : 'translate-x-full absolute inset-y-0 right-0'
          } ${isMobile ? 'hidden' : 'flex'}`}
        >
          {/* Header Tabs */}
          <div className="grid grid-cols-3 gap-1 p-2 border-b border-slate-800 bg-slate-950/60">
            {[
              { id: 'inspector' as RightTabCategory, label: 'Inspector' },
              { id: 'styling' as RightTabCategory, label: 'Global' },
              { id: 'params' as RightTabCategory, label: 'Sample' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveRightTab(tab.id)}
                className={`p-2 rounded-xl text-[10px] font-bold uppercase tracking-wider text-center transition-all ${
                  activeRightTab === tab.id
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-5">
            {/* TAB 1: ELEMENT INSPECTOR */}
            {activeRightTab === 'inspector' && (
              <div>
                {selectedElement ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <SlidersHorizontal className="w-4 h-4" /> Edit {selectedElement.type.toUpperCase()}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedElementId(null)}
                        className="text-[10px] text-slate-400 hover:text-white"
                      >
                        Deselect
                      </button>
                    </div>

                    {/* Text Element Properties */}
                    {selectedElement.type === 'text' && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] text-slate-400 font-bold block mb-1 uppercase">Text String</label>
                          <textarea
                            value={selectedElement.text || ''}
                            onChange={(e) =>
                              updateCanvasElements(
                                canvasElements.map((el) => (el.id === selectedElement.id ? { ...el, text: e.target.value } : el))
                              )
                            }
                            rows={2}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-slate-400 font-bold block mb-1 uppercase">Font Size (px)</label>
                            <input
                              type="number"
                              min={8}
                              max={72}
                              value={selectedElement.fontSize || 16}
                              onChange={(e) =>
                                updateCanvasElements(
                                  canvasElements.map((el) =>
                                    el.id === selectedElement.id ? { ...el, fontSize: parseInt(e.target.value) || 12 } : el
                                  )
                                )
                              }
                              className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-400 font-bold block mb-1 uppercase">Color</label>
                            <input
                              type="color"
                              value={selectedElement.fontColor || '#ffffff'}
                              onChange={(e) =>
                                updateCanvasElements(
                                  canvasElements.map((el) => (el.id === selectedElement.id ? { ...el, fontColor: e.target.value } : el))
                                )
                              }
                              className="w-full h-8 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 font-bold block mb-1 uppercase">Font Weight</label>
                          <div className="grid grid-cols-3 gap-1">
                            {['normal', 'bold', '900'].map((w) => (
                              <button
                                key={w}
                                type="button"
                                onClick={() =>
                                  updateCanvasElements(
                                    canvasElements.map((el) => (el.id === selectedElement.id ? { ...el, fontWeight: w } : el))
                                  )
                                }
                                className={`py-1 rounded-lg text-[10px] font-bold border ${
                                  selectedElement.fontWeight === w
                                    ? 'bg-blue-500/20 border-blue-400 text-blue-300'
                                    : 'bg-slate-950 border-slate-800 text-slate-400'
                                }`}
                              >
                                {w === '900' ? 'Black' : w.toUpperCase()}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 font-bold block mb-1 uppercase">Alignment</label>
                          <div className="grid grid-cols-3 gap-1">
                            {[
                              { align: 'left', icon: AlignLeft },
                              { align: 'center', icon: AlignCenter },
                              { align: 'right', icon: AlignRight },
                            ].map((item) => {
                              const Icon = item.icon;
                              return (
                                <button
                                  key={item.align}
                                  type="button"
                                  onClick={() =>
                                    updateCanvasElements(
                                      canvasElements.map((el) =>
                                        el.id === selectedElement.id ? { ...el, textAlign: item.align as any } : el
                                      )
                                    )
                                  }
                                  className={`py-1.5 rounded-lg flex items-center justify-center border ${
                                    selectedElement.textAlign === item.align
                                      ? 'bg-blue-500/20 border-blue-400 text-blue-300'
                                      : 'bg-slate-950 border-slate-800 text-slate-400'
                                  }`}
                                >
                                  <Icon className="w-3.5 h-3.5" />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Image / Logo Properties */}
                    {(selectedElement.type === 'image' || selectedElement.type === 'logo') && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] text-slate-400 font-bold block mb-1 uppercase">Image Source URL</label>
                          <input
                            type="text"
                            value={selectedElement.src || ''}
                            onChange={(e) =>
                              updateCanvasElements(
                                canvasElements.map((el) => (el.id === selectedElement.id ? { ...el, src: e.target.value } : el))
                              )
                            }
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 font-bold block mb-1 uppercase">Border Radius (px)</label>
                          <input
                            type="number"
                            min={0}
                            max={50}
                            value={selectedElement.borderRadius || 0}
                            onChange={(e) =>
                              updateCanvasElements(
                                canvasElements.map((el) =>
                                  el.id === selectedElement.id ? { ...el, borderRadius: parseInt(e.target.value) || 0 } : el
                                )
                              )
                            }
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                          />
                        </div>
                      </div>
                    )}

                    {/* Shape Fill & Stroke Properties */}
                    {(selectedElement.type === 'rectangle' || selectedElement.type === 'circle' || selectedElement.type === 'line') && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          {selectedElement.type !== 'line' && (
                            <div>
                              <label className="text-[10px] text-slate-400 font-bold block mb-1 uppercase">Fill Color</label>
                              <input
                                type="color"
                                value={selectedElement.fill || '#f59e0b'}
                                onChange={(e) =>
                                  updateCanvasElements(
                                    canvasElements.map((el) => (el.id === selectedElement.id ? { ...el, fill: e.target.value } : el))
                                  )
                                }
                                className="w-full h-8 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer"
                              />
                            </div>
                          )}

                          <div>
                            <label className="text-[10px] text-slate-400 font-bold block mb-1 uppercase">Stroke Color</label>
                            <input
                              type="color"
                              value={selectedElement.stroke || '#ffffff'}
                              onChange={(e) =>
                                updateCanvasElements(
                                  canvasElements.map((el) => (el.id === selectedElement.id ? { ...el, stroke: e.target.value } : el))
                                )
                              }
                              className="w-full h-8 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 font-bold block mb-1 uppercase">Stroke Width (px)</label>
                          <input
                            type="number"
                            min={0}
                            max={20}
                            value={selectedElement.strokeWidth || 2}
                            onChange={(e) =>
                              updateCanvasElements(
                                canvasElements.map((el) =>
                                  el.id === selectedElement.id ? { ...el, strokeWidth: parseInt(e.target.value) || 0 } : el
                                )
                              )
                            }
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                          />
                        </div>
                      </div>
                    )}

                    {/* Geometry & Coordinates Inputs */}
                    <div className="pt-3 border-t border-slate-800 space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Position & Dimensions (%)</span>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] text-slate-500 block">X Pos (%)</label>
                          <input
                            type="number"
                            value={selectedElement.x}
                            onChange={(e) =>
                              updateCanvasElements(
                                canvasElements.map((el) =>
                                  el.id === selectedElement.id ? { ...el, x: parseFloat(e.target.value) || 0 } : el
                                )
                              )
                            }
                            className="w-full px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-500 block">Y Pos (%)</label>
                          <input
                            type="number"
                            value={selectedElement.y}
                            onChange={(e) =>
                              updateCanvasElements(
                                canvasElements.map((el) =>
                                  el.id === selectedElement.id ? { ...el, y: parseFloat(e.target.value) || 0 } : el
                                )
                              )
                            }
                            className="w-full px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-500 block">Width (%)</label>
                          <input
                            type="number"
                            value={selectedElement.width}
                            onChange={(e) =>
                              updateCanvasElements(
                                canvasElements.map((el) =>
                                  el.id === selectedElement.id ? { ...el, width: parseFloat(e.target.value) || 5 } : el
                                )
                              )
                            }
                            className="w-full px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-slate-500 block">Height (%)</label>
                          <input
                            type="number"
                            value={selectedElement.height}
                            onChange={(e) =>
                              updateCanvasElements(
                                canvasElements.map((el) =>
                                  el.id === selectedElement.id ? { ...el, height: parseFloat(e.target.value) || 5 } : el
                                )
                              )
                            }
                            className="w-full px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="pt-3 border-t border-slate-800 flex gap-2">
                      <button
                        type="button"
                        onClick={() => duplicateElement(selectedElement.id)}
                        className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center justify-center gap-1"
                      >
                        <Copy className="w-3.5 h-3.5" /> Duplicate
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteElement(selectedElement.id)}
                        className="py-1.5 px-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-xs font-bold text-red-400 flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 space-y-3 text-slate-500">
                    <Move className="w-8 h-8 mx-auto text-slate-600 animate-pulse" />
                    <p className="text-xs font-bold text-slate-400">No Canvas Object Selected</p>
                    <p className="text-[11px] leading-relaxed max-w-[200px] mx-auto">
                      Click any element on the ticket to inspect, resize, move, or change properties.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: GLOBAL STYLING */}
            {activeRightTab === 'styling' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-400 font-bold block">Font Family</label>
                  <select
                    value={customization.fontFamily || theme.fontFamily}
                    onChange={(e) => updateCustomization({ fontFamily: e.target.value as FontFamilyOption })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  >
                    {FONT_OPTIONS.map((f) => (
                      <option key={f} value={f}>
                        {labelize(f)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-400 font-bold block">Primary & Accent Colors</label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[9px] text-slate-400 block mb-1">Primary</label>
                      <input
                        type="color"
                        value={customization.primaryColor || theme.colors.primary}
                        onChange={(e) => updateCustomization({ primaryColor: e.target.value })}
                        className="w-full h-8 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-slate-400 block mb-1">Secondary</label>
                      <input
                        type="color"
                        value={customization.secondaryColor || theme.colors.secondary}
                        onChange={(e) => updateCustomization({ secondaryColor: e.target.value })}
                        className="w-full h-8 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-slate-400 block mb-1">Accent</label>
                      <input
                        type="color"
                        value={customization.accentColor || theme.colors.accent}
                        onChange={(e) => updateCustomization({ accentColor: e.target.value })}
                        className="w-full h-8 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SAMPLE PASS PARAMS */}
            {activeRightTab === 'params' && (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1 uppercase">Event Title</label>
                  <input
                    type="text"
                    value={ticketParams.eventName || ''}
                    onChange={(e) => updateTicketParams({ eventName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 uppercase">Price</label>
                    <input
                      type="number"
                      value={ticketParams.price || 75}
                      onChange={(e) => updateTicketParams({ price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1 uppercase">Currency</label>
                    <select
                      value={ticketParams.currency || 'USD'}
                      onChange={(e) => updateTicketParams({ currency: e.target.value as 'USD' | 'LRD' })}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-bold"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="LRD">LRD (L$)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* MOBILE BOTTOM DOCK NAVBAR (FOR SMALL SCREENS) */}
      <nav className="md:hidden bg-slate-900 border-t border-slate-800 p-2 flex items-center justify-around z-30 shrink-0">
        <button
          type="button"
          onClick={() => {
            setActiveLeftTool('themes');
            setMobileDrawerOpen(true);
          }}
          className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-amber-400"
        >
          <Palette className="w-5 h-5" />
          <span>Themes</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveLeftTool('text');
            setMobileDrawerOpen(true);
          }}
          className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-amber-400"
        >
          <Type className="w-5 h-5" />
          <span>Text</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveLeftTool('elements');
            setMobileDrawerOpen(true);
          }}
          className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-amber-400"
        >
          <Square className="w-5 h-5" />
          <span>Shapes</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveLeftTool('logos');
            setMobileDrawerOpen(true);
          }}
          className="flex flex-col items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-amber-400"
        >
          <ImageIcon className="w-5 h-5" />
          <span>Media</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveRightTab('inspector');
            setMobileDrawerOpen(true);
          }}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
            selectedElement ? 'text-amber-400 animate-pulse' : 'text-slate-400'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Inspector</span>
        </button>
      </nav>

      {/* MOBILE BOTTOM DRAWER SHEET */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed bottom-0 left-0 right-0 max-h-[60vh] bg-slate-900 border-t border-slate-800 rounded-t-3xl z-50 p-4 overflow-y-auto shadow-2xl flex flex-col gap-4 md:hidden"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-heading font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> Designer Studio Tools
              </span>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Render selected mobile tools */}
            {activeLeftTool === 'themes' && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      updateCustomization({ canvasElements: getBlankCanvasElements() });
                      setMobileDrawerOpen(false);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 text-xs font-bold text-white"
                  >
                    Blank Canvas
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateCustomization({ canvasElements: getInitialCanvasElements(ticketParams) });
                      setMobileDrawerOpen(false);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-amber-500/20 text-xs font-bold text-amber-400"
                  >
                    Reset Default
                  </button>
                </div>
              </div>
            )}

            {activeLeftTool === 'text' && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    addCanvasElement('text', { text: 'HEADING TITLE', fontSize: 22, fontWeight: '900' });
                    setMobileDrawerOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white"
                >
                  + Heading Text
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addCanvasElement('text', { text: 'Subheading Label', fontSize: 14 });
                    setMobileDrawerOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-amber-300"
                >
                  + Subheading
                </button>
              </div>
            )}

            {activeLeftTool === 'elements' && (
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    addCanvasElement('rectangle', { fill: '#f59e0b', width: 25, height: 15 });
                    setMobileDrawerOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white text-center"
                >
                  Rectangle
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addCanvasElement('circle', { fill: '#ef4444', width: 16, height: 35 });
                    setMobileDrawerOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white text-center"
                >
                  Circle
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addCanvasElement('line', { stroke: '#f59e0b', strokeWidth: 3 });
                    setMobileDrawerOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white text-center"
                >
                  Line
                </button>
              </div>
            )}

            {activeLeftTool === 'logos' && (
              <div className="space-y-3">
                <label className="p-3 rounded-xl bg-slate-950 border border-dashed border-amber-500/50 flex items-center justify-center gap-2 cursor-pointer text-xs font-bold text-white">
                  <Upload className="w-4 h-4 text-amber-400" /> Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      handleFileUpload(e, 'image');
                      setMobileDrawerOpen(false);
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN PREVIEW MODAL */}
      <AnimatePresence>
        {isPreviewModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-6"
          >
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 max-w-4xl w-full flex flex-col items-center gap-6 shadow-2xl relative">
              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-1">
                <h3 className="text-base sm:text-lg font-heading font-extrabold text-white uppercase tracking-wider">Pass Studio Preview</h3>
                <p className="text-xs text-slate-400">High-resolution print rendering check</p>
              </div>

              <div className="p-4 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center w-full overflow-hidden">
                <TicketRenderer ticket={sampleTicket} />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleExportPng}
                  disabled={exporting !== null}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download PNG
                </button>
                <button
                  type="button"
                  onClick={handleExportPdf}
                  disabled={exporting !== null}
                  className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2"
                >
                  <FileDown className="w-4 h-4" /> Export PDF 300DPI
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
