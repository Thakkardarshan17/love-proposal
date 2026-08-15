#!/bin/bash
# Insert Theme tab button
sed -i '/<span>Soundtrack<\/span>/,/<\/button>/a \
          <button\
            type="button"\
            onClick={() => setActiveTab('\''theme'\'')}\
            className={`py-1.5 sm:py-2 px-3 sm:px-3.5 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 shrink-0 cursor-pointer whitespace-nowrap ${activeTab === '\''theme'\'' ? '\''bg-gradient-to-r from-[var(--c-accent-main)] to-[var(--c-accent-gold)] text-[var(--c-bg-darkest)] shadow-md font-bold'\'' : '\''bg-white/5 text-[var(--c-accent-light)]/80 hover:bg-white/10 hover:text-[var(--c-text-main)]'\''}`}\
          >\
            <Palette className="w-3.5 h-3.5" />\
            <span>Theme</span>\
          </button>' src/components/CustomizationModal.tsx
