#!/bin/bash
sed -i '/{\/\* Customizer Modal Trigger \*\/}/i \
              {/* Date Spots Modal Trigger */}\
              <button\
                onClick={() => setIsDateIdeasOpen(true)}\
                className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-full bg-[var(--c-bg-dark)]/90 hover:bg-[var(--c-bg-dark)] border border-[var(--c-accent-main)]/40 text-[var(--c-accent-light)] hover:text-[var(--c-text-main)] transition-all hover:scale-105 shadow-md cursor-pointer shrink-0"\
                title="Find Romantic Date Spots Nearby"\
                aria-label="Find Date Spots"\
              >\
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />\
              </button>\
' src/App.tsx
