
import React, { useState, useRef, useEffect } from 'react';
import { Download, Copy, Check, Edit2, Plus, MessageSquare, Save, Trash2, FileText, Type } from 'lucide-react';
import { TranscriptionSegment, SpeakerMap } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface TranscriptionTableProps {
  initialSegments: TranscriptionSegment[];
}

const TranscriptionTable: React.FC<TranscriptionTableProps> = ({ initialSegments }) => {
  const [segments, setSegments] = useState<TranscriptionSegment[]>(initialSegments);
  const [speakerMap, setSpeakerMap] = useState<SpeakerMap>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);

  // Update segments when props change (new transcription)
  useEffect(() => {
    setSegments(initialSegments);
    
    // Extract unique speakers to initialize map
    const speakers = new Set(initialSegments.map(s => s.speaker));
    const newMap: SpeakerMap = {};
    speakers.forEach(s => newMap[s] = s);
    setSpeakerMap(newMap);
  }, [initialSegments]);

  // --- Handlers ---

  const handleSpeakerRename = (originalName: string, newName: string) => {
    setSpeakerMap(prev => ({
      ...prev,
      [originalName]: newName
    }));
  };

  const handleTextEdit = (id: string, newText: string) => {
    setSegments(prev => prev.map(s => s.id === id ? { ...s, text: newText } : s));
  };

  const handleAddSection = (index: number) => {
    const newSegments = [...segments];
    // Mark the segment at this index as a section header
    newSegments[index] = {
      ...newSegments[index],
      isSectionHeader: true,
      sectionTitle: "New Chapter"
    };
    setSegments(newSegments);
  };

  const handleRemoveSection = (index: number) => {
    const newSegments = [...segments];
    newSegments[index] = {
      ...newSegments[index],
      isSectionHeader: false,
      sectionTitle: undefined
    };
    setSegments(newSegments);
  };

  const handleSectionTitleEdit = (index: number, title: string) => {
    const newSegments = [...segments];
    if (newSegments[index]) {
        newSegments[index] = { ...newSegments[index], sectionTitle: title };
        setSegments(newSegments);
    }
  };

  const handleAddNote = (id: string) => {
    const note = prompt("Enter personal note for this segment:");
    if (note) {
      setSegments(prev => prev.map(s => s.id === id ? { ...s, note } : s));
    }
  };

  // --- Export ---

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text("Podcast Transcript", 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 28);

    const tableBody = segments.map(s => {
      // Logic for formatting rows in PDF
      // If it's a section header, we might want to show that
      const speakerName = speakerMap[s.speaker] || s.speaker;
      let content = s.text;
      
      if (s.isSectionHeader && s.sectionTitle) {
        content = `[CHAPTER: ${s.sectionTitle.toUpperCase()}]\n\n` + content;
      }
      
      if (s.note) {
        content += `\n\n(Note: ${s.note})`;
      }

      return [s.timestamp, speakerName, content];
    });

    autoTable(doc, {
      head: [['Time', 'Speaker', 'Transcript']],
      body: tableBody,
      startY: 35,
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: {
        0: { cellWidth: 25 }, // Time
        1: { cellWidth: 35, fontStyle: 'bold', textColor: [79, 70, 229] }, // Speaker
        2: { cellWidth: 'auto' } // Text
      },
      didDrawPage: function (data) {
        // Footer page number
        let str = 'Page ' + doc.getNumberOfPages();
        doc.setFontSize(8);
        doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 10);
      }
    });

    doc.save('transcript.pdf');
  };

  const handleDownloadCSV = () => {
    const headers = ['Timestamp,Speaker,Text,Notes'];
    const csvContent = segments
      .map((s) => {
        const sp = speakerMap[s.speaker] || s.speaker;
        const note = s.note ? ` [Note: ${s.note}]` : '';
        const section = s.isSectionHeader ? `[Chapter: ${s.sectionTitle}] ` : '';
        return `"${s.timestamp}","${sp}","${section}${s.text.replace(/"/g, '""')}${note}"`;
      })
      .join('\n');
    
    const blob = new Blob([headers.concat(csvContent).join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'transcription.csv');
    link.click();
  };

  // --- Render ---

  if (segments.length === 0) return null;

  const uniqueSpeakers = Object.keys(speakerMap);

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 animate-fade-in-up pb-20">
      
      {/* Top Controls: Speaker Renaming & Exports */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Transcript Editor</h2>
            <p className="text-sm text-slate-500">Edit text, rename speakers, and add chapters.</p>
          </div>
          <div className="flex gap-2">
             <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Download size={16} /> CSV
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
            >
              <FileText size={16} /> Export PDF
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
          <span className="text-sm font-semibold text-slate-600 flex items-center gap-2">
            <Edit2 size={14} /> Rename Speakers:
          </span>
          {uniqueSpeakers.map(sp => (
            <div key={sp} className="flex items-center gap-2">
              <span className="text-xs text-slate-400 uppercase tracking-wide">{sp} &rarr;</span>
              <input 
                type="text" 
                value={speakerMap[sp]}
                onChange={(e) => handleSpeakerRename(sp, e.target.value)}
                className="px-2 py-1 text-sm border border-slate-300 rounded bg-white w-32 focus:ring-2 focus:ring-primary/50 outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-visible">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">
                Time
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-40">
                Speaker
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Transcript
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {segments.map((segment, idx) => (
              <React.Fragment key={segment.id}>
                {/* Chapter / Section Header Row */}
                {segment.isSectionHeader && (
                  <tr className="bg-indigo-50/50">
                    <td colSpan={3} className="px-6 py-3">
                      <div className="flex items-center gap-3 group">
                        <div className="flex items-center gap-2 text-indigo-700 font-bold">
                           <Type size={16} />
                           <input 
                              type="text"
                              value={segment.sectionTitle || ''}
                              onChange={(e) => handleSectionTitleEdit(idx, e.target.value)}
                              className="bg-transparent border-b border-indigo-200 focus:border-indigo-500 outline-none px-1"
                              placeholder="Chapter Title"
                           />
                        </div>
                        <button 
                          onClick={() => handleRemoveSection(idx)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity"
                          title="Remove Chapter"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}

                {/* Main Content Row */}
                <tr 
                  className={`hover-trigger relative transition-colors ${hoveredRowId === segment.id ? 'bg-slate-50' : ''}`}
                  onMouseEnter={() => setHoveredRowId(segment.id)}
                  onMouseLeave={() => setHoveredRowId(null)}
                >
                  {/* Hover Menu floating over/near timestamp */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-500 font-mono relative align-top">
                    {segment.timestamp}
                    
                    {/* The Action Tooltip */}
                    <div className="hover-target absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-2 flex gap-1 z-10">
                       <div className="flex flex-col gap-1 bg-white border border-slate-200 shadow-lg rounded-lg p-1">
                          <button 
                            onClick={() => handleAddSection(idx)} 
                            title="Add Chapter/Section"
                            className="p-1.5 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 rounded"
                          >
                            <Type size={14} />
                          </button>
                          <button 
                            onClick={() => handleAddNote(segment.id)}
                            title="Add Note"
                            className="p-1.5 hover:bg-yellow-50 text-slate-500 hover:text-yellow-600 rounded"
                          >
                            <MessageSquare size={14} />
                          </button>
                          <button 
                            onClick={() => setEditingId(editingId === segment.id ? null : segment.id)}
                            title="Edit Text"
                            className={`p-1.5 rounded ${editingId === segment.id ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-slate-100 text-slate-500'}`}
                          >
                            <Edit2 size={14} />
                          </button>
                       </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 font-semibold align-top">
                    {speakerMap[segment.speaker] || segment.speaker}
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-800 leading-relaxed align-top relative group">
                    {editingId === segment.id ? (
                      <textarea
                        className="w-full min-h-[80px] p-2 border border-indigo-300 rounded focus:ring-2 focus:ring-indigo-200 outline-none"
                        value={segment.text}
                        onChange={(e) => handleTextEdit(segment.id, e.target.value)}
                        autoFocus
                        onBlur={() => setEditingId(null)} // Save on click away
                      />
                    ) : (
                      <div onClick={() => setEditingId(segment.id)} className="cursor-text p-1 -m-1 rounded hover:bg-white/50">
                        {segment.text}
                      </div>
                    )}
                    
                    {segment.note && (
                      <div className="mt-2 text-xs bg-yellow-50 border border-yellow-200 text-yellow-800 p-2 rounded flex items-start gap-2">
                        <MessageSquare size={12} className="mt-0.5 shrink-0" />
                        <span>{segment.note}</span>
                      </div>
                    )}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TranscriptionTable;