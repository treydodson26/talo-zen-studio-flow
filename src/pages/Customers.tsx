import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  MoreHorizontal,
  Eye,
  MessageCircle,
  Mail,
  Users,
  TrendingUp,
  Calendar,
  Activity,
  Upload,
} from 'lucide-react';
import { ImportSyncModal } from '@/components/customers/ImportSyncModal';
import { WhatsAppMessageModal } from '@/components/customers/WhatsAppMessageModal';

// Define interface for customer metrics view
interface CustomerMetrics {
  id: string;
  name: string;
  email: string;
  phone: string;
  marketing_email_opt_in: string;
  marketing_text_opt_in: string;
  tags: string;
  first_seen: string;
  last_seen: string;
  birthday: string;
  address: string;
  total_classes_attended: number;
  last_class_date: string;
  first_class_date: string;
  calculated_status: string;
  is_active_member: boolean;
  estimated_lifetime_value: number;
}

// Define interface for customer metrics summary
interface CustomerSummary {
  total_clients: number;
  active_members: number;
  trial_members: number;
  new_this_month: number;
  no_purchases: number;
  first_class_booked: number;
  intro_offer: number;
  bought_membership: number;
  retention_risk: number;
}

// Define sequence stages for intro offer
const INTRO_SEQUENCE_STAGES = [
  { stage: 'Day 0', label: 'Welcome - Day 0', description: 'Just signed up' },
  { stage: 'Day 1', label: 'Check-in - Day 1', description: 'First day follow-up' },
  { stage: 'Day 3', label: 'Tips & Encouragement - Day 3', description: 'Early engagement' },
  { stage: 'Day 7', label: 'Week 1 Check-in - Day 7', description: 'First week complete' },
  { stage: 'Day 14', label: 'Halfway Point - Day 14', description: 'Mid-trial momentum' },
  { stage: 'Day 21', label: 'Week 3 Motivation - Day 21', description: 'Building habits' },
  { stage: 'Day 28', label: 'Final Push - Day 28', description: 'Converting to membership' },
  { stage: 'Day 30+', label: 'Conversion Ready', description: 'Ready to convert' },
];

type FilterStage = 'all' | 'no-purchases' | 'first-class-booked' | 'intro-offer' | 'bought-membership' | 'active-members' | 'retention-risk';

