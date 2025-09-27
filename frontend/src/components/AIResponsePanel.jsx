import React, { useEffect, useMemo, useState } from "react";
import { Copy, Check, FileText, Code, Terminal } from "lucide-react";

const AIResponsePanel = ({ message, isOpen = false, onToggle = () => {} }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [copiedStates, setCopiedStates] = useState({});
  const [editableContent, setEditableContent] = useState({});
  const [parsedResponse, setParsedResponse] = useState(null);
  const [openFolders, setOpenFolders] = useState(new Set());


  useEffect(() => {
    if (!message) {
      setParsedResponse(null);
      setSelectedFile(null);      // clear old selection
      setEditableContent({});     // clear old edits
      return;
    }

    try {
      const payload = message.content;
      if (typeof payload === "string") {
        setParsedResponse(JSON.parse(payload));
      } else if (typeof payload === "object" && payload !== null) {
        setParsedResponse(payload);
      } else {
        setParsedResponse(null);
      }

      // clear selection + edits for new response
      setSelectedFile(null);
      setEditableContent({});
    } catch {
      setParsedResponse(null);
      setSelectedFile(null);
      setEditableContent({});
    }
  }, [message]);


  
  // convert fileTree → simple array of files
//  ->  After mapping, files becomes as:
/*
 [
   { name: "app.js", content: "console.log('Hello')" },
   { name: "package.json", content: "{...}" }
 ]
*/
  // const files = useMemo(() => {
  //   if (!parsedResponse?.fileTree) return [];
  //   return Object.entries(parsedResponse.fileTree).map(([filename, value]) => ({
  //     name: filename,
  //     content: value.file?.contents ?? "",
  //   }));
  // }, [parsedResponse]);


const toggleFolder = (path) => {
  setOpenFolders((prev) => {
    const newSet = new Set(prev);
    if (newSet.has(path)) newSet.delete(path);
    else newSet.add(path);
    return newSet;
  });
};


const FileNode = ({
  name,
  node,
  level = 0,
  path,
  selectedFile,
  onSelect,
  openFolders,
  toggleFolder,
}) => {
  const isFile = node.file && typeof node.file.contents === "string";
  const isOpen = openFolders.has(path); // get state from parent

  return (
    <div>
      <div
        onClick={() => {
          if (isFile) {
            onSelect(path, node.file.contents);
          } else {
            toggleFolder(path); // toggle folder in parent state
          }
        }}
        style={{ paddingLeft: `${level * 16}px` }}
        className={`flex items-center cursor-pointer p-1 rounded transition-colors
          ${
            selectedFile?.name === path
              ? "bg-gray-700 border-l-2 border-emerald-400"
              : "hover:bg-gray-800"
          }`}
      >
        {isFile ? (
          <FileText className="w-4 h-4 mr-2 text-gray-300" />
        ) : (
          <span className="mr-2">{isOpen ? "📂" : "📁"}</span>
        )}
        <span className="text-sm text-white truncate">{name}</span>
      </div>

      {!isFile && isOpen && node && (
        <div>
          {Object.entries(node).map(([childName, childNode]) => (
            <FileNode
              key={`${path}/${childName}`}
              name={childName}
              node={childNode}
              level={level + 1}
              path={`${path}/${childName}`}
              selectedFile={selectedFile}
              onSelect={onSelect}
              openFolders={openFolders}
              toggleFolder={toggleFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
};


//  -> if there were simple files only , not heirarchy of files
// useEffect(() => {
//   if (files.length > 0 && !selectedFile) {
//     setSelectedFile(files[0]);
//     setEditableContent((p) => ({
//       ...p,
//       [files[0].name]: files[0].content,
//     }));
//   }
// }, [files, selectedFile]);


  const copyToClipboard = async (text, key) => {
    try {
      if (!navigator.clipboard) throw new Error("Clipboard not supported");
      await navigator.clipboard.writeText(text);
      setCopiedStates((p) => ({ ...p, [key]: true }));
      setTimeout(() => setCopiedStates((p) => ({ ...p, [key]: false })), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  if (!isOpen) return null;

return (
  <div className="inset-y-0 mt-20 right flex-1 bg-gray-900 shadow-lg z-40 flex flex-col border-2 border-gray-400 rounded-2xl overflow-hidden">
    {/* Header */}
    <div className="flex items-center justify-between p-4 border-b bg-gray-800">
      <div className="flex items-center gap-3">
        <Code className="w-5 h-5 text-cyan-400" />
        <h2 className="font-semibold text-cyan-400">AI Response</h2>
      </div>
      <button onClick={onToggle} className="p-1 hover:bg-gray-700 rounded text-gray-200">
        ✕
      </button>
    </div>

    {!parsedResponse ? (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <p>No AI Response yet</p>
      </div>
    ) : (
      <div className="flex-1 flex overflow-hidden">
        {/* File tree */}
        <div
          className={`bg-gray-800 border-r border-gray-700 flex flex-col 
                      ${selectedFile ? "hidden md:flex" : "flex"} 
                      w-full md:w-auto md:min-w-max 
                      h-[calc(88vh-5rem)] md:h-auto`}
        >
          <div className="p-3 bg-gray-700 border-b">
            <h3 className="font-semibold text-sm text-emerald-400">Files</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
            {parsedResponse?.fileTree ? (
              Object.entries(parsedResponse.fileTree).map(([name, node]) => (
                <FileNode
                  key={name}
                  name={name}
                  node={node}
                  path={name}
                  level={0}
                  selectedFile={selectedFile}
                  onSelect={(path, content) => {
                    setSelectedFile({ name: path, content });
                    setEditableContent((p) => ({ ...p, [path]: content }));
                  }}
                  openFolders={openFolders}
                  toggleFolder={toggleFolder}
                />
              ))
            ) : (
              <p className="text-sm text-gray-400">No files generated</p>
            )}
          </div>
        </div>

        {/* File content editor */}
        {selectedFile && (
          <div className="flex-1 flex flex-col bg-gray-900 w-full h-[calc(88vh-5rem)] md:h-auto relative">
            {/* Top bar with back button and responsive file name */}
            <div className="flex items-center justify-center md:justify-start p-3 bg-gray-800 border-b relative">
              {/* Back button at left (mobile only) */}
              <button
                className="absolute left-3 text-xl text-white hover:text-cyan-400 md:hidden"
                onClick={() => setSelectedFile(null)}
              >
                ←
              </button>

              {/* File name */}
              <span className="font-semibold text-sm text-emerald-400 truncate pl-10 md:pl-3">
                {selectedFile.name}
              </span>

              {/* Copy button at right */}
              <button
                onClick={() =>
                  copyToClipboard(editableContent[selectedFile.name] ?? selectedFile.content, selectedFile.name)
                }
                className="absolute right-3 p-1 hover:bg-gray-700 rounded"
              >
                {copiedStates[selectedFile.name] ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-300" />
                )}
              </button>
            </div>

            <textarea
              value={editableContent[selectedFile.name] ?? selectedFile.content}
              onChange={(e) =>
                setEditableContent((p) => ({ ...p, [selectedFile.name]: e.target.value }))
              }
              className="flex-1 p-4 font-mono text-sm text-gray-200 bg-gray-900 resize-none outline-none scrollbar-hide"
              spellCheck={false}
            />

            {/* Original bottom back button */}
            <button
              className="p-2 bg-gray-800 text-gray-200 hover:bg-gray-700 md:hidden mt-2 rounded"
              onClick={() => setSelectedFile(null)}
            >
              ← Back to Files
            </button>
          </div>
        )}
      </div>
    )}
  </div>
);



};

export default AIResponsePanel;
