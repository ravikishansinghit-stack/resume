import React, { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import { calculateATSScore } from '@/utils/atsChecker';

interface ATSScoreBarProps {
  resumeData: any;
}

const ATSScoreBar: React.FC<ATSScoreBarProps> = ({ resumeData }) => {
  const analysis = useMemo(() => {
    if (!resumeData) return null;
    return calculateATSScore(resumeData);
  }, [resumeData]);

  if (!analysis) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-400 to-green-600';
    if (score >= 60) return 'from-blue-400 to-blue-600';
    if (score >= 40) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">ATS Score:</span>
            <span className={`text-sm font-bold bg-gradient-to-r ${getScoreColor(analysis.score)} bg-clip-text text-transparent`}>
              {Math.round(analysis.score)}%
            </span>
          </div>
          <div className="flex-1 max-w-xs">
            <Progress value={analysis.score} className="h-1.5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSScoreBar;