export default function Customers() {
  const [customers, setCustomers] = useState<CustomerMetrics[]>([]);
  const [customerSummary, setCustomerSummary] = useState<CustomerSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerMetrics | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeStage, setActiveStage] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [selectedCustomerForMessage, setSelectedCustomerForMessage] = useState<CustomerMetrics | null>(null);

  // Map tab names to filter stages
  const getFilterStage = (tabName: string): FilterStage => {
    switch (tabName) {
      case 'No Purchases or Reservations': return 'no-purchases';
      case 'First Class Booked': return 'first-class-booked';
      case 'Intro Offer': return 'intro-offer';
      case 'Bought Membership in the Last 7 Days': return 'bought-membership';
      case 'Active Member': return 'active-members';
      case 'Retention': return 'retention-risk';
      default: return 'all';
    }
  };

  // Fetch customer data and summary
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch customer summary
        const { data: summaryData, error: summaryError } = await supabase
          .rpc('get_customer_metrics_summary');

        if (summaryError) {
          console.error('Error fetching summary:', summaryError);
        } else {
          setCustomerSummary(summaryData[0] || null);
        }

        // Fetch filtered customers based on active stage
        const filterStage = getFilterStage(activeStage);
        const { data: customerData, error: customerError } = await supabase
          .rpc('get_filtered_customers', { filter_stage: filterStage });

        if (customerError) {
          console.error('Error fetching customers:', customerError);
          setError('Failed to load customers');
          return;
        }

        setCustomers(customerData || []);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load customers');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeStage]);

  // Filter customers based on search query
  const filteredCustomers = customers.filter(customer => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      customer.name?.toLowerCase().includes(searchLower) ||
      customer.email?.toLowerCase().includes(searchLower) ||
      customer.phone?.toLowerCase().includes(searchLower) ||
      customer.tags?.toLowerCase().includes(searchLower)
    );
  });

  // Get customers organized by sequence stage for Intro Offer
  const getCustomersBySequenceStage = () => {
    if (activeStage !== 'Intro Offer') return [];
    
    const introCustomers = filteredCustomers.filter(c => c.calculated_status === 'Intro Offer');
    
    return INTRO_SEQUENCE_STAGES.map(stage => ({
      ...stage,
      customers: introCustomers.filter(customer => {
        if (!customer.first_seen) return false;
        
        const signupDate = new Date(customer.first_seen);
        const daysSinceSignup = Math.floor((Date.now() - signupDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (stage.stage === 'Day 0') return daysSinceSignup === 0;
        if (stage.stage === 'Day 1') return daysSinceSignup === 1;
        if (stage.stage === 'Day 3') return daysSinceSignup >= 2 && daysSinceSignup <= 4;
        if (stage.stage === 'Day 7') return daysSinceSignup >= 5 && daysSinceSignup <= 9;
        if (stage.stage === 'Day 14') return daysSinceSignup >= 10 && daysSinceSignup <= 17;
        if (stage.stage === 'Day 21') return daysSinceSignup >= 18 && daysSinceSignup <= 25;
        if (stage.stage === 'Day 28') return daysSinceSignup >= 26 && daysSinceSignup <= 30;
        if (stage.stage === 'Day 30+') return daysSinceSignup > 30;
        
        return false;
      })
    }));
  };

  const handleViewProfile = (customer: CustomerMetrics) => {
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  const handleSendMessage = (customer: CustomerMetrics) => {
    setSelectedCustomerForMessage(customer);
    setWhatsAppModalOpen(true);
  };

  const handleSendEmail = (customer: CustomerMetrics) => {
    if (customer.email) {
      window.open(`mailto:${customer.email}`, '_blank');
    }
  };

  const handleImportComplete = () => {
    window.location.reload();
  };

  // Define tabs matching Arketa dashboard exactly
  const tabs = [
    { name: 'All', count: customerSummary?.total_clients || 0 },
    { name: 'No Purchases or Reservations', count: customerSummary?.no_purchases || 0 },
    { name: 'First Class Booked', count: customerSummary?.first_class_booked || 0 },
    { name: 'Intro Offer', count: customerSummary?.intro_offer || 0 },
    { name: 'Bought Membership in the Last 7 Days', count: customerSummary?.bought_membership || 0 },
    { name: 'Active Member', count: customerSummary?.active_members || 0 },
    { name: 'Retention', count: customerSummary?.retention_risk || 0 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <span>Customers</span>
            <span>›</span>
            <span>Clients</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-1">Customers</h1>
            <div className="text-sm text-muted-foreground">
              Arketa dashboard replica - organized by customer journey stages
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setImportModalOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Import & Sync
          </Button>
        </div>
      </div>

      {/* Arketa Dashboard Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveStage(tab.name)}
              className={`px-4 py-2 text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeStage === tab.name
                  ? 'border-primary text-primary font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.name}
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-muted rounded-full">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search customers..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-muted-foreground">Loading customers...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-destructive">{error}</div>
        </div>
      ) : activeStage === 'Intro Offer' ? (
        // Intro Offer - Organized by Sequence Stage
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Intro Offer - Organized by Sequence Stage</h2>
          </div>
          
          {getCustomersBySequenceStage().map((stage) => (
            <Card key={stage.stage}>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      {stage.stage}
                    </Badge>
                    <span>{stage.label}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stage.customers.length} customers
                  </Badge>
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  {stage.description}
                </div>
              </CardHeader>
              
              {stage.customers.length > 0 && (
                <CardContent>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>NAME</TableHead>
                          <TableHead>EMAIL</TableHead>
                          <TableHead>PHONE</TableHead>
                          <TableHead>FIRST SEEN</TableHead>
                          <TableHead>CLASSES</TableHead>
                          <TableHead>ACTIONS</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stage.customers.map((customer) => (
                          <TableRow key={customer.id}>
                            <TableCell>
                              <div className="font-medium">{customer.name || '—'}</div>
                            </TableCell>
                            <TableCell>
                              <div className="text-muted-foreground">{customer.email || '—'}</div>
                            </TableCell>
                            <TableCell>
                              <div className="text-muted-foreground">{customer.phone || '—'}</div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {customer.first_seen 
                                  ? new Date(customer.first_seen).toLocaleDateString('en-US', { 
                                      month: 'short', 
                                      day: 'numeric', 
                                      year: 'numeric' 
                                    })
                                  : '—'
                                }
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {customer.total_classes_attended || 0} classes
                              </div>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleViewProfile(customer)}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleSendMessage(customer)}>
                                    <MessageCircle className="w-4 h-4 mr-2 text-green-600" />
                                    Send Message
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleSendEmail(customer)}>
                                    <Mail className="w-4 h-4 mr-2 text-red-600" />
                                    Send Email
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      ) : (
        // Standard Table View for all other tabs
        <div className="bg-surface rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NAME</TableHead>
                <TableHead>EMAIL</TableHead>
                <TableHead>PHONE</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>FIRST SEEN</TableHead>
                <TableHead>LAST SEEN</TableHead>
                <TableHead>CLASSES</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No customers found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="font-medium">{customer.name || '—'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-muted-foreground">{customer.email || '—'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-muted-foreground">{customer.phone || '—'}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {customer.calculated_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {customer.first_seen 
                          ? new Date(customer.first_seen).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })
                          : '—'
                        }
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {customer.last_seen
                          ? new Date(customer.last_seen).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })
                          : '—'
                        }
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {customer.total_classes_attended || 0} classes
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewProfile(customer)}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendMessage(customer)}>
                            <MessageCircle className="w-4 h-4 mr-2 text-green-600" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendEmail(customer)}>
                            <Mail className="w-4 h-4 mr-2 text-red-600" />
                            Send Email
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Import & Sync Modal */}
      <ImportSyncModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImportComplete={handleImportComplete}
      />
      
      {/* WhatsApp Message Modal */}
      <WhatsAppMessageModal
        isOpen={whatsAppModalOpen}
        onClose={() => setWhatsAppModalOpen(false)}
        customer={selectedCustomerForMessage}
      />
    </div>
  );
}