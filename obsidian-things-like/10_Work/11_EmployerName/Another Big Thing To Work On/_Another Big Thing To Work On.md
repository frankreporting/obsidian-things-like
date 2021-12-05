---
id: 20211110183326128
alias: ⭕️ Another Big Thing To Work On
display: Another Big Thing To Work On
tags: project
---
area:: [[_Employer Name|🗃 Work.Employer Name]]
```dataviewjs
customJS.DvTasks.checkboxInNote({app, dv, luxon, moment, markComplete: customJS.MarkTask.complete, that:this})
```

start:: 
due:: 
completed:: 

---

```dataviewjs
const {DvTasks} = customJS
const {MarkTask} = customJS
DvTasks.areaOrProject({app, dv, moment, luxon, that:this, markComplete:MarkTask.complete})
```
