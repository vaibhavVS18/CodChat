import React, { useState } from "react";
import { FileText } from "lucide-react";

const FileNode = ({ name, node, level = 0, onSelect, selectedFile }) => {
  const isFile = node.file && typeof node.file.contents === "string";
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* File or Folder row */}
      <div
        onClick={() => {
          if (isFile) {
            onSelect(name, node.file.contents);
          } else {
            setIsOpen(!isOpen);
          }
        }}
        style={{ paddingLeft: `${level * 16}px` }}
        className={`flex items-center cursor-pointer p-1 rounded ${
          selectedFile?.name === name
            ? "bg-blue-50 border-l-2 border-blue-500"
            : "hover:bg-gray-100"
        }`}
      >
        {isFile ? (
          <FileText className="w-4 h-4 mr-2 text-gray-600" />
        ) : (
          <span className="mr-2">{isOpen ? "📂" : "📁"}</span>
        )}
        <span className="text-sm truncate">{name}</span>
      </div>

      {/* Children if it's a folder and expanded */}
      {!isFile && isOpen && node && (
        <div>
          {Object.entries(node).map(([childName, childNode]) => (
            <FileNode
              key={childName}
              name={childName}
              node={childNode}
              level={level + 1}
              onSelect={onSelect}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FileNode;
