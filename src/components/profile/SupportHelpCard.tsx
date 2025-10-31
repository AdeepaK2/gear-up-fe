import React, { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, Phone, Mail, ExternalLink } from "lucide-react";

/**
 * SupportHelpCard component
 * Displays support and help options
 */
export const SupportHelpCard = React.memo(() => {
  const handleContactSupport = useCallback(() => {
    window.open("tel:+1-555-SUPPORT", "_self");
  }, []);

  const handleHelpCenter = useCallback(() => {
    window.open("/help", "_blank");
  }, []);

  const handleSubmitFeedback = useCallback(() => {
    window.open("/contact", "_blank");
  }, []);

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="bg-[#2c3e82] border-b border-gray-100 py-4 px-6">
        <div className="flex items-center justify-between min-h-[32px]">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-white" aria-hidden="true" />
            <CardTitle className="text-white font-semibold">
              Support & Help
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition-all duration-200"
            onClick={handleContactSupport}
            aria-label="Contact support via phone"
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            Contact Support
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition-all duration-200"
            onClick={handleHelpCenter}
            aria-label="Open help center in new tab"
          >
            <HelpCircle className="w-4 h-4" aria-hidden="true" />
            Help Center & FAQs
            <ExternalLink className="w-3 h-3 ml-auto" aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white transition-all duration-200"
            onClick={handleSubmitFeedback}
            aria-label="Submit feedback in new tab"
          >
            <Mail className="w-4 h-4" aria-hidden="true" />
            Submit Feedback
            <ExternalLink className="w-3 h-3 ml-auto" aria-hidden="true" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

SupportHelpCard.displayName = "SupportHelpCard";
