import React from 'react';

interface TranslationInfoProps {
  usingFallback: boolean;
}

export function TranslationInfo({ usingFallback }: TranslationInfoProps) {
  return (
    <div className="mt-3 text-sm text-gray-600 bg-gray-100 p-2 rounded">
      {usingFallback ? (
        <div>
          <p className="font-medium">Using local dictionary translation</p>
          <p className="text-xs">Limited vocabulary available. The API connection was unsuccessful.</p>
        </div>
      ) : (
        <div>
          <p className="font-medium">Translation powered by Google Translate</p>
          <p className="text-xs">Using <a href="https://github.com/vitalets/google-translate-api" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">@vitalets/google-translate-api</a> - a free and reliable translation service</p>
        </div>
      )}
    </div>
  );
}
