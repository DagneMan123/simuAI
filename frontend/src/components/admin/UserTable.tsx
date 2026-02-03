import React, { useState } from 'react';
import { 
  Edit, Trash2, UserCheck,  MoreVertical, Search, Filter, UserPlus, AlertCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserRole, ROLE_LABELS, ROLE_COLORS } from '@/constants/roles';

// 1. Interface with more details
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'pending' | 'banned';
  lastActive: string;
  createdAt: string;
  company?: string;
}

interface UserTableProps {
  users: User[];
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
  onStatusChange?: (userId: string, status: User['status']) => void;
  loading?: boolean;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  onEdit,
  onDelete,
  onStatusChange,
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 2. Advanced Filtering
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // 3. Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'banned': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedUsers(currentItems.map(user => user.id));
    else setSelectedUsers([]);
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) setSelectedUsers(prev => [...prev, userId]);
    else setSelectedUsers(prev => prev.filter(id => id !== userId));
  };

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            className="pl-10 h-10 border-none bg-gray-50 focus-visible:ring-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-36 bg-gray-50 border-none">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="EMPLOYER">Employer</SelectItem>
              <SelectItem value="CANDIDATE">Candidate</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="shrink-0"><Filter size={18}/></Button>
          <Button className="bg-blue-600 hover:bg-blue-700 gap-2"><UserPlus size={18}/> Add</Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="border rounded-xl bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-12">
                  <input 
                    type="checkbox" 
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wider">User Profile</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Role</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-xs uppercase tracking-wider">Joined Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="h-40 text-center text-gray-400 italic">Fetching users...</TableCell></TableRow>
              ) : currentItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle className="h-10 w-10 text-gray-200" />
                      <p className="text-gray-500 font-medium">No users found matching your criteria.</p>
                      <Button variant="link" onClick={() => {setSearchTerm(''); setRoleFilter('all');}}>Clear all filters</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                currentItems.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell>
                      <input 
                        type="checkbox" 
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs uppercase">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Badge className={`text-[10px] font-bold ${ROLE_COLORS[user.role]}`}>{ROLE_LABELS[user.role]}</Badge></TableCell>
                    <TableCell><Badge className={`text-[10px] ${getStatusColor(user.status)}`}>{user.status.toUpperCase()}</Badge></TableCell>
                    <TableCell className="text-xs text-gray-500">{user.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreVertical size={16} /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem onClick={() => onEdit?.(user)} className="gap-2"><Edit size={14}/> Edit Profile</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onStatusChange?.(user.id, 'active')} className="gap-2"><UserCheck size={14}/> Activate</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onDelete?.(user.id)} className="text-red-600 gap-2 font-medium"><Trash2 size={14}/> Delete User</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-2">
        <p className="text-xs text-gray-500">
          Showing <span className="font-bold text-gray-900">{indexOfFirstItem + 1}</span> to <span className="font-bold text-gray-900">{Math.min(indexOfLastItem, filteredUsers.length)}</span> of {filteredUsers.length} users
        </p>
        <div className="flex gap-2">
          <Button 
            variant="outline" size="sm" 
            onClick={() => setCurrentPage(prev => prev - 1)} 
            disabled={currentPage === 1}
            className="h-8 text-xs px-4"
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
             {[...Array(totalPages)].map((_, i) => (
               <Button 
                 key={i} 
                 variant={currentPage === i + 1 ? "default" : "outline"} 
                 size="sm" 
                 className="h-8 w-8 p-0 text-xs"
                 onClick={() => setCurrentPage(i + 1)}
               >
                 {i + 1}
               </Button>
             ))}
          </div>
          <Button 
            variant="outline" size="sm" 
            onClick={() => setCurrentPage(prev => prev + 1)} 
            disabled={currentPage === totalPages}
            className="h-8 text-xs px-4"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;