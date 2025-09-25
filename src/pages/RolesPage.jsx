import React from "react";
import RolesTable from "../components/role/RolesTable";

const RolesPage = () => {
    const roles = [
      { name: "Administrator", createdDate: "2024-01-15", users: 5 },
      { name: "Editor", createdDate: "2024-01-16", users: 8 },
      { name: "Viewer", createdDate: "2024-01-17", users: 12 },
    ];
  
    return (
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <RolesTable roles={roles} />
        </div>
      </main>
    );
  };
  
  export default RolesPage;