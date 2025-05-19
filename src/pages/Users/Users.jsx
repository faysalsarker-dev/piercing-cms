// .jsx
import  { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const fakeUsers = [
  { id: 1, name: "Faysal Sarker", email: "faysal@example.com", role: "admin" },
  { id: 2, name: "Tanvir Hossain", email: "tanvir@example.com", role: "editor" },
  { id: 3, name: "Nusrat Jahan", email: "nusrat@example.com", role: "viewer" },
  { id: 4, name: "Mehedi Hasan", email: "mehedi@example.com", role: "editor" },
];

const roleColors = {
  admin: "bg-red-500 text-white",
  editor: "bg-blue-500 text-white",
  viewer: "bg-gray-500 text-white",
};

const Users = () => {
  const [users, setUsers] = useState(fakeUsers);

  const handleRoleChange = (id, newRole) => {
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, role: newRole } : user
    );
    setUsers(updatedUsers);
  };

  return (
    <Card className="p-4 mt-6 mx-auto w-full shadow-xl rounded-2xl ">
      <h2 className="text-2xl font-semibold mb-4 text-center">User Management</h2>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-center">Change Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge className={roleColors[user.role] || "bg-gray-300"}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Select
                    value={user.role}
                    onValueChange={(value) => handleRoleChange(user.id, value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Users;
