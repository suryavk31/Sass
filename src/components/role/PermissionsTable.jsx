const PermissionsTable = ({ permissions, onPermissionChange }) => {
    const tasks = ["Users Management", "Role Management", "Content Management", "Settings"];
    const actions = ["Create", "Edit", "Delete", "View"];
  
    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Permissions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tasks
                </th>
                {actions.map((action) => (
                  <th key={action} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {action}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr key={task} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task}</td>
                  {actions.map((action) => (
                    <td key={action} className="px-6 py-4 whitespace-nowrap text-center">
                      <input
                        type="checkbox"
                        checked={permissions[task]?.[action] || false}
                        onChange={() => onPermissionChange(task, action)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default PermissionsTable;
  