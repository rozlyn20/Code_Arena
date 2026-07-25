import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { dracula } from "@uiw/codemirror-theme-dracula";

export default function Editor({ socketRef, roomId, onCodeChange, code }) {
  const defaultCode = " write code here";

  return (
    <CodeMirror
      value={code}
      onChange={(value) => {
        onCodeChange(value);

        socketRef.current.emit("code-change", {
          roomId,
          code: value,
        });
      }}
      theme={dracula}
      extensions={[javascript()]}
      height="100%"
      style={{
        height: "100%",
        width: "100%",
        fontSize: "15px",
      }}
      basicSetup={{
        lineNumbers: true,
        highlightActiveLine: true,
        highlightActiveLineGutter: true,
        foldGutter: true,
        autocompletion: true,
        bracketMatching: true,
        closeBrackets: true,
      }}
    />
  );
}
