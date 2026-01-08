import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Shield, LayoutDashboard, Package, CheckCircle, Sparkles } from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: () => void;
  onSkip: () => void;
  userName?: string;
}

const steps = [
  {
    id: 'welcome',
    title: 'ברוכים הבאים ל-SafeM!',
    description: 'מערכת ניהול בטיחות וציוד מתקדמת שתעזור לך לנהל את הבדיקות והציוד בצורה יעילה.',
    icon: Shield,
    color: 'bg-indigo-500',
  },
  {
    id: 'dashboard',
    title: 'לוח הבקרה',
    description: 'בלוח הבקרה תוכל לראות סקירה כללית של כל הפעילות - ציוד, בדיקות, ממצאים ועוד. כאן תמיד תדע מה המצב.',
    icon: LayoutDashboard,
    color: 'bg-cyan-500',
  },
  {
    id: 'equipment',
    title: 'ניהול ציוד',
    description: 'הוסף ציוד חדש, עקוב אחר תאריכי בדיקה, וקבל התראות על ציוד שדורש טיפול. הכל במקום אחד.',
    icon: Package,
    color: 'bg-emerald-500',
  },
  {
    id: 'ready',
    title: 'מוכן להתחיל!',
    description: 'עכשיו אתה מוכן להשתמש במערכת. אם יש לך שאלות, תמיד אפשר לפנות לתמיכה.',
    icon: CheckCircle,
    color: 'bg-green-500',
  },
];

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete, onSkip, userName }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = steps[currentStep];
  const Icon = step.icon;
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="text-sm text-slate-400">מדריך התחלה מהירה</span>
          </div>
          <button
            onClick={onSkip}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${step.color} text-white mb-6 shadow-lg`}>
            <Icon className="w-10 h-10" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-3">
            {currentStep === 0 && userName ? `שלום ${userName}! ` : ''}{step.title}
          </h2>

          {/* Description */}
          <p className="text-slate-300 leading-relaxed">{step.description}</p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 pb-4">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentStep
                  ? 'bg-cyan-400 w-6'
                  : index < currentStep
                  ? 'bg-cyan-400/50'
                  : 'bg-slate-600'
              }`}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-slate-700 bg-slate-800/50">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
            הקודם
          </button>

          <button
            onClick={onSkip}
            className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            דלג על ההדרכה
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors"
          >
            {isLastStep ? 'בואו נתחיל!' : 'הבא'}
            {!isLastStep && <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
