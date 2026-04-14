const PermissionsTable = ({ permissions, onPermissionChange }) => {
    const tasks = [
      { id: 'tasks', label: 'Tasks & Objectives' },
      { id: 'projects', label: 'Project Portfolio' },
      { id: 'employees', label: 'Team & Members' },
      { id: 'roles', label: 'Security & RBAC' },
      { id: 'billing', label: 'Payments & Billing' },
      { id: 'Sales', label: 'Sales & Pipelines' },
      { id: 'CRM', label: 'CRM & Contacts' },
      { id: 'Leads', label: 'Lead Intelligence' },
      { id: 'Calendar', label: 'Event Calendar' },
      { id: 'HR', label: 'Human Resources' },
      { id: 'workspace', label: 'Developer Settings' }
    ];
    const actions = [
      { id: 'create', label: 'Create' },
      { id: 'edit', label: 'Edit' },
      { id: 'delete', label: 'Delete' },
      { id: 'view', label: 'View' }
    ];
  
    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Permissions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modules
                </th>
                {actions.map((action) => (
                  <th key={action.id} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {action.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.label}</td>
                  {actions.map((action) => (
                    <td key={action.id} className="px-6 py-4 whitespace-nowrap text-center">
                      <input
                        type="checkbox"
                        checked={permissions[task.id]?.[action.id] || false}
                        onChange={() => onPermissionChange(task.id, action.id)}
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
  