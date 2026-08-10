import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { CustomerRecord, StoreLocation } from '../types';
import { GOLF_TOWN_STORES, findGolfTownStore } from '../data/golfTownStores';
import { guessGender } from '../data/initialData';
import { parseRowWithSmartAlignment, sanitizeCustomerRecord, isHeaderRow, extractColIndexes } from '../data/dataSanitizer';
import { Upload, FileSpreadsheet, Check, MapPin, Store, AlertCircle, X, ChevronRight, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

interface SheetParsedData {
  sheetName: string;
  detectedStoreId: string;
  detectedStoreName: string;
  records: CustomerRecord[];
  selected: boolean;
  totalBalance: number;
}

interface XlsxUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportCustomers: (newRecords: CustomerRecord[], newStores?: StoreLocation[]) => void;
  existingStores: StoreLocation[];
}

const INTERNAL_FIELDS = [
  { key: 'firstName', label: 'First Name (Required)', required: true },
  { key: 'lastName', label: 'Last Name (Required)', required: true },
  { key: 'custId', label: 'Customer ID', required: false },
  { key: 'balance', label: 'Store Credit Balance', required: true },
  { key: 'email', label: 'Email Address', required: false },
  { key: 'phone', label: 'Phone Number', required: false },
  { key: 'company', label: 'Company Name', required: false },
  { key: 'city', label: 'City', required: false },
  { key: 'comments', label: 'Comments / Notes', required: false },
];

