const fs = require('fs');
let code = fs.readFileSync('src/components/DateIdeasModal.tsx', 'utf8');

const replacement = `        {/* Content */}
        <div className={\`relative w-full flex flex-col overflow-y-auto \${(!hasValidKey || error || locating) ? 'bg-[var(--c-bg-darker)]' : 'flex-1 h-[60vh] sm:h-[70vh] bg-[#1a202c]'}\`}>
          {!hasValidKey ? (
             <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 text-center min-h-[300px]">
               <AlertCircle className="w-12 h-12 text-yellow-500 mb-4 shrink-0" />
               <h3 className="text-xl font-bold text-[var(--c-text-main)] mb-2">Google Maps API Key Required</h3>
               <p className="text-sm text-[var(--c-text-main)]/70 mb-4 max-w-md">
                 To find the best cafes near you, we need a Google Maps API Key.
               </p>
               <div className="bg-black/30 p-4 rounded-xl text-left text-sm text-[var(--c-text-main)]/80 space-y-2 border border-white/10 shrink-0">
                 <p><strong>Step 1:</strong> Get a key from Google Cloud Console.</p>
                 <p><strong>Step 2:</strong> Go to AI Studio <strong>Settings</strong> (⚙️ gear icon, top-right).</p>
                 <p><strong>Step 3:</strong> Select <strong>Secrets</strong>.</p>
                 <p><strong>Step 4:</strong> Add a secret named <code>GOOGLE_MAPS_PLATFORM_KEY</code> and paste your key.</p>
               </div>
             </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 text-center min-h-[300px]">
               <MapPin className="w-12 h-12 text-red-400 mb-4 shrink-0" />
               <h3 className="text-lg font-bold text-red-400 mb-2">Location Error</h3>
               <p className="text-sm text-[var(--c-text-main)]/70 max-w-md mb-6">{error}</p>
               <button 
                 onClick={() => { setError(null); setLocation(null); }}
                 className="px-6 py-2 rounded-full bg-[var(--c-accent-main)] text-[var(--c-bg-darkest)] font-bold text-sm shrink-0"
               >
                 Try Again
               </button>
            </div>
          ) : locating ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 min-h-[300px]">
               <div className="w-12 h-12 border-4 border-[var(--c-accent-main)]/20 border-t-[var(--c-accent-main)] rounded-full animate-spin mb-4 shrink-0" />
               <p className="text-sm font-medium text-[var(--c-text-main)] animate-pulse">Finding your location...</p>
            </div>
          ) : location ? (
            <APIProvider apiKey={API_KEY} version="weekly">
              <Map
                defaultCenter={location}
                defaultZoom={13}
                mapId="DATE_SPOTS_MAP_ID"
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                style={{ width: '100%', height: '100%' }}
                gestureHandling="greedy"
                disableDefaultUI={true}
              >
                <PlacesSearch userLocation={location} />
              </Map>
            </APIProvider>
          ) : null}
        </div>
      </div>
    </div>
  );
}`;

code = code.substring(0, code.indexOf('{/* Content */}')) + replacement;
fs.writeFileSync('src/components/DateIdeasModal.tsx', code);
