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
import {
  Search,
  Plus,
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

// Define interface for client_imports table
interface ClientImport {
  id: number;
  "Client Name": string | null;
  "First Name": string | null;
  "Last Name": string | null;
  "Client Email": string | null;
  "Phone Number": string | null;
  "Birthday": string | null;
  "Address": string | null;
  "Marketing Email Opt-in": boolean | null;
  "Marketing Text Opt In": boolean | null;
  "Agree to Liability Waiver": boolean | null;
  "Pre-Arketa Milestone Count": number | null;
  "Transactional Text Opt In": boolean | null;
  "First Seen": string | null;
  "Last Seen": string | null;
  "Tags": string | null;
  created_at?: string;
  updated_at?: string;
}

export default function Customers() {
  const [clients, setClients] = useState<ClientImport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<ClientImport | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeStage, setActiveStage] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [totalClients, setTotalClients] = useState(0);
  const [importModalOpen, setImportModalOpen] = useState(false);

  // Fetch clients from client_imports table
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch client data from client_imports table
        const { data, error: fetchError, count } = await supabase
          .from('client_imports')
          .select('*', { count: 'exact' });

        if (fetchError) {
          console.error('Error fetching clients:', fetchError);
          setError('Failed to load clients');
          return;
        }

        setClients(data || []);
        setTotalClients(count || 0);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load clients');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter clients based on search query
  const filteredClients = clients.filter(client => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      (client["Client Name"]?.toLowerCase().includes(searchLower) || 
       client["First Name"]?.toLowerCase().includes(searchLower) || 
       client["Last Name"]?.toLowerCase().includes(searchLower) ||
       client["Client Email"]?.toLowerCase().includes(searchLower) || 
       client["Phone Number"]?.toLowerCase().includes(searchLower) ||
       false)
    );
  });

  const handleViewProfile = (client: ClientImport) => {
    setSelectedClient(client);
    setModalOpen(true);
  };

  const handleSendMessage = (client: ClientImport) => {
    // Open WhatsApp with client's phone number
    if (client["Phone Number"]) {
      window.open(`https://wa.me/${client["Phone Number"].replace(/\D/g, '')}`, '_blank');
    }
  };

  const handleSendEmail = (client: ClientImport) => {
    // Open email client with client's email
    if (client["Client Email"]) {
      window.open(`mailto:${client["Client Email"]}`, '_blank');
    }
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
              Imported client data from Arketa
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

      {/* Stage Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveStage('Dashboard')}
            className={`px-4 py-2 text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeStage === 'Dashboard'
                ? 'border-primary text-primary font-medium'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveStage('All')}
            className={`px-4 py-2 text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeStage === 'All'
                ? 'border-primary text-primary font-medium'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            All Clients
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-muted rounded-full">
              {totalClients}
            </span>
          </button>
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
      </div>

      {/* Conditional Content */}
      {activeStage === 'Dashboard' ? (
        // Dashboard View
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Client Overview</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalClients}</div>
                <p className="text-xs text-muted-foreground">
                  Imported from Arketa
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Marketing Opt-ins</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {clients.filter(c => c["Marketing Email Opt-in"] === true).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Email marketing enabled
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">SMS Opt-ins</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {clients.filter(c => c["Marketing Text Opt In"] === true).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  SMS marketing enabled
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Imports</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {clients.filter(c => {
                    const created = c.created_at ? new Date(c.created_at) : null;
                    const now = new Date();
                    const daysDiff = created ? Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)) : 100;
                    return daysDiff <= 7;
                  }).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Added in the last 7 days
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
              <div className="text-muted-foreground">Loading clients...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-destructive">{error}</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CLIENT NAME</TableHead>
                  <TableHead>EMAIL</TableHead>
                  <TableHead>PHONE</TableHead>
                  <TableHead>FIRST SEEN</TableHead>
                  <TableHead>LAST SEEN</TableHead>
                  <TableHead>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No clients found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <div className="font-medium">{client["Client Name"] || `${client["First Name"] || ''} ${client["Last Name"] || ''}`}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-muted-foreground">{client["Client Email"] || '—'}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-muted-foreground">{client["Phone Number"] || '—'}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {client["First Seen"] 
                            ? new Date(client["First Seen"]).toLocaleDateString('en-US', { 
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
                          {client["Last Seen"]
                            ? new Date(client["Last Seen"]).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })
                            : '—'
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
                            <DropdownMenuItem onClick={() => handleViewProfile(client)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSendMessage(client)}>
                              <MessageCircle className="w-4 h-4 mr-2 text-green-600" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSendEmail(client)}>
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

      {/* Import & Sync Modal */}
      <ImportSyncModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImportComplete={handleImportComplete}
      />
    </div>
  );
}