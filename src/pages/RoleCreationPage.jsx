import { useState } from "react";
import { useDispatch } from "react-redux";
import { createRole } from "../actions/roleActions";
import { useNavigate } from "react-router-dom";
import RoleForm from "../components/role/RoleForm";

const RoleCreationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (roleData) => {
    setIsLoading(true);
    setErrorMessage(null); // Clear previous errors
    try {
      await dispatch(createRole(roleData));
      navigate("/roles"); // Redirect to roles list on success
    } catch (error) {
      setErrorMessage(error.message); // Display error on failure
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="max-w-8xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-900">Create New Role</h1>
        <p className="mt-2 text-sm text-gray-600">
          Define a new role and assign permissions
        </p>
        {errorMessage && (
          <p className="mt-4 text-red-500">{errorMessage}</p>
        )}
        {isLoading && (
          <p className="mt-4 text-gray-600">Creating role...</p>
        )}
        <RoleForm onSubmit={handleSubmit} isSubmitting={isLoading} />
      </div>
    </div>
  );
};

export default RoleCreationPage;