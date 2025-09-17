'use client';

import { useState } from 'react';
import { CheckCircle, Circle, ArrowRight, Clock, AlertCircle, Info } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  estimatedTime?: string;
  requirements?: string[];
  tips?: string[];
}

interface StepGuideProps {
  title: string;
  steps: Step[];
  onStepComplete?: (stepId: string) => void;
  onCompleteAll?: () => void;
}

export default function StepGuide({ title, steps, onStepComplete, onCompleteAll }: StepGuideProps) {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const handleStepClick = (stepId: string, index: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps(prev => [...prev, stepId]);
      onStepComplete?.(stepId);
      
      // Auto advance to next step if current step is completed
      if (index === currentStep && index < steps.length - 1) {
        setCurrentStep(index + 1);
      }
    }
  };

  const getStepIcon = (step: Step, index: number) => {
    if (completedSteps.includes(step.id)) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    if (index === currentStep) {
      return <Circle className="h-5 w-5 text-blue-500 fill-current" />;
    }
    return <Circle className="h-5 w-5 text-gray-300" />;
  };

  const getStepStatus = (step: Step, index: number) => {
    if (completedSteps.includes(step.id)) {
      return 'completed';
    }
    if (index === currentStep) {
      return 'current';
    }
    return 'pending';
  };

  const progressPercentage = (completedSteps.length / steps.length) * 100;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{completedSteps.length} / {steps.length} bước hoàn thành</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const status = getStepStatus(step, index);
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = index === currentStep;
          
          return (
            <div
              key={step.id}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                isCurrent 
                  ? 'border-blue-500 bg-blue-50' 
                  : isCompleted 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <button
                  onClick={() => handleStepClick(step.id, index)}
                  className={`flex-shrink-0 mt-1 ${
                    isCurrent || isCompleted ? 'cursor-pointer' : 'cursor-not-allowed'
                  }`}
                  disabled={!isCurrent && !isCompleted}
                >
                  {getStepIcon(step, index)}
                </button>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${
                      isCurrent ? 'text-blue-900' : isCompleted ? 'text-green-900' : 'text-gray-900'
                    }`}>
                      {step.title}
                    </h4>
                    {step.estimatedTime && (
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {step.estimatedTime}
                      </div>
                    )}
                  </div>
                  
                  <p className={`text-sm mt-1 ${
                    isCurrent ? 'text-blue-700' : isCompleted ? 'text-green-700' : 'text-gray-600'
                  }`}>
                    {step.description}
                  </p>

                  {/* Requirements */}
                  {step.requirements && step.requirements.length > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center text-xs font-medium text-gray-700 mb-1">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Yêu cầu:
                      </div>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {step.requirements.map((req, reqIndex) => (
                          <li key={reqIndex} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tips */}
                  {step.tips && step.tips.length > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center text-xs font-medium text-gray-700 mb-1">
                        <Info className="h-3 w-3 mr-1" />
                        Mẹo:
                      </div>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {step.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start">
                            <span className="mr-2">💡</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Button */}
                  {isCurrent && !isCompleted && (
                    <button
                      onClick={() => handleStepClick(step.id, index)}
                      className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors flex items-center"
                    >
                      Hoàn thành bước này
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Message */}
      {completedSteps.length === steps.length && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-green-800 font-medium">
              Chúc mừng! Bạn đã hoàn thành tất cả các bước.
            </span>
          </div>
          {onCompleteAll && (
            <button
              onClick={onCompleteAll}
              className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              Tiếp tục với bước tiếp theo
            </button>
          )}
        </div>
      )}
    </div>
  );
}
