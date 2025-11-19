import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutTemplate, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { sampleResumeData } from "@/data/sample-resume";

// ✅ Template imports (All imports)
import ModernTemplate from "@/components/templates/ModernTemplate";
import ClassicTemplate from "@/components/templates/ClassicTemplate";
import CreativeTemplate from "@/components/templates/CreativeTemplate";
import MinimalTemplate from "@/components/templates/MinimalTemplate";
import ExecutiveTemplate from "@/components/templates/ExecutiveTemplate";
import TechTemplate from "@/components/templates/TechTemplate";
import AcademicTemplate from "@/components/templates/AcademicTemplate";
import HealthcareTemplate from "@/components/templates/HealthcareTemplate";
import LegalTemplate from "@/components/templates/LegalTemplate";
import SalesTemplate from "@/components/templates/SalesTemplate";
import MarketingTemplate from "@/components/templates/MarketingTemplate";
import FinanceTemplate from "@/components/templates/FinanceTemplate";
import ConsultingTemplate from "@/components/templates/ConsultingTemplate";
import EducationTemplate from "@/components/templates/EducationTemplate";
import NonProfitTemplate from "@/components/templates/NonProfitTemplate";
import StartupTemplate from "@/components/templates/StartupTemplate";
import RetailTemplate from "@/components/templates/RetailTemplate";
import HospitalityTemplate from "@/components/templates/HospitalityTemplate";
import ManufacturingTemplate from "@/components/templates/ManufacturingTemplate";
import MediaTemplate from "@/components/templates/MediaTemplate";
import GovernmentTemplate from "@/components/templates/GovernmentTemplate";
import EngineeringTemplate from "@/components/templates/EngineeringTemplate";
import ArchitectureTemplate from "@/components/templates/ArchitectureTemplate";
import FreelancerTemplate from "@/components/templates/FreelancerTemplate";
import InternTemplate from "@/components/templates/InternTemplate";
import RemoteTemplate from "@/components/templates/RemoteTemplate";
import InternationalTemplate from "@/components/templates/InternationalTemplate";
import ScienceTemplate from "@/components/templates/ScienceTemplate";
import ArtisticTemplate from "@/components/templates/ArtisticTemplate";
import SportsTemplate from "@/components/templates/SportsTemplate";
import VeteranTemplate from "@/components/templates/VeteranTemplate";
import EntryLevelTemplate from "@/components/templates/EntryLevelTemplate";
import CareerChangeTemplate from "@/components/templates/CareerChangeTemplate";
import ExecutiveCTemplate from "@/components/templates/ExecutiveCTemplate";
import DataScienceTemplate from "@/components/templates/DataScienceTemplate";
import CybersecurityTemplate from "@/components/templates/CybersecurityTemplate";
import { ProfessionalTemplate } from "@/components/templates/ProfessionalTemplate";

// Helper type for the template data structure
type TemplateType = {
  name: string;
  description: string;
  component: React.ComponentType<{ data: any; isEditing: boolean }>;
};

// Map of template names to their components for easy lookup
const TemplateComponents: Record<string, React.ComponentType<{ data: any; isEditing: boolean }>> = {
    Modern: ModernTemplate,
    Professional: ProfessionalTemplate,
    Classic: ClassicTemplate,
    Creative: CreativeTemplate,
    Minimal: MinimalTemplate,
    Executive: ExecutiveTemplate,
    Tech: TechTemplate,
    Academic: AcademicTemplate,
    Healthcare: HealthcareTemplate,
    Legal: LegalTemplate,
    Sales: SalesTemplate,
    Marketing: MarketingTemplate,
    Finance: FinanceTemplate,
    Consulting: ConsultingTemplate,
    Education: EducationTemplate,
    'Non-Profit': NonProfitTemplate,
    Startup: StartupTemplate,
    Retail: RetailTemplate,
    Hospitality: HospitalityTemplate,
    Manufacturing: ManufacturingTemplate,
    Media: MediaTemplate,
    Government: GovernmentTemplate,
    Engineering: EngineeringTemplate,
    Architecture: ArchitectureTemplate,
    Freelancer: FreelancerTemplate,
    Intern: InternTemplate,
    Remote: RemoteTemplate,
    International: InternationalTemplate,
    Science: ScienceTemplate,
    Artistic: ArtisticTemplate,
    Sports: SportsTemplate,
    Veteran: VeteranTemplate,
    'Entry Level': EntryLevelTemplate,
    'Career Change': CareerChangeTemplate,
    'C-Suite': ExecutiveCTemplate,
    'Data Science': DataScienceTemplate,
    Cybersecurity: CybersecurityTemplate,
};

// ✅ Template list
const templates: TemplateType[] = [
  ...Object.keys(TemplateComponents).map(name => ({
    name,
    description: name === 'Modern' ? "Clean and professional." : `A ${name.toLowerCase()} template.`,
    component: TemplateComponents[name],
  })),
];


// ✅ FIXED TemplatePreview Component
const TemplatePreview = ({ children, scale, isCardPreview }: { children: React.ReactNode, scale: number, isCardPreview: boolean }) => {
  
  // Use centering logic for the card preview (from your 2nd example)
  const positionClasses = isCardPreview
    ? "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    : "absolute top-0 left-0"; // Use top-left for the scrollable modal preview

  // Use origin-center for the card, origin-top-left for the modal
  const originClass = isCardPreview ? "origin-center" : "origin-top-left";

  return (
    <div className={positionClasses}>
      {/* FIX: We use an inline style for scale. This guarantees the dynamic
        scale value is applied, bypassing any Tailwind JIT build issues.
      */}
      <div 
        className={`transform ${originClass}`} 
        style={{ transform: `scale(${scale})` }}
      >
        <div className="w-[816px] h-[1056px] bg-white shadow-md overflow-hidden">{children}</div>
      </div>
    </div>
  )
};

