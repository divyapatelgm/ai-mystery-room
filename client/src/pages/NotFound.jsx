import React from 'react';
import { Link } from 'react-router-dom';
import { SearchX, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center py-20 px-4 text-center">
      <div className="max-w-md space-y-6 bg-noir-900 border border-noir-600 rounded-xl p-8 shadow-noir-lg">
        <div className="w-16 h-16 rounded-full bg-noir-800 border border-gold/40 flex items-center justify-center text-gold mx-auto">
          <SearchX className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-gold block">
            404 • CASE FILE EXPUNGED
          </span>
          <h1 className="text-2xl font-serif font-bold text-cream">
            Missing Criminal Record
          </h1>
          <p className="text-xs text-parchment font-sans leading-relaxed">
            The archive ledger or investigative workspace you requested does not exist or has been struck from the detective record.
          </p>
        </div>

        <Link to="/">
          <Button variant="gold" icon={ArrowLeft} className="w-full">
            Return to Bureau Headquarters
          </Button>
        </Link>
      </div>
    </div>
  );
}
