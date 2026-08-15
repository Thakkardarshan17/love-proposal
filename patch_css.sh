#!/bin/bash
sed -i '4i\
  :root {\
    --c-bg-darkest: #12080D;\
    --c-bg-darker: #1C0B13;\
    --c-bg-dark: #2A101B;\
    --c-bg-light: #3A1422;\
    --c-accent-main: #E8899D;\
    --c-accent-light: #F7B8C5;\
    --c-accent-gold: #D8A06C;\
    --c-text-main: #FFF3EF;\
  }\
  .theme-midnight {\
    --c-bg-darkest: #070B19;\
    --c-bg-darker: #0B1229;\
    --c-bg-dark: #121A3B;\
    --c-bg-light: #1A254D;\
    --c-accent-main: #6B8AFF;\
    --c-accent-light: #A5BAFF;\
    --c-accent-gold: #D8A06C;\
    --c-text-main: #F0F4FF;\
  }\
  .theme-sunset {\
    --c-bg-darkest: #1A0D08;\
    --c-bg-darker: #29140B;\
    --c-bg-dark: #3B1C12;\
    --c-bg-light: #4D251A;\
    --c-accent-main: #FF8A66;\
    --c-accent-light: #FFBAA5;\
    --c-accent-gold: #FFD166;\
    --c-text-main: #FFF4F0;\
  }\
  .theme-gold {\
    --c-bg-darkest: #14120D;\
    --c-bg-darker: #1C1914;\
    --c-bg-dark: #2A251E;\
    --c-bg-light: #3B332B;\
    --c-accent-main: #D8A06C;\
    --c-accent-light: #F2D2A9;\
    --c-accent-gold: #FFD700;\
    --c-text-main: #FDFBF7;\
  }\
' src/index.css
