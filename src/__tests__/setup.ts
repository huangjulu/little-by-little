import React from "react";

// tsconfig allowUmdGlobalAccess 讓 React 在編譯時全域可用，
// 但 vitest runtime 不支援，需手動掛載。
globalThis.React = React;
