import React from 'react';

interface TranslationDisclaimerProps {
  usingFallback: boolean;
}

export function TranslationDisclaimer({ usingFallback }: TranslationDisclaimerProps) {
  return (
    <div className="text-xs text-gray-500 mt-2">
      {usingFallback ? (
        <p>Translation provided by local dictionary (limited vocabulary). API connection failed.</p>
      ) : (
        <p>Translation powered by LibreTranslate API - free and open source machine translation.</p>
      )}
    </div>
  );
}
