import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CircleCheck as CheckCircle, ArrowRight } from "lucide-react";
import AIWritingAssistant from "../AIWritingAssistant";

interface PersonalInfoFormProps {
  data: any;
  onUpdate: (section: string, data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLastStep: boolean;
  isFirstStep: boolean;
  completedSteps?: Set<number>;
}

const PersonalInfoForm = ({ data, onUpdate, onNext }: PersonalInfoFormProps) => {
  const { toast } = useToast();
  
  const isFormValid = () => {
    return formData.name && formData.email && formData.phone && formData.location;
  };

  const [formData, setFormData] = useState(() => {
    const defaults = {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
      summary: '',
    };
    // Initialize with data if available, otherwise use defaults
    if (data?.personalInfo && Object.keys(data.personalInfo).length > 0) {
      return { ...defaults, ...data.personalInfo };
    }
    return defaults;
  });

  const [savedFields, setSavedFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Only update form if we receive new data from parent
    // But don't overwrite user's current edits with empty defaults
    if (data?.personalInfo && Object.keys(data.personalInfo).length > 0) {
      const hasRealData = Object.values(data.personalInfo).some(
        val => val !== undefined && val !== null && val !== ''
      );
      
      if (hasRealData) {
        console.log('📋 Loading personalInfo data into form:', data.personalInfo);
        setFormData(prev => {
          // Only update fields that are actually populated in data
          const updates = {};
          Object.keys(data.personalInfo).forEach(key => {
            if (data.personalInfo[key] !== undefined && data.personalInfo[key] !== null && data.personalInfo[key] !== '') {
              updates[key] = data.personalInfo[key];
            }
          });
          
          if (Object.keys(updates).length > 0) {
            console.log('✅ Applying updates to form:', updates);
            return { ...prev, ...updates };
          }
          return prev;
        });
      }
    }
  }, [JSON.stringify(data?.personalInfo)]); // Use stringify to detect actual changes

  // Auto-save with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      onUpdate('personalInfo', formData);
    }, 500);

    return () => clearTimeout(timer);
  }, [formData]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Show saved indicator
    setSavedFields(prev => new Set(prev).add(field));
    setTimeout(() => {
      setSavedFields(prev => {
        const newSet = new Set(prev);
        newSet.delete(field);
        return newSet;
      });
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Optional validation - users can proceed even with incomplete data
    if (formData.name.trim()) {
      toast({
        title: "Information saved!",
        description: "Moving to next section...",
      });
    } else {
      toast({
        title: "Proceeding to next section",
        description: "You can return to complete this section anytime.",
      });
    }
    
    onNext();
  };

  const getFieldIcon = (field: string) => {
    if (savedFields.has(field)) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    return null;
  };

  // Prepare context for AI writing assistant
  const aiContext = {
    fullName: formData.name,
    experience: data?.experience || [],
    skills: data?.skills || [],
    education: data?.education || []
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          ✨ <strong>Auto-save enabled:</strong> Your information is automatically saved as you type!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="relative">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Full Name *
          </Label>
          <div className="relative">
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., John Doe"
              required
              className="mt-1 pr-8"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              {getFieldIcon('name')}
            </div>
          </div>
        </div>
        <div className="relative">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Address *
          </Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="e.g., john@example.com"
              required
              className="mt-1 pr-8"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              {getFieldIcon('email')}
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="relative">
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Phone Number *
          </Label>
          <div className="relative">
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="e.g., +1 (555) 123-4567"
              required
              className="mt-1 pr-8"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              {getFieldIcon('phone')}
            </div>
          </div>
        </div>
        <div className="relative">
          <Label htmlFor="location" className="text-sm font-medium text-gray-700">
            Location *
          </Label>
          <div className="relative">
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="e.g., New York, NY"
              required
              className="mt-1 pr-8"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              {getFieldIcon('location')}
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="relative">
          <Label htmlFor="linkedin" className="text-sm font-medium text-gray-700">
            LinkedIn Profile (Optional)
          </Label>
          <div className="relative">
            <Input
              id="linkedin"
              value={formData.linkedin}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              placeholder="e.g., linkedin.com/in/johndoe"
              className="mt-1 pr-8"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              {getFieldIcon('linkedin')}
            </div>
          </div>
        </div>
        <div className="relative">
          <Label htmlFor="website" className="text-sm font-medium text-gray-700">
            Portfolio/Website (Optional)
          </Label>
          <div className="relative">
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="e.g., johndoe.com"
              className="mt-1 pr-8"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              {getFieldIcon('website')}
            </div>
          </div>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          Professional Summary (Optional but Recommended)
        </Label>
        <AIWritingAssistant
          value={formData.summary}
          onChange={(value) => handleChange('summary', value)}
          placeholder="Write a brief summary of your professional background, key skills, and career objectives..."
          userContext={aiContext}
        />
      </div>

      <div className="flex items-center justify-between pt-6">
        <div className="text-sm text-gray-600">
          * Required fields
        </div>
        <Button
          variant="default"
          onClick={onNext}
          className="flex items-center gap-2"
          disabled={!isFormValid()}
        >
          Continue to Experience
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
};

export default PersonalInfoForm;
