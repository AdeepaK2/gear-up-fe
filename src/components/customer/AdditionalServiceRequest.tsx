"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Upload,
  FileText,
  Image,
  X,
  Send,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AdditionalServiceRequest } from "@/lib/types/Project";

interface AdditionalServiceRequestProps {
  onSubmit: (request: {
    customRequest: string;
    referenceFile?: File;
  }) => Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function AdditionalServiceRequestForm({
  onSubmit,
  isLoading = false,
  disabled = false,
}: AdditionalServiceRequestProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [customRequest, setCustomRequest] = useState("");
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customRequest.trim()) return;

    try {
      await onSubmit({
        customRequest: customRequest.trim(),
        referenceFile: referenceFile || undefined,
      });

      // Reset form
      setCustomRequest("");
      setReferenceFile(null);
      setIsExpanded(false);
    } catch (error) {
      console.error("Error submitting additional service request:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReferenceFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setReferenceFile(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setReferenceFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <Image className="h-5 w-5 text-blue-500" />;
    }
    return <FileText className="h-5 w-5 text-gray-500" />;
  };

  if (!isExpanded) {
    return (
      <Card className="border-2 border-dashed border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200">
        <CardContent className="p-6">
          <Button
            onClick={() => setIsExpanded(true)}
            variant="ghost"
            className="w-full h-auto p-4 text-left hover:bg-white/50"
            disabled={disabled}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-1">
                  Need something else?
                </h3>
                <p className="text-blue-700 text-sm">
                  Request additional services not listed above
                </p>
              </div>
              <div className="ml-auto">
                <HelpCircle className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50"
      id="additional-service-request"
    >
      <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 border-b border-blue-200">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-blue-900">
            <div className="p-2 bg-blue-200 rounded-lg">
              <Plus className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <div className="text-lg font-bold">
                Request Additional Service
              </div>
              <div className="text-sm font-normal text-blue-700">
                Describe any additional services you need
              </div>
            </div>
          </CardTitle>
          <Button
            onClick={() => setIsExpanded(false)}
            variant="ghost"
            size="sm"
            className="hover:bg-blue-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Description */}
          <div className="space-y-2">
            <Label
              htmlFor="customRequest"
              className="text-blue-900 font-medium"
            >
              Describe the service you need *
            </Label>
            <textarea
              id="customRequest"
              value={customRequest}
              onChange={(e) => setCustomRequest(e.target.value)}
              placeholder="Example: Replace brake pads, fix air conditioning, install new tires, etc."
              rows={4}
              className="w-full px-3 py-3 border-2 border-blue-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              disabled={isLoading || disabled}
              required
            />
            <p className="text-sm text-blue-600">
              Be as specific as possible to help us understand your needs
            </p>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label className="text-blue-900 font-medium">
              Reference File (Optional)
            </Label>
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                dragActive
                  ? "border-blue-500 bg-blue-100"
                  : "border-blue-300 bg-white hover:bg-blue-50"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {referenceFile ? (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getFileIcon(referenceFile)}
                    <div className="text-left">
                      <p className="font-medium text-gray-900">
                        {referenceFile.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(referenceFile.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={removeFile}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-blue-900 font-medium mb-1">
                    Upload a reference image or document
                  </p>
                  <p className="text-sm text-blue-600 mb-3">
                    Drag and drop or click to browse
                  </p>
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    disabled={isLoading || disabled}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt"
                disabled={isLoading || disabled}
              />
            </div>
            <p className="text-xs text-blue-600">
              Supported formats: Images (JPG, PNG, GIF), PDF, Word documents
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={!customRequest.trim() || isLoading || disabled}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              {isLoading ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Request
                </>
              )}
            </Button>

            <Button
              type="button"
              onClick={() => setIsExpanded(false)}
              variant="outline"
              className="border-2 border-gray-300 hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">How it works</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Our technicians will review your request</li>
                <li>• You'll receive an estimate within 24 hours</li>
                <li>• Once approved, it will be added to your project</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
