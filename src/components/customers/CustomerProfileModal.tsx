import { useState } from 'react';
import { Customer } from '@/types/customers';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { MessageSquare, Edit3, CreditCard, UserPlus } from 'lucide-react';

interface CustomerProfileModalProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomerProfileModal({ customer, open, onOpenChange }: CustomerProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState<Customer | null>(null);

  if (!customer) return null;

  const handleEdit = () => {
    setEditedCustomer({ ...customer });
    setIsEditing(true);
  };

  const handleSave = () => {
    // Here would be the save logic
    setIsEditing(false);
    console.log('Saving customer:', editedCustomer);
  };

  const handleCancel = () => {
    setEditedCustomer(null);
    setIsEditing(false);
  };

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

  const displayCustomer = isEditing ? editedCustomer! : customer;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-lg font-semibold">
                {customer.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <DialogTitle className="text-xl">{customer.name}</DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getStatusColor(customer.status)}>
                    {customer.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Member since {new Date(customer.memberSince).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <Button variant="outline" size="sm" onClick={handleEdit}>
                    <Edit3 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Message
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    value={displayCustomer.email}
                    onChange={(e) => setEditedCustomer(prev => ({ ...prev!, email: e.target.value }))}
                  />
                ) : (
                  <p className="text-sm mt-1">{displayCustomer.email}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={displayCustomer.phone || ''}
                    onChange={(e) => setEditedCustomer(prev => ({ ...prev!, phone: e.target.value }))}
                  />
                ) : (
                  <p className="text-sm mt-1">{displayCustomer.phone || 'Not provided'}</p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              {isEditing ? (
                <Input
                  id="address"
                  value={displayCustomer.address || ''}
                  onChange={(e) => setEditedCustomer(prev => ({ ...prev!, address: e.target.value }))}
                />
              ) : (
                <p className="text-sm mt-1">{displayCustomer.address || 'Not provided'}</p>
              )}
            </div>
          </div>

          {/* Membership Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Membership</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Current Plan</Label>
                <p className="text-sm mt-1 font-medium">{displayCustomer.currentPlan}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="auto-renewal" 
                  checked={displayCustomer.autoRenewal}
                  disabled={!isEditing}
                  onCheckedChange={(checked) => 
                    isEditing && setEditedCustomer(prev => ({ ...prev!, autoRenewal: checked }))
                  }
                />
                <Label htmlFor="auto-renewal">Auto-renewal</Label>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Stats</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">{displayCustomer.totalClasses}</div>
                <div className="text-sm text-muted-foreground">Total Classes</div>
              </div>
              <div className="bg-muted p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">{displayCustomer.attendanceRate}%</div>
                <div className="text-sm text-muted-foreground">Attendance Rate</div>
              </div>
              <div className="bg-muted p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">{displayCustomer.classesThisMonth}</div>
                <div className="text-sm text-muted-foreground">This Month</div>
              </div>
            </div>
            <div>
              <Label>Favorite Class</Label>
              <p className="text-sm mt-1 font-medium">{displayCustomer.favoriteClass}</p>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Notes</h3>
            {isEditing ? (
              <Textarea
                value={displayCustomer.notes || ''}
                onChange={(e) => setEditedCustomer(prev => ({ ...prev!, notes: e.target.value }))}
                placeholder="Add notes about this customer..."
                className="min-h-[80px]"
              />
            ) : (
              <p className="text-sm">{displayCustomer.notes || 'No notes added'}</p>
            )}
          </div>

          {/* Actions */}
          {!isEditing && (
            <div className="flex gap-2 pt-4 border-t">
              <Button variant="outline" className="flex-1">
                <CreditCard className="w-4 h-4 mr-2" />
                Update Membership
              </Button>
              <Button variant="outline" className="flex-1">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Note
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}