---
id: 20211112001648978
obsidianUIMode: preview
---
```dataviewjs
const {DvTasks} = customJS
DvTasks.noteGroup({app, dv, that:this, 
	source: '"00_Meta/06_Logbook"',
	sortProp: p => p.file.name,
  sortOrder: "desc",
  prependText: dv.current().file.name,
  headerLevel: 1,
})
```
