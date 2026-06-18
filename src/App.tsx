import React, { useState, useRef, useEffect } from "react";
import { toPng } from "html-to-image";
import {
  User,
  Briefcase,
  Image as ImageIcon,
  Download,
  MapPin,
  Calendar,
  Clock,
  RefreshCw,
  FileImage,
  Sparkles,
  Settings,
  Check,
  Info,
  ChevronDown,
  ChevronUp,
  Sliders,
  AlertTriangle
} from "lucide-react";
import { PosterCard } from "./components/PosterCard";
import defaultBgImage from "./Post-Template.png";

export default function App() {
  // --- Form & Poster States ---
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  
  // Attendee profile image raw/uploaded state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(""); // base64 representation for CORS-safety
  const [imageDragActive, setImageDragActive] = useState(false);

  // Template background image state
  const [bgImageUrl, setBgImageUrl] = useState(defaultBgImage);
  const [customBgFile, setCustomBgFile] = useState<File | null>(null);
  const [bgDragActive, setBgDragActive] = useState(false);

  // Advanced / Optional Event configuration (pre-loaded with user's HTML template defaults)
  const [badgeText, setBadgeText] = useState("I am Attending");
  const [title, setTitle] = useState("SpeedUp:");
  const [titleAccent, setTitleAccent] = useState("Academia to Industry");
  const [description, setDescription] = useState(
    "I'm excited to be attending this seminar focused on bridging the gap between theory and the professional world."
  );
  const [eventDate, setEventDate] = useState("22nd of June");
  const [eventTime, setEventTime] = useState("2:00 Pm to 6:00Pm");
  const [venue, setVenue] = useState("National incubation Center karachi - NED University");

  // UI Utilities
  const [isDownloading, setIsDownloading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [corsWarning, setCorsWarning] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.35); // dynamic scale to fit the page

  // Refs for rendering
  const livePreviewRef = useRef<HTMLDivElement>(null);
  const highResContainerRef = useRef<HTMLDivElement>(null);
  const previewParentRef = useRef<HTMLDivElement>(null);

  // Adjust preview scaling dynamically based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (previewParentRef.current) {
        const parentWidth = previewParentRef.current.clientWidth;
        // Adjust padding offset context dynamically based on viewport width
        const sidePadding = window.innerWidth < 640 ? 32 : 48;
        const targetWidth = parentWidth - sidePadding;
        
        // Allow up to 0.65 scale ratio on wide screens and scale perfectly on mobile screens
        const newScale = Math.min(targetWidth / 1080, 0.65);
        setPreviewScale(newScale > 0 ? newScale : 0.15);
      }
    };

    handleResize();
    const timer = setTimeout(handleResize, 150); // safety fallback layout calculation pass
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  // --- Handlers for User Profile Image Upload ---
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, JPEG).");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setImageDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  // --- Handlers for Custom Background Upload ---
  const handleBgFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, JPEG) to use as background.");
      return;
    }
    setCustomBgFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setBgImageUrl(e.target.result as string);
        setCorsWarning(false); // standard uploaded base64 avoids CORS issues completely
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBgDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setBgDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleBgFile(e.dataTransfer.files[0]);
    }
  };

  // Reset all states to initial HTML defaults
  const handleReset = () => {
    setName("");
    setPosition("");
    setImageFile(null);
    setImageUrl("");
    setBgImageUrl(defaultBgImage);
    setCustomBgFile(null);
    setBadgeText("I am Attending");
    setTitle("SpeedUp:");
    setTitleAccent("Academia to Industry");
    setDescription("I'm excited to be attending this seminar focused on bridging the gap between theory and the professional world.");
    setEventDate("22nd of June");
    setEventTime("2:00 Pm to 6:00Pm");
    setVenue("National incubation Center karachi - NED University");
    setDownloadSuccess(false);
  };

  // --- HTML canvas render and Auto-Download ---
  const exportPoster = async () => {
    if (!highResContainerRef.current) return;

    // Validate inputs
    if (!name.trim()) {
      alert("Please enter a name for the poster.");
      return;
    }
    if (!position.trim()) {
      alert("Please enter your position or job title.");
      return;
    }
    if (!imageUrl) {
      alert("Please upload an attendee image to construct your custom card.");
      return;
    }

    try {
      setIsDownloading(true);
      setDownloadSuccess(false);

      // Force highRes content wait to make sure images are fully painted.
      // We render a 1080x1080 pure PNG with zero scale artifacts.
      const dataUrl = await toPng(highResContainerRef.current, {
        width: 1080,
        height: 1080,
        cacheBust: true,
        style: {
          transform: "none",
        },
      });

      // Standard browser download trigger
      const link = document.createElement("a");
      let sanitizedName = name.trim().toLowerCase().replace(/[^a-z0-9]/g, "_");
      link.download = `speedup_attendee_${sanitizedName}.png`;
      link.href = dataUrl;
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (error) {
      console.error("Export process failed:", error);
      // If fails due to CORS, show CORS helper prompt info
      if (bgImageUrl.startsWith("http")) {
        setCorsWarning(true);
      }
      alert(
        "Browser security (CORS) or network policy prevented rendering the remote background image template. Please drag and drop your background template file into the 'Template Customizer' tool below to generate locally!"
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    exportPoster();
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-[#1c1c1e] flex flex-col antialiased selection:bg-[#FB5700]/15 selection:text-[#FB5700]">
      {/* Top Navigation Grid Bar */}
      <header className="border-b border-[#e5e5ea] bg-white sticky top-0 z-40 backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#FB5700] text-white p-2.5 rounded-xl shadow-lg shadow-[#FB5700]/15">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-[#1c1c1e]">SpeedUp Attendee Card Generator</h1>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg text-[#3a3a3c] hover:bg-[#f2f2f7] transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset
            </button>
            {new Date().getTime() > new Date("2026-06-22T23:59:59").getTime() ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-red-100 text-red-800">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></span>
                Expired
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-emerald-100 text-emerald-800">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
                Active
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Left Column - Input Form Details */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-[#e5e5ea] p-4 sm:p-6 shadow-sm flex flex-col gap-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#f2f2f7]">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#1c1c1e] flex items-center gap-2">
                  <User className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[#FB5700]" /> Participant Credentials
                </h2>
                <p className="text-[10px] sm:text-xs text-[#8e8e93] mt-0.5">Fill out your profile details to dynamically update the poster template.</p>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
              {/* Name Input Field */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name-input" className="text-xs font-bold text-[#3a3a3c] uppercase tracking-wider flex items-center gap-1">
                  Name <span className="text-[#e51a24] font-bold">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8e8e93]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="name-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Khuzaima Aurangzeb"
                    className="w-full pl-10 pr-4 py-3 bg-[#f2f2f7]/50 rounded-xl border border-[#e5e5ea] focus:outline-none focus:border-[#FB5700] focus:ring-4 focus:ring-[#FB5700]/10 text-sm font-medium text-[#1c1c1e] transition-all"
                    required
                  />
                </div>
              </div>

              {/* Position Input Field */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="position-input" className="text-xs font-bold text-[#3a3a3c] uppercase tracking-wider flex items-center gap-1">
                  Position / Title / Designation <span className="text-[#e51a24] font-bold">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8e8e93]">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <input
                    id="position-input"
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="Product Designer"
                    className="w-full pl-10 pr-4 py-3 bg-[#f2f2f7]/50 rounded-xl border border-[#e5e5ea] focus:outline-none focus:border-[#FB5700] focus:ring-4 focus:ring-[#FB5700]/10 text-sm font-medium text-[#1c1c1e] transition-all"
                    required
                  />
                </div>
              </div>

              {/* Attendance Picture Upload */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#3a3a3c] uppercase tracking-wider flex items-center gap-1">
                  Upload Attendee Image <span className="text-[#e51a24] font-bold">*</span>
                </label>
                
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setImageDragActive(true);
                  }}
                  onDragLeave={() => setImageDragActive(false)}
                  onDrop={handleImageDrop}
                  className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition ${
                    imageUrl 
                    ? "border-[#FB5700]/40 bg-orange-50/10" 
                    : imageDragActive 
                    ? "border-[#FB5700] bg-orange-50/20" 
                    : "border-[#e5e5ea] hover:border-[#FB5700] bg-[#f2f2f7]/20 hover:bg-[#f2f2f7]/40"
                  }`}
                  onClick={() => document.getElementById("profile-image-upload")?.click()}
                >
                  <input
                    id="profile-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageFile(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />

                  {imageUrl ? (
                    <div className="text-center flex flex-col items-center">
                      <div className="relative mb-2">
                        <img
                          src={imageUrl}
                          alt="Thumbnail preview"
                          className="w-16 h-16 rounded-lg object-cover border-2 border-[#FB5700] shadow-md"
                        />
                        <div className="absolute -top-1.5 -right-1.5 bg-[#FB5700] text-white p-0.5 rounded-full shadow">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <p className="text-xs font-bold text-[#1c1c1e]">{imageFile?.name}</p>
                      <p className="text-[10px] text-[#8e8e93] mt-0.5">Click or drag & drop to change picture</p>
                    </div>
                  ) : (
                    <div className="text-center flex flex-col items-center">
                      <div className="p-3 bg-[#FB5700]/10 rounded-xl mb-2 text-[#FB5700]">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-[#1c1c1e]">Drag and drop your picture here</p>
                      <p className="text-[10px] text-[#8e8e93] mt-1 font-medium">Supports PNG, JPG, GIF up to 10MB</p>
                      <span className="mt-3 px-3.5 py-1.5 bg-[#FB5700] hover:bg-[#FB5700]/95 text-white text-xs font-bold rounded-lg transition shadow-md shadow-[#FB5700]/10">
                        Choose File
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Submission Trigger Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isDownloading}
                  className="w-full bg-[#FB5700] hover:bg-[#FB5700]/95 text-white py-3.5 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#FB5700]/25"
                >
                  {isDownloading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Rendering High-Res Poster...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 flex-shrink-0" />
                      <span className="truncate">Submit and Download</span>
                    </>
                  )}
                </button>
                <p className="text-[10px] text-[#8e8e93] text-center mt-2.5 font-medium leading-relaxed">
                  Generates an instantly download-ready, high-resolution <span className="font-bold text-[#3a3a3c]">1080x1080px</span> poster file. Perfect for sharing directly to LinkedIn, Facebook, and Instagram!
                </p>
              </div>
            </form>
          </div>
        </section>

        {/* Right Column - Live Preview Window */}
        <section className="lg:col-span-7 flex flex-col" ref={previewParentRef}>
          <div className="bg-white rounded-2xl border border-[#e5e5ea] p-4 sm:p-6 shadow-sm flex-1 flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#f2f2f7] gap-2">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-[#1c1c1e] flex items-center gap-2">
                  <Sliders className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[#FB5700]" /> Live Poster Preview
                </h2>
                <p className="text-[10px] sm:text-xs text-[#8e8e93] mt-0.5">Scale adjustable preview. Final downloaded post will be exactly 1080 x 1080 pixels.</p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-[10px] sm:text-[11px] font-bold px-2 py-1 bg-[#f2f2f7] text-[#3a3a3c] rounded-md font-mono">
                  Scale: {Math.round(previewScale * 100)}%
                </span>
              </div>
            </div>

            {/* Alert banner if CORS detected or pending image */}
            {corsWarning && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-[10px] sm:text-xs">
                  <span className="font-bold">Image Domain Capturing Restriction (CORS):</span> Browser sandboxes sometimes block downloading external images. If the background image doesn't print, please download the template background (<a href="https://digicreates.com/wp-content/uploads/2026/06/Post-Template.png" target="_blank" rel="noreferrer" className="underline font-bold text-[#FB5700]">Post-Template.png</a>) locally and drag & drop it in the <span className="font-bold">Template Customizer</span>!
                </div>
              </div>
            )}

            {downloadSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <p className="text-[10px] sm:text-xs font-bold">Awesome! Your attendee poster image has been auto-downloaded successfully.</p>
              </div>
            )}

            {/* Simulated Poster Showcase Stand containing scaled HTML rendering */}
            <div 
              className="flex-1 bg-[#1c1c1e]/5 rounded-xl border border-[#e5e5ea]/50 flex items-center justify-center p-2 sm:p-6 relative overflow-hidden transition-all duration-300"
              style={{ minHeight: `${Math.max(220, 1080 * previewScale + 24)}px` }}
            >
              <div
                style={{
                  width: `${1080 * previewScale}px`,
                  height: `${1080 * previewScale}px`,
                  overflow: "hidden",
                  borderRadius: "16px",
                  boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.45)",
                  backgroundColor: "rgba(30, 20, 20, 0.9)",
                }}
                className="relative select-none"
              >
                {/* Embedded Live PosterCard */}
                <PosterCard
                  name={name}
                  position={position}
                  imageUrl={imageUrl}
                  bgImageUrl={bgImageUrl}
                  badgeText={badgeText}
                  title={title}
                  titleAccent={titleAccent}
                  description={description}
                  eventDate={eventDate}
                  eventTime={eventTime}
                  venue={venue}
                  scale={previewScale}
                />
              </div>

              {/* Watermark badge highlighting dimensional correctness */}
              <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-white/95 backdrop-blur shadow border border-[#e5e5ea] px-2.5 py-1 rounded-full text-[8px] sm:text-[10px] font-bold text-[#3a3a3c] font-mono tracking-wide">
                TARGET OUTPUT: 1080 × 1080 px
              </div>
            </div>

            {/* Quick Helper Tip */}
            <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl flex gap-2.5 sm:gap-3 text-[10px] sm:text-xs text-[#2a2a2c] leading-relaxed">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Pro-tip for attendees:</span> For maximum visual output, pick a high-contrast square-shaped profile image with uniform lighting or transparent background.
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Out-Of-Sight Absolute Element for High-Precision 1080x1080 HTML painting */}
      <div
        style={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          width: "1080px",
          height: "1080px",
          overflow: "hidden",
        }}
      >
        <PosterCard
          ref={highResContainerRef}
          name={name}
          position={position}
          imageUrl={imageUrl}
          bgImageUrl={bgImageUrl}
          badgeText={badgeText}
          title={title}
          titleAccent={titleAccent}
          description={description}
          eventDate={eventDate}
          eventTime={eventTime}
          venue={venue}
          scale={1} // rendered at native resolution for pristine PNG grab
        />
      </div>

      {/* Footer bar */}
      <footer className="border-t border-[#e5e5ea] bg-white py-6 mt-12 text-center text-xs text-[#8e8e93] font-medium">
        <p>© 2026 Attendee Card Generator.</p>
      </footer>
    </div>
  );
}
