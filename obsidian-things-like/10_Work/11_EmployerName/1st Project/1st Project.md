---
id: 20211110184017970
alias: ⭕️ Work.Employer Name.1st Project
display: 1st Project
tags: project
---
area:: [[_Employer Name|🗃 Work.Employer Name]]
```dataviewjs
customJS.DvTasks.checkboxInNote({app, dv, luxon, moment, markComplete: customJS.MarkTask.complete, that:this})
```

start:: [[2021-11-25]]
completed:: 
due:: 

---

```dataviewjs
const {DvTasks} = customJS
const {MarkTask} = customJS
DvTasks.areaOrProject({app, dv, moment, luxon, that:this, markComplete:MarkTask.complete})
```
