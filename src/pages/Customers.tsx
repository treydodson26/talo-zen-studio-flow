import { useState, useMemo, useEffect } from 'react';
import { Customer, CustomerFilters } from '@/types/customers';
import { supabase } from '@/integrations/supabase/client';
import { CustomerProfileModal } from '@/components/customers/CustomerProfileModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  MessageSquare,
  Edit,
} from 'lucide-react';

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeStage, setActiveStage] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch customers from Supabase
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching customers:', error);
          setError('Failed to load customers');
          return;
        }

        // Transform Supabase data to Customer interface
        const transformedCustomers: Customer[] = (data || []).map((client) => ({
          id: client.id,
          name: client["Client Name"] || `${client["First Name"] || ''} ${client["Last Name"] || ''}`.trim() || 'Unknown',
          email: client["Client Email"] || '',
          phone: client["Phone Number"] || '',
          address: client.Address || '',
          status: determineStatus(client),
          segment: determineSegment(client),
          lastVisit: client["Last Seen"] || new Date().toISOString().split('T')[0],
          classesThisMonth: 0, // This would need to be calculated from class attendance data
          totalClasses: parseInt(client["Pre-Arketa Milestone Count"]) || 0,
          attendanceRate: 0, // This would need to be calculated
          favoriteClass: 'Unknown',
          memberSince: client["First Seen"] || client.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          currentPlan: 'Unknown',
          autoRenewal: false,
          notes: client.Tags || '',
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

    fetchCustomers();
  }, []);

  // Helper function to determine customer status
  const determineStatus = (client: any): Customer['status'] => {
    if (client["Marketing Email Opt-in"] === 'Yes' || client["Marketing Text Opt In"] === 'Yes') {
      return 'Active';
    }
    return 'Trial';
  };

  // Helper function to determine customer segment
  const determineSegment = (client: any): Customer['segment'] => {
    const tags = client.Tags?.toLowerCase() || '';
    if (tags.includes('prenatal')) return 'Prenatal';
    if (tags.includes('senior')) return 'Seniors';
    if (tags.includes('student')) return 'Students';
    if (tags.includes('professional')) return 'Professionals';
    return 'General';
  };

  const customerStages = [
    { id: 'All', label: 'All', count: customers.length },
    { id: 'No Purchases', label: 'No Purchases or Reservations', count: customers.filter(c => c.totalClasses === 0).length },
    { id: 'Intro Offer', label: 'Intro Offer', count: customers.filter(c => c.status === 'Trial').length },
    { id: 'Bought Membership', label: 'Bought Membership in the last 7 days', count: customers.filter(c => c.status === 'Active' && isRecentMember(c.memberSince)).length },
    { id: 'Member', label: 'Member', count: customers.filter(c => c.status === 'Active').length },
    { id: 'Active Member', label: 'Active Member', count: customers.filter(c => c.status === 'Active' && !isRecentVisit(c.lastVisit)).length },
    { id: 'Retention', label: 'Retention', count: customers.filter(c => c.status === 'At-Risk').length },
    { id: 'First class booked', label: 'First class booked', count: customers.filter(c => c.totalClasses === 1).length },
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
      if (activeStage !== 'All') {
        switch (activeStage) {
          case 'No Purchases':
            matchesStage = customer.totalClasses === 0;
            break;
          case 'Intro Offer':
            matchesStage = customer.status === 'Trial';
            break;
          case 'Bought Membership':
            matchesStage = customer.status === 'Active' && isRecentMember(customer.memberSince);
            break;
          case 'Member':
            matchesStage = customer.status === 'Active';
            break;
          case 'Active Member':
            matchesStage = customer.status === 'Active' && !isRecentVisit(customer.lastVisit);
            break;
          case 'Retention':
            matchesStage = customer.status === 'At-Risk';
            break;
          case 'First class booked':
            matchesStage = customer.totalClasses === 1;
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
    console.log('Send message to:', customer.name);
  };

  const handleUpdateStatus = (customer: Customer) => {
    console.log('Update status for:', customer.name);
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
              {stage.count > 0 && (
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

      {/* Table */}
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
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatus(customer)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Update Status
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

      {/* Customer Profile Modal */}
      <CustomerProfileModal
        customer={selectedCustomer}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}