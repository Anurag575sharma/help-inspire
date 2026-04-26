import { BrowserRouter, Routes, Route, useNavigate, useParams, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import CampaignDetail from "./pages/CampaignDetail";
import CreateCampaign from "./pages/CreateCampaign";
import ThankYou from "./pages/ThankYou";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

const LOGO = "https://iskconujjaindonation.com/wp-content/uploads/2023/12/cropped-MEHARUN_NEW-LOGO-ISKCON-1001x1024.png";

const PRABHUPADA_QUOTES = [
  "If you simply give some contribution to spreading this Krishna consciousness movement, you get a permanent credit.",
  "The more you give in Krishna's service, the more you become enriched. That is the spiritual version.",
  "Charity given to a worthy person at the proper time and place, without expectation of return, is considered to be in the mode of goodness.",
  "One who is engaged in devotional service has already attained liberation.",
  "There is no loss or diminution in devotional service. A little effort in this direction can protect one from the greatest danger.",
  "The highest perfection of human life is to remember the Supreme Lord at the end of life.",
  "Service to the devotees of the Lord is more valuable than service to the Lord Himself.",
  "Real happiness is not found in material possessions but in serving Krishna with love and devotion.",
  "By giving Krishna prasadam to others, you are performing the highest welfare activity.",
  "Every living entity is the servant of God. When we forget this, we suffer. When we remember, we are happy.",
];

function PublicNav() {
  const navigate = useNavigate();
  return (
    <>
      <div className="text-[11px] text-center py-1.5 tracking-[0.2em] font-medium text-[#FDF2E9]" style={{ background: "linear-gradient(90deg, #7B241C, #922B21, #7B241C)" }}>
        ✦ Hare Krishna Hare Krishna Krishna Krishna Hare Hare · Hare Rama Hare Rama Rama Rama Hare Hare ✦
      </div>
      <nav className="bg-white/95 backdrop-blur-lg border-b border-[#E8DCCF] sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
          <button onClick={() => navigate("/")} className="flex items-center gap-3 group">
            <img src={LOGO} alt="ISKCON Ujjain" className="h-16 w-16 object-contain group-hover:scale-105 transition-transform rounded-lg" />
            <div className="text-left">
              <span className="text-xl font-serif font-bold text-[#7B241C] block leading-tight tracking-wide">ISKCON Ujjain</span>
              <span className="text-[10px] text-[#D35400] tracking-[0.2em] uppercase font-medium">Ujjain · Serving Humanity Through Devotion</span>
            </div>
          </button>
          <a href="https://centers.iskcondesiretree.com/india/" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-2 text-sm font-medium text-[#D35400] hover:text-[#7B241C] bg-[#FDF2E9] hover:bg-[#FADBD8] px-5 py-2.5 rounded-full transition-all border border-[#E8DCCF]">
            🛕 Find Nearby Centre
          </a>
        </div>
      </nav>
    </>
  );
}

function PublicFooter() {
  const [quoteIndex, setQuoteIndex] = useState(Math.floor(Math.random() * PRABHUPADA_QUOTES.length));
  useEffect(() => {
    const timer = setInterval(() => setQuoteIndex((i) => (i + 1) % PRABHUPADA_QUOTES.length), 10000);
    return () => clearInterval(timer);
  }, []);

  const [showPolicy, setShowPolicy] = useState(null);

  return (
    <>
    <footer className="px-6 py-6 bg-[#FDF2E9] border-t border-[#E8DCCF]">
      <div className="max-w-6xl mx-auto space-y-4">
        <p className="text-center text-[#7B241C] text-base font-serif italic leading-relaxed">
          "{PRABHUPADA_QUOTES[quoteIndex]}"
          <span className="not-italic text-[#D35400]/50 text-sm ml-1">— Srila Prabhupada</span>
        </p>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-[#5D6D7E]/70 pt-2 border-t border-[#E8DCCF]">
          <div className="flex items-center gap-2">
            <img src={LOGO} alt="ISKCON Ujjain" className="h-5 w-5 object-contain" />
            <span className="font-medium">ISKCON Ujjain</span>
          </div>
          <div className="flex items-center gap-3">
            <span>📞 +91 76929 32955</span>
            <span>✉️ iyfcentral@iskconujjain.com</span>
          </div>
        </div>
        <p className="text-center text-[10px] text-[#5D6D7E]/50">
          International Society for Krishna Consciousness (ISKCON) · Ujjain, Madhya Pradesh
        </p>
        <div className="flex justify-center gap-4 text-[11px] text-[#D35400]/70">
          <button onClick={() => setShowPolicy("contact")} className="hover:text-[#7B241C] hover:underline transition-colors">Contact Us</button>
          <span className="text-[#E8DCCF]">|</span>
          <button onClick={() => setShowPolicy("privacy")} className="hover:text-[#7B241C] hover:underline transition-colors">Privacy Policy</button>
          <span className="text-[#E8DCCF]">|</span>
          <button onClick={() => setShowPolicy("terms")} className="hover:text-[#7B241C] hover:underline transition-colors">Terms & Conditions</button>
          <span className="text-[#E8DCCF]">|</span>
          <button onClick={() => setShowPolicy("cancellation")} className="hover:text-[#7B241C] hover:underline transition-colors">Cancellation & Refund</button>
        </div>
      </div>
    </footer>

    {showPolicy && (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setShowPolicy(null)}>
        <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6 animate-fade-up" onClick={(e) => e.stopPropagation()}>
          {showPolicy === "contact" && (
            <>
              <h2 className="text-xl font-serif font-bold text-[#7B241C] mb-4">Contact Us</h2>
              <div className="space-y-3 text-sm text-[#5D6D7E]">
                <p><strong className="text-[#17202A]">Organization:</strong> International Society for Krishna Consciousness (ISKCON), Ujjain</p>
                <p><strong className="text-[#17202A]">Address:</strong> ISKCON Temple, Ujjain, Madhya Pradesh, India</p>
                <p><strong className="text-[#17202A]">Email:</strong> <a href="mailto:iyfcentral@iskconujjain.com" className="text-[#D35400] hover:underline">iyfcentral@iskconujjain.com</a></p>
                <p><strong className="text-[#17202A]">Phone:</strong> +91 76929 32955</p>
                <p><strong className="text-[#17202A]">Website:</strong> <a href="https://iskconujjain.com" target="_blank" rel="noopener noreferrer" className="text-[#D35400] hover:underline">iskconujjain.com</a></p>
                <p className="text-xs text-[#5D6D7E]/60 pt-2">For any queries regarding donations, campaigns, or receipts, please reach out via email or phone during office hours (9 AM – 6 PM IST).</p>
              </div>
            </>
          )}
          {showPolicy === "privacy" && (
            <>
              <h2 className="text-xl font-serif font-bold text-[#7B241C] mb-4">Privacy Policy</h2>
              <div className="space-y-3 text-sm text-[#5D6D7E] leading-relaxed">
                <p>ISKCON Ujjain respects your privacy and is committed to protecting your personal information.</p>
                <p><strong className="text-[#17202A]">Information We Collect:</strong> When you make a donation, we collect your name, email address (optional), and donation amount. Payment details are processed securely by our payment gateway (Cashfree) and are not stored on our servers.</p>
                <p><strong className="text-[#17202A]">How We Use Your Information:</strong> Your information is used solely to process donations, send donation receipts, display donor recognition (unless you choose anonymous), and communicate about campaigns you have supported.</p>
                <p><strong className="text-[#17202A]">Data Security:</strong> We implement industry-standard security measures including HTTPS encryption, input sanitization, and secure payment processing to protect your data.</p>
                <p><strong className="text-[#17202A]">Third-Party Services:</strong> We use Cashfree for payment processing, Cloudinary for image hosting, and Gmail SMTP for email receipts. These services have their own privacy policies.</p>
                <p><strong className="text-[#17202A]">Data Retention:</strong> Donation records are retained for tax compliance and accounting purposes. You may request deletion of your personal data by contacting us at iyfcentral@iskconujjain.com.</p>
                <p><strong className="text-[#17202A]">Cookies:</strong> This website does not use tracking cookies. Only essential cookies required for website functionality may be used.</p>
              </div>
            </>
          )}
          {showPolicy === "terms" && (
            <>
              <h2 className="text-xl font-serif font-bold text-[#7B241C] mb-4">Terms & Conditions</h2>
              <div className="space-y-3 text-sm text-[#5D6D7E] leading-relaxed">
                <p>By using this donation platform, you agree to the following terms:</p>
                <p><strong className="text-[#17202A]">Donations:</strong> All donations are voluntary and made at the donor's discretion. Donations are used for the spiritual and social programs of ISKCON Ujjain as described in the respective campaign.</p>
                <p><strong className="text-[#17202A]">Payment Processing:</strong> Payments are processed securely through Cashfree Payments or via UPI/QR code. By making a payment, you agree to Cashfree's terms of service.</p>
                <p><strong className="text-[#17202A]">Tax Benefits:</strong> Donations to ISKCON may be eligible for tax exemption under Section 80G of the Income Tax Act. Please consult your tax advisor for specific guidance. 80G receipts are provided upon request.</p>
                <p><strong className="text-[#17202A]">Anonymous Donations:</strong> If you choose to donate anonymously, your name will not be displayed publicly. However, your donation record is maintained internally for accounting purposes.</p>
                <p><strong className="text-[#17202A]">Accuracy:</strong> While we strive to keep campaign information accurate and up-to-date, ISKCON Ujjain reserves the right to modify campaign details, targets, and descriptions as needed.</p>
                <p><strong className="text-[#17202A]">Liability:</strong> ISKCON Ujjain is not liable for any technical issues, payment failures, or service interruptions caused by third-party services. In case of payment deduction without confirmation, refunds will be processed automatically.</p>
              </div>
            </>
          )}
          {showPolicy === "cancellation" && (
            <>
              <h2 className="text-xl font-serif font-bold text-[#7B241C] mb-4">Cancellation & Refund Policy</h2>
              <div className="space-y-3 text-sm text-[#5D6D7E] leading-relaxed">
                <p><strong className="text-[#17202A]">Donation Nature:</strong> Donations made through this platform are considered as voluntary contributions to ISKCON Ujjain's charitable activities. Once a donation is successfully processed, it is generally non-refundable.</p>
                <p><strong className="text-[#17202A]">Refund Eligibility:</strong> Refunds may be considered in the following cases:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Duplicate payment due to technical error</li>
                  <li>Incorrect amount charged due to system malfunction</li>
                  <li>Payment deducted but donation not recorded in our system</li>
                </ul>
                <p><strong className="text-[#17202A]">Refund Process:</strong> To request a refund, please email iyfcentral@iskconujjain.com with your payment details (order ID, amount, date) within 7 days of the transaction. Refund requests will be reviewed within 5-7 business days.</p>
                <p><strong className="text-[#17202A]">Refund Timeline:</strong> Approved refunds will be processed within 7-10 business days and credited back to the original payment method.</p>
                <p><strong className="text-[#17202A]">Cancellation:</strong> Once a payment is initiated through the payment gateway, it cannot be cancelled mid-transaction. If the payment fails, no amount will be deducted.</p>
                <p><strong className="text-[#17202A]">UPI/QR Donations:</strong> For donations made via UPI/QR code, refund requests must include the payment screenshot and transaction reference number.</p>
              </div>
            </>
          )}
          <button onClick={() => setShowPolicy(null)} className="mt-5 w-full py-2.5 text-[#D35400] font-semibold rounded-xl border-2 border-[#E8DCCF] hover:bg-[#FDF2E9] transition-all text-sm">
            Close
          </button>
        </div>
      </div>
    )}
    </>
  );
}

function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FAF6F0" }}>
      <PublicNav />
      <div className="flex-1 max-w-6xl mx-auto px-6 py-8 w-full"><Home onSelect={(id) => navigate(`/campaign/${id}`)} /></div>
      <PublicFooter />
    </div>
  );
}

function CampaignPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FAF6F0" }}>
      <PublicNav />
      <div className="flex-1 max-w-6xl mx-auto px-6 py-8 w-full"><CampaignDetail id={id} onBack={() => navigate("/")} /></div>
      <PublicFooter />
    </div>
  );
}

function AdminPage() {
  const navigate = useNavigate();
  const { pathname } = window.location;
  useEffect(() => { if (pathname !== "/admin") navigate("/admin", { replace: true }); }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FAF6F0" }}>
      <nav className="bg-white/95 backdrop-blur-lg border-b border-[#E8DCCF] sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
          <button onClick={() => navigate("/admin")} className="flex items-center gap-3">
            <img src={LOGO} alt="ISKCON Ujjain" className="h-12 w-12 object-contain rounded-lg" />
            <span className="text-lg font-serif font-bold text-[#7B241C]">Admin Panel</span>
          </button>
          <button onClick={() => navigate("/")} className="text-[#D35400] text-sm font-medium hover:text-[#7B241C] transition-colors">← Back to site</button>
        </div>
      </nav>
      <div className="flex-1 max-w-6xl mx-auto px-6 py-10 w-full"><CreateCampaign onCreated={() => {}} /></div>
    </div>
  );
}

function ThankYouPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#FAF6F0" }}>
      <PublicNav />
      <div className="flex-1 max-w-6xl mx-auto px-6 py-8 w-full"><ThankYou /></div>
      <PublicFooter />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/campaign/:id" element={<CampaignPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
