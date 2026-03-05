import { useState, useEffect } from "react";
import { DataTable, ConfirmModal, Modal } from "../../components";
import adminAPI from "../../api/admin";
import {
  Users,
  User,
  Shield,
  UserCog,
  Trash2,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  UserCheck,
  UserX,
} from "lucide-react";

/**
 * Admin Users Page
 * View and manage all users with verification system
 */
const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
  const [roleModal, setRoleModal] = useState({
    open: false,
    user: null,
    newRole: null,
  });
  const [verifyModal, setVerifyModal] = useState({
    open: false,
    user: null,
    action: null, // 'verify' or 'unverify'
  });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getUsers(page);
      setUsers(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async () => {
    if (!deleteModal.user) return;

    setActionLoading(true);
    try {
      await adminAPI.deleteUser(deleteModal.user._id);
      setDeleteModal({ open: false, user: null });
      fetchUsers(pagination?.page || 1);
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRoleChange = async () => {
    if (!roleModal.user || !roleModal.newRole) return;

    setActionLoading(true);
    try {
      await adminAPI.updateUserRole(roleModal.user._id, roleModal.newRole);
      setRoleModal({ open: false, user: null, newRole: null });
      fetchUsers(pagination?.page || 1);
    } catch (error) {
      console.error("Error updating user role:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyAction = async () => {
    if (!verifyModal.user) return;

    setActionLoading(true);
    try {
      if (verifyModal.action === "verify") {
        await adminAPI.verifyUser(verifyModal.user._id);
      } else {
        await adminAPI.unverifyUser(verifyModal.user._id);
      }
      setVerifyModal({ open: false, user: null, action: null });
      fetchUsers(pagination?.page || 1);
    } catch (error) {
      console.error("Error updating user verification:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: {
        bg: "bg-purple-100 text-purple-700",
        icon: Shield,
      },
      landlord: {
        bg: "bg-blue-100 text-blue-700",
        icon: UserCog,
      },
      student: {
        bg: "bg-green-100 text-green-700",
        icon: User,
      },
    };

    const config = roleConfig[role] || roleConfig.student;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${config.bg}`}
      >
        <Icon className="h-3 w-3" />
        {role}
      </span>
    );
  };

  const columns = [
    {
      header: "User",
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium">
                {user.name?.charAt(0)?.toUpperCase() || "?"}
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-900">{user.name || "N/A"}</p>
              {user.isVerified && (
                <CheckCircle
                  className="h-4 w-4 text-green-500"
                  title="Verified User"
                />
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Mail className="h-3 w-3" />
              <span className="max-w-[180px] truncate">{user.email}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      render: (user) => getRoleBadge(user.role),
    },
    {
      header: "Joined",
      render: (user) => (
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Calendar className="h-3 w-3" />
          {formatDate(user.createdAt)}
        </div>
      ),
    },
    {
      header: "Verification",
      render: (user) => (
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
            user.isVerified
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {user.isVerified ? (
            <CheckCircle className="h-3 w-3" />
          ) : (
            <XCircle className="h-3 w-3" />
          )}
          {user.isVerified ? "Verified" : "Not Verified"}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      cellClassName: "text-right",
      render: (user) => (
        <div className="flex items-center justify-end gap-1">
          {/* Verify/Unverify Button */}
          {user.isVerified ? (
            <button
              onClick={() =>
                setVerifyModal({ open: true, user, action: "unverify" })
              }
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-yellow-50 hover:text-yellow-600"
              title="Unverify User"
            >
              <UserX className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() =>
                setVerifyModal({ open: true, user, action: "verify" })
              }
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-green-50 hover:text-green-600"
              title="Verify User"
            >
              <UserCheck className="h-4 w-4" />
            </button>
          )}
          {/* Role Toggle Dropdown */}
          <select
            value={user.role}
            onChange={(e) =>
              setRoleModal({
                open: true,
                user,
                newRole: e.target.value,
              })
            }
            className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="student">Student</option>
            <option value="landlord">Landlord</option>
            <option value="admin">Admin</option>
          </select>
          <button
            onClick={() => setDeleteModal({ open: true, user })}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
            title="Delete User"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Users</h1>
        <p className="mt-1 text-gray-600">
          Manage all registered users, roles, and verifications
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl bg-blue-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-600">Total Users</p>
              <p className="text-xl font-bold text-blue-700">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-green-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <User className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-600">Students</p>
              <p className="text-xl font-bold text-green-700">
                {users.filter((u) => u.role === "student").length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-yellow-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-100 p-2">
              <UserCog className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-yellow-600">Landlords</p>
              <p className="text-xl font-bold text-yellow-700">
                {users.filter((u) => u.role === "landlord").length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-purple-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-purple-600">Admins</p>
              <p className="text-xl font-bold text-purple-700">
                {users.filter((u) => u.role === "admin").length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-emerald-50 p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-emerald-600">Verified</p>
              <p className="text-xl font-bold text-emerald-700">
                {users.filter((u) => u.isVerified).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        pagination={pagination}
        onPageChange={fetchUsers}
        emptyMessage="No users found"
        emptyIcon={Users}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, user: null })}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteModal.user?.name}"? This will also remove all their associated data and cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={actionLoading}
      />

      {/* Role Change Modal */}
      <ConfirmModal
        isOpen={roleModal.open}
        onClose={() => setRoleModal({ open: false, user: null, newRole: null })}
        onConfirm={handleRoleChange}
        title="Change User Role"
        message={`Are you sure you want to change "${roleModal.user?.name}"'s role to ${roleModal.newRole}?`}
        confirmText="Change Role"
        variant="warning"
        loading={actionLoading}
      />

      {/* Verification Modal */}
      <ConfirmModal
        isOpen={verifyModal.open}
        onClose={() =>
          setVerifyModal({ open: false, user: null, action: null })
        }
        onConfirm={handleVerifyAction}
        title={
          verifyModal.action === "verify" ? "Verify User" : "Unverify User"
        }
        message={
          verifyModal.action === "verify"
            ? `Are you sure you want to verify "${verifyModal.user?.name}"? ${
                verifyModal.user?.role === "landlord"
                  ? "This will allow them to add properties."
                  : ""
              }`
            : `Are you sure you want to unverify "${verifyModal.user?.name}"? ${
                verifyModal.user?.role === "landlord"
                  ? "This will prevent them from adding new properties."
                  : ""
              }`
        }
        confirmText={verifyModal.action === "verify" ? "Verify" : "Unverify"}
        variant={verifyModal.action === "verify" ? "success" : "warning"}
        loading={actionLoading}
      />
    </div>
  );
};

export default AdminUsers;
