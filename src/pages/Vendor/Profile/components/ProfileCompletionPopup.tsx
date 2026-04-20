import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileCompletionPopupProps {
  isOpen: boolean;
  percentage: number;
  missingFields: string[];
  onCompleteProfile: () => void;
  onDismiss: () => void;
}

export const ProfileCompletionPopup = ({
  isOpen,
  percentage,
  missingFields,
  onCompleteProfile,
  onDismiss
}: ProfileCompletionPopupProps) => {
  if (!isOpen) return null;

  const isComplete = percentage === 100;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isComplete 
              ? 'bg-emerald-100' 
              : 'bg-amber-100'
          }`}>
            {isComplete ? (
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            ) : (
              <AlertCircle className="w-10 h-10 text-amber-600" />
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isComplete ? 'Profile Complete!' : 'Profile Update Required'}
          </h2>
          
          <p className="text-gray-600">
            {isComplete 
              ? 'Your profile is fully complete. You can now add products.' 
              : 'Complete your profile to unlock all features and add products'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Progress</span>
            <span className={`text-sm font-bold ${
              isComplete ? 'text-emerald-600' : 'text-amber-600'
            }`}>
              {percentage}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ease-out rounded-full ${
                isComplete 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' 
                  : 'bg-gradient-to-r from-amber-500 to-amber-600'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Missing Fields List */}
        {!isComplete && missingFields.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl">
            <h3 className="text-sm font-bold text-red-800 mb-3 flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              Missing Required Fields:
            </h3>
            <ul className="space-y-2">
              {missingFields.map((field, index) => (
                <li 
                  key={index}
                  className="flex items-start gap-2 text-sm text-red-700"
                >
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                  {field}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Success Message */}
        {isComplete && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
            <p className="text-sm font-semibold text-emerald-800 text-center">
              ✓ All required fields are complete!
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!isComplete ? (
            <>
              <Button
                onClick={onCompleteProfile}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-amber-600/30"
              >
                Complete Profile Now
              </Button>
              
              <Button
                onClick={onDismiss}
                variant="outline"
                className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-3 px-4 rounded-xl transition-all duration-200"
              >
                Remind Later
              </Button>
            </>
          ) : (
            <Button
              onClick={onDismiss}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-600/30"
            >
              Continue to Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
