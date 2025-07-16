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
    { id: 'Trial', label: 'Trial', count: customers.filter(c => c.status === 'Trial').length },
    { id: 'Active', label: 'Active Member', count: customers.filter(c => c.status === 'Active').length },
    { id: 'At-Risk', label: 'At-Risk', count: customers.filter(c => c.status === 'At-Risk').length },
    { id: 'Expired', label: 'Expired', count: customers.filter(c => c.status === 'Expired').length },
    { id: 'Prenatal', label: 'Prenatal', count: customers.filter(c => c.segment === 'Prenatal').length },
    { id: 'Seniors', label: 'Seniors', count: customers.filter(c => c.segment === 'Seniors').length },
    { id: 'Students', label: 'Students', count: customers.filter(c => c.segment === 'Students').length },
    { id: 'Professionals', label: 'Professionals', count: customers.filter(c => c.segment === 'Professionals').length },
  ];

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = 
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone?.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesStage = true;
      if (activeStage !== 'All') {
        if (['Trial', 'Active', 'At-Risk', 'Expired'].includes(activeStage)) {
          matchesStage = customer.status === activeStage;
        } else if (['Prenatal', 'Seniors', 'Students', 'Professionals'].includes(activeStage)) {
          matchesStage = customer.segment === activeStage;
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
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <span>Dashboard</span>
            <span>/</span>
            <span>Customers</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Customers</h1>
            <div className="text-sm text-muted-foreground">
              Customer information may be delayed by up to one hour when using segments
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
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
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search all customers"
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
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Segment</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Total Classes</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
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
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-sm font-medium">
                          {customer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-muted-foreground">{customer.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(customer.status)}>
                        {customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getSegmentColor(customer.segment)}>
                        {customer.segment}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={isRecentVisit(customer.lastVisit) ? 'text-danger font-medium' : ''}>
                        {new Date(customer.lastVisit).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{customer.totalClasses}</span>
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