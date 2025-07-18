import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, CheckCircle, MessageCircle, CalendarDays, Upload } from "lucide-react";
import { ImportSyncModal } from "@/components/customers/ImportSyncModal";

const actions = [
  {
    title: "Add Lead",
    description: "Create new lead profile",
    icon: UserPlus,
    variant: "default" as const,
    href: "/leads"
  },
  {
    title: "Import & Sync",
    description: "Upload Arketa CSV data",
    icon: Upload,
    variant: "secondary" as const,
    action: "import"
  },
  {
    title: "Send Message",
    description: "Communicate with members",
    icon: MessageCircle,
    variant: "outline" as const,
    href: "#"
  },
  {
    title: "View Schedule",
    description: "See upcoming classes",
    icon: CalendarDays,
    variant: "outline" as const,
    href: "#"
  }
];

export function QuickActions() {
  const [importModalOpen, setImportModalOpen] = useState(false);

  const handleImportComplete = () => {
    // Refresh data after import
    window.location.reload();
  };

  const handleActionClick = (action: typeof actions[0]) => {
    if (action.action === "import") {
      setImportModalOpen(true);
    }
  };

  return (
    <Card className="shadow-card border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2">
          {actions.map((action, index) => (
            action.href ? (
              <Button
                key={index}
                variant={action.variant}
                className="h-auto p-4 flex flex-col items-start space-y-2 hover:shadow-soft transition-shadow"
                asChild
              >
                <Link to={action.href}>
                  <div className="flex items-center space-x-2">
                    <action.icon className="h-5 w-5" />
                    <span className="font-medium">{action.title}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{action.description}</span>
                </Link>
              </Button>
            ) : (
              <Button
                key={index}
                variant={action.variant}
                className="h-auto p-4 flex flex-col items-start space-y-2 hover:shadow-soft transition-shadow"
                onClick={() => handleActionClick(action)}
              >
                <div className="flex items-center space-x-2">
                  <action.icon className="h-5 w-5" />
                  <span className="font-medium">{action.title}</span>
                </div>
                <span className="text-sm text-muted-foreground">{action.description}</span>
              </Button>
            )
          ))}
        </div>
      </CardContent>

      {/* Import & Sync Modal */}
      <ImportSyncModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImportComplete={handleImportComplete}
      />
    </Card>
  );
}