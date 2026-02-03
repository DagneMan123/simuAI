import  { useState } from 'react';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  Building,
  FileText,
  Mail,
  Phone,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminNavbar from '@/components/admin/AdminNavbar';

interface VerificationRequest {
  id: string;
  type: 'employer' | 'candidate';
  name: string;
  email: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: string[];
  details: {
    companyName?: string;
    position?: string;
    phone?: string;
    location?: string;
    website?: string;
  };
}

const VerificationPage = () => {
  const [requests, setRequests] = useState<VerificationRequest[]>([
    {
      id: '1',
      type: 'employer',
      name: 'Acme Corporation',
      email: 'hr@acme.com',
      submittedAt: '2024-02-01 10:30',
      status: 'pending',
      documents: ['business_license.pdf', 'tax_certificate.pdf'],
      details: {
        companyName: 'Acme Corporation',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        website: 'https://acme.com'
      }
    },
    {
      id: '2',
      type: 'candidate',
      name: 'John Doe',
      email: 'john@example.com',
      submittedAt: '2024-01-31 14:20',
      status: 'pending',
      documents: ['id_card.jpg', 'resume.pdf', 'certificate.pdf'],
      details: {
        position: 'Senior Frontend Developer',
        phone: '+1 (555) 987-6543',
        location: 'New York, NY'
      }
    },
    {
      id: '3',
      type: 'employer',
      name: 'TechStart Inc.',
      email: 'info@techstart.com',
      submittedAt: '2024-01-30 09:15',
      status: 'approved',
      documents: ['registration_certificate.pdf'],
      details: {
        companyName: 'TechStart Inc.',
        phone: '+1 (555) 456-7890',
        location: 'Austin, TX',
        website: 'https://techstart.com'
      }
    },
    {
      id: '4',
      type: 'candidate',
      name: 'Jane Smith',
      email: 'jane@example.com',
      submittedAt: '2024-01-29 16:45',
      status: 'rejected',
      documents: ['passport.jpg', 'degree_certificate.pdf'],
      details: {
        position: 'Full Stack Developer',
        phone: '+1 (555) 234-5678',
        location: 'Boston, MA'
      }
    },
  ]);

  const handleApprove = (id: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'approved' } : req
    ));
  };

  const handleReject = (id: string) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'rejected' } : req
    ));
  };

  const pendingRequests = requests.filter(req => req.status === 'pending');
  const approvedRequests = requests.filter(req => req.status === 'approved');
  const rejectedRequests = requests.filter(req => req.status === 'rejected');

  const getStatusBadge = (status: VerificationRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
    }
  };

  const getTypeIcon = (type: VerificationRequest['type']) => {
    return type === 'employer' ? 
      <Building className="h-5 w-5 text-blue-500" /> : 
      <User className="h-5 w-5 text-green-500" />;
  };

  return (
    <div className="space-y-6">
      <AdminNavbar />
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Verification Requests</h1>
          <p className="text-gray-600">Verify employer and candidate identities</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            View Guidelines
          </Button>
          <Button>
            <Shield className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Requests</p>
                <h3 className="text-2xl font-bold mt-1">{requests.length}</h3>
              </div>
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <h3 className="text-2xl font-bold mt-1">{pendingRequests.length}</h3>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Approved</p>
                <h3 className="text-2xl font-bold mt-1">{approvedRequests.length}</h3>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Rejected</p>
                <h3 className="text-2xl font-bold mt-1">{rejectedRequests.length}</h3>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="pending">
            <Clock className="h-4 w-4 mr-2" />
            Pending ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            <CheckCircle className="h-4 w-4 mr-2" />
            Approved ({approvedRequests.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            <XCircle className="h-4 w-4 mr-2" />
            Rejected ({rejectedRequests.length})
          </TabsTrigger>
        </TabsList>

        {/* Pending Tab */}
        <TabsContent value="pending" className="space-y-6">
          {pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-12 w-12 text-green-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600">No pending requests</h3>
                <p className="text-gray-500 mt-1">All verification requests have been processed</p>
              </CardContent>
            </Card>
          ) : (
            pendingRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-100 rounded-lg">
                          {getTypeIcon(request.type)}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{request.name}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Mail className="h-3 w-3" />
                              {request.email}
                            </div>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-500">
                              Submitted: {request.submittedAt}
                            </span>
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h4 className="font-semibold">Details</h4>
                        {Object.entries(request.details).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-3">
                            {key === 'phone' && <Phone className="h-4 w-4 text-gray-400" />}
                            {key === 'location' && <MapPin className="h-4 w-4 text-gray-400" />}
                            {key === 'website' && <ExternalLink className="h-4 w-4 text-gray-400" />}
                            <span className="text-sm font-medium capitalize">{key}:</span>
                            <span className="text-sm text-gray-600">{value}</span>
                          </div>
                        ))}
                      </div>

                      {/* Documents */}
                      <div className="space-y-3">
                        <h4 className="font-semibold">Documents ({request.documents.length})</h4>
                        <div className="space-y-2">
                          {request.documents.map((doc, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <FileText className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">{doc}</span>
                              </div>
                              <Button variant="outline" size="sm">View</Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <Button 
                        variant="outline" 
                        onClick={() => handleReject(request.id)}
                        className="border-red-600 text-red-700 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      <Button 
                        onClick={() => handleApprove(request.id)}
                        className="bg-gradient-to-r from-green-600 to-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Approved Tab */}
        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Approved Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {approvedRequests.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-300 mx-auto mb-4" />
                  <p className="text-gray-500">No approved requests yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {approvedRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                          {getTypeIcon(request.type)}
                        </div>
                        <div>
                          <h4 className="font-medium">{request.name}</h4>
                          <p className="text-sm text-gray-500">{request.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">{request.submittedAt}</span>
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rejected Tab */}
        <TabsContent value="rejected">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {rejectedRequests.length === 0 ? (
                <div className="text-center py-12">
                  <XCircle className="h-12 w-12 text-red-300 mx-auto mb-4" />
                  <p className="text-gray-500">No rejected requests</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rejectedRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 rounded-lg">
                          {getTypeIcon(request.type)}
                        </div>
                        <div>
                          <h4 className="font-medium">{request.name}</h4>
                          <p className="text-sm text-gray-500">{request.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">{request.submittedAt}</span>
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Verification Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">For Employers</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Valid business registration certificate</li>
                <li>✓ Company website or LinkedIn page</li>
                <li>✓ Official company email address</li>
                <li>✓ Tax identification number (if applicable)</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">For Candidates</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Government-issued ID (passport, driver's license)</li>
                <li>✓ Educational certificates</li>
                <li>✓ Professional certifications</li>
                <li>✓ LinkedIn profile or portfolio</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationPage;