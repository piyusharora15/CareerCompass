import React, { useState } from "react";

const TargetRoleModal = ({
  isOpen,
  onClose,
  savedRoles,
  onSelectRole,
}) => {
  const [customRole, setCustomRole] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (customRole.trim()) {
      onSelectRole(customRole.trim());
    }
    setCustomRole("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-md p-6 space-y-4 border border-gray-700">
        <h2 className="text-xl font-bold">Change Target Role</h2>

        {/* Existing roles */}
        {savedRoles.length > 0 && (
          <div>
            <p className="text-sm text-gray-400 mb-2">
              Previously used roles
            </p>
            <div className="flex flex-wrap gap-2">
              {savedRoles.map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    onSelectRole(role);
                    onClose();
                  }}
                  className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded text-sm"
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Custom role input */}
        <div>
          <label className="text-sm text-gray-400">
            Or enter a new target role
          </label>
          <input
            type="text"
            value={customRole}
            onChange={(e) => setCustomRole(e.target.value)}
            placeholder="e.g. Backend Engineer"
            className="mt-2 w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 outline-none"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default TargetRoleModal;