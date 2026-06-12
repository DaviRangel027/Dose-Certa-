import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell, Clock, CheckCircle2, ChevronRight, Camera, ScanLine,
  Pill, Calendar, History, Home, X, Edit3, AlertCircle,
  Check, Timer, ArrowLeft, User, Settings, ChevronDown,
  FileText, Zap
} from "lucide-react";

type Screen = "home" | "scanner" | "alarm" | "history";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  color: string;
}

interface HistoryEntry {
  id: string;
  name: string;
  dosage: string;
  takenAt: string;
  date: string;
  prescribedBy: string;
}

const medications: Medication[] = [
  { id: "1", name: "Losartana", dosage: "50 mg", time: "07:00", taken: true, color: "#6B3FA0" },
  { id: "2", name: "Metformina", dosage: "500 mg", time: "12:00", taken: false, color: "#8B5CC8" },
  { id: "3", name: "Atorvastatina", dosage: "20 mg", time: "20:00", taken: false, color: "#4A2970" },
  { id: "4", name: "AAS", dosage: "100 mg", time: "22:00", taken: false, color: "#9B6DD0" },
];

const historyData: HistoryEntry[] = [
  { id: "1", name: "Losartana", dosage: "50 mg", takenAt: "07:03", date: "Hoje", prescribedBy: "Dr. Roberto Alves" },
  { id: "2", name: "Metformina", dosage: "500 mg", takenAt: "12:11", date: "Hoje", prescribedBy: "Dra. Carla Mendes" },
  { id: "3", name: "Atorvastatina", dosage: "20 mg", takenAt: "20:02", date: "Ontem", prescribedBy: "Dr. Roberto Alves" },
  { id: "4", name: "AAS", dosage: "100 mg", takenAt: "22:00", date: "Ontem", prescribedBy: "Dr. Roberto Alves" },
  { id: "5", name: "Losartana", dosage: "50 mg", takenAt: "07:00", date: "11/06/2026", prescribedBy: "Dr. Roberto Alves" },
  { id: "6", name: "Metformina", dosage: "500 mg", takenAt: "12:05", date: "11/06/2026", prescribedBy: "Dra. Carla Mendes" },
  { id: "7", name: "Atorvastatina", dosage: "20 mg", takenAt: "20:18", date: "10/06/2026", prescribedBy: "Dr. Roberto Alves" },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [scanPhase, setScanPhase] = useState<"camera" | "form">("camera");
  const [alarmSnoozed, setAlarmSnoozed] = useState(false);
  const [snoozeTimer, setSnoozeTimer] = useState(0);
  const [formData, setFormData] = useState({
    name: "Metformina",
    dosage: "500 mg",
    posology: "1 comprimido 2x ao dia, com refeições",
    duration: "90 dias (renovar em 11/09/2026)",
  });

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (alarmSnoozed && snoozeTimer > 0) {
      interval = setInterval(() => {
        setSnoozeTimer((t) => {
          if (t <= 1) {
            setAlarmSnoozed(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [alarmSnoozed, snoozeTimer]);

  const handleSnooze = () => {
    setAlarmSnoozed(true);
    setSnoozeTimer(10 * 60);
  };

  const now = new Date();
  const timeStr = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" });

  const takenCount = medications.filter((m) => m.taken).length;

  return (
    <div className="min-h-screen bg-[#F5F3FA] flex items-center justify-center p-4">
      {/* Phone shell */}
      <div
        className="relative w-[390px] h-[844px] bg-[#F5F3FA] rounded-[44px] overflow-hidden shadow-2xl border border-purple-100"
        style={{ boxShadow: "0 30px 80px rgba(107,63,160,0.2), 0 0 0 1px rgba(107,63,160,0.1)" }}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-4 pb-1 bg-transparent">
          <span className="text-[13px] font-bold text-[#1A1030]">{timeStr}</span>
          <div className="flex items-center gap-1">
            <div className="flex gap-[3px] items-end">
              {[3, 5, 7, 9].map((h, i) => (
                <div key={i} className="w-[3px] rounded-sm bg-[#1A1030]" style={{ height: h }} />
              ))}
            </div>
            <div className="w-4 h-3 rounded-sm border-2 border-[#1A1030] relative ml-1">
              <div className="absolute inset-[1px] right-[-1px] w-3/4 bg-[#1A1030] rounded-sm" />
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {screen === "home" && (
            <HomeScreen
              key="home"
              setScreen={setScreen}
              medications={medications}
              takenCount={takenCount}
              dateStr={dateStr}
              setScanPhase={setScanPhase}
            />
          )}
          {screen === "scanner" && (
            <ScannerScreen
              key="scanner"
              setScreen={setScreen}
              scanPhase={scanPhase}
              setScanPhase={setScanPhase}
              formData={formData}
              setFormData={setFormData}
            />
          )}
          {screen === "alarm" && (
            <AlarmScreen
              key="alarm"
              setScreen={setScreen}
              alarmSnoozed={alarmSnoozed}
              snoozeTimer={snoozeTimer}
              onSnooze={handleSnooze}
            />
          )}
          {screen === "history" && (
            <HistoryScreen key="history" setScreen={setScreen} historyData={historyData} />
          )}
        </AnimatePresence>

        {/* Bottom Nav — shown on home and history */}
        {(screen === "home" || screen === "history") && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-purple-100 px-6 pt-3 pb-6">
            <div className="flex justify-around items-center">
              <NavBtn
                icon={<Home size={24} />}
                label="Início"
                active={screen === "home"}
                onClick={() => setScreen("home")}
              />
              <NavBtn
                icon={<Bell size={24} />}
                label="Alarme"
                active={screen === "alarm"}
                onClick={() => setScreen("alarm")}
                badge
              />
              <NavBtn
                icon={<History size={24} />}
                label="Histórico"
                active={screen === "history"}
                onClick={() => setScreen("history")}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function NavBtn({
  icon, label, active, onClick, badge,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 px-4 py-1 relative"
    >
      <div className={active ? "text-[#6B3FA0]" : "text-[#7A6A95]"}>
        {icon}
      </div>
      <span
        className={`text-[12px] font-semibold ${active ? "text-[#6B3FA0]" : "text-[#7A6A95]"}`}
      >
        {label}
      </span>
      {badge && (
        <span className="absolute top-0 right-2 w-2.5 h-2.5 bg-[#F5C518] rounded-full border-2 border-white" />
      )}
    </button>
  );
}

/* ─── HOME SCREEN ─────────────────────────────────────────── */
function HomeScreen({
  setScreen, medications, takenCount, dateStr, setScanPhase,
}: {
  setScreen: (s: Screen) => void;
  medications: Medication[];
  takenCount: number;
  dateStr: string;
  setScanPhase: (p: "camera" | "form") => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-[calc(100%-120px)] overflow-y-auto"
    >
      {/* Header */}
      <div className="px-6 pt-2 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[#7A6A95] text-[14px] capitalize">{dateStr}</p>
            <h1 className="text-[#1A1030] text-[26px] font-black leading-tight">
              Bom dia, Maria! 👋
            </h1>
          </div>
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#6B3FA0] to-[#8B5CC8] flex items-center justify-center shadow-md">
            <User size={20} className="text-white" />
          </div>
        </div>

        {/* Progress card */}
        <div
          className="rounded-2xl p-5 text-white shadow-lg"
          style={{ background: "linear-gradient(135deg, #6B3FA0 0%, #8B5CC8 100%)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-purple-200 text-[13px] font-semibold mb-0.5">Progresso do dia</p>
              <p className="text-[30px] font-black leading-none">
                {takenCount}
                <span className="text-[18px] font-bold text-purple-200">/{medications.length}</span>
              </p>
              <p className="text-purple-200 text-[13px] mt-1">medicamentos tomados</p>
            </div>
            <div className="relative w-16 h-16">
              <svg viewBox="0 0 56 56" className="w-16 h-16 -rotate-90">
                <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
                <circle
                  cx="28" cy="28" r="22"
                  fill="none"
                  stroke="#F5C518"
                  strokeWidth="6"
                  strokeDasharray={`${(takenCount / medications.length) * 138.2} 138.2`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[13px] font-black text-[#F5C518]">
                  {Math.round((takenCount / medications.length) * 100)}%
                </span>
              </div>
            </div>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(takenCount / medications.length) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-[#F5C518] rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Medications list */}
      <div className="px-6 flex-1">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[#1A1030] text-[18px] font-black">Medicamentos de hoje</h2>
          <span className="text-[12px] text-[#7A6A95] font-semibold">12/06/2026</span>
        </div>

        <div className="flex flex-col gap-3 pb-4">
          {medications.map((med, i) => (
            <motion.div
              key={med.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <MedCard med={med} onAlarm={() => setScreen("alarm")} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAB */}
      <motion.button
        whileTap={{ scale: 0.94 }}
        onClick={() => { setScanPhase("camera"); setScreen("scanner"); }}
        className="absolute bottom-[90px] right-5 flex items-center gap-2.5 px-5 py-4 rounded-2xl text-white shadow-xl"
        style={{
          background: "linear-gradient(135deg, #F5C518 0%, #E6B800 100%)",
          boxShadow: "0 8px 24px rgba(245,197,24,0.45)",
        }}
      >
        <ScanLine size={22} className="text-[#1A1030]" />
        <span className="text-[15px] font-black text-[#1A1030]">Escanear Receita</span>
      </motion.button>
    </motion.div>
  );
}

function MedCard({ med, onAlarm }: { med: Medication; onAlarm: () => void }) {
  return (
    <div
      className={`rounded-2xl p-4 flex items-center gap-4 ${med.taken ? "bg-white opacity-70" : "bg-white shadow-sm"}`}
      style={{ border: `1px solid ${med.taken ? "rgba(107,63,160,0.08)" : "rgba(107,63,160,0.15)"}` }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: med.taken ? "#EDE8F7" : `${med.color}18` }}
      >
        <Pill size={22} color={med.taken ? "#7A6A95" : med.color} />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-[16px] font-black truncate"
          style={{ color: med.taken ? "#7A6A95" : "#1A1030" }}
        >
          {med.name}
        </p>
        <p className="text-[#7A6A95] text-[13px] font-semibold">{med.dosage}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          <Clock size={13} className="text-[#7A6A95]" />
          <span className="text-[13px] font-bold text-[#7A6A95]">{med.time}</span>
        </div>
        {med.taken ? (
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 size={18} className="text-green-600" />
          </div>
        ) : (
          <button
            onClick={onAlarm}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "#F5C518" }}
          >
            <Bell size={15} className="text-[#1A1030]" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── SCANNER SCREEN ──────────────────────────────────────── */
function ScannerScreen({
  setScreen, scanPhase, setScanPhase, formData, setFormData,
}: {
  setScreen: (s: Screen) => void;
  scanPhase: "camera" | "form";
  setScanPhase: (p: "camera" | "form") => void;
  formData: { name: string; dosage: string; posology: string; duration: string };
  setFormData: (d: any) => void;
}) {
  const [scanning, setScanning] = useState(false);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanPhase("form");
    }, 2200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-[calc(100%-40px)]"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3">
        <button
          onClick={() => { setScanPhase("camera"); setScreen("home"); }}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-purple-100"
        >
          <ArrowLeft size={20} className="text-[#6B3FA0]" />
        </button>
        <h2 className="text-[#1A1030] text-[20px] font-black">
          {scanPhase === "camera" ? "Escanear Receita" : "Confirmar Dados"}
        </h2>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 px-5 mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-black"
            style={{ background: "#6B3FA0", color: "white" }}
          >
            {scanPhase === "form" ? <Check size={14} /> : "1"}
          </div>
          <span className={`text-[13px] font-bold ${scanPhase === "camera" ? "text-[#6B3FA0]" : "text-[#7A6A95]"}`}>
            Digitalizar
          </span>
        </div>
        <div className="h-[2px] flex-1 rounded" style={{ background: scanPhase === "form" ? "#6B3FA0" : "#EDE8F7" }} />
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-black"
            style={{ background: scanPhase === "form" ? "#6B3FA0" : "#EDE8F7", color: scanPhase === "form" ? "white" : "#7A6A95" }}
          >
            2
          </div>
          <span className={`text-[13px] font-bold ${scanPhase === "form" ? "text-[#6B3FA0]" : "text-[#7A6A95]"}`}>
            Confirmar
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {scanPhase === "camera" ? (
          <motion.div
            key="camera"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col px-5 gap-4"
          >
            {/* Camera viewfinder */}
            <div className="relative flex-1 rounded-3xl overflow-hidden bg-[#1A1030]">
              {/* Simulated camera content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-full h-full opacity-20"
                  style={{
                    background: "repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(107,63,160,0.3) 30px, rgba(107,63,160,0.3) 31px), repeating-linear-gradient(90deg, transparent, transparent 30px, rgba(107,63,160,0.3) 30px, rgba(107,63,160,0.3) 31px)",
                  }}
                />
              </div>

              {/* Scanning overlay */}
              {scanning && (
                <motion.div
                  initial={{ top: "10%" }}
                  animate={{ top: "90%" }}
                  transition={{ duration: 1.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                  className="absolute left-0 right-0 h-[2px] bg-[#F5C518] shadow-[0_0_12px_rgba(245,197,24,0.8)]"
                />
              )}

              {/* Corner guides */}
              <div className="absolute inset-6">
                {["top-left", "top-right", "bottom-left", "bottom-right"].map((pos) => (
                  <div
                    key={pos}
                    className={`absolute w-8 h-8 ${pos.includes("top") ? "top-0" : "bottom-0"} ${pos.includes("left") ? "left-0" : "right-0"}`}
                  >
                    <div
                      className="absolute w-full h-[3px] rounded bg-[#F5C518]"
                      style={{ top: pos.includes("top") ? 0 : "auto", bottom: pos.includes("bottom") ? 0 : "auto" }}
                    />
                    <div
                      className="absolute h-full w-[3px] rounded bg-[#F5C518]"
                      style={{ left: pos.includes("left") ? 0 : "auto", right: pos.includes("right") ? 0 : "auto" }}
                    />
                  </div>
                ))}
              </div>

              {/* Receipt illustration */}
              <div className="absolute inset-8 bg-white/5 rounded-xl border border-white/20 flex flex-col items-center justify-center gap-3 p-6">
                <FileText size={40} className="text-white/30" />
                <div className="space-y-2 w-full">
                  {[90, 70, 80, 60, 75].map((w, i) => (
                    <div key={i} className="h-2 bg-white/15 rounded-full" style={{ width: `${w}%` }} />
                  ))}
                </div>
              </div>

              {/* Flash btn */}
              <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center">
                <Zap size={18} className="text-white" />
              </button>
            </div>

            <p className="text-center text-[14px] text-[#7A6A95] font-semibold px-4">
              Posicione a receita médica dentro da área marcada
            </p>

            {/* Scan button */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleScan}
              disabled={scanning}
              className="w-full py-5 rounded-2xl text-white flex items-center justify-center gap-3 disabled:opacity-70"
              style={{
                background: "linear-gradient(135deg, #6B3FA0 0%, #8B5CC8 100%)",
                boxShadow: "0 8px 24px rgba(107,63,160,0.35)",
              }}
            >
              {scanning ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <ScanLine size={22} />
                  </motion.div>
                  <span className="text-[17px] font-black">Lendo receita...</span>
                </>
              ) : (
                <>
                  <Camera size={22} />
                  <span className="text-[17px] font-black">Escanear Receita</span>
                </>
              )}
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-y-auto px-5 pb-4"
          >
            {/* OCR success banner */}
            <div className="flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-5">
              <CheckCircle2 size={18} className="text-green-600 flex-shrink-0" />
              <p className="text-[13px] font-bold text-green-700">
                Dados extraídos com sucesso! Revise e confirme.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <FormField
                label="Nome do Medicamento"
                value={formData.name}
                onChange={(v) => setFormData({ ...formData, name: v })}
                icon={<Pill size={17} className="text-[#6B3FA0]" />}
              />
              <FormField
                label="Dosagem"
                value={formData.dosage}
                onChange={(v) => setFormData({ ...formData, dosage: v })}
                icon={<AlertCircle size={17} className="text-[#6B3FA0]" />}
              />
              <FormField
                label="Posologia"
                value={formData.posology}
                onChange={(v) => setFormData({ ...formData, posology: v })}
                icon={<Clock size={17} className="text-[#6B3FA0]" />}
                multiline
              />
              <FormField
                label="Tempo de Tratamento"
                value={formData.duration}
                onChange={(v) => setFormData({ ...formData, duration: v })}
                icon={<Calendar size={17} className="text-[#6B3FA0]" />}
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setScreen("home")}
              className="w-full mt-5 py-5 rounded-2xl text-white flex items-center justify-center gap-3"
              style={{
                background: "linear-gradient(135deg, #6B3FA0 0%, #8B5CC8 100%)",
                boxShadow: "0 8px 24px rgba(107,63,160,0.35)",
              }}
            >
              <Check size={22} />
              <span className="text-[18px] font-black">Confirmar Medicamento</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FormField({
  label, value, onChange, icon, multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  multiline?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[#1A1030] text-[15px] font-black flex items-center gap-2">
        {icon}
        {label}
      </label>
      <div className="relative">
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="w-full rounded-xl px-4 py-4 text-[15px] font-semibold text-[#1A1030] resize-none outline-none"
            style={{
              background: "#EDE8F7",
              border: "1.5px solid rgba(107,63,160,0.2)",
              fontFamily: "Nunito, sans-serif",
            }}
          />
        ) : (
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-xl px-4 py-4 text-[15px] font-semibold text-[#1A1030] outline-none"
            style={{
              background: "#EDE8F7",
              border: "1.5px solid rgba(107,63,160,0.2)",
              fontFamily: "Nunito, sans-serif",
            }}
          />
        )}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Edit3 size={15} className="text-[#7A6A95]" />
        </div>
      </div>
    </div>
  );
}

/* ─── ALARM SCREEN ────────────────────────────────────────── */
function AlarmScreen({
  setScreen, alarmSnoozed, snoozeTimer, onSnooze,
}: {
  setScreen: (s: Screen) => void;
  alarmSnoozed: boolean;
  snoozeTimer: number;
  onSnooze: () => void;
}) {
  const [pulse, setPulse] = useState(true);

  const formatSnooze = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col"
      style={{ background: "linear-gradient(160deg, #3B1D6E 0%, #6B3FA0 50%, #8B5CC8 100%)" }}
    >
      {/* Top section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-8">
        {/* Pill icon with pulse */}
        <div className="relative mb-8">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full opacity-30 bg-[#F5C518]"
            style={{ margin: -16 }}
          />
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            className="absolute inset-0 rounded-full opacity-20 bg-[#F5C518]"
            style={{ margin: -8 }}
          />
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ background: "rgba(245,197,24,0.2)", border: "3px solid #F5C518" }}
          >
            <Pill size={44} className="text-[#F5C518]" />
          </div>
        </div>

        <p className="text-white/70 text-[15px] font-bold mb-2 tracking-widest uppercase">
          Hora do Medicamento
        </p>

        <h1 className="text-white text-[36px] font-black text-center leading-tight mb-2">
          Metformina
        </h1>

        <div
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl mb-6"
          style={{ background: "rgba(245,197,24,0.2)", border: "1px solid rgba(245,197,24,0.4)" }}
        >
          <span className="text-[#F5C518] text-[22px] font-black">500 mg</span>
          <span className="text-white/50 text-[15px]">•</span>
          <span className="text-white/80 text-[15px] font-semibold">1 comprimido</span>
        </div>

        {/* Time */}
        <div className="flex items-center gap-3 mb-8">
          <Clock size={20} className="text-white/60" />
          <span className="text-white text-[28px] font-black">12:00</span>
        </div>

        {/* Instruction */}
        <div
          className="flex items-start gap-3 rounded-2xl px-5 py-4 mb-4"
          style={{ background: "rgba(255,255,255,0.1)" }}
        >
          <AlertCircle size={18} className="text-[#F5C518] flex-shrink-0 mt-0.5" />
          <p className="text-white/80 text-[14px] font-semibold leading-relaxed">
            Tomar com alimentação. Evite tomar com o estômago vazio.
          </p>
        </div>

        {/* Snoozed state */}
        {alarmSnoozed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5"
            style={{ background: "rgba(245,197,24,0.15)", border: "1px solid rgba(245,197,24,0.3)" }}
          >
            <Timer size={16} className="text-[#F5C518]" />
            <span className="text-[#F5C518] text-[15px] font-black">
              Adiado — {formatSnooze(snoozeTimer)}
            </span>
          </motion.div>
        )}
      </div>

      {/* Action buttons */}
      <div className="px-6 pb-10 flex flex-col gap-4">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => setScreen("home")}
          className="w-full py-5 rounded-2xl flex items-center justify-center gap-3"
          style={{
            background: "#F5C518",
            boxShadow: "0 12px 32px rgba(245,197,24,0.4)",
          }}
        >
          <Check size={26} className="text-[#1A1030]" />
          <span className="text-[20px] font-black text-[#1A1030]">Tomar Agora</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onSnooze}
          disabled={alarmSnoozed}
          className="w-full py-5 rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50"
          style={{
            background: "rgba(255,255,255,0.12)",
            border: "2px solid rgba(255,255,255,0.25)",
          }}
        >
          <Timer size={24} className="text-white" />
          <span className="text-[18px] font-black text-white">
            {alarmSnoozed ? `Adiado (${formatSnooze(snoozeTimer)})` : "Adiar (10 min)"}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ─── HISTORY SCREEN ──────────────────────────────────────── */
function HistoryScreen({
  setScreen, historyData,
}: {
  setScreen: (s: Screen) => void;
  historyData: HistoryEntry[];
}) {
  const grouped: Record<string, HistoryEntry[]> = {};
  historyData.forEach((entry) => {
    if (!grouped[entry.date]) grouped[entry.date] = [];
    grouped[entry.date].push(entry);
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-[calc(100%-120px)]"
    >
      {/* Header */}
      <div className="px-6 pt-2 pb-4">
        <h1 className="text-[#1A1030] text-[26px] font-black">Histórico</h1>
        <p className="text-[#7A6A95] text-[14px] font-semibold">Registro completo de administração</p>
      </div>

      {/* Summary card */}
      <div className="px-6 mb-4">
        <div
          className="rounded-2xl p-4 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg, #6B3FA0 0%, #8B5CC8 100%)" }}
        >
          <div>
            <p className="text-purple-200 text-[13px] font-semibold">Taxa de adesão</p>
            <p className="text-white text-[28px] font-black">92%</p>
            <p className="text-purple-200 text-[12px]">Últimos 30 dias</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={16} className="text-[#F5C518]" />
              <span className="text-white text-[14px] font-bold">184 tomados</span>
            </div>
            <div className="flex items-center gap-2">
              <X size={16} className="text-white/50" />
              <span className="text-white/60 text-[14px] font-bold">16 perdidos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Export button */}
      <div className="px-6 mb-3">
        <button
          className="w-full py-3 rounded-xl flex items-center justify-center gap-2 border"
          style={{ borderColor: "rgba(107,63,160,0.25)", background: "white" }}
        >
          <FileText size={17} className="text-[#6B3FA0]" />
          <span className="text-[14px] font-bold text-[#6B3FA0]">
            Exportar relatório para médico
          </span>
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        {Object.entries(grouped).map(([date, entries], gi) => (
          <div key={date} className="mb-5">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="px-3 py-1 rounded-full"
                style={{ background: "#EDE8F7" }}
              >
                <span className="text-[12px] font-black text-[#6B3FA0]">{date}</span>
              </div>
              <div className="h-[1px] flex-1 bg-purple-100" />
            </div>

            <div className="flex flex-col gap-3">
              {entries.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: gi * 0.1 + i * 0.05 }}
                  className="bg-white rounded-2xl p-4 flex items-center gap-4"
                  style={{ border: "1px solid rgba(107,63,160,0.1)", boxShadow: "0 2px 8px rgba(107,63,160,0.06)" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "#EDE8F7" }}
                  >
                    <CheckCircle2 size={20} className="text-[#6B3FA0]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-black text-[#1A1030] truncate">{entry.name}</p>
                    <p className="text-[12px] font-semibold text-[#7A6A95]">{entry.dosage}</p>
                    <p className="text-[11px] font-semibold text-[#7A6A95] truncate">{entry.prescribedBy}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full mb-1"
                      style={{ background: "#EDE8F7" }}
                    >
                      <Clock size={11} className="text-[#6B3FA0]" />
                      <span className="text-[12px] font-black text-[#6B3FA0]">{entry.takenAt}</span>
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-[11px] font-bold text-green-600">Tomado</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