export const XlsxUploadModal: React.FC<XlsxUploadModalProps> = ({
  isOpen,
  onClose,
  onImportCustomers,
  existingStores,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedSheets, setParsedSheets] = useState<SheetParsedData[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTabIdx, setActiveTabIdx] = useState<number>(0);

  // Mapping state
  const [step, setStep] = useState<'upload' | 'mapping' | 'review'>('upload');
  const [workbookData, setWorkbookData] = useState<XLSX.WorkBook | null>(null);
  const [extractedHeaders, setExtractedHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, number>>({});

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const selectedFile = files[0];
    setFile(selectedFile);
    await loadWorkbookForMapping(selectedFile);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);
      await loadWorkbookForMapping(selectedFile);
    }
  };

  const loadWorkbookForMapping = async (fileToProcess: File) => {
    setLoading(true);
    try {
      const arrayBuffer = await fileToProcess.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      setWorkbookData(workbook);

      let headers: string[] = [];
      if (workbook.SheetNames.length > 0) {
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

        for (const row of rows) {
          if (isHeaderRow(row)) {
            headers = row.map(c => String(c || '').trim());
            break;
          }
        }
        
        // Fallback if no header row clearly detected
        if (headers.length === 0) {
          for (const row of rows) {
            if (row.length > 0 && row.some(c => String(c).trim() !== '')) {
              headers = row.map(c => String(c || '').trim());
              break;
            }
          }
        }
      }

      setExtractedHeaders(headers);
      const initialMapping = extractColIndexes(headers);
      setColumnMapping(initialMapping);
      setStep('mapping');

    } catch (err) {
      console.error('Error reading workbook:', err);
      alert('Failed to read XLSX file.');
    } finally {
      setLoading(false);
    }
  };

  const proceedToProcessing = async () => {
    if (!workbookData) return;
    await processWorkbook(workbookData, columnMapping);
  };

  const handleMappingChange = (internalKey: string, headerIndexStr: string) => {
    setColumnMapping(prev => {
      const newMapping = { ...prev };
      if (headerIndexStr === '') {
        delete newMapping[internalKey];
      } else {
        newMapping[internalKey] = parseInt(headerIndexStr, 10);
      }
      return newMapping;
    });
  };

  const processWorkbook = async (workbook: XLSX.WorkBook, finalMapping: Record<string, number>) => {
    setLoading(true);
    setStep('review');
    try {
      const sheetResults: SheetParsedData[] = [];

      for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];
        const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

        if (!rows || rows.length === 0) continue;

        // Auto-detect store from sheet name or text in first 10 rows
        let matchedStore = findGolfTownStore(sheetName);
        if (!matchedStore) {
          const topText = rows.slice(0, 10).flatMap(r => r).join(' ');
          matchedStore = findGolfTownStore(topText);
        }

        const storeId = matchedStore ? matchedStore.id : '504';
        const storeName = matchedStore ? matchedStore.name : `Store ${storeId} - Golf Town Location`;
        const storeCity = matchedStore ? matchedStore.city : 'Calgary';

        const records: CustomerRecord[] = [];

        // Apply finalMapping across the entire workbook
        const activeColIndexes = { ...finalMapping };

        for (let i = 0; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0) continue;

          // Pass true for forceColIndexes so it doesn't re-detect headers and overwrite our mapped columns
          const parsed = parseRowWithSmartAlignment(row, activeColIndexes, storeCity, true);

          if (!parsed.parsedFields) continue;

          const {
            rawCustId,
            firstName,
            lastName,
            company,
            email,
            phone,
            city,
            balanceNum,
            comments,
            createdDate,
            saleDate
          } = parsed.parsedFields;

          if (!firstName && !lastName && !rawCustId) continue;

          const genderData = guessGender(firstName);

          const uncleanedRecord: CustomerRecord = {
            id: `import-${storeId}-${records.length + 1}-${Math.random().toString(36).substr(2, 5)}`,
            storeId,
            storeName,
            quarter: 'Q1',
            year: 2026,
            quarterYearKey: '2026-Q1',
            city: city || storeCity || 'Calgary',
            lastCreatedDate: createdDate || new Date().toLocaleDateString(),
            lastSaleDate: saleDate || new Date().toLocaleDateString(),
            custId: rawCustId || `CUST-${Math.floor(10000000 + Math.random() * 90000000)}`,
            firstName,
            lastName,
            company,
            email,
            phone: phone || '(403) 723-0100',
            sumOfStoreCreditBalance: balanceNum,
            comments,
            approvedBy: '',
            gender: genderData.gender,
            genderConfidence: genderData.confidence
          };

          const cleanRecord = sanitizeCustomerRecord(uncleanedRecord);
          records.push(cleanRecord);
        }

        const totalBalance = records.reduce((sum, r) => sum + r.sumOfStoreCreditBalance, 0);

        sheetResults.push({
          sheetName,
          detectedStoreId: storeId,
          detectedStoreName: storeName,
          records,
          selected: true,
          totalBalance
        });
      }

      setParsedSheets(sheetResults);
      setActiveTabIdx(0);
    } catch (err) {
      console.error('Error parsing XLSX workbook:', err);
      alert('Failed to parse multi-tab XLSX file. Please verify the file format.');
    } finally {
      setLoading(false);
    }
  };

  const handleStoreChangeForSheet = (sheetIndex: number, newStoreId: string) => {
    const store = GOLF_TOWN_STORES.find(s => s.id === newStoreId);
    if (!store) return;

    setParsedSheets(prev => prev.map((sheet, idx) => {
      if (idx !== sheetIndex) return sheet;
      const updatedRecords = sheet.records.map(r => ({
        ...r,
        storeId: store.id,
        storeName: store.name,
        city: store.city || r.city
      }));
      return {
        ...sheet,
        detectedStoreId: store.id,
        detectedStoreName: store.name,
        records: updatedRecords
      };
    }));
  };

  const toggleSheetSelected = (sheetIndex: number) => {
    setParsedSheets(prev => prev.map((s, idx) => idx === sheetIndex ? { ...s, selected: !s.selected } : s));
  };

  const handleConfirmImport = () => {
    const selectedSheets = parsedSheets.filter(s => s.selected);
    const allRecordsToImport = selectedSheets.flatMap(s => s.records);

    if (allRecordsToImport.length === 0) {
      alert('No records selected for import.');
      return;
    }

    // Collect stores that might need adding
    const newStoresToAdd: StoreLocation[] = [];
    selectedSheets.forEach(s => {
      const match = GOLF_TOWN_STORES.find(gs => gs.id === s.detectedStoreId);
      if (match && !existingStores.some(ex => ex.id === match.id)) {
        newStoresToAdd.push(match);
      }
    });

    onImportCustomers(allRecordsToImport, newStoresToAdd);
    onClose();
  };

  const activeSheet = parsedSheets[activeTabIdx];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 text-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-200 shadow-xs">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black tracking-widest text-emerald-800 uppercase bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                POS Reconciliation Engine
              </span>
              <h3 className="text-xl font-black mt-1 text-slate-900 tracking-tight">Import Golf Town Excel Workbook</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer border border-transparent hover:border-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* File Upload Zone */}
          {step === 'upload' && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/30 rounded-3xl p-12 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-4 group"
            >
              <div className="p-5 bg-white border border-slate-200 text-slate-400 group-hover:text-emerald-700 group-hover:scale-110 rounded-2xl shadow-sm transition-all">
                <Upload className="w-10 h-10" />
              </div>
              <div>
                <p className="text-lg font-black text-slate-900">
                  Drag & Drop Multi-Tab XLSX or Click to Browse
                </p>
                <p className="text-xs text-slate-500 font-bold mt-1">
                  Supports .xlsx, .xls, .csv files containing multiple Golf Town store tabs
                </p>
              </div>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
                id="xlsx-file-input"
              />
              <label
                htmlFor="xlsx-file-input"
                className="px-8 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-lg transition-all cursor-pointer inline-flex items-center gap-2 active:scale-95"
              >
                Select Excel File
              </label>
            </div>
          )}
          
          {/* Mapping Step */}
          {step === 'mapping' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
                <h4 className="text-emerald-900 font-black text-lg mb-2">Column Mapping</h4>
                <p className="text-emerald-700 text-sm">
                  We extracted the following headers from your file. Please match them to the correct system fields before processing.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-black uppercase tracking-widest text-[10px]">
                    <tr>
                      <th className="px-6 py-4 w-1/3">System Field</th>
                      <th className="px-6 py-4">Your Spreadsheet Column</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {INTERNAL_FIELDS.map((field) => (
                      <tr key={field.key} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-800">{field.label}</span>
                          {field.required && <span className="ml-2 text-rose-500 font-black">*</span>}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={columnMapping[field.key] !== undefined ? columnMapping[field.key] : ''}
                            onChange={(e) => handleMappingChange(field.key, e.target.value)}
                            className="w-full max-w-md px-4 py-2 bg-white border border-slate-300 rounded-xl text-slate-700 font-medium focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                          >
                            <option value="">-- Ignore / Do Not Map --</option>
                            {extractedHeaders.map((header, idx) => (
                              <option key={idx} value={idx}>
                                Column {idx + 1}: {header || '(Empty)'}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Review Step */}
          {step === 'review' && parsedSheets.length > 0 && (
            <div className="space-y-6">
              {/* File Info Bar */}
              <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-xs text-emerald-700">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">{file?.name}</p>
                    <p className="text-xs text-slate-500 font-bold">
                      Found {parsedSheets.length} sheet tabs • {parsedSheets.reduce((sum, s) => sum + s.records.length, 0)} total records
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setStep('mapping')}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all active:scale-95"
                  >
                    Edit Mapping
                  </button>
                  <label
                    htmlFor="xlsx-file-input-change"
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl shadow-xs cursor-pointer transition-all active:scale-95"
                  >
                    Change File
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileChange}
                      className="hidden"
                      id="xlsx-file-input-change"
                    />
                  </label>
                </div>
              </div>

              {/* Sheet Tabs Navigation */}
              <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
                {parsedSheets.map((s, idx) => (
                  <button
                    key={s.sheetName}
                    onClick={() => setActiveTabIdx(idx)}
                    className={`flex items-center gap-3 px-5 py-2.5 text-xs font-bold rounded-xl transition-all border whitespace-nowrap shadow-xs ${
                      activeTabIdx === idx
                        ? 'bg-emerald-800 text-white border-emerald-900 shadow-md ring-2 ring-emerald-500/20'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={s.selected}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleSheetSelected(idx);
                      }}
                      className="rounded border-slate-300 text-emerald-700 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                    />
                    <span>{s.sheetName}</span>
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${activeTabIdx === idx ? 'bg-emerald-700/50 text-white' : 'bg-slate-100 text-slate-700'}`}>
                      {s.records.length} RECS
                    </span>
                  </button>
                ))}
              </div>

              {/* Active Sheet Details & Store Assignment */}
              {activeSheet && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="p-5 bg-white rounded-3xl border border-slate-200 flex flex-wrap items-center justify-between gap-6 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-2xl shadow-xs">
                        <Store className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Store Location Mapping: "{activeSheet.sheetName}"
                        </p>
                        <p className="text-base font-black text-slate-900 mt-0.5">
                          {activeSheet.detectedStoreName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-2.5 rounded-2xl">
                      <label className="text-xs font-bold text-slate-500 pl-2">Assign POS Store:</label>
                      <select
                        value={activeSheet.detectedStoreId}
                        onChange={(e) => handleStoreChangeForSheet(activeTabIdx, e.target.value)}
                        className="px-4 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl shadow-xs focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 focus:outline-none cursor-pointer transition-all"
                      >
                        {GOLF_TOWN_STORES.map(gs => (
                          <option key={gs.id} value={gs.id}>
                            Store #{gs.id} - {gs.name} ({gs.city})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Customer Record Preview Table */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
                    <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <span className="p-1 bg-emerald-100 text-emerald-800 rounded-md">
                          <Check className="w-3 h-3" />
                        </span>
                        <span className="text-xs font-black text-slate-900">
                          Previewing {activeSheet.records.length} Records
                        </span>
                      </div>
                      <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-black text-emerald-800 shadow-xs">
                        Total Balance: ${activeSheet.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                    </div>

                    <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-400 font-black uppercase tracking-widest text-[9px] border-b border-slate-200 sticky top-0 z-10 shadow-xs">
                          <tr>
                            <th className="px-5 py-4">Cust ID</th>
                            <th className="px-5 py-4">Name</th>
                            <th className="px-5 py-4">City</th>
                            <th className="px-5 py-4 text-right">Credit Balance</th>
                            <th className="px-5 py-4">Status / Comments</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-800 font-bold">
                          {activeSheet.records.slice(0, 50).map((r, i) => (
                            <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                              <td className="px-5 py-3 font-mono text-[10px] text-slate-500">{r.custId}</td>
                              <td className="px-5 py-3 text-slate-900">{r.firstName} {r.lastName}</td>
                              <td className="px-5 py-3 text-slate-500">{r.city || 'Calgary'}</td>
                              <td className="px-5 py-3 text-right font-black text-slate-900">
                                <span className="bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg">
                                  ${r.sumOfStoreCreditBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                              </td>
                              <td className="px-5 py-3">
                                <div className="flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                  <span className="text-slate-400 font-medium text-[10px] max-w-[200px] truncate">{r.comments || 'Direct POS Sync'}</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step === 'review' && (
              <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-black text-slate-500 shadow-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>{parsedSheets.filter(s => s.selected).length} Sheets Active</span>
              </div>
            )}
            {step === 'mapping' && (
              <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-black text-slate-500 shadow-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-emerald-700" />
                <span>Map required fields to continue</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>

            {step === 'mapping' && (
              <button
                onClick={proceedToProcessing}
                disabled={loading}
                className="px-8 py-2.5 text-sm font-black text-white bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-emerald-900/10 transition-all inline-flex items-center gap-2 active:scale-95"
              >
                Continue to Review
                <ArrowRight className="w-5 h-5" />
              </button>
            )}

            {step === 'review' && (
              <button
                onClick={handleConfirmImport}
                disabled={parsedSheets.length === 0 || !parsedSheets.some(s => s.selected)}
                className="px-8 py-2.5 text-sm font-black text-white bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-emerald-900/10 transition-all inline-flex items-center gap-2 active:scale-95"
              >
                <Check className="w-5 h-5" />
                Commit Selected Tabs
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
