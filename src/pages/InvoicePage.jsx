import React, { useState, useEffect, useCallback } from 'react';
import axios from '../utils/axiosInstance';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { listWorkspaces } from '../actions/workspaceActions';
import toast from 'react-hot-toast';
import {
  ReceiptLongRounded, AddRounded, DownloadRounded, PreviewRounded,
  DeleteRounded, EditRounded, PictureAsPdfRounded, CheckCircleRounded,
  SendRounded, CancelRounded, ArticleRounded, PaletteRounded,
  AddCircleRounded, RemoveCircleRounded, VisibilityRounded, CloseRounded,
  AutoAwesomeRounded, LinkRounded,
} from '@mui/icons-material';

// Centralized auth and headers are now handled by axiosInstance.

// ── Status badge ─────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    Draft: 'bg-slate-100 text-slate-600 border-slate-200',
    Sent: 'bg-blue-50 text-blue-600 border-blue-200',
    Paid: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    Cancelled: 'bg-rose-50 text-rose-600 border-rose-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${map[status] || map.Draft}`}>
      {status}
    </span>
  );
};

// ── Template preview card ─────────────────────────────────────
const TemplateCard = ({ id, label, description, color, selected, onSelect }) => (
  <button
    onClick={() => onSelect(id)}
    className={`relative flex flex-col items-start p-4 rounded-2xl border-2 transition-all text-left w-full group ${
      selected ? 'border-[#7b68ee] bg-[#7b68ee]/5 shadow-lg shadow-[#7b68ee]/10' : 'border-slate-200 hover:border-slate-300 bg-white'
    }`}
  >
    {selected && (
      <div className="absolute top-3 right-3 w-5 h-5 bg-[#7b68ee] rounded-full flex items-center justify-center">
        <CheckCircleRounded sx={{ fontSize: 14, color: 'white' }} />
      </div>
    )}
    {/* Mini preview */}
    <div className="w-full h-20 rounded-xl mb-3 overflow-hidden border border-slate-100" style={{ background: '#f8fafc' }}>
      <div className="w-full h-3" style={{ background: color }} />
      <div className="p-2 space-y-1">
        <div className="h-1.5 rounded bg-slate-200 w-3/4" />
        <div className="h-1 rounded bg-slate-100 w-1/2" />
        <div className="mt-2 grid grid-cols-3 gap-1">
          {[1,2,3].map(i => <div key={i} className="h-1 rounded bg-slate-100" />)}
        </div>
      </div>
    </div>
    <div className="font-black text-sm text-slate-800">{label}</div>
    <div className="text-[11px] text-slate-400 mt-0.5">{description}</div>
  </button>
);

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
const InvoicePage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user || {});

  const workspaceList = useSelector((state) => state.workspace);
  const { workspaces } = workspaceList;
  const [wsId, setWsId] = useState('');

  // Tabs: 'list' | 'create' | 'templates'
  const [tab, setTab] = useState('list');

  // ── Invoice list state ──────────────────────────────────────
  const [invoices, setInvoices] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');

  // ── Create form state ───────────────────────────────────────
  const [deals, setDeals] = useState([]);
  const [form, setForm] = useState({
    dealId: '',
    customerName: '', customerEmail: '', customerPhone: '', customerAddress: '',
    companyName: '', companyAddress: '', companyPhone: '', companyEmail: '', companyLogo: '',
    items: [{ description: '', quantity: 1, unitPrice: 0, amount: 0 }],
    taxRate: 0, discountRate: 0, currency: 'INR',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    notes: '', termsAndConditions: '',
    template: 'classic', primaryColor: '#7b68ee',
    status: 'Draft',
  });
  const [createLoading, setCreateLoading] = useState(false);

  // ── Template tab state ──────────────────────────────────────
  const [templates, setTemplates] = useState([]);
  const [tmplForm, setTmplForm] = useState({
    name: '', templateStyle: 'classic', companyName: '', companyAddress: '',
    companyPhone: '', companyEmail: '', primaryColor: '#7b68ee', footerText: 'Thank you for your business!', isDefault: false,
  });
  const [editingTmpl, setEditingTmpl] = useState(null);
  const [tmplLoading, setTmplLoading] = useState(false);

  // ── Preview modal ───────────────────────────────────────────
  const [previewInvoice, setPreviewInvoice] = useState(null);
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState({});

  // ── Init Workspace ──────────────────────────────────────────
  useEffect(() => { dispatch(listWorkspaces()); }, [dispatch]);

  useEffect(() => {
    if (workspaces?.length > 0 && !wsId) {
      const saved = localStorage.getItem('activeWorkspaceId');
      const found = workspaces.find(w => w.id === saved || w._id === saved);
      const id = found?.id || found?._id || workspaces[0].id || workspaces[0]._id;
      setWsId(id);
    }
  }, [workspaces, wsId]);

  useEffect(() => { if (wsId) { fetchInvoices(); fetchDeals(); fetchTemplates(); } }, [wsId]);

  // Handle navigation from SalesPipeline (deal pre-selected)
  useEffect(() => {
    if (location.state?.dealId && deals.length > 0) {
      const deal = deals.find(d => d.id === location.state.dealId);
      if (deal) {
        prefillFromDeal(deal);
        setTab('create');
      }
    }
  }, [location.state, deals]);

  // ── Data fetchers ───────────────────────────────────────────
  const fetchInvoices = useCallback(async () => {
    if (!wsId || wsId === 'undefined') return;
    setListLoading(true);
    try {
      const { data } = await axios.get(`/api/invoices?workspaceId=${wsId}${filterStatus ? `&status=${filterStatus}` : ''}`);
      setInvoices(data);
    } catch (e) { console.error(e); }
    setListLoading(false);
  }, [wsId, filterStatus]);

  useEffect(() => { if (wsId) fetchInvoices(); }, [filterStatus, wsId]);

  const fetchDeals = async () => {
    if (!wsId || wsId === 'undefined') return;
    try {
      const { data } = await axios.get(`/api/sales/pipelines?workspaceId=${wsId}`);
      const allDeals = data.flatMap(p => p.stages?.flatMap(s => s.deals || []) || []);
      setDeals(allDeals);
    } catch (e) { console.error(e); }
  };

  const fetchTemplates = async () => {
    if (!wsId || wsId === 'undefined') return;
    try {
      const { data } = await axios.get(`/api/invoice-templates?workspaceId=${wsId}`);
      setTemplates(data);
    } catch (e) { console.error(e); }
  };

  // ── Form helpers ────────────────────────────────────────────
  const prefillFromDeal = (deal) => {
    const contact = deal.contact;
    setForm(f => ({
      ...f,
      dealId: deal.id,
      customerName: contact ? `${contact.firstName} ${contact.lastName || ''}`.trim() : deal.title,
      customerEmail: contact?.email || '',
      customerPhone: contact?.phone || '',
      currency: deal.currency || 'INR',
      items: [{ description: deal.title, quantity: 1, unitPrice: parseFloat(deal.value || 0), amount: parseFloat(deal.value || 0) }],
    }));
  };

  const handleDealSelect = (dealId) => {
    const deal = deals.find(d => d.id === dealId);
    if (deal) prefillFromDeal(deal);
    else setForm(f => ({ ...f, dealId }));
  };

  const recalcItem = (items) => items.map(item => ({
    ...item,
    amount: parseFloat(((parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0)).toFixed(2)),
  }));

  const updateItem = (idx, field, val) => {
    const updated = [...form.items];
    updated[idx] = { ...updated[idx], [field]: val };
    const recalculated = recalcItem(updated);
    setForm(f => ({ ...f, items: recalculated }));
  };

  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { description: '', quantity: 1, unitPrice: 0, amount: 0 }] }));
  const removeItem = (idx) => setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));

  // ── Computed totals ─────────────────────────────────────────
  const subtotal = form.items.reduce((s, it) => s + (parseFloat(it.amount) || 0), 0);
  const discountAmt = (subtotal * parseFloat(form.discountRate || 0)) / 100;
  const taxAmt = ((subtotal - discountAmt) * parseFloat(form.taxRate || 0)) / 100;
  const totalAmt = subtotal - discountAmt + taxAmt;

  // ── Create Invoice ──────────────────────────────────────────
  const handleCreateInvoice = async () => {
    if (form.items.length === 0 || !form.items[0].description) return toast.error('Add at least one line item');
    setCreateLoading(true);
    try {
      await axios.post('/api/invoices', { ...form, workspaceId: wsId });
      toast.success('Invoice created successfully!');
      setTab('list');
      fetchInvoices();
      setForm(f => ({
        ...f, dealId: '', customerName: '', customerEmail: '', customerPhone: '', customerAddress: '',
        items: [{ description: '', quantity: 1, unitPrice: 0, amount: 0 }],
        notes: '', dueDate: '', status: 'Draft',
      }));
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.message || 'Failed to create invoice');
    }
    setCreateLoading(false);
  };

  // ── Status update ───────────────────────────────────────────
  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`/api/invoices/${id}`, { status });
      setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status } : inv));
      toast.success(`Status updated to ${status}`);
    } catch (e) { toast.error('Failed to update status'); }
  };

  // ── Delete invoice ──────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this invoice? This cannot be undone.')) return;
    try {
      await axios.delete(`/api/invoices/${id}`);
      setInvoices(prev => prev.filter(inv => inv.id !== id));
      toast.success('Invoice deleted');
    } catch (e) { toast.error('Failed to delete invoice'); }
  };

  // ── Generate PDF ────────────────────────────────────────────
  const handleGeneratePDF = async (inv) => {
    setPdfLoading(prev => ({ ...prev, [inv.id]: true }));
    try {
      const { data } = await axios.post(`/api/invoices/${inv.id}/generate-pdf`, {});
      toast.success('PDF generated!');
      // Open download
      const link = document.createElement('a');
      link.href = data.downloadUrl;
      link.target = '_blank';
      link.click();
      fetchInvoices();
    } catch (e) {
      console.error(e);
      toast.error('PDF generation failed');
    }
    setPdfLoading(prev => ({ ...prev, [inv.id]: false }));
  };

  // ── Preview HTML ────────────────────────────────────────────
  const handlePreview = async (inv) => {
    setPreviewInvoice(inv);
    setPreviewLoading(true);
    try {
      const res = await axios.get(`/api/invoices/${inv.id}/preview-html`, { responseType: 'text' });
      setPreviewHtml(res.data);
    } catch (e) { setPreviewHtml('<p style="padding:40px;color:#999;">Could not load preview.</p>'); }
    setPreviewLoading(false);
  };

  // ── Template CRUD ───────────────────────────────────────────
  const handleSaveTemplate = async () => {
    setTmplLoading(true);
    try {
      if (editingTmpl) {
        await axios.put(`/api/invoice-templates/${editingTmpl}`, { ...tmplForm, workspaceId: wsId });
        toast.success('Template updated');
      } else {
        await axios.post('/api/invoice-templates', { ...tmplForm, workspaceId: wsId });
        toast.success('Template created');
      }
      setEditingTmpl(null);
      setTmplForm({ name: '', templateStyle: 'classic', companyName: '', companyAddress: '', companyPhone: '', companyEmail: '', primaryColor: '#7b68ee', footerText: 'Thank you for your business!', isDefault: false });
      fetchTemplates();
    } catch (e) { toast.error('Failed to save template'); }
    setTmplLoading(false);
  };

  const handleDeleteTemplate = async (id) => {
    if (!window.confirm('Delete this template?')) return;
    try {
      await axios.delete(`/api/invoice-templates/${id}`);
      fetchTemplates();
      toast.success('Template deleted');
    } catch (e) { toast.error('Failed to delete template'); }
  };

  const startEditTemplate = (tmpl) => {
    setEditingTmpl(tmpl.id);
    setTmplForm({ name: tmpl.name, templateStyle: tmpl.templateStyle, companyName: tmpl.companyName || '', companyAddress: tmpl.companyAddress || '', companyPhone: tmpl.companyPhone || '', companyEmail: tmpl.companyEmail || '', primaryColor: tmpl.primaryColor || '#7b68ee', footerText: tmpl.footerText || '', isDefault: tmpl.isDefault });
  };

  const inputCls = "w-full bg-slate-50 border-2 border-transparent rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:border-[#7b68ee] focus:bg-white outline-none transition-all";
  const labelCls = "block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1.5";

  return (
    <div className="flex-1 bg-[#fafafa] flex flex-col min-w-0 h-full overflow-hidden">
      {/* ── Header ── */}
      <div className="px-8 pt-8 pb-0 shrink-0">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 bg-gradient-to-br from-[#7b68ee] to-[#5b4fc4] rounded-xl flex items-center justify-center shadow-md shadow-[#7b68ee]/25">
                <ReceiptLongRounded sx={{ fontSize: 18, color: 'white' }} />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Invoices</h1>
            </div>
            <p className="text-slate-400 text-sm ml-12">Generate, manage and download professional PDF invoices.</p>
          </div>
          {tab === 'list' && (
            <button onClick={() => setTab('create')} className="flex items-center gap-2 bg-gradient-to-r from-[#7b68ee] to-[#5b4fc4] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[#7b68ee]/25 hover:shadow-[#7b68ee]/40 hover:scale-[1.02] active:scale-95 transition-all">
              <AddRounded sx={{ fontSize: 18 }} /> Create Invoice
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-200">
          {['list', 'create', 'templates'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-bold capitalize transition-all border-b-2 -mb-px ${tab === t ? 'border-[#7b68ee] text-[#7b68ee]' : 'border-transparent text-slate-400 hover:text-slate-700'}`}
            >
              {t === 'list' ? 'All Invoices' : t === 'create' ? 'Create Invoice' : 'Templates'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab: Invoice List ── */}
      {tab === 'list' && (
        <div className="flex-1 overflow-auto p-8">
          {/* Filter bar */}
          <div className="flex items-center gap-3 mb-6">
            {['', 'Draft', 'Sent', 'Paid', 'Cancelled'].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${filterStatus === s ? 'bg-[#7b68ee] text-white border-[#7b68ee] shadow-md shadow-[#7b68ee]/20' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
              >{s || 'All'}</button>
            ))}
            <span className="ml-auto text-xs text-slate-400 font-medium">{invoices.length} invoice{invoices.length !== 1 ? 's' : ''}</span>
          </div>

          {listLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-3 border-[#7b68ee]/20 border-t-[#7b68ee] rounded-full animate-spin" style={{ borderWidth: 3 }} />
                <p className="text-sm text-slate-400 font-medium">Loading invoices…</p>
              </div>
            </div>
          ) : invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                <ReceiptLongRounded sx={{ fontSize: 28, color: '#cbd5e1' }} />
              </div>
              <div className="text-center">
                <p className="font-black text-slate-700">No invoices yet</p>
                <p className="text-sm text-slate-400 mt-1">Create your first invoice to get started.</p>
              </div>
              <button onClick={() => setTab('create')} className="flex items-center gap-2 bg-[#7b68ee] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-[#7b68ee]/20 hover:bg-[#6c58e0] transition-all">
                <AddRounded sx={{ fontSize: 18 }} /> Create Invoice
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    {['Invoice #', 'Customer', 'Deal', 'Date', 'Due Date', 'Amount', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-wider first:pl-6 last:pr-6 last:text-right">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(inv => (
                    <tr key={inv.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors group">
                      <td className="py-3.5 pl-6 pr-4">
                        <span className="font-black text-[#7b68ee] text-sm">{inv.invoiceNumber || inv.id.substring(0,8)}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800 text-sm">{inv.customerName || '—'}</div>
                        {inv.customerEmail && <div className="text-[11px] text-slate-400">{inv.customerEmail}</div>}
                      </td>
                      <td className="py-3.5 px-4 text-sm text-slate-500">{inv.deal?.title || '—'}</td>
                      <td className="py-3.5 px-4 text-sm text-slate-500">{inv.invoiceDate || '—'}</td>
                      <td className="py-3.5 px-4 text-sm text-slate-500">{inv.dueDate || '—'}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-black text-slate-900 text-sm">
                          {inv.currency || '₹'} {parseFloat(inv.totalAmount || inv.amount || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={inv.status}
                          onChange={e => handleStatusUpdate(inv.id, e.target.value)}
                          className="appearance-none bg-transparent border-0 outline-none cursor-pointer"
                          style={{ padding: 0 }}
                        >
                          <option value="Draft">Draft</option>
                          <option value="Sent">Sent</option>
                          <option value="Paid">Paid</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="py-3.5 pr-6 pl-4">
                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button title="Preview" onClick={() => handlePreview(inv)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all">
                            <VisibilityRounded sx={{ fontSize: 16 }} />
                          </button>
                          <button title="Generate & Download PDF"
                            onClick={() => handleGeneratePDF(inv)}
                            disabled={pdfLoading[inv.id]}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#7b68ee]/10 text-slate-400 hover:text-[#7b68ee] transition-all disabled:opacity-50">
                            {pdfLoading[inv.id]
                              ? <div className="w-3 h-3 border-2 border-[#7b68ee]/30 border-t-[#7b68ee] rounded-full animate-spin" />
                              : <PictureAsPdfRounded sx={{ fontSize: 16 }} />}
                          </button>
                          {inv.pdfPath && (
                            <a href={`/api/invoices/${inv.id}/download-pdf`} target="_blank" rel="noreferrer" title="Download PDF"
                              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-all">
                              <DownloadRounded sx={{ fontSize: 16 }} />
                            </a>
                          )}
                          <button title="Delete" onClick={() => handleDelete(inv.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-all">
                            <DeleteRounded sx={{ fontSize: 16 }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Create Invoice ── */}
      {tab === 'create' && (
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl mx-auto space-y-6">

            {/* Template Picker */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-sm font-black text-slate-800 mb-1 flex items-center gap-2">
                <AutoAwesomeRounded sx={{ fontSize: 16, color: '#7b68ee' }} /> Invoice Template
              </h2>
              <p className="text-xs text-slate-400 mb-4">Choose a visual style for your invoice.</p>
              <div className="grid grid-cols-3 gap-3">
                <TemplateCard id="classic" label="Classic" description="Traditional, professional" color="#7b68ee" selected={form.template === 'classic'} onSelect={t => setForm(f => ({ ...f, template: t }))} />
                <TemplateCard id="modern" label="Modern" description="Bold sidebar design" color="#5b4fc4" selected={form.template === 'modern'} onSelect={t => setForm(f => ({ ...f, template: t }))} />
                <TemplateCard id="minimal" label="Minimal" description="Clean, black & white" color="#1e2a3a" selected={form.template === 'minimal'} onSelect={t => setForm(f => ({ ...f, template: t }))} />
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div>
                  <label className={labelCls}>Accent Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.primaryColor} onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))}
                      className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer p-0.5" />
                    <span className="text-xs text-slate-400 font-medium">{form.primaryColor}</span>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Currency</label>
                  <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium outline-none focus:border-[#7b68ee]">
                    {['INR','USD','EUR','GBP','AED','SGD','AUD','CAD'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Deal + Customer */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-sm font-black text-slate-800 mb-4">Customer Details</h2>
              <div className="mb-4">
                <label className={labelCls}>Link to Deal (optional)</label>
                <select value={form.dealId} onChange={e => handleDealSelect(e.target.value)}
                  className={inputCls}>
                  <option value="">— Select a deal —</option>
                  {deals.map(d => <option key={d.id} value={d.id}>{d.title} (${parseFloat(d.value||0).toFixed(0)})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Customer Name *</label><input className={inputCls} value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} placeholder="John Doe" /></div>
                <div><label className={labelCls}>Email</label><input className={inputCls} value={form.customerEmail} onChange={e => setForm(f => ({ ...f, customerEmail: e.target.value }))} placeholder="john@example.com" /></div>
                <div><label className={labelCls}>Phone</label><input className={inputCls} value={form.customerPhone} onChange={e => setForm(f => ({ ...f, customerPhone: e.target.value }))} placeholder="+1 555 000 0000" /></div>
                <div><label className={labelCls}>Address</label><input className={inputCls} value={form.customerAddress} onChange={e => setForm(f => ({ ...f, customerAddress: e.target.value }))} placeholder="123 Main St, City" /></div>
              </div>
            </div>

            {/* Company */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-sm font-black text-slate-800 mb-4">Company / Sender</h2>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Company Name</label><input className={inputCls} value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} placeholder="Bivith Inc." /></div>
                <div><label className={labelCls}>Company Email</label><input className={inputCls} value={form.companyEmail} onChange={e => setForm(f => ({ ...f, companyEmail: e.target.value }))} placeholder="billing@company.com" /></div>
                <div><label className={labelCls}>Phone</label><input className={inputCls} value={form.companyPhone} onChange={e => setForm(f => ({ ...f, companyPhone: e.target.value }))} placeholder="+1 800 000 0000" /></div>
                <div><label className={labelCls}>Logo URL</label><input className={inputCls} value={form.companyLogo} onChange={e => setForm(f => ({ ...f, companyLogo: e.target.value }))} placeholder="https://..." /></div>
                <div className="col-span-2"><label className={labelCls}>Address</label><textarea className={inputCls} rows={2} value={form.companyAddress} onChange={e => setForm(f => ({ ...f, companyAddress: e.target.value }))} placeholder="456 Business Ave, Suite 100, City, State ZIP" /></div>
              </div>
            </div>

            {/* Line Items */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black text-slate-800">Line Items</h2>
                <button onClick={addItem} className="flex items-center gap-1.5 text-[#7b68ee] text-xs font-bold hover:bg-[#7b68ee]/5 px-3 py-1.5 rounded-lg transition-all">
                  <AddCircleRounded sx={{ fontSize: 16 }} /> Add Item
                </button>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2 px-2 pb-1 border-b border-slate-100">
                  {['Description', 'Qty', 'Unit Price', 'Amount', ''].map((h, i) => (
                    <div key={i} className={`text-[9px] font-black text-slate-400 uppercase tracking-wider ${i === 0 ? 'col-span-5' : i === 4 ? 'col-span-1' : 'col-span-2'} ${i > 0 && i < 4 ? 'text-right' : ''}`}>{h}</div>
                  ))}
                </div>
                {form.items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                    <input className={`${inputCls} col-span-5`} value={item.description} onChange={e => updateItem(idx, 'description', e.target.value)} placeholder="Item description" />
                    <input type="number" className={`${inputCls} col-span-2 text-right`} value={item.quantity} onChange={e => updateItem(idx, 'quantity', e.target.value)} min="0" step="0.01" />
                    <input type="number" className={`${inputCls} col-span-2 text-right`} value={item.unitPrice} onChange={e => updateItem(idx, 'unitPrice', e.target.value)} min="0" step="0.01" />
                    <div className="col-span-2 text-right font-black text-sm text-slate-800 px-2">
                      {parseFloat(item.amount || 0).toFixed(2)}
                    </div>
                    <button onClick={() => removeItem(idx)} disabled={form.items.length === 1}
                      className="col-span-1 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-rose-50 text-slate-300 hover:text-rose-400 transition-all disabled:opacity-20">
                      <RemoveCircleRounded sx={{ fontSize: 16 }} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-6 flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className={labelCls}>Tax %</label><input type="number" className={inputCls} value={form.taxRate} onChange={e => setForm(f => ({ ...f, taxRate: e.target.value }))} min="0" max="100" step="0.1" /></div>
                    <div><label className={labelCls}>Discount %</label><input type="number" className={inputCls} value={form.discountRate} onChange={e => setForm(f => ({ ...f, discountRate: e.target.value }))} min="0" max="100" step="0.1" /></div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 mt-2">
                    <div className="flex justify-between text-xs text-slate-500"><span>Subtotal</span><span className="font-bold">{form.currency} {subtotal.toFixed(2)}</span></div>
                    {parseFloat(form.discountRate) > 0 && <div className="flex justify-between text-xs text-slate-500"><span>Discount ({form.discountRate}%)</span><span className="font-bold text-rose-500">− {form.currency} {discountAmt.toFixed(2)}</span></div>}
                    {parseFloat(form.taxRate) > 0 && <div className="flex justify-between text-xs text-slate-500"><span>Tax ({form.taxRate}%)</span><span className="font-bold">+ {form.currency} {taxAmt.toFixed(2)}</span></div>}
                    <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                      <span>Total</span><span style={{ color: form.primaryColor }}>{form.currency} {totalAmt.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dates + Notes */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-sm font-black text-slate-800 mb-4">Dates & Notes</h2>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div><label className={labelCls}>Invoice Date</label><input type="date" className={inputCls} value={form.invoiceDate} onChange={e => setForm(f => ({ ...f, invoiceDate: e.target.value }))} /></div>
                <div><label className={labelCls}>Due Date</label><input type="date" className={inputCls} value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} /></div>
                <div><label className={labelCls}>Status</label>
                  <select className={inputCls} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    {['Draft','Sent','Paid','Cancelled'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Notes</label><textarea className={inputCls} rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Payment instructions, thank you note…" /></div>
                <div><label className={labelCls}>Terms & Conditions</label><textarea className={inputCls} rows={3} value={form.termsAndConditions} onChange={e => setForm(f => ({ ...f, termsAndConditions: e.target.value }))} placeholder="Payment due within 30 days…" /></div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pb-8">
              <button onClick={() => setTab('list')} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all">
                Cancel
              </button>
              <div className="flex items-center gap-3">
                <button onClick={() => setForm(f => ({ ...f, status: 'Draft' }))} className="px-5 py-2.5 rounded-xl text-sm font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
                  Save as Draft
                </button>
                <button onClick={handleCreateInvoice} disabled={createLoading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black text-white bg-gradient-to-r from-[#7b68ee] to-[#5b4fc4] shadow-lg shadow-[#7b68ee]/30 hover:shadow-[#7b68ee]/50 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60">
                  {createLoading
                    ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <ReceiptLongRounded sx={{ fontSize: 18 }} />}
                  Create Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Templates ── */}
      {tab === 'templates' && (
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Template form */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-sm font-black text-slate-800 mb-4">
                {editingTmpl ? 'Edit Template' : 'Create New Template'}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Template Name *</label><input className={inputCls} value={tmplForm.name} onChange={e => setTmplForm(f => ({ ...f, name: e.target.value }))} placeholder="My Company Template" /></div>
                <div><label className={labelCls}>Style</label>
                  <select className={inputCls} value={tmplForm.templateStyle} onChange={e => setTmplForm(f => ({ ...f, templateStyle: e.target.value }))}>
                    <option value="classic">Classic</option>
                    <option value="modern">Modern</option>
                    <option value="minimal">Minimal</option>
                  </select>
                </div>
                <div><label className={labelCls}>Company Name</label><input className={inputCls} value={tmplForm.companyName} onChange={e => setTmplForm(f => ({ ...f, companyName: e.target.value }))} placeholder="Bivith Inc." /></div>
                <div><label className={labelCls}>Company Email</label><input className={inputCls} value={tmplForm.companyEmail} onChange={e => setTmplForm(f => ({ ...f, companyEmail: e.target.value }))} placeholder="billing@company.com" /></div>
                <div><label className={labelCls}>Phone</label><input className={inputCls} value={tmplForm.companyPhone} onChange={e => setTmplForm(f => ({ ...f, companyPhone: e.target.value }))} placeholder="+1 800 000 0000" /></div>
                <div><label className={labelCls}>Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={tmplForm.primaryColor} onChange={e => setTmplForm(f => ({ ...f, primaryColor: e.target.value }))} className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-1" />
                    <span className="text-xs text-slate-400">{tmplForm.primaryColor}</span>
                  </div>
                </div>
                <div className="col-span-2"><label className={labelCls}>Company Address</label><textarea className={inputCls} rows={2} value={tmplForm.companyAddress} onChange={e => setTmplForm(f => ({ ...f, companyAddress: e.target.value }))} placeholder="456 Business Ave, Suite 100" /></div>
                <div className="col-span-2"><label className={labelCls}>Footer Text</label><input className={inputCls} value={tmplForm.footerText} onChange={e => setTmplForm(f => ({ ...f, footerText: e.target.value }))} placeholder="Thank you for your business!" /></div>
                <div className="col-span-2 flex items-center gap-2">
                  <input type="checkbox" id="isDefault" checked={tmplForm.isDefault} onChange={e => setTmplForm(f => ({ ...f, isDefault: e.target.checked }))} className="w-4 h-4 accent-[#7b68ee]" />
                  <label htmlFor="isDefault" className="text-sm font-medium text-slate-600 cursor-pointer">Set as default template</label>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                {editingTmpl && <button onClick={() => { setEditingTmpl(null); setTmplForm({ name: '', templateStyle: 'classic', companyName: '', companyAddress: '', companyPhone: '', companyEmail: '', primaryColor: '#7b68ee', footerText: 'Thank you for your business!', isDefault: false }); }} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all">Cancel</button>}
                <button onClick={handleSaveTemplate} disabled={tmplLoading || !tmplForm.name}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black text-white bg-gradient-to-r from-[#7b68ee] to-[#5b4fc4] shadow-lg shadow-[#7b68ee]/25 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60">
                  {tmplLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <PaletteRounded sx={{ fontSize: 16 }} />}
                  {editingTmpl ? 'Update Template' : 'Save Template'}
                </button>
              </div>
            </div>

            {/* Template list */}
            {templates.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider px-1">Saved Templates</h3>
                {templates.map(tmpl => (
                  <div key={tmpl.id} className="bg-white rounded-2xl p-5 border border-slate-200 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: tmpl.primaryColor + '20' }}>
                        <PaletteRounded sx={{ fontSize: 20, color: tmpl.primaryColor }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-slate-800">{tmpl.name}</span>
                          {tmpl.isDefault && <span className="text-[9px] font-black uppercase tracking-wider bg-[#7b68ee]/10 text-[#7b68ee] px-2 py-0.5 rounded-full">Default</span>}
                        </div>
                        <div className="text-xs text-slate-400 capitalize">{tmpl.templateStyle} · {tmpl.companyName || 'No company set'}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startEditTemplate(tmpl)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all">
                        <EditRounded sx={{ fontSize: 16 }} />
                      </button>
                      <button onClick={() => handleDeleteTemplate(tmpl.id)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-all">
                        <DeleteRounded sx={{ fontSize: 16 }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Preview Modal ── */}
      {previewInvoice && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <div>
                <div className="font-black text-slate-900">{previewInvoice.invoiceNumber}</div>
                <div className="text-xs text-slate-400">{previewInvoice.customerName} · {previewInvoice.currency} {parseFloat(previewInvoice.totalAmount || 0).toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleGeneratePDF(previewInvoice)} disabled={pdfLoading[previewInvoice.id]}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#7b68ee] text-white hover:bg-[#6c58e0] transition-all disabled:opacity-60">
                  <PictureAsPdfRounded sx={{ fontSize: 14 }} />
                  {pdfLoading[previewInvoice.id] ? 'Generating…' : 'Generate PDF'}
                </button>
                {previewInvoice.pdfPath && (
                  <a href={`/api/invoices/${previewInvoice.id}/download-pdf`} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition-all">
                    <DownloadRounded sx={{ fontSize: 14 }} /> Download
                  </a>
                )}
                <button onClick={() => { setPreviewInvoice(null); setPreviewHtml(''); }}
                  className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 transition-all">
                  <CloseRounded sx={{ fontSize: 18 }} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-slate-100 p-6">
              {previewLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="w-8 h-8 border-3 border-[#7b68ee]/20 border-t-[#7b68ee] rounded-full animate-spin" style={{ borderWidth: 3 }} />
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <iframe
                    srcDoc={previewHtml}
                    title="Invoice Preview"
                    className="w-full"
                    style={{ minHeight: '800px', border: 'none' }}
                    sandbox="allow-same-origin"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicePage;
