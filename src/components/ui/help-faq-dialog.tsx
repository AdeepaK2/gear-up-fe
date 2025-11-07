"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

interface HelpFAQDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    id: "1",
    category: "Account",
    question: "How do I update my profile information?",
    answer:
      "To update your profile, navigate to the Profile page, click the 'Edit Profile' button, make your changes, and click 'Save Changes'. You can update your name, phone number, and address details.",
  },
  {
    id: "2",
    category: "Account",
    question: "How do I change my password?",
    answer:
      "Go to your Profile page, find the 'Security Settings' section, and click on 'Change Password'. Enter your current password, then your new password twice, and click 'Update Password'.",
  },
  {
    id: "3",
    category: "Account",
    question: "Can I deactivate my account?",
    answer:
      "Yes, you can deactivate your account from the Profile page under Security Settings. Click 'Deactivate Account' and confirm. Note that this action cannot be undone and you will lose access to all your data.",
  },
  {
    id: "4",
    category: "Appointments",
    question: "How do I book an appointment?",
    answer:
      "Navigate to the Appointments page, click 'Book New Appointment', select a service, choose a vehicle (or add a new one), pick your preferred date and time, and submit your booking.",
  },
  {
    id: "5",
    category: "Appointments",
    question: "Can I reschedule or cancel my appointment?",
    answer:
      "Yes, you can reschedule or cancel appointments from the Appointments page. Find your appointment and click the respective action button. Note that there may be restrictions based on the appointment status.",
  },
  {
    id: "6",
    category: "Appointments",
    question: "What are the different appointment statuses?",
    answer:
      "Appointments can have the following statuses: Pending (awaiting confirmation), Confirmed (approved by admin), In Progress (currently being serviced), Completed (service finished), or Cancelled (appointment cancelled).",
  },
  {
    id: "7",
    category: "Vehicles",
    question: "How do I add a new vehicle?",
    answer:
      "When booking an appointment, you can add a new vehicle by clicking 'Add New Vehicle' and entering details like make, model, year, and registration number.",
  },
  {
    id: "8",
    category: "Services",
    question: "What services do you offer?",
    answer:
      "We offer a wide range of automotive services including oil changes, brake repairs, tire services, engine diagnostics, and more. Visit the Services page to see the complete list with pricing details.",
  },
  {
    id: "9",
    category: "Notifications",
    question: "How do I manage my notification preferences?",
    answer:
      "Go to your Profile page, click on 'Notification Preferences' in the Security Settings section, and toggle your preferences for email and SMS notifications for appointments, promotions, and system updates.",
  },
  {
    id: "10",
    category: "Support",
    question: "How can I contact customer support?",
    answer:
      "You can contact support through the 'Contact Support' button on your Profile page, or visit our Contact page. We're available via phone, email, and live chat during business hours.",
  },
  {
    id: "11",
    category: "Support",
    question: "How do I submit feedback or report an issue?",
    answer:
      "Click on 'Submit Feedback' in the Support & Help section of your Profile page, or navigate to the Contact page. We appreciate your feedback and will respond as soon as possible.",
  },
  {
    id: "12",
    category: "General",
    question: "Is my personal information secure?",
    answer:
      "Yes, we take your privacy and security seriously. All data is encrypted and stored securely. We never share your personal information with third parties without your consent.",
  },
];

export function HelpFAQDialog({ open, onOpenChange }: HelpFAQDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const categories = Array.from(new Set(faqData.map((item) => item.category)));

  const filteredFAQs = faqData.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleItem = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const groupedFAQs = categories
    .map((category) => ({
      category,
      items: filteredFAQs.filter((item) => item.category === category),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#2c3e82]">
            Help Center & FAQs
          </DialogTitle>
        </DialogHeader>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
        </div>

        {/* FAQ List */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          {groupedFAQs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No results found. Try a different search term.
            </div>
          ) : (
            groupedFAQs.map((group) => (
              <div key={group.category} className="space-y-3">
                <h3 className="text-lg font-semibold text-[#2c3e82] border-b pb-2">
                  {group.category}
                </h3>
                <div className="space-y-2">
                  {group.items.map((item) => {
                    const isExpanded = expandedItems.has(item.id);
                    return (
                      <div
                        key={item.id}
                        className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <button
                          onClick={() => toggleItem(item.id)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-800 pr-4">
                            {item.question}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        {isExpanded && (
                          <div className="px-4 pb-4 text-gray-600 bg-gray-50 border-t">
                            <p className="pt-3">{item.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t text-center text-sm text-gray-600">
          <p>
            Can't find what you're looking for?{" "}
            <button
              onClick={() => {
                onOpenChange(false);
                window.open("/contact", "_blank");
              }}
              className="text-[#2c3e82] hover:underline font-medium"
            >
              Contact Support
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
