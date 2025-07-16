import { useState, useMemo, useEffect } from 'react';
import { Customer, CustomerFilters } from '@/types/customers';
import { supabase } from '@/integrations/supabase/client';
import { CustomerProfileModal } from '@/components/customers/CustomerProfileModal';
import { ImportSyncModal } from '@/components/customers/ImportSyncModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import {
  Search,
  Plus,
  Download,
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

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeStage, setActiveStage] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [metrics, setMetrics] = useState({
    totalClients: 0,
    activeMembers: 0,
    trialMembers: 0,
    newThisMonth: 0,
    noPurchases: 0,
    firstClassBooked: 0,
    introOffer: 0,
    boughtMembership: 0,
    retentionRisk: 0
  });
  const [importModalOpen, setImportModalOpen] = useState(false);

  // Fetch customers and metrics from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch customer metrics summary
        const { data: metricsData, error: metricsError } = await supabase
          .rpc('get_customer_metrics_summary');

        if (metricsError) {
          console.error('Error fetching metrics:', metricsError);
        } else if (metricsData?.[0]) {
          setMetrics({
            totalClients: Number(metricsData[0].total_clients),
            activeMembers: Number(metricsData[0].active_members),
            trialMembers: Number(metricsData[0].trial_members),
            newThisMonth: Number(metricsData[0].new_this_month),
            noPurchases: Number(metricsData[0].no_purchases),
            firstClassBooked: Number(metricsData[0].first_class_booked),
            introOffer: Number(metricsData[0].intro_offer),
            boughtMembership: Number(metricsData[0].bought_membership),
            retentionRisk: Number(metricsData[0].retention_risk)
          });
        }

        // Fetch customer data from the view
        const { data: customersData, error: customersError } = await supabase
          .from('customer_metrics_view')
          .select('*')
          .order('name', { ascending: true });

        if (customersError) {
          console.error('Error fetching customers:', customersError);
          setError('Failed to load customers');
          return;
        }

        // Transform the view data to Customer interface
        const transformedCustomers: Customer[] = (customersData || []).map((client) => ({
          id: client.id,
          name: client.name || 'Unknown',
          email: client.email || '',
          phone: client.phone || '',
          address: client.address || '',
          status: mapCalculatedStatusToCustomerStatus(client.calculated_status),
          segment: determineSegment(client),
          lastVisit: client.last_seen || new Date().toISOString().split('T')[0],
          classesThisMonth: 0, // Could be calculated from recent attendance
          totalClasses: Number(client.total_classes_attended) || 0,
          attendanceRate: client.is_active_member ? 85 : 45, // Simplified calculation
          favoriteClass: 'Unknown',
          memberSince: client.first_seen || client.first_class_date?.split('T')[0] || new Date().toISOString().split('T')[0],
          currentPlan: client.calculated_status === 'Active Members' ? 'Unlimited' : 'Trial',
          autoRenewal: client.is_active_member,
          notes: client.tags || '',
          avatar: undefined
        }));

        setCustomers(transformedCustomers);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load customers');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to map calculated status to Customer status
  const mapCalculatedStatusToCustomerStatus = (calculatedStatus: string): Customer['status'] => {
    switch (calculatedStatus) {
      case 'Active Members':
        return 'Active';
      case 'Intro Offer':
      case 'First Class Booked':
        return 'Trial';
      case 'Retention Risk':
        return 'At-Risk';
      case 'Bought Membership':
        return 'Active';
      default:
        return 'Trial';
    }
  };

  // Helper function to determine customer segment
  const determineSegment = (client: any): Customer['segment'] => {
    const tags = client.tags?.toLowerCase() || '';
    if (tags.includes('prenatal')) return 'Prenatal';
    if (tags.includes('senior')) return 'Seniors';
    if (tags.includes('student')) return 'Students';
    if (tags.includes('professional')) return 'Professionals';
    return 'General';
  };

  const customerStages = [
    { id: 'Dashboard', label: 'Dashboard', count: null },
    { id: 'All', label: 'All', count: metrics.totalClients },
    { id: 'No Purchases', label: 'No Purchases or Reservations', count: metrics.noPurchases },
    { id: 'First class booked', label: 'First class booked', count: metrics.firstClassBooked },
    { id: 'Intro Offer', label: 'Intro Offer', count: metrics.introOffer },
    { id: 'Bought Membership', label: 'Bought Membership', count: metrics.boughtMembership },
    { id: 'Active Members', label: 'Active Members', count: metrics.activeMembers },
    { id: 'Retention Risk', label: 'Retention Risk', count: metrics.retentionRisk },
  ];

  const isRecentMember = (memberSince: string) => {
    const memberDate = new Date(memberSince);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - memberDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= 7;
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone?.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesStage = true;
      if (activeStage !== 'All' && activeStage !== 'Dashboard') {
        switch (activeStage) {
          case 'No Purchases':
            matchesStage = customer.totalClasses === 0;
            break;
          case 'First class booked':
            matchesStage = customer.totalClasses === 1;
            break;
          case 'Intro Offer':
            matchesStage = customer.status === 'Trial' && customer.totalClasses > 1;
            break;
          case 'Bought Membership':
            matchesStage = customer.status === 'Active' && customer.totalClasses > 1 && !isRecentVisit(customer.lastVisit);
            break;
          case 'Active Members':
            matchesStage = customer.status === 'Active' && isRecentVisit(customer.lastVisit);
            break;
          case 'Retention Risk':
            matchesStage = customer.status === 'At-Risk';
            break;
        }
      }

      return matchesSearch && matchesStage;
    });
  }, [customers, activeStage, searchQuery]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-success text-success-foreground';
      case 'Trial':
        return 'bg-warning text-warning-foreground';
      case 'Expired':
        return 'bg-danger text-danger-foreground';
      case 'At-Risk':
        return 'bg-danger text-danger-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'Prenatal':
        return 'bg-purple-100 text-purple-800';
      case 'Seniors':
        return 'bg-blue-100 text-blue-800';
      case 'Students':
        return 'bg-green-100 text-green-800';
      case 'Professionals':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isRecentVisit = (lastVisit: string) => {
    const visitDate = new Date(lastVisit);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - visitDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff >= 90;
  };

  const handleViewProfile = (customer: Customer) => {
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  const handleSendMessage = (customer: Customer) => {
    // Open WhatsApp with customer's phone number
    if (customer.phone) {
      window.open(`https://wa.me/${customer.phone.replace(/\D/g, '')}`, '_blank');
    }
  };

  const handleSendEmail = (customer: Customer) => {
    // Open Gmail compose with customer's email
    window.open(`mailto:${customer.email}`, '_blank');
  };

  const handleImportComplete = () => {
    // Refresh data after import
    window.location.reload();
  };

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
            <h1 className="text-2xl font-bold mb-1">Clients</h1>
            <div className="text-sm text-muted-foreground">
              Client information may be delayed by up to one hour when using segments
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">More</span>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add new
          </Button>
        </div>
      </div>

      {/* Stage Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-1 overflow-x-auto">
          {customerStages.map((stage) => (
            <button
              key={stage.id}
              onClick={() => setActiveStage(stage.id)}
              className={`px-4 py-2 text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeStage === stage.id
                  ? 'border-primary text-primary font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {stage.label}
              {stage.count !== null && stage.count > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-muted rounded-full">
                  {stage.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search all clients"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
        </Button>
      </div>

      {/* Conditional Content */}
      {activeStage === 'Dashboard' ? (
        // Dashboard View
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Customer Overview</h2>
            <Button onClick={() => setImportModalOpen(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Import & Sync
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalClients}</div>
                <p className="text-xs text-muted-foreground">
                  Live data from Arketa
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Members</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.activeMembers}</div>
                <p className="text-xs text-muted-foreground">
                  Recent class attendance
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Trial Members</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.introOffer}</div>
                <p className="text-xs text-muted-foreground">
                  Intro offer students
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New This Month</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.newThisMonth}</div>
                <p className="text-xs text-muted-foreground">
                  First classes this month
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        // Table View
        <div className="bg-surface rounded-lg border">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-muted-foreground">Loading customers...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-destructive">{error}</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NAME</TableHead>
                  <TableHead>EMAIL</TableHead>
                  <TableHead>TAGS</TableHead>
                  <TableHead>CREATED</TableHead>
                  <TableHead>LAST SEEN</TableHead>
                  <TableHead>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No customers found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="font-medium">{customer.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-muted-foreground">{customer.email}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {customer.segment !== 'General' ? customer.segment : '--'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(customer.memberSince).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {customer.lastVisit === new Date().toISOString().split('T')[0] ? 
                            '--' : 
                            new Date(customer.lastVisit).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })
                          }
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
          )}
        </div>
      )}

      {/* Customer Profile Modal */}
      <CustomerProfileModal
        customer={selectedCustomer}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      {/* Import & Sync Modal */}
      <ImportSyncModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImportComplete={handleImportComplete}
      />
    </div>
  );
}