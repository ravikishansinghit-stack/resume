import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, FileText, User, Briefcase, GraduationCap, Wrench, Eye } from "lucide-react";
import { generatePDF } from "@/utils/html2pdfGenerator";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import ExperienceForm from "./forms/ExperienceForm";
import EducationForm from "./forms/EducationForm";
import SkillsForm from "./forms/SkillsForm";
import ProjectsForm from "./forms/ProjectsForm";
import ResumePreview from "./ResumePreview";
import ATSScoreBar from "./ats/ATSScoreBar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/components/auth/AuthProvider';
import { useResumes } from '@/hooks/useResumes';

interface ResumeBuilderProps {
  onBack: () => void;
  initialData?: any;
  resumeId?: string | null;
}

const ResumeBuilder = ({ onBack, initialData, resumeId }: ResumeBuilderProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    projects: []
  });
  const { toast } = useToast();
  const { user } = useAuth();
  const { saveResume, updateResume } = useResumes();

  const steps = [
    {
      id: 'personal',
      title: 'Personal Info',
      icon: User,
      component: PersonalInfoForm,
      description: 'Basic contact information'
    },
    {
      id: 'experience',
      title: 'Experience',
      icon: Briefcase,
      component: ExperienceForm,
      description: 'Work history and achievements'
    },
    {
      id: 'education',
      title: 'Education',
      icon: GraduationCap,
      component: EducationForm,
      description: 'Educational background'
    },
    {
      id: 'skills',
      title: 'Skills',
      icon: Wrench,
      component: SkillsForm,
      description: 'Technical and soft skills'
    },
    {
      id: 'projects',
      title: 'Projects',
      icon: FileText,
      component: ProjectsForm,
      description: 'Portfolio and key projects'
    },
    {
      id: 'preview',
      title: 'Preview',
      icon: Eye,
      component: ResumePreview,
      description: 'Review and download'
    }
  ];

  // Load initial data if provided
  useEffect(() => {
    if (initialData) {
      console.log('🔄 Loading initial data into ResumeBuilder:', initialData);
      // Deep merge to preserve structure
      setResumeData(prevData => {
        const merged = {
          personalInfo: { ...prevData.personalInfo, ...initialData.personalInfo },
          experience: initialData.experience || prevData.experience,
          education: initialData.education || prevData.education,
          skills: initialData.skills || prevData.skills,
          projects: initialData.projects || prevData.projects,
        };
        console.log('✅ Merged resume data:', merged);
        return merged;
      });
    }
  }, [JSON.stringify(initialData)]);

  const updateResumeData = (sectionOrData: string | { skills: string[] }, data?: any) => {
    if (typeof sectionOrData === 'string') {
      // Handle section and data update
      setResumeData(prev => ({
        ...prev,
        [sectionOrData]: data
      }));
    } else {
      // Handle direct data update (for SkillsForm)
      setResumeData(prev => ({
        ...prev,
        skills: sectionOrData.skills
      }));
    }

    // Mark current step as completed
    setCompletedSteps(prev => new Set(prev).add(currentStep));
  };

  const handleNext = () => {
    try {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      toast({
        title: "Navigation Error",
        description: "There was an issue navigating to the next step. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePrevious = () => {
    try {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      toast({
        title: "Navigation Error", 
        description: "There was an issue navigating to the previous step. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleStepClick = (stepIndex: number) => {
    try {
      setCurrentStep(stepIndex);
    } catch (error) {
      console.error('Step navigation error:', error);
      toast({
        title: "Navigation Error",
        description: "There was an issue navigating to that step. Please try again.",
        variant: "destructive"
      });
    }
  };
  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your resume.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Debug: Log entire resumeData to see what's being saved
      console.log('🔍 Full resumeData:', resumeData);
      console.log('🔍 personalInfo:', resumeData?.personalInfo);
      
      // Use the full name entered by user, or default to "My Resume"
      // IMPORTANT: The resumeData should already have the latest personalInfo
      // due to the auto-save in PersonalInfoForm
      const fullName = resumeData?.personalInfo?.name?.trim();
      console.log('📝 Resume data name:', resumeData?.personalInfo?.name);
      console.log('📝 Full name (trimmed):', fullName);
      console.log('📝 Full name is empty?', !fullName);
      console.log('📝 Full name length:', fullName?.length);
      
      const title = (fullName && fullName.length > 0) ? fullName : 'My Resume';
      console.log('📝 Final title:', title);
      console.log('✅ Title being saved:', title);

      if (resumeId) {
        console.log('🔄 Updating resume with title:', title);
        await updateResume(resumeId, {
          title,
          resume_data: resumeData,
          template_type: 'modern'
        });
      } else {
        console.log('➕ Creating new resume with title:', title);
        await saveResume(resumeData, title, 'modern');
      }

      toast({
        title: "Resume saved!",
        description: `Your resume "${title}" has been saved successfully.`,
      });
    } catch (error) {
      console.error('❌ Error saving resume:', error);
      toast({
        title: "Save failed",
        description: "Failed to save resume. Please try again.",
        variant: "destructive"
      });
    }
  };

  const CurrentStepComponent = steps[currentStep].component;
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;
  const isPreviewStep = currentStep === steps.length - 1;

  // Full screen layout for preview step
  if (isPreviewStep) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Minimal Header for Preview */}
        <header className="bg-white border-b border-gray-200 flex-shrink-0">
          <div className="px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Exit</span>
              </Button>
              <div className="flex items-center gap-2">
                <img src="tarp-logo.png" alt="VitaBuilder" className=" h-6" />
                <h1 className="text-lg font-bold text-foreground">Resume Builder</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {user && (
                <Button variant="outline" size="sm" onClick={handleSave}>
                  Save Progress
                </Button>
              )}
                {user && (
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-blue-0 hover:bg-blue-100"
                  onClick={async () => {
                    try {
                      await generatePDF();
                      toast({
                        title: "Success",
                        description: "Resume downloaded successfully!",
                      });
                    } catch (error) {
                      console.error('PDF generation failed:', error);
                      toast({
                        title: "Error",
                        description: "Could not generate PDF. Please try again.",
                        variant: "destructive"
                      });
                    }
                  }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                )}
              <div className="text-xs text-gray-500">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = completedSteps.has(index);

                return (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                          : isCompleted
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      onClick={() => handleStepClick(index)}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium text-sm">{step.title}</span>
                      {isCompleted && (
                        <span className="text-green-600">✓</span>
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <ArrowRight className="w-4 h-4 mx-2 text-gray-400" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ATS Score Bar */}
        <ATSScoreBar resumeData={resumeData} />

        {/* Full Screen Preview */}
        <div className="flex-1 overflow-hidden">
          <CurrentStepComponent
            data={resumeData}
            onUpdate={updateResumeData}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isLastStep={isLastStep}
            isFirstStep={isFirstStep}
            completedSteps={completedSteps}
          />
        </div>
      </div>
    );
  }

  // Regular builder layout for other steps
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <div className="flex items-center space-x-3">
                <img src="tarp-logo.png" alt="VitaBuilder" className="h-8" />
                <h1 className="text-2xl font-bold text-foreground">Resume Builder</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <Button variant="outline" onClick={handleSave}>
                  Save Progress
                </Button>
              )}

              <div className="text-sm text-gray-600">
                Step {currentStep + 1} of {steps.length}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = completedSteps.has(index);
              const isAccessible = true;

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                        : isCompleted
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={() => handleStepClick(index)}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{step.title}</span>
                    {isCompleted && (
                      <span className="text-green-600">✓</span>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 mx-2 text-gray-400" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ATS Score Bar */}
      <ATSScoreBar resumeData={resumeData} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl">
           <CardHeader className="text-center">
             <CardTitle className="text-2xl flex items-center justify-center space-x-2">
               {(() => {
                 const Icon = steps[currentStep].icon;
                 return <Icon className="w-6 h-6" />;
               })()}
               <span>{steps[currentStep].title}</span>
             </CardTitle>
             <p className="text-gray-600 mt-2">{steps[currentStep].description}</p>
           </CardHeader>
           <CardContent className="p-8">
             <CurrentStepComponent
               data={resumeData}
               onUpdate={updateResumeData}
               onNext={handleNext}
               onPrevious={handlePrevious}
               isLastStep={isLastStep}
               isFirstStep={isFirstStep}
               completedSteps={completedSteps}
             />
           </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ResumeBuilder;