// ✅ TemplateShowcase component (From your first file)
const TemplateShowcase = () => {
  const [selectedTemplateName, setSelectedTemplateName] = useState<string | null>(null);
  const navigate = useNavigate();

  const selectedTemplate = useMemo(() => {
    const index = templates.findIndex(t => t.name === selectedTemplateName);
    return index !== -1 ? { ...templates[index], index } : null;
  }, [selectedTemplateName]);

  const handleTemplateClick = (template: TemplateType) => {
    setSelectedTemplateName(template.name);
  };

  const handleStartWithTemplate = () => {
    if (selectedTemplate) {
      navigate("/resume-builder", { state: { templateName: selectedTemplate.name } });
    }
  };

  const handleNavigation = (direction: 'next' | 'prev') => {
    if (selectedTemplate) {
      let newIndex = selectedTemplate.index;
      if (direction === 'next') {
        newIndex = Math.min(newIndex + 1, templates.length - 1);
      } else {
        newIndex = Math.max(newIndex - 1, 0);
      }
      setSelectedTemplateName(templates[newIndex].name);
    }
  };

  const TemplateComponent = selectedTemplate ? selectedTemplate.component : null;
  
  // Use the 0.24 scale from your second example for the card
  const CARD_PREVIEW_SCALE = 0.24; 
  const MODAL_PREVIEW_SCALE = 0.85; // Keep the larger scale for the modal

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 border border-blue-200 px-4 py-2 rounded-full mb-6">
            <LayoutTemplate className="w-5 h-5 text-blue-700" />
            <span className="text-blue-700 font-medium text-sm">
              Professionally Designed Templates
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Find a Style That Fits You
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from {templates.length}+ professionally designed templates that help your resume take flight.
            Each template is ATS-optimized and fully customizable.
          </p>
        </div>

        {/* ✅ Grid View (Matches your desired 3-col layout) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <Card
              key={template.name}
              className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              onClick={() => handleTemplateClick(template)}
            >
              {/* This container uses h-64 and relative, as in your 2nd example */}
              <div className="h-64 bg-gray-200 border-b border-gray-300 overflow-hidden relative">
                <TemplatePreview scale={CARD_PREVIEW_SCALE} isCardPreview={true}>
                  <template.component data={sampleResumeData} isEditing={false} />
                </TemplatePreview>
              </div>
              
              {/* Card Content Styling (Matches your desired style) */}
              <CardContent className="p-6 text-center">
                <CardTitle className="text-xl mb-2">{template.name}</CardTitle>
                <CardDescription>
                  {template.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={() => navigate("/resume-builder")}
          >
            Start Building Your Resume (No Template)
          </Button>
        </div>
      </div>

      {/* ✅ Modal Layout (Unchanged) */}
      <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplateName(null)}>
        <DialogContent className="max-w-6xl max-h-[95vh] h-full p-0 overflow-hidden">
          {selectedTemplate && TemplateComponent && (
            <div className="flex h-full">
              
              {/* 1. Left Sidebar: Template Info and Buttons */}
              <div className="w-96 flex-shrink-0 p-8 border-r flex flex-col justify-between bg-white">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{selectedTemplate.name}</h3>
                  <p className="text-gray-500 text-sm mb-6">
                    Template {selectedTemplate.index + 1} of {templates.length}
                  </p>
                  
                  <p className="text-gray-700 text-lg">
                    {selectedTemplate.description}
                  </p>
                  <p className="text-sm text-gray-500 mt-4">
                    This template is designed for **ATS compatibility** and is fully customizable in the builder.
                  </p>
                </div>

                {/* 2. Bottom Action Buttons */}
                <div className="mt-8 pt-4 border-t">
                  <div className="flex space-x-4 mb-4">
                    <Button 
                      variant="outline"
                      onClick={() => handleNavigation('prev')}
                      disabled={selectedTemplate.index === 0}
                      className="flex-1"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleNavigation('next')}
                      disabled={selectedTemplate.index === templates.length - 1}
                      className="flex-1"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                  
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={handleStartWithTemplate}
                  >
                    Build with this template
                  </Button>
                </div>
              </div>

              {/* 3. Right Preview Area */}
              <div className="flex-1 bg-gray-100 p-6 overflow-y-auto flex justify-center h-[95vh] relative">
                <button
                    onClick={() => setSelectedTemplateName(null)}
                    className="absolute right-8 top-8 z-50 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition"
                >
                    <X className="w-5 h-5" />
                </button>
                
                <div 
                  style={{ width: 816 * MODAL_PREVIEW_SCALE, minHeight: 1056 * MODAL_PREVIEW_SCALE }}
                  className="flex-shrink-0 max-w-full" 
                >
                  <TemplatePreview scale={MODAL_PREVIEW_SCALE} isCardPreview={false}>
                    <TemplateComponent data={sampleResumeData} isEditing={false} />
                  </TemplatePreview>
                </div>
              </div>

            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}; 

export default TemplateShowcase;  