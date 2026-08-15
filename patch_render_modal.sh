#!/bin/bash
sed -i '/<CustomizationModal/i \
      {/* Date Ideas Modal */}\
      <DateIdeasModal\
        isOpen={isDateIdeasOpen}\
        onClose={() => setIsDateIdeasOpen(false)}\
      />\
' src/App.tsx
