"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Clock, TrendingUp } from "lucide-react";
import { timeLogService, type ProjectTimeLogSummary } from "@/lib/services/timeLogService";

interface ProjectTimeLogSummaryProps {
  projectId: number;
}

export default function ProjectTimeLogSummaryCard({ projectId }: ProjectTimeLogSummaryProps) {
  const [summary, setSummary] = useState<ProjectTimeLogSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSummary();
  }, [projectId]);

  const loadSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await timeLogService.getProjectTimeLogSummary(projectId);
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load time log summary");
      console.error("Error loading time log summary:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time Log Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (error || !summary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time Log Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-500">
            {error || "Failed to load summary"}
          </div>
        </CardContent>
      </Card>
    );
  }

  const progressColor = summary.isOverBudget
    ? "rgb(239, 68, 68)" // red-500
    : summary.percentageUsed > 80
    ? "rgb(234, 179, 8)" // yellow-500
    : "rgb(34, 197, 94)"; // green-500

  return (
    <Card className={summary.isOverBudget ? "border-red-300" : ""}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Time Log Summary
          {summary.isOverBudget && (
            <AlertCircle className="h-5 w-5 text-red-500 ml-auto" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Hours Used</span>
            <span className="font-semibold">{summary.percentageUsed.toFixed(1)}%</span>
          </div>
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200">
            <div 
              className="h-full transition-all duration-300 ease-in-out"
              style={{ 
                width: `${Math.min(summary.percentageUsed, 100)}%`,
                backgroundColor: progressColor
              }}
            />
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Estimated Hours</p>
            <p className="text-2xl font-bold text-gray-900">
              {summary.totalEstimatedHours}h
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Logged Hours</p>
            <p className={`text-2xl font-bold ${summary.isOverBudget ? 'text-red-600' : 'text-blue-600'}`}>
              {summary.totalLoggedHours.toFixed(1)}h
            </p>
          </div>
        </div>

        {/* Remaining Hours */}
        <div className={`p-4 rounded-lg ${summary.isOverBudget ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {summary.isOverBudget ? "Over Budget" : "Remaining"}
            </span>
            <span className={`text-xl font-bold ${summary.isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
              {summary.isOverBudget ? '+' : ''}{Math.abs(summary.remainingHours).toFixed(1)}h
            </span>
          </div>
        </div>

        {/* Warning Message */}
        {summary.isOverBudget && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700">
              <p className="font-semibold">Budget Exceeded</p>
              <p className="text-xs mt-1">
                The logged hours have exceeded the estimated hours for this project.
              </p>
            </div>
          </div>
        )}

        {/* Warning for high usage */}
        {!summary.isOverBudget && summary.percentageUsed > 80 && (
          <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <TrendingUp className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-700">
              <p className="font-semibold">Approaching Limit</p>
              <p className="text-xs mt-1">
                You're approaching the estimated hours for this project.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
