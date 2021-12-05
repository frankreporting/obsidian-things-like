---
id: 20211112002937843
obsidianUIMode: preview
---
```dataviewjs
const {DvTasks} = customJS
DvTasks.noteGroup({app, dv, that:this, 
	source: '"00_Meta/05_Inbox"',
	sortProp: p => p.file.ctime,
  sortOrder: "desc",
  prependText: dv.current().file.name,
  headerLevel: 1,
})
```
