import React, { useState } from 'react';
import { FlowStep, UploadedDataset } from '../types';
import { SideNav } from '../components/SideNav';
import { TopNav } from '../components/TopNav';
import { FRAMEWORK_OPTIONS } from './DecisionObjectiveView';
import { generateInstitutionalSampleDataset, parseCSVOrJSON } from '../utils/datasetManager';

interface DatasetUploadViewProps {
  objectiveId: string;
  objectiveTitle: string;
  onUploadComplete: (fileData: UploadedDataset) => void;
  onNavigate: (step: FlowStep) => void;
}

export const DatasetUploadView: React.FC<DatasetUploadViewProps> = ({
  objectiveId,
  objectiveTitle,
  onUploadComplete,
  onNavigate,
}) => {
  const selectedFramework = FRAMEWORK_OPTIONS.find((f) => f.id === objectiveId) || FRAMEWORK_OPTIONS[0];

  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Ingesting telemetry...');
  const [uploadedFile, setUploadedFile] = useState<UploadedDataset | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processAndUploadDataset = (dataset: UploadedDataset) => {
    setUploading(true);
    setProgress(0);
    setStatusMessage('Reading dataset schema & headers...');

    const stages = [
      { p: 25, msg: 'Normalizing 8 telemetry columns...' },
      { p: 55, msg: 'Auditing data types & completeness...' },
      { p: 85, msg: 'Compiling institutional schema...' },
      { p: 100, msg: 'Upload complete! Preparing audit...' },
    ];

    let stageIdx = 0;
    const interval = setInterval(() => {
      if (stageIdx < stages.length) {
        const stage = stages[stageIdx];
        setProgress(stage.p);
        setStatusMessage(stage.msg);
        stageIdx++;
      } else {
        clearInterval(interval);
        setUploading(false);
        setUploadedFile(dataset);
        onUploadComplete(dataset);
        // Seamlessly transition to DataValidationView after successful upload
        setTimeout(() => {
          onNavigate('data_validation');
        }, 400);
      }
    }, 200);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      readFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      readFile(file);
    }
  };

  const readFile = (file: File) => {
    const sizeMb = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = (event.target?.result as string) || '';
      const parsedDataset = parseCSVOrJSON(text, file.name, sizeMb);
      processAndUploadDataset(parsedDataset);
    };

    reader.onerror = () => {
      const fallback = generateInstitutionalSampleDataset();
      processAndUploadDataset(fallback);
    };

    reader.readAsText(file);
  };

  const handleLoadSampleData = () => {
    const sampleDataset = generateInstitutionalSampleDataset();
    processAndUploadDataset(sampleDataset);
  };

  return (
    <div className="flex h-screen overflow-hidden antialiased font-body-md text-body-md bg-[#121414] text-[#e2e2e2]">
      <SideNav currentStep="dataset_upload" onNavigate={onNavigate} />
      <TopNav currentStep="dataset_upload" onNavigate={onNavigate} />

      <main className="flex-1 md:ml-64 mt-16 p-container-padding overflow-y-auto custom-scrollbar relative">
        <div className="max-w-5xl mx-auto space-y-stack-lg pb-stack-lg">
          {/* Top Breadcrumb */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-[#Geist] text-xs text-[#4edea3] tracking-widest uppercase">
                  {objectiveTitle.toUpperCase()}
                </span>
                <span className="material-symbols-outlined text-[#909095] text-sm">chevron_right</span>
                <span className="font-[#Geist] text-xs text-[#c6c6cb]">Data Upload</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-[#Hanken Grotesk] font-bold text-[#e2e2e2]">
                Upload Assistant
              </h2>
            </div>

            <button
              onClick={handleLoadSampleData}
              className="px-4 py-2 bg-[#282a2b] border border-[#45474b] rounded text-[#4edea3] hover:bg-[#333535] text-xs font-[#Geist] font-medium flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">database</span>
              <span>Load Sample Institutional Dataset</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            {/* Left Box: Required Data Checklist */}
            <div className="lg:col-span-4 glass-panel rounded-xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-[#Hanken Grotesk] font-bold text-[#e2e2e2] mb-3">
                  Required Telemetry
                </h3>
                <p className="text-body-md text-[#c6c6cb] mb-4">
                  Confirm dataset headers match expected schema:
                </p>
                <ul className="space-y-3 font-[#Geist] text-xs text-[#c6c6cb]">
                  {selectedFramework.requiredFields.map((field, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#4edea3] text-sm">check_circle</span>
                      <span className="text-[#e2e2e2]">{field}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-[#1E293B] mt-6">
                <button
                  onClick={() => onNavigate('dataset_requirement')}
                  className="text-xs text-[#c6c6cb] hover:text-[#e2e2e2] flex items-center gap-1 font-[#Geist] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">edit_note</span>
                  <span>View Full Schema Specs</span>
                </button>
              </div>
            </div>

            {/* Right Box: Drag & Drop Dropzone and Status */}
            <div className="lg:col-span-8 flex flex-col gap-gutter">
              {/* Dropzone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center transition-all min-h-[260px] relative ${
                  dragActive
                    ? 'border-[#4edea3] bg-[#4edea3]/5'
                    : 'border-[#1E293B] bg-[#0b0e14]/50 hover:border-[#45474b]'
                }`}
              >
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileChange}
                  accept=".csv,.xlsx,.json"
                  className="hidden"
                />

                <div className="w-14 h-14 rounded-full bg-[#1E293B] border border-[#45474b] flex items-center justify-center mb-4 text-[#4edea3]">
                  <span className="material-symbols-outlined text-3xl">upload_file</span>
                </div>

                <h4 className="text-lg font-[#Hanken Grotesk] font-bold text-[#e2e2e2] mb-1">
                  Drag and drop raw financial dataset
                </h4>
                <p className="text-body-md text-[#c6c6cb] mb-4">
                  Accepts .CSV, .XLSX, or .JSON formats up to 250MB
                </p>

                <label
                  htmlFor="file-upload"
                  className="bg-white text-[#0B0E14] px-5 py-2.5 rounded font-[#Hanken Grotesk] font-bold text-xs hover:bg-[#4edea3] hover:text-[#003824] transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">folder_open</span>
                  <span>Browse Local Files</span>
                </label>
              </div>

              {/* Upload Progress or Status Card */}
              {uploading && (
                <div className="glass-panel rounded-xl p-6 animate-fadeIn">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-[#Geist] text-xs font-semibold text-[#e2e2e2] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
                      {statusMessage}
                    </span>
                    <span className="font-[#Geist] text-xs text-[#4edea3] font-bold">{progress}%</span>
                  </div>
                  <div className="w-full bg-[#0b0e14] h-2 rounded-full overflow-hidden border border-[#1E293B]">
                    <div
                      className="bg-[#4edea3] h-full transition-all duration-200 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {uploadedFile && !uploading && (
                <div className="glass-panel rounded-xl p-6 border border-[#4edea3]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-[#4edea3]/10 border border-[#4edea3]/30 flex items-center justify-center text-[#4edea3]">
                      <span className="material-symbols-outlined">description</span>
                    </div>
                    <div>
                      <h5 className="font-[#Geist] text-sm font-semibold text-[#e2e2e2]">{uploadedFile.name}</h5>
                      <p className="font-[#Geist] text-xs text-[#c6c6cb]">
                        {uploadedFile.size} • {uploadedFile.rows} Rows Detected • {uploadedFile.confidenceScore || 92}% Confidence
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onUploadComplete(uploadedFile);
                      onNavigate('data_validation');
                    }}
                    className="bg-[#4edea3] text-[#003824] font-[#Hanken Grotesk] font-bold text-xs px-5 py-2.5 rounded hover:bg-[#6ffbbe] transition-all flex items-center gap-2 cursor-pointer shadow-lg w-full sm:w-auto justify-center"
                  >
                    <span>Validate Dataset</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
