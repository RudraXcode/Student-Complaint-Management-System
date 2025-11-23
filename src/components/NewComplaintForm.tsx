import React, { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { ArrowLeft, FileText, Clock, AlertCircle } from 'lucide-react';
import { AttachmentUpload } from './AttachmentUpload';
import { Complaint, AttachmentFile } from '../App';
import { COMPLAINT_CATEGORIES } from '../utils/constants';
import { sanitizeInput } from '../utils/security';

interface NewComplaintFormProps {
  onSubmit: (complaint: Partial<Complaint>) => void;
  onBack: () => void;
}

export function NewComplaintForm({ onSubmit, onBack }: NewComplaintFormProps) {
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High',
  });
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.description.length > 1000) {
      alert('Description must be less than 1000 characters');
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      // Sanitize description to prevent XSS
      const sanitizedDescription = sanitizeInput(formData.description);
      
      onSubmit({
        ...formData,
        description: sanitizedDescription,
        attachments: attachments
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const priorityOptions = [
    { 
      value: 'Low', 
      label: 'Low Priority', 
      description: 'Non-urgent, can wait a few days',
      icon: <Clock className="h-4 w-4 text-green-500" />
    },
    { 
      value: 'Medium', 
      label: 'Medium Priority', 
      description: 'Should be addressed soon',
      icon: <FileText className="h-4 w-4 text-yellow-500" />
    },
    { 
      value: 'High', 
      label: 'High Priority', 
      description: 'Urgent, needs immediate attention',
      icon: <AlertCircle className="h-4 w-4 text-red-500" />
    }
  ];

  const getCategoryDescription = (category: string) => {
    const descriptions = {
      'Academics': 'Course materials, grading, faculty issues, academic policies',
      'Hostel': 'Room maintenance, facilities, roommate issues, security',
      'Mess': 'Food quality, meal timings, dietary requirements, hygiene',
      'Facilities': 'Library, labs, WiFi, infrastructure, equipment',
      'Administration': 'Registration, fees, documents, staff behavior',
      'Other': 'Any other concerns not covered above'
    };
    return descriptions[category as keyof typeof descriptions] || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 animate-slide-in-up">
          <Button variant="ghost" onClick={onBack} className="mb-4 hover:bg-blue-50 transition-all duration-300 hover:scale-105">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 shadow-soft border border-blue-100">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#2F5DCE] to-purple-600 bg-clip-text text-transparent" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Submit New Complaint ✍️
            </h1>
            <p className="text-gray-700 text-lg">
              Please provide detailed information about your complaint for faster resolution. All fields marked with (*) are required.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Complaint Form */}
          <Card className="shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-in">
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Poppins, sans-serif' }}>Complaint Details</CardTitle>
              <CardDescription>
                Provide clear and specific information about your complaint
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category Selection */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-base font-semibold">Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="h-12 border-2 hover:border-[#2F5DCE] transition-all duration-300">
                    <SelectValue placeholder="Select complaint category" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPLAINT_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category} className="hover:bg-blue-50 cursor-pointer">
                        <div className="flex flex-col py-1">
                          <span className="font-medium">{category}</span>
                          <span className="text-xs text-gray-500">{getCategoryDescription(category)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.category && (
                  <p className="text-sm text-blue-700 bg-blue-50 p-3 rounded-lg border border-blue-200 animate-slide-in-up">
                    {getCategoryDescription(formData.category)}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-semibold">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your complaint in detail. Include:
• What exactly happened?
• When did it occur?
• Where did it happen?
• What steps have you already taken?
• How has this affected you?

The more specific you are, the faster we can resolve your issue."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-[150px] border-2 hover:border-[#2F5DCE] focus:border-[#2F5DCE] transition-all duration-300"
                  required
                />
                <div className="flex justify-between text-sm">
                  <span className={`font-medium ${formData.description.length > 1000 ? 'text-red-600' : 'text-gray-500'}`}>
                    {formData.description.length}/1000 characters
                  </span>
                  {formData.description.length > 800 && (
                    <span className="text-orange-600 font-medium animate-pulse">
                      {1000 - formData.description.length} characters remaining
                    </span>
                  )}
                </div>
              </div>

              {/* Priority Selection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Priority Level *</Label>
                <RadioGroup
                  value={formData.priority}
                  onValueChange={(value: 'Low' | 'Medium' | 'High') => 
                    setFormData(prev => ({ ...prev, priority: value }))
                  }
                >
                  <div className="grid grid-cols-1 gap-3">
                    {priorityOptions.map((option) => (
                      <div key={option.value} className="flex items-start space-x-3 p-4 border-2 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-[#2F5DCE] transition-all duration-300 cursor-pointer hover:shadow-md">
                        <RadioGroupItem value={option.value} id={option.value.toLowerCase()} className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {option.icon}
                            <Label htmlFor={option.value.toLowerCase()} className="font-semibold cursor-pointer">
                              {option.label}
                            </Label>
                          </div>
                          <p className="text-sm text-gray-600">{option.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Attachment Upload */}
          <Card className="shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-in animation-delay-200">
            <CardHeader>
              <CardTitle style={{ fontFamily: 'Poppins, sans-serif' }}>Supporting Documents (Optional)</CardTitle>
              <CardDescription>
                Upload images, screenshots, or documents that support your complaint. This helps us understand and resolve your issue faster.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AttachmentUpload
                attachments={attachments}
                onAttachmentsChange={setAttachments}
                disabled={isSubmitting}
              />
            </CardContent>
          </Card>

          {/* Submit Section */}
          <Card className="shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-in animation-delay-300">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-gradient-to-r from-[#2F5DCE] to-[#4F46E5] hover:from-[#2548a8] hover:to-[#4338CA] shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 font-semibold"
                  disabled={isSubmitting || !formData.category || !formData.description.trim()}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Submitting Complaint...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Submit Complaint
                    </div>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-12 border-2 hover:border-red-400 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
                  onClick={onBack}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
              
              {isSubmitting && (
                <div className="mt-4 text-center text-sm text-gray-700 bg-blue-50 p-3 rounded-lg animate-pulse">
                  <div className="inline-flex items-center gap-2 font-medium">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#2F5DCE] border-t-transparent"></div>
                    Processing your complaint and uploading attachments...
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </form>

        {/* Help Section */}
        <Card className="mt-6 shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-in animation-delay-500">
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Poppins, sans-serif' }}>Need Help? 💡</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
                <h4 className="font-semibold mb-3 text-blue-900 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  What happens after I submit?
                </h4>
                <ul className="text-gray-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    <span>You'll receive a complaint ID for tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    <span>Your complaint will be assigned to the relevant department</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    <span>You'll get email notifications for all updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">✓</span>
                    <span>You can track progress anytime in your dashboard</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                <h4 className="font-semibold mb-3 text-green-900 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Resolution timeline
                </h4>
                <ul className="text-gray-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">🔴</span>
                    <span><strong>High priority:</strong> 1-2 business days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-0.5">🟡</span>
                    <span><strong>Medium priority:</strong> 3-5 business days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">🟢</span>
                    <span><strong>Low priority:</strong> 5-7 business days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500 mt-0.5">⚠️</span>
                    <span>Complex issues may take longer</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}