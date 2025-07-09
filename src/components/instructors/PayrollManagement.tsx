import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Check, DollarSign, Download, Upload } from "lucide-react";

export function PayrollManagement() {
  const payrollData = [
    { instructor: "Sarah Johnson", regularClasses: 8, basePay: 400, studentBonuses: 480, substitutes: 200, total: 1080, status: "pending" },
    { instructor: "Michael Chen", regularClasses: 12, basePay: 480, studentBonuses: 336, substitutes: 0, total: 816, status: "approved" },
    { instructor: "Jennifer Martinez", regularClasses: 15, basePay: 750, studentBonuses: 450, substitutes: 100, total: 1300, status: "pending" },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Current Period</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Dec 1-31, 2024</div>
            <p className="text-xs text-success">Ready for approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Payroll</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$7,240</div>
            <p className="text-xs text-muted-foreground">156 classes taught</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Gusto Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Connected</div>
            <p className="text-xs text-muted-foreground">Last synced 2 hours ago</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Payroll Actions</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Export Report</Button>
              <Button variant="outline" size="sm"><Calculator className="h-4 w-4 mr-2" />Calculate All</Button>
              <Button size="sm"><Upload className="h-4 w-4 mr-2" />Send to Gusto</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Instructor</TableHead>
                <TableHead>Regular Classes</TableHead>
                <TableHead>Student Bonuses</TableHead>
                <TableHead>Substitutes</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{row.instructor}</TableCell>
                  <TableCell>{row.regularClasses} × ${row.basePay / row.regularClasses} = ${row.basePay}</TableCell>
                  <TableCell>${row.studentBonuses}</TableCell>
                  <TableCell>${row.substitutes}</TableCell>
                  <TableCell className="font-bold">${row.total}</TableCell>
                  <TableCell>
                    <Badge variant={row.status === 'approved' ? 'default' : 'secondary'}>
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <Check className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}