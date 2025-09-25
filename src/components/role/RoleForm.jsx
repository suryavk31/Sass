import { useState } from "react";
import PermissionsTable from "./PermissionsTable";

const RoleForm = ({ onSubmit, isSubmitting }) => {
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState({});

  const handleCheckboxChange = (task, action) => {
    setPermissions((prev) => ({
      ...prev,
      [task]: { ...prev[task], [action]: !prev[task]?.[action] },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ roleName, permissions });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-6">
      <div>
        <label htmlFor="role-name" className="block text-sm font-medium text-gray-700">
          Role Name
        </label>
        <input
          type="text"
          id="role-name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          className="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter role name"
        />
      </div>

      <PermissionsTable permissions={permissions} onPermissionChange={handleCheckboxChange} />

      <div className="flex justify-end mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium text-white ${
            isSubmitting
              ? "bg-gray-400"
              : "bg-indigo-600 hover:bg-indigo-700"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          {isSubmitting ? "Saving..." : "Save Role"}
        </button>
      </div>
    </form>
  );
};

export default RoleForm;