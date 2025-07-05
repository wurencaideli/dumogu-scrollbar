## Introduction

A simple and lightweight custom scroll bar. The compressed file is less than 10kb

There is no repeated packaging of the scroll container. This custom scroll bar is mounted on the body, so it has no impact on the original scroll container.

You can even directly introduce the rail component to define the mounting target yourself and define the style of the scroll bar more flexibly.

[DEMO](https://wurencaideli.github.io/dumogu-scrollbar/demo.html)

#### install

```javascript
npm install dumogu-scrollbar
```

#### How to use

```javascript
import {DumoguScrollbar} form 'dumogu-scrollbar';

const el = document.getElementById('target');
const dumoguScrollbar = new DumoguScrollbar(el,{
    keepShow:false,  // Whether to always display
    stopClickPropagation:false  // Cancel the bubble of the click event
});

/** The following are some methods in the examples */

// Update the style
dumoguScrollbar.update();
// Mount
dumoguScrollbar.mount()
// Unmount
dumoguScrollbar.unmount()
// Destroy
dumoguScrollbar.destroy()
```