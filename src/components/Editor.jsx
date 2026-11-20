import { useEffect, useRef } from "react";
import { EditorView, keymap, placeholder } from "@codemirror/view";
import { Compartment, Prec } from "@codemirror/state";
import { basicSetup } from "codemirror";
import { yCollab, yUndoManagerKeymap } from "y-codemirror.next";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";

const LANGUAGES = { cpp, python, java, javascript };
const languageExtension = (name) => (LANGUAGES[name] || javascript)();

/**
 * A CodeMirror editor bound to a Yjs Y.Text.
 * Every edit becomes a small Yjs update (not the whole file), concurrent edits
 * merge instead of overwriting each other, and remote users' cursors are drawn
 * from the awareness object.
 */
export default function Editor({ ytext, awareness, language }) {
  const hostRef = useRef(null);
  const viewRef = useRef(null);
  const languageSlot = useRef(new Compartment());

  // (Re)create the editor when the bound document changes, e.g. switching tabs.
  useEffect(() => {
    if (!ytext || !hostRef.current) return undefined;

    const view = new EditorView({
      doc: ytext.toString(),
      parent: hostRef.current,
      extensions: [
        // Yjs owns undo/redo (per-user), so its keymap must win over CodeMirror's history.
        Prec.highest(keymap.of(yUndoManagerKeymap)),
        basicSetup,
        dracula,
        languageSlot.current.of(languageExtension(language)),
        yCollab(ytext, awareness),
        placeholder("Write code here…"),
        EditorView.theme({
          "&": { height: "100%", fontSize: "15px" },
        }),
      ],
    });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // language is applied by the effect below, not by rebuilding the editor
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ytext, awareness]);

  // Switching language only swaps the syntax highlighter.
  useEffect(() => {
    viewRef.current?.dispatch({
      effects: languageSlot.current.reconfigure(languageExtension(language)),
    });
  }, [language, ytext, awareness]);

  return <div ref={hostRef} style={{ height: "100%", width: "100%" }} />;
}
