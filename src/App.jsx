import React, { useState, useEffect, useRef } from "react";
import { 
  Users, Building2, TrendingUp, Search, LogOut, Plus, Trash2, 
  Download, Eye, Music, Upload, RotateCcw, Play, Pause, 
  FileDown, ShieldAlert, UserCheck, Sparkles, Sun, Moon 
} from "lucide-react";
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar,
  PieChart, Pie, Cell, Tooltip, Legend, BarChart, CartesianGrid,
  XAxis, YAxis, Bar, AreaChart, Area
} from "recharts";
import { API_BASE_URL } from "./config";
import { calculateAllResults } from "./lib/scoring";
import { generateDeepReport } from "./lib/pdfReport";
import jsPDF from "jspdf";

const COLORS = ["#8B5CF6", "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#06B6D4", "#EC4899", "#6366F1"];

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem("perfy_admin_theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("perfy_admin_theme", theme);
  }, [theme]);

  // Auth state
  const [token, setToken] = useState(() => localStorage.getItem("perfy_admin_token") || "");
  const [adminUser, setAdminUser] = useState(() => {
    const stored = localStorage.getItem("perfy_admin_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  // Dashboard Data State
  const [users, setUsers] = useState([]);
  const [results, setResults] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  // Payments & Discount Codes administrative state
  const [upiConfig, setUpiConfig] = useState({ upiId: "" });
  const [adminUpiInput, setAdminUpiInput] = useState("");
  const [discountCodes, setDiscountCodes] = useState([]);
  const [newDiscountCode, setNewDiscountCode] = useState("");
  const [pendingPayments, setPendingPayments] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null); // Review modal
  const [submittingUpi, setSubmittingUpi] = useState(false);
  const [generatingCode, setGeneratingCode] = useState(false);

  // UI Navigation
  const [activeTab, setActiveTab] = useState("analytics");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");

  // Selected User for detail modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserResults, setSelectedUserResults] = useState(null);

  // Add Company Modal state
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyCode, setNewCompanyCode] = useState("");
  const [newCompanyIndustry, setNewCompanyIndustry] = useState("");
  const [newCompanyLocation, setNewCompanyLocation] = useState("");
  const [companyError, setCompanyError] = useState("");



  // Sync token with headers
  const getHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  });

  const labelColor = theme === 'dark' ? '#9ca3af' : '#475569';
  const gridColor = theme === 'dark' ? '#374151' : '#e2e8f0';

  // Handle server login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Invalid credentials");
      }

      const data = await res.json();
      
      if (data.user.role !== "admin") {
        throw new Error("Access denied. Admin rights required.");
      }

      localStorage.setItem("perfy_admin_token", data.token);
      localStorage.setItem("perfy_admin_user", JSON.stringify(data.user));
      setToken(data.token);
      setAdminUser(data.user);
    } catch (err) {
      setLoginError(err.message || "Login failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("perfy_admin_token");
    localStorage.removeItem("perfy_admin_user");
    setToken("");
    setAdminUser(null);
    setUsers([]);
    setResults([]);
    setCompanies([]);
    setAnalytics(null);
    setUpiConfig({ upiId: "" });
    setAdminUpiInput("");
    setDiscountCodes([]);
    setPendingPayments([]);
    setFeedbacks([]);
    setSelectedPayment(null);
  };

  // Fetch all backend data
  const fetchData = async () => {
    if (!token) return;
    try {
      const [usersRes, resultsRes, companiesRes, upiRes, discountsRes, pendingRes, feedbacksRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/users`, { headers: getHeaders() }),
        fetch(`${API_BASE_URL}/admin/results`, { headers: getHeaders() }),
        fetch(`${API_BASE_URL}/admin/companies`, { headers: getHeaders() }),
        fetch(`${API_BASE_URL}/admin/upi-config`, { headers: getHeaders() }),
        fetch(`${API_BASE_URL}/admin/discount-codes`, { headers: getHeaders() }),
        fetch(`${API_BASE_URL}/admin/pending-payments`, { headers: getHeaders() }),
        fetch(`${API_BASE_URL}/admin/feedbacks`, { headers: getHeaders() })
      ]);

      if (!usersRes.ok || !resultsRes.ok || !companiesRes.ok || !upiRes.ok || !discountsRes.ok || !pendingRes.ok || !feedbacksRes.ok) {
        if (usersRes.status === 401 || resultsRes.status === 401) {
          handleLogout();
          return;
        }
        throw new Error("Failed to fetch administrative data.");
      }

      const usersData = await usersRes.json();
      const resultsData = await resultsRes.json();
      const companiesData = await companiesRes.json();
      const upiData = await upiRes.json();
      const discountsData = await discountsRes.json();
      const pendingData = await pendingRes.json();
      const feedbacksData = await feedbacksRes.json();

      setUsers(usersData);
      setResults(resultsData);
      setCompanies(companiesData);
      setUpiConfig(upiData);
      setAdminUpiInput(upiData.upiId || "");
      setDiscountCodes(discountsData);
      setPendingPayments(pendingData);
      setFeedbacks(feedbacksData);

      calculateAnalytics(usersData, resultsData);
    } catch (err) {
      console.error("Data Fetch Error:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  // Calculate analytics dashboard metrics
  const calculateAnalytics = (allUsers, allResults) => {
    let totalUsers = allUsers.length;
    let completedCount = allResults.length;
    let students = allUsers.filter(u => u.role === "student").length;
    let employees = allUsers.filter(u => u.role === "employee").length;

    let totalIQ = 0, totalEQ = 0, totalAQ = 0, totalCQ = 0;
    const mbtiDist = {};
    const careerTrends = {};
    const discDist = { D: 0, I: 0, S: 0, C: 0 };
    const companyStats = {};
    const learningDist = {};

    // Build assessment results mapping by email for quick lookup
    const resultsMap = {};
    allResults.forEach(r => {
      resultsMap[r.email] = r;
    });

    allUsers.forEach(u => {
      // Track company employee counts
      if (u.companyCode) {
        const code = u.companyCode.toUpperCase();
        if (!companyStats[code]) {
          companyStats[code] = { count: 0, completed: 0, totalIQ: 0, totalEQ: 0 };
        }
        companyStats[code].count++;
      }

      const userResult = resultsMap[u.email];
      if (!userResult) return;

      if (u.companyCode) {
        const code = u.companyCode.toUpperCase();
        companyStats[code].completed++;
      }

      try {
        const calc = calculateAllResults(userResult.responses, u.role === "employee");
        
        totalIQ += calc.quotients.IQ;
        totalEQ += calc.quotients.EQ;
        totalAQ += calc.quotients.AQ;
        totalCQ += calc.quotients.CQ;

        // MBTI
        mbtiDist[calc.mbti.type] = (mbtiDist[calc.mbti.type] || 0) + 1;

        // Career Top RIASEC
        calc.career.top2.forEach(c => {
          careerTrends[c] = (careerTrends[c] || 0) + 1;
        });

        // DISC Bird
        const discType = calc.disc.bird === "Eagle" ? "D" : calc.disc.bird === "Parrot" ? "I" : calc.disc.bird === "Dove" ? "S" : "C";
        discDist[discType]++;

        // Learning Styles
        learningDist[calc.learningStyle.dominant] = (learningDist[calc.learningStyle.dominant] || 0) + 1;

        if (u.companyCode) {
          const code = u.companyCode.toUpperCase();
          companyStats[code].totalIQ += calc.quotients.IQ;
          companyStats[code].totalEQ += calc.quotients.EQ;
        }
      } catch (err) {
        console.error("Scoring error for user:", u.email, err);
      }
    });

    setAnalytics({
      totalUsers,
      completed: completedCount,
      students,
      employees,
      avgIQ: completedCount ? Math.round(totalIQ / completedCount) : 0,
      avgEQ: completedCount ? Math.round(totalEQ / completedCount) : 0,
      avgAQ: completedCount ? Math.round(totalAQ / completedCount) : 0,
      avgCQ: completedCount ? Math.round(totalCQ / completedCount) : 0,
      mbtiDist,
      careerTrends,
      discDist,
      learningDist,
      companyStats
    });
  };

  // Add Company CRUD
  const handleAddCompany = async (e) => {
    e.preventDefault();
    setCompanyError("");

    if (!newCompanyName || !newCompanyCode) {
      setCompanyError("Company Name and Code are required.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/admin/companies`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          name: newCompanyName,
          code: newCompanyCode.toUpperCase(),
          industry: newCompanyIndustry,
          location: newCompanyLocation
        })
      });

      if (!res.ok) {
        throw new Error("Failed to create company on server.");
      }

      setNewCompanyName("");
      setNewCompanyCode("");
      setNewCompanyIndustry("");
      setNewCompanyLocation("");
      setShowAddCompany(false);
      
      // Refresh
      fetchData();
    } catch (err) {
      setCompanyError(err.message || "Failed to create company.");
    }
  };

  // Delete Company CRUD
  const handleDeleteCompany = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/admin/companies/${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });

      if (!res.ok) {
        throw new Error("Failed to delete company on server.");
      }

      fetchData();
    } catch (err) {
      alert(err.message || "Failed to delete company.");
    }
  };

  // Save UPI Config Settings
  const handleSaveUpi = async (e) => {
    e.preventDefault();
    if (!adminUpiInput.trim()) {
      alert("UPI ID cannot be blank.");
      return;
    }
    setSubmittingUpi(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/upi-config`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ upiId: adminUpiInput })
      });
      if (!res.ok) throw new Error("Failed to save UPI settings.");
      alert("UPI Configuration saved successfully! ✅");
      fetchData();
    } catch (err) {
      alert(err.message || "Failed to save UPI ID.");
    } finally {
      setSubmittingUpi(false);
    }
  };

  // Generate a random unique discount code
  const handleAutoGenerateDiscountCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "PERFY-";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewDiscountCode(code);
  };

  // Save new discount code
  const handleCreateDiscountCode = async (e) => {
    e.preventDefault();
    if (!newDiscountCode.trim()) {
      alert("Discount code cannot be blank.");
      return;
    }
    setGeneratingCode(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/discount-codes`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ code: newDiscountCode })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create discount code.");
      alert("Discount code created successfully! 🎫");
      setNewDiscountCode("");
      fetchData();
    } catch (err) {
      alert(err.message || "Failed to create discount code.");
    } finally {
      setGeneratingCode(false);
    }
  };

  // Delete an active discount code
  const handleDeleteDiscountCode = async (code) => {
    if (!window.confirm(`Are you sure you want to delete the code ${code}?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/discount-codes/${code}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      if (!res.ok) throw new Error("Failed to delete discount code.");
      fetchData();
    } catch (err) {
      alert(err.message || "Failed to delete discount code.");
    }
  };

  // Approve pending verification and unlock user report
  const handleApprovePayment = async (email) => {
    if (!window.confirm(`Approve payment for ${email} and unlock their report?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/approve-payment`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ email })
      });
      if (!res.ok) throw new Error("Failed to approve payment.");
      alert("Payment approved successfully! Report is now unlocked. ✅");
      setSelectedPayment(null);
      fetchData();
    } catch (err) {
      alert(err.message || "Failed to approve payment.");
    }
  };

  // Reject pending verification screenshot
  const handleRejectPayment = async (email) => {
    const reason = window.confirm(`Reject payment and screenshot upload for ${email}? This will prompt the user to pay/upload again.`);
    if (!reason) return;
    try {
      const res = await fetch(`${API_BASE_URL}/admin/reject-payment`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ email })
      });
      if (!res.ok) throw new Error("Failed to reject payment.");
      alert("Payment transaction rejected. ❌");
      setSelectedPayment(null);
      fetchData();
    } catch (err) {
      alert(err.message || "Failed to reject payment.");
    }
  };

  // Handle detailed user report rendering
  const handleViewUserReport = (targetUser) => {
    const userResult = results.find(r => r.email === targetUser.email);
    if (!userResult) {
      alert("Assessment responses not found for this user.");
      return;
    }
    try {
      const calc = calculateAllResults(userResult.responses, targetUser.role === "employee");
      setSelectedUser(targetUser);
      setSelectedUserResults(calc);
    } catch (err) {
      alert("Error scoring user's assessment.");
    }
  };

  // Dynamically compile and trigger 20-page Detailed PDF report download
  const handleDownloadUserPDF = (targetUser) => {
    const userResult = results.find(r => r.email === targetUser.email);
    if (!userResult) {
      alert("Responses not found for this user.");
      return;
    }
    try {
      const calc = calculateAllResults(userResult.responses, targetUser.role === "employee");
      // Add missing school/company fields if exist
      const fullUser = {
        ...targetUser,
        companyName: getCompanyName(targetUser.companyCode),
        school: targetUser.school || ""
      };
      
      generateDeepReport(fullUser, calc);
    } catch (err) {
      console.error(err);
      alert("Error generating user's detailed PDF report.");
    }
  };

  // Export Users to CSV
  const handleExportCSV = () => {
    const headers = "Name,Email,Role,Phone,Company Code,Company Name,Department,School,Status,IQ,EQ,AQ,CQ,DISC,MBTI,RIASEC1,RIASEC2\n";
    
    const resultsMap = {};
    results.forEach(r => { resultsMap[r.email] = r; });

    const rows = filteredUsers().map(u => {
      const userResult = resultsMap[u.email];
      const completed = !!userResult;
      let disc = "", mbti = "", iq = "", eq = "", aq = "", cq = "", c1 = "", c2 = "";
      
      if (completed) {
        try {
          const calc = calculateAllResults(userResult.responses, u.role === "employee");
          disc = calc.disc.dominant;
          mbti = calc.mbti.type;
          iq = `${calc.quotients.IQ}`;
          eq = `${calc.quotients.EQ}`;
          aq = `${calc.quotients.AQ}`;
          cq = `${calc.quotients.CQ}`;
          c1 = calc.career.top2[0] || "";
          c2 = calc.career.top2[1] || "";
        } catch (e) {}
      }

      return `"${u.name}","${u.email}","${u.role}","${u.phone || ""}","${u.companyCode || ""}","${getCompanyName(u.companyCode)}","${u.department || ""}","${u.school || ""}","${completed ? "Completed" : "Pending"}","${iq}","${eq}","${aq}","${cq}","${disc}","${mbti}","${c1}","${c2}"`;
    }).join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Perfy_Users_Export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  // Export Company Summary PDF
  const handleExportCompanyReport = (code) => {
    const company = companies.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (!company) return;

    const companyUsers = users.filter(u => u.companyCode && u.companyCode.toUpperCase() === code.toUpperCase());
    const doc = new jsPDF();
    const pw = doc.internal.pageSize.getWidth();

    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, pw, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text(`${company.name} — Company Summary`, pw / 2, 16, { align: "center" });
    doc.setFontSize(11);
    doc.text(`Code: ${company.code} • ${company.industry || "General"} • ${company.location || "Online"}`, pw / 2, 26, { align: "center" });
    doc.text(`Generated: ${new Date().toLocaleDateString()} • Total Employees: ${companyUsers.length}`, pw / 2, 34, { align: "center" });

    doc.setTextColor(0, 0, 0);
    let y = 55;

    const resultsMap = {};
    results.forEach(r => { resultsMap[r.email] = r; });

    companyUsers.forEach((u, idx) => {
      const userResult = resultsMap[u.email];
      const completed = !!userResult;

      if (y > 260) { doc.addPage(); y = 20; }
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`${idx + 1}. ${u.name}`, 20, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      y += 7;
      doc.text(`Email: ${u.email} • Dept: ${u.department || "N/A"} • Status: ${completed ? "Completed" : "Pending"}`, 25, y);
      y += 6;
      
      if (completed) {
        try {
          const calc = calculateAllResults(userResult.responses, true);
          doc.text(`DISC: ${calc.disc.dominant} | MBTI: ${calc.mbti.type} | IQ: ${calc.quotients.IQ}% | EQ: ${calc.quotients.EQ}%`, 25, y);
          y += 6;
          doc.text(`Career RIASEC: ${calc.career.top2.join(", ")} | Learning Style: ${calc.learningStyle.dominant}`, 25, y);
          y += 6;
        } catch (e) {}
      }
      y += 6;
    });

    doc.save(`${company.name.replace(/\s+/g, "_")}_Company_Report.pdf`);
  };



  // Helpers
  const getCompanyName = (code) => {
    if (!code) return "—";
    const comp = companies.find(c => c.code.toUpperCase() === code.toUpperCase());
    return comp ? comp.name : code;
  };

  const filteredUsers = () => {
    return users.filter(u => {
      // Role Filter
      if (roleFilter !== "all" && u.role !== roleFilter) return false;

      // Company Filter
      if (companyFilter !== "all") {
        if (!u.companyCode || u.companyCode.toUpperCase() !== companyFilter.toUpperCase()) return false;
      }

      // Search Query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = u.name.toLowerCase().includes(query);
        const matchesEmail = u.email.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail) return false;
      }

      return true;
    });
  };

  // Login View
  if (!token) {
    return (
      <div className="modal-overlay" style={{ background: "var(--bg-base)", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ position: "absolute", top: "20px", right: "20px" }}>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="btn btn-secondary btn-icon" title="Toggle Theme" style={{ background: "rgba(255, 255, 255, 0.05)" }}>
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
        <div className="glass-panel fade-in" style={{ padding: "40px", width: "100%", maxWidth: "450px", textAlign: "center" }}>
          <div className="gradient-text" style={{ fontSize: "3rem", fontWeight: "800", fontFamily: "var(--font-display)", marginBottom: "8px" }}>
            PERFY
          </div>
          <p className="form-label" style={{ fontSize: "1rem", color: "var(--text-secondary)", marginBottom: "30px" }}>
            Administrative Control Panel
          </p>

          {loginError && (
            <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "10px", padding: "12px", color: "#f87171", fontSize: "0.85rem", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px", textAlign: "left" }}>
            <div className="form-group">
              <label className="form-label">Admin Email</label>
              <input
                type="email"
                required
                className="form-input"
                placeholder="admin@perfy.com"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                className="form-input"
                placeholder="••••••••"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", marginTop: "10px" }}>
              {loading ? "Authenticating..." : "Sign In to Admin Portal"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard calculations for charts
  const getQuotientData = () => {
    if (!analytics) return [];
    return [
      { subject: "IQ (Intellectual)", value: analytics.avgIQ },
      { subject: "EQ (Emotional)", value: analytics.avgEQ },
      { subject: "AQ (Adversity)", value: analytics.avgAQ },
      { subject: "CQ (Creative)", value: analytics.avgCQ }
    ];
  };

  const getDISCData = () => {
    if (!analytics) return [];
    return [
      { name: "Dominant (Eagle)", value: analytics.discDist.D },
      { name: "Influential (Parrot)", value: analytics.discDist.I },
      { name: "Steady (Dove)", value: analytics.discDist.S },
      { name: "Compliant (Owl)", value: analytics.discDist.C }
    ];
  };

  const getMBTIBarData = () => {
    if (!analytics) return [];
    return Object.entries(analytics.mbtiDist).map(([mbti, count]) => ({
      name: mbti,
      count
    }));
  };

  const getRIASECAreaData = () => {
    if (!analytics) return [];
    return Object.entries(analytics.careerTrends).map(([domain, value]) => ({
      name: domain,
      value
    }));
  };

  const getLearningStyleData = () => {
    if (!analytics) return [];
    return Object.entries(analytics.learningDist).map(([style, count]) => ({
      name: style,
      value: count
    }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Top Banner Header */}
      <header className="glass-panel admin-header" style={{ borderRadius: "0 0 16px 16px", borderTop: "none", borderLeft: "none", borderRight: "none", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: "0", zIndex: "500", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className="gradient-text" style={{ fontSize: "2rem", fontWeight: "800", fontFamily: "var(--font-display)" }}>
            PERFY
          </div>
          <div style={{ height: "24px", width: "1px", background: "var(--border)" }}></div>
          <div>
            <h1 style={{ fontSize: "1.1rem", fontWeight: "700" }}>Admin Portal</h1>
            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>From Effort to Impact</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginLeft: "auto" }}>
          <div className="admin-info" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: "600" }}>Perfy Administrator</span>
            <span style={{ fontSize: "0.75rem", color: "var(--primary)" }}>{adminUser?.email}</span>
          </div>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="btn btn-secondary btn-icon" title="Toggle Theme" style={{ background: "rgba(255, 255, 255, 0.05)" }}>
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={handleLogout} className="btn btn-secondary btn-icon" title="Logout">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main style={{ flex: "1", width: "100%", maxWidth: "1280px", margin: "24px auto", padding: "0 24px", display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Navigation Tabs */}
        <div className="glass-panel tabs-container">
          <button onClick={() => setActiveTab("analytics")} className={`tab-trigger ${activeTab === "analytics" ? "active" : ""}`}>
            <TrendingUp className="w-4 h-4" /> Dashboard Analytics
          </button>
          <button onClick={() => setActiveTab("users")} className={`tab-trigger ${activeTab === "users" ? "active" : ""}`}>
            <Users className="w-4 h-4" /> Registered Users
          </button>
          <button onClick={() => setActiveTab("companies")} className={`tab-trigger ${activeTab === "companies" ? "active" : ""}`}>
            <Building2 className="w-4 h-4" /> Company Management
          </button>
          <button onClick={() => setActiveTab("payments")} className={`tab-trigger ${activeTab === "payments" ? "active" : ""}`}>
            <FileDown className="w-4 h-4" /> Payments &amp; Codes
          </button>
        </div>

        {/* Global Stats Banner */}
        {analytics && (
          <div className="stats-grid fade-in">
            <div className="glass-panel stat-card">
              <div className="stat-icon"><Users /></div>
              <div>
                <div className="stat-value">{analytics.totalUsers}</div>
                <div className="stat-label">Total Users</div>
              </div>
            </div>
            <div className="glass-panel stat-card">
              <div className="stat-icon" style={{ color: "#34d399", background: "rgba(16, 185, 129, 0.15)" }}><UserCheck /></div>
              <div>
                <div className="stat-value">{analytics.completed}</div>
                <div className="stat-label">Completed Tests</div>
              </div>
            </div>
            <div className="glass-panel stat-card">
              <div className="stat-icon" style={{ color: "#60a5fa", background: "rgba(59, 130, 246, 0.15)" }}><Sparkles /></div>
              <div>
                <div className="stat-value">{analytics.avgIQ}%</div>
                <div className="stat-label">Average IQ</div>
              </div>
            </div>
            <div className="glass-panel stat-card">
              <div className="stat-icon" style={{ color: "#fbbf24", background: "rgba(245, 158, 11, 0.15)" }}><TrendingUp /></div>
              <div>
                <div className="stat-value">{analytics.avgEQ}%</div>
                <div className="stat-label">Average EQ</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENTS */}
        
        {/* ANALYTICS TAB */}
        {activeTab === "analytics" && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {!analytics ? (
              <div className="glass-panel" style={{ padding: "40px", textAlignment: "center", color: "var(--text-secondary)" }}>
                No completed assessment data to render dashboard.
              </div>
            ) : (
              <div className="charts-grid">
                {/* Quotients radar */}
                <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "16px", width: "100%" }}>Average Quotients (IQ, EQ, AQ, CQ)</h3>
                  <div style={{ width: "100%", height: "280px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={getQuotientData()}>
                        <PolarGrid stroke={gridColor} />
                        <PolarAngleAxis dataKey="subject" stroke={labelColor} tick={{ fontSize: 10 }} />
                        <Radar name="Averages" dataKey="value" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* DISC bird styles */}
                <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "16px", width: "100%" }}>DISC Distribution (Bird Archetypes)</h3>
                  <div style={{ width: "100%", height: "280px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getDISCData()}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={85}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {getDISCData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--bg-surface-solid)", color: "var(--text-primary)" }} />
                        <Legend wrapperStyle={{ fontSize: 11, color: labelColor }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* MBTI bar */}
                <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "16px", width: "100%" }}>MBTI Cognitive Types</h3>
                  <div style={{ width: "100%", height: "280px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getMBTIBarData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis dataKey="name" stroke={labelColor} tick={{ fontSize: 10 }} />
                        <YAxis stroke={labelColor} tick={{ fontSize: 10 }} />
                        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--bg-surface-solid)", color: "var(--text-primary)" }} />
                        <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* RIASEC Career area */}
                <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "16px", width: "100%" }}>RIASEC Career Domain Averages</h3>
                  <div style={{ width: "100%", height: "280px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={getRIASECAreaData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis dataKey="name" stroke={labelColor} tick={{ fontSize: 10 }} />
                        <YAxis stroke={labelColor} tick={{ fontSize: 10 }} />
                        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--bg-surface-solid)", color: "var(--text-primary)" }} />
                        <Area type="monotone" dataKey="value" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Learning Style */}
                <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", gridColumn: "span 2" }}>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "16px", width: "100%" }}>Learning Style (Visual / Auditory / Kinesthetic)</h3>
                  <div style={{ width: "100%", height: "240px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getLearningStyleData()}
                          cx="50%"
                          cy="50%"
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {getLearningStyleData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--bg-surface-solid)", color: "var(--text-primary)" }} />
                        <Legend wrapperStyle={{ color: labelColor }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === "users" && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Filters Row */}
            <div className="glass-panel" style={{ padding: "20px", display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", flex: "1", minWidth: "300px" }}>
                <div style={{ position: "relative", flex: "1", minWidth: "200px" }}>
                  <Search className="w-5 h-5 text-muted" style={{ position: "absolute", left: "12px", top: "12px" }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: "40px" }}
                    placeholder="Search users by name or email..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="form-input" style={{ width: "150px" }}>
                  <option value="all">All Roles</option>
                  <option value="student">Student</option>
                  <option value="employee">Employee</option>
                </select>

                <select value={companyFilter} onChange={e => setCompanyFilter(e.target.value)} className="form-input" style={{ width: "200px" }}>
                  <option value="all">All Companies</option>
                  {companies.map(c => (
                    <option key={c.id} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>

              <button onClick={handleExportCSV} className="btn btn-secondary">
                <Download className="w-4 h-4" /> Export CSV
              </button>
            </div>

            {/* Table Card */}
            <div className="glass-panel" style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "1.1rem" }}>{filteredUsers().length} Active Users</h3>
                {companyFilter !== "all" && (
                  <button onClick={() => handleExportCompanyReport(companyFilter)} className="btn btn-primary" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                    <FileDown className="w-4 h-4" /> Download Company PDF
                  </button>
                )}
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Company/School</th>
                      <th>Assessment</th>
                      <th>MBTI</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers().length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: "center", color: "var(--text-secondary)", padding: "40px" }}>
                          No registered users match the filters.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers().map(u => {
                        const userResult = results.find(r => r.email === u.email);
                        const completed = !!userResult;
                        let mbti = "—";
                        if (completed) {
                          try {
                            const c = calculateAllResults(userResult.responses, u.role === "employee");
                            mbti = c.mbti.type;
                          } catch (e) {}
                        }
                        
                        return (
                          <tr key={u.email}>
                            <td style={{ fontWeight: "600" }}>{u.name}</td>
                            <td style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{u.email}</td>
                            <td>
                              <span className={`badge badge-${u.role}`}>{u.role}</span>
                            </td>
                            <td>{u.companyCode ? getCompanyName(u.companyCode) : u.school || "—"}</td>
                            <td>
                              <span className={`badge badge-${completed ? "done" : "pending"}`}>
                                {completed ? "Completed" : "Pending"}
                              </span>
                            </td>
                            <td style={{ fontFamily: "monospace", fontWeight: "700", color: "var(--primary)" }}>{mbti}</td>
                            <td style={{ textAlign: "right" }}>
                              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                                {completed && (
                                  <>
                                    <button onClick={() => handleViewUserReport(u)} className="btn btn-secondary btn-icon" title="View Detailed Report">
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDownloadUserPDF(u)} className="btn btn-primary btn-icon" title="Download PDF Report">
                                      <FileDown className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* COMPANIES TAB */}
        {activeTab === "companies" && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "1.4rem" }}>Corporate Partnerships</h2>
              <button onClick={() => setShowAddCompany(true)} className="btn btn-primary">
                <Plus className="w-4 h-4" /> Add Partner Company
              </button>
            </div>

            {/* Grid of companies */}
            <div className="companies-grid">
              {companies.length === 0 ? (
                <div className="glass-panel" style={{ padding: "40px", gridColumn: "span 3", textAlignment: "center", color: "var(--text-secondary)" }}>
                  No partner companies created yet. Click "+ Add Partner Company" above to register one.
                </div>
              ) : (
                companies.map(c => {
                  const stats = analytics?.companyStats[c.code.toUpperCase()] || { count: 0, completed: 0, totalIQ: 0, totalEQ: 0 };
                  const avgIQ = stats.completed ? Math.round(stats.totalIQ / stats.completed) : 0;
                  const avgEQ = stats.completed ? Math.round(stats.totalEQ / stats.completed) : 0;

                  return (
                    <div key={c.id} className="glass-panel fade-in" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <h3 style={{ fontSize: "1.2rem", fontWeight: "700" }}>{c.name}</h3>
                          <span style={{ fontSize: "0.8rem", color: "var(--primary)", fontFamily: "monospace", fontWeight: "700" }}>
                            CODE: {c.code}
                          </span>
                        </div>
                        <button onClick={() => handleDeleteCompany(c.id)} className="btn btn-secondary btn-icon" style={{ color: "var(--error)" }} title="Delete Company">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                        <div>🏭 Industry: {c.industry || "General"}</div>
                        <div>📍 Location: {c.location || "Online"}</div>
                        <div>👥 Registered Employees: <strong style={{ color: "var(--text-primary)" }}>{stats.count}</strong></div>
                        <div>✅ Completed Tests: <strong style={{ color: "var(--text-primary)" }}>{stats.completed}</strong></div>
                      </div>

                      {stats.completed > 0 && (
                        <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px", display: "flex", justifyContent: "space-around", fontSize: "0.8rem" }}>
                          <div>Average IQ: <strong style={{ color: "var(--secondary)" }}>{avgIQ}%</strong></div>
                          <div>Average EQ: <strong style={{ color: "var(--success)" }}>{avgEQ}%</strong></div>
                        </div>
                      )}

                      <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                        <button onClick={() => { setCompanyFilter(c.code); setActiveTab("users"); }} className="btn btn-secondary" style={{ flex: "1", padding: "6px 12px", fontSize: "0.8rem" }}>
                          <Users className="w-4 h-4" /> Employees
                        </button>
                        <button onClick={() => handleExportCompanyReport(c.code)} className="btn btn-secondary" style={{ padding: "6px" }} title="Download Summary PDF">
                          <FileDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* PAYMENTS & DISCOUNT CODES TAB */}
        {activeTab === "payments" && (
          <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Upper Config & Review Section */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "24px" }}>
              
              {/* Left Side: UPI Settings & Discount Codes */}
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                
                {/* UPI Settings Card */}
                <div className="glass-panel" style={{ padding: "24px" }}>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "16px", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>
                    UPI Payment Settings
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
                    Configure the target UPI ID where users will send report payments. The user portal dynamically generates a payment QR code using this address.
                  </p>
                  <form onSubmit={handleSaveUpi} style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
                    <div className="form-group" style={{ flex: "1" }}>
                      <label className="form-label">Active UPI Address</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. perfy@ybl, perfy.pay@okhdfcbank"
                        value={adminUpiInput}
                        onChange={e => setAdminUpiInput(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" disabled={submittingUpi} className="btn btn-primary" style={{ padding: "10px 20px" }}>
                      {submittingUpi ? "Saving..." : "Save ID"}
                    </button>
                  </form>
                  {upiConfig && upiConfig.updatedAt && (
                    <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", display: "block", marginTop: "8px" }}>
                      Last updated: {new Date(upiConfig.updatedAt).toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Discount Code Generator & Manager */}
                <div className="glass-panel" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "700", borderBottom: "1px solid var(--border)", paddingBottom: "8px", margin: "0" }}>
                    Single-Use Discount Codes
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: "0" }}>
                    Generate unique, single-use codes. When entered by users, the report unlocks immediately for free. The code is auto-deleted from the database once used.
                  </p>

                  <form onSubmit={handleCreateDiscountCode} style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
                    <div className="form-group" style={{ flex: "1" }}>
                      <label className="form-label">New Discount Code</label>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <input
                          type="text"
                          className="form-input"
                          style={{ textTransform: "uppercase", fontFamily: "monospace", fontWeight: "700" }}
                          placeholder="e.g. FREE100"
                          value={newDiscountCode}
                          onChange={e => setNewDiscountCode(e.target.value)}
                          required
                        />
                        <button 
                          type="button" 
                          onClick={handleAutoGenerateDiscountCode} 
                          className="btn btn-secondary btn-icon" 
                          title="Auto-Generate Random Code"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <button type="submit" disabled={generatingCode} className="btn btn-primary" style={{ padding: "10px 16px" }}>
                      {generatingCode ? "Creating..." : "Register"}
                    </button>
                  </form>

                  {/* Active codes table */}
                  <div style={{ marginTop: "10px" }}>
                    <h4 style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "8px" }}>Active Codes ({discountCodes.length})</h4>
                    <div className="table-container" style={{ maxHeight: "250px", overflowY: "auto" }}>
                      <table className="data-table" style={{ fontSize: "0.85rem" }}>
                        <thead>
                          <tr>
                            <th>Code</th>
                            <th>Created At</th>
                            <th style={{ textAlign: "right" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {discountCodes.length === 0 ? (
                            <tr>
                              <td colSpan="3" style={{ textAlign: "center", color: "var(--text-secondary)", padding: "20px" }}>
                                No active codes. Create one above!
                              </td>
                            </tr>
                          ) : (
                            discountCodes.map(codeItem => (
                              <tr key={codeItem.id}>
                                <td style={{ fontFamily: "monospace", fontWeight: "700", color: "var(--primary)" }}>{codeItem.code}</td>
                                <td style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>
                                  {new Date(codeItem.createdAt).toLocaleString()}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                  <button 
                                    onClick={() => handleDeleteDiscountCode(codeItem.code)} 
                                    className="btn btn-secondary btn-icon" 
                                    style={{ color: "var(--error)", padding: "4px" }} 
                                    title="Delete Code"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              </div>

              {/* Right Side: Pending Payments review list */}
              <div className="glass-panel" style={{ padding: "24px" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "16px", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>
                  Pending Payment Verifications ({pendingPayments.length})
                </h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
                  Review user UPI payment submissions. Click the eye icon to verify screenshot receipts and approve or reject access.
                </p>

                <div className="table-container" style={{ maxHeight: "560px", overflowY: "auto" }}>
                  <table className="data-table" style={{ fontSize: "0.85rem" }}>
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Submitted</th>
                        <th style={{ textAlign: "right" }}>Review</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingPayments.length === 0 ? (
                        <tr>
                          <td colSpan="3" style={{ textAlign: "center", color: "var(--text-secondary)", padding: "40px" }}>
                            No pending payments to review. All caught up! 🎉
                          </td>
                        </tr>
                      ) : (
                        pendingPayments.map(pay => (
                          <tr key={pay.email}>
                            <td>
                              <div style={{ fontWeight: "600" }}>{pay.name}</div>
                              <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{pay.email}</div>
                            </td>
                            <td style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>
                              {pay.paymentSubmittedAt ? new Date(pay.paymentSubmittedAt).toLocaleString() : "N/A"}
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <button 
                                onClick={() => setSelectedPayment(pay)} 
                                className="btn btn-primary btn-icon" 
                                title="Review Screenshot"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Bottom Row: User Testimonials & Feedback Grid */}
            <div className="glass-panel" style={{ padding: "24px" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "16px", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>
                User Testimonials &amp; Feedbacks ({feedbacks.length})
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "20px" }}>
                Browse reviews, ratings, and optional S3-hosted video testimonials submitted by users before their report summary download.
              </p>

              {feedbacks.length === 0 ? (
                <div style={{ padding: "40px", textAlignment: "center", color: "var(--text-secondary)", border: "1px dashed var(--border)", borderRadius: "12px", background: "rgba(255,255,255,0.01)" }}>
                  No testimonials submitted yet. Completed users will provide ratings and video comments here.
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
                  {feedbacks.map((feed) => (
                    <div 
                      key={feed.email} 
                      className="fade-in"
                      style={{ 
                        background: "rgba(255, 255, 255, 0.02)", 
                        border: "1px solid var(--border)", 
                        borderRadius: "12px", 
                        padding: "16px", 
                        display: "flex", 
                        flexDirection: "column", 
                        gap: "12px" 
                      }}
                    >
                      {/* Top Header Row of card */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                        <div>
                          <strong style={{ display: "block", fontSize: "0.95rem" }}>{feed.name}</strong>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", wordBreak: "break-all" }}>{feed.email}</span>
                        </div>
                        <span className={`badge badge-${feed.role || "student"}`} style={{ fontSize: "0.7rem", padding: "2px 6px" }}>
                          {feed.role || "Student"}
                        </span>
                      </div>

                      {/* Corporate / School Context and Date */}
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                        <span>
                          🏫 {feed.companyCode ? getCompanyName(feed.companyCode) : feed.school || "Individual"}
                        </span>
                        <span>
                          {feed.feedbackSubmittedAt ? new Date(feed.feedbackSubmittedAt).toLocaleDateString() : ""}
                        </span>
                      </div>

                      {/* Visual Rating Star component */}
                      <div style={{ display: "flex", gap: "2px" }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span 
                            key={star} 
                            style={{ 
                              color: star <= (feed.feedbackRating || feed.rating || 5) ? "#fbbf24" : "var(--border)", 
                              fontSize: "1.2rem",
                              lineHeight: "1" 
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </div>

                      {/* Comments content */}
                      {(feed.feedbackComments || feed.textFeedback) ? (
                        <div 
                          style={{ 
                            fontSize: "0.85rem", 
                            color: "var(--text-secondary)", 
                            fontStyle: "italic", 
                            background: "rgba(0,0,0,0.1)", 
                            padding: "10px", 
                            borderRadius: "8px", 
                            borderLeft: "3px solid var(--primary)",
                            whiteSpace: "pre-wrap"
                          }}
                        >
                          "{feed.feedbackComments || feed.textFeedback}"
                        </div>
                      ) : (
                        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontStyle: "italic" }}>
                          No written feedback provided.
                        </span>
                      )}

                      {/* Native HTML5 Video Testimonial from S3 */}
                      {feed.videoTestimonialUrl ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--secondary)" }}>
                            📹 Video Testimonial
                          </span>
                          <video 
                            src={feed.videoTestimonialUrl} 
                            controls 
                            preload="none" 
                            style={{ 
                              width: "100%", 
                              maxHeight: "180px", 
                              borderRadius: "8px", 
                              border: "1px solid var(--border)", 
                              background: "rgba(0,0,0,0.3)",
                              objectFit: "contain" 
                            }} 
                          />
                        </div>
                      ) : (
                        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontStyle: "italic" }}>
                          No video testimonial uploaded.
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      {/* DETAILED REPORT MODAL */}
      {selectedUser && selectedUserResults && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="glass-panel modal-content fade-in" style={{ padding: "24px", background: "var(--bg-surface-solid)" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "16px", marginBottom: "20px" }}>
              <div>
                <span className="badge badge-done" style={{ marginBottom: "6px" }}>Scored Assessment</span>
                <h2 style={{ fontSize: "1.6rem" }}>{selectedUser.name}</h2>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  {selectedUser.email} • {selectedUser.role} • {selectedUser.companyCode ? getCompanyName(selectedUser.companyCode) : selectedUser.school || "Individual"}
                </p>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={() => handleDownloadUserPDF(selectedUser)} className="btn btn-primary">
                  <Download className="w-4 h-4" /> Download PDF Report
                </button>
                <button onClick={() => setSelectedUser(null)} className="btn btn-secondary">
                  Close
                </button>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Stats Row */}
              <div className="modal-stats-grid">
                <div style={{ padding: "16px", border: "1px solid var(--border)", borderRadius: "12px", textAlign: "center" }}>
                  <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-secondary)" }}>IQ Percentile</div>
                  <div style={{ fontSize: "1.8rem", fontWeight: "700", color: "#60a5fa" }}>{selectedUserResults.quotients.IQ}%</div>
                </div>
                <div style={{ padding: "16px", border: "1px solid var(--border)", borderRadius: "12px", textAlign: "center" }}>
                  <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-secondary)" }}>EQ Percentile</div>
                  <div style={{ fontSize: "1.8rem", fontWeight: "700", color: "#34d399" }}>{selectedUserResults.quotients.EQ}%</div>
                </div>
                <div style={{ padding: "16px", border: "1px solid var(--border)", borderRadius: "12px", textAlign: "center" }}>
                  <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-secondary)" }}>AQ Percentile</div>
                  <div style={{ fontSize: "1.8rem", fontWeight: "700", color: "#fbbf24" }}>{selectedUserResults.quotients.AQ}%</div>
                </div>
                <div style={{ padding: "16px", border: "1px solid var(--border)", borderRadius: "12px", textAlign: "center" }}>
                  <div style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-secondary)" }}>CQ Percentile</div>
                  <div style={{ fontSize: "1.8rem", fontWeight: "700", color: "#a78bfa" }}>{selectedUserResults.quotients.CQ}%</div>
                </div>
              </div>

              {/* MBTI and DISC Cards */}
              <div className="modal-cards-grid">
                <div style={{ padding: "20px", border: "1px solid var(--border)", borderRadius: "12px", background: "rgba(255,255,255,0.01)" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", uppercase: "true" }}>Behavioral Archetype (DISC)</span>
                  <h4 style={{ fontSize: "1.3rem", fontWeight: "700", margin: "4px 0", color: "var(--primary)" }}>{selectedUserResults.disc.dominant}</h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "6px" }}>
                    Primary behavioral type is characterized by the <strong>{selectedUserResults.disc.bird}</strong> style. Focuses heavily on results and action.
                  </p>
                </div>
                <div style={{ padding: "20px", border: "1px solid var(--border)", borderRadius: "12px", background: "rgba(255,255,255,0.01)" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", uppercase: "true" }}>Cognitive Profile (MBTI)</span>
                  <h4 style={{ fontSize: "1.3rem", fontWeight: "700", margin: "4px 0", color: "var(--secondary)" }}>{selectedUserResults.mbti.type}</h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "6px" }}>
                    The four preferences combine into a deep strategic profile, showing clear methods for thinking, decision making, and leadership.
                  </p>
                </div>
              </div>

              {/* SWOT Matrix */}
              <div style={{ border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
                <div style={{ background: "rgba(255,255,255,0.02)", padding: "10px 16px", borderBottom: "1px solid var(--border)", fontWeight: "600", fontSize: "0.9rem" }}>
                  GROWTH SWOT MATRIX
                </div>
                <div className="modal-swot-grid">
                  <div style={{ background: "var(--bg-surface-solid)", padding: "16px" }}>
                    <strong style={{ color: "#34d399", fontSize: "0.8rem", textTransform: "uppercase" }}>Strengths</strong>
                    <ul style={{ fontSize: "0.85rem", listStyle: "circle", paddingLeft: "16px", marginTop: "6px" }}>
                      {selectedUserResults.swot.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                  <div style={{ background: "var(--bg-surface-solid)", padding: "16px" }}>
                    <strong style={{ color: "#f87171", fontSize: "0.8rem", textTransform: "uppercase" }}>Weaknesses</strong>
                    <ul style={{ fontSize: "0.85rem", listStyle: "circle", paddingLeft: "16px", marginTop: "6px" }}>
                      {selectedUserResults.swot.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                  <div style={{ background: "var(--bg-surface-solid)", padding: "16px" }}>
                    <strong style={{ color: "#60a5fa", fontSize: "0.8rem", textTransform: "uppercase" }}>Opportunities</strong>
                    <ul style={{ fontSize: "0.85rem", listStyle: "circle", paddingLeft: "16px", marginTop: "6px" }}>
                      {selectedUserResults.swot.opportunities.map((o, i) => <li key={i}>{o}</li>)}
                    </ul>
                  </div>
                  <div style={{ background: "var(--bg-surface-solid)", padding: "16px" }}>
                    <strong style={{ color: "#fbbf24", fontSize: "0.8rem", textTransform: "uppercase" }}>Threats</strong>
                    <ul style={{ fontSize: "0.85rem", listStyle: "circle", paddingLeft: "16px", marginTop: "6px" }}>
                      {selectedUserResults.swot.threats.map((t, i) => <li key={i}>{t}</li>)}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Plan */}
              <div style={{ padding: "20px", border: "1px solid var(--border)", borderRadius: "12px", background: "rgba(255,255,255,0.01)" }}>
                <h4 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "12px", borderBottom: "1px solid var(--border)", paddingBottom: "6px" }}>
                  Actionable Development Plan
                </h4>
                <div className="modal-action-grid">
                  <div>
                    <strong style={{ fontSize: "0.85rem", color: "var(--primary)" }}>Skill Targets:</strong>
                    <ul style={{ fontSize: "0.8rem", listStyle: "decimal", paddingLeft: "16px", marginTop: "6px", display: "flex", flexDirection: "column", gap: "6px" }}>
                      {calculateAllResults(results.find(r => r.email === selectedUser.email).responses, selectedUser.role === "employee").swot.strengths.slice(0, 3).map((item, idx) => (
                        <li key={idx}>Leverage and enhance {item.toLowerCase()}</li>
                      ))}
                      <li>Leverage {selectedUserResults.learningStyle.dominant} style learning</li>
                    </ul>
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.85rem", color: "var(--secondary)" }}>Suggested Careers:</strong>
                    <ul style={{ fontSize: "0.8rem", listStyle: "square", paddingLeft: "16px", marginTop: "6px", display: "flex", flexDirection: "column", gap: "6px" }}>
                      {selectedUserResults.career.suggestedRoles.map((role, idx) => (
                        <li key={idx}>{role} ({selectedUserResults.career.top2.join(" & ")})</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD COMPANY DIALOG MODAL */}
      {showAddCompany && (
        <div className="modal-overlay" onClick={() => setShowAddCompany(false)}>
          <div className="glass-panel fade-in" style={{ padding: "24px", width: "100%", maxWidth: "450px", background: "var(--bg-surface-solid)" }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "16px", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>
              Add Partner Company
            </h3>

            {companyError && (
              <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "8px", padding: "10px", color: "#f87171", fontSize: "0.8rem", marginBottom: "16px" }}>
                {companyError}
              </div>
            )}

            <form onSubmit={handleAddCompany} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. TechCorp Solutions"
                  value={newCompanyName}
                  onChange={e => setNewCompanyName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Access Code *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  style={{ textTransform: "uppercase", fontFamily: "monospace", fontWeight: "700" }}
                  placeholder="e.g. TECH001"
                  value={newCompanyCode}
                  onChange={e => setNewCompanyCode(e.target.value)}
                />
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                  Employees must input this code when registering.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Industry</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Finance, Tech, Healthcare"
                  value={newCompanyIndustry}
                  onChange={e => setNewCompanyIndustry(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Boston, MA"
                  value={newCompanyLocation}
                  onChange={e => setNewCompanyLocation(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                <button type="submit" className="btn btn-primary" style={{ flex: "1" }}>
                  Create Company
                </button>
                <button type="button" onClick={() => setShowAddCompany(false)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCREENSHOT VERIFICATION REVIEW MODAL */}
      {selectedPayment && (
        <div className="modal-overlay" onClick={() => setSelectedPayment(null)}>
          <div className="glass-panel modal-content fade-in" style={{ padding: "24px", maxWidth: "800px", width: "90%", background: "var(--bg-surface-solid)" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "16px", marginBottom: "20px" }}>
              <div>
                <span className="badge badge-pending" style={{ marginBottom: "6px" }}>Pending Verification</span>
                <h2 style={{ fontSize: "1.4rem", fontWeight: "700" }}>Review UPI Screenshot</h2>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Submitted by {selectedPayment.name} ({selectedPayment.email})</p>
              </div>
              <button onClick={() => setSelectedPayment(null)} className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                Close
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
              {/* Left Column: S3 Image Render */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
                <strong style={{ fontSize: "0.8rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Uploaded S3 Receipt Image</strong>
                <div style={{ width: "100%", maxHeight: "380px", overflow: "hidden", border: "1px solid var(--border)", borderRadius: "12px", background: "rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img
                    src={selectedPayment.paymentScreenshotUrl}
                    alt="Receipt Screenshot"
                    style={{ maxWidth: "100%", maxHeight: "380px", objectFit: "contain", borderRadius: "12px" }}
                  />
                </div>
                <a
                  href={selectedPayment.paymentScreenshotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ fontSize: "0.75rem", padding: "6px 12px", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <Eye className="w-4 h-4" /> View Fullscreen Image
                </a>
              </div>

              {/* Right Column: User details & Admin Approval Controls */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", justifyContent: "space-between" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <h4 style={{ fontSize: "1rem", fontWeight: "700", borderBottom: "1px solid var(--border)", paddingBottom: "6px", margin: "0" }}>
                    Transaction Meta
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.85rem" }}>
                    <div>👥 Name: <strong style={{ color: "var(--text-primary)" }}>{selectedPayment.name}</strong></div>
                    <div>✉️ Email: <strong style={{ color: "var(--text-primary)" }}>{selectedPayment.email}</strong></div>
                    <div>🎓 Role: <span className={`badge badge-${selectedPayment.role}`}>{selectedPayment.role}</span></div>
                    {selectedPayment.companyCode && <div>🏭 Company: <strong style={{ color: "var(--text-primary)" }}>{getCompanyName(selectedPayment.companyCode)}</strong></div>}
                    {selectedPayment.school && <div>🏫 School: <strong style={{ color: "var(--text-primary)" }}>{selectedPayment.school}</strong></div>}
                    <div>⏳ Submitted At: <strong style={{ color: "var(--text-primary)" }}>{new Date(selectedPayment.paymentSubmittedAt).toLocaleString()}</strong></div>
                    <div>📅 Completed Test: <strong style={{ color: "var(--text-primary)" }}>{new Date(selectedPayment.completedAt).toLocaleString()}</strong></div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
                  <button
                    onClick={() => handleApprovePayment(selectedPayment.email)}
                    className="btn btn-primary"
                    style={{ width: "100%", gap: "6px", background: "var(--success)", border: "1px solid var(--success)", padding: "12px", color: "#ffffff", fontWeight: "700" }}
                  >
                    Approve Payment &amp; Unlock Report
                  </button>
                  <button
                    onClick={() => handleRejectPayment(selectedPayment.email)}
                    className="btn btn-secondary"
                    style={{ width: "100%", gap: "6px", color: "var(--error)", border: "1px solid var(--border)", padding: "12px" }}
                  >
                    Reject Screenshot Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
