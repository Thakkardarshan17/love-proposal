#!/bin/bash
# We want to insert our code before the last three lines of CustomizationModal.tsx
# which are:
#       </div>
#     </div>
#   );
# };

# Get total lines
TOTAL_LINES=$(wc -l < src/components/CustomizationModal.tsx)
INSERT_LINE=$((TOTAL_LINES - 4))

sed -i "${INSERT_LINE}r theme_tab_content.txt" src/components/CustomizationModal.tsx
