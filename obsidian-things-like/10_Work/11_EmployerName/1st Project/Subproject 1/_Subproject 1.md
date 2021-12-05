---
id: 20211110183604141
alias: ⭕️ Work.Employer Name.Subproject 1
display: Subproject 1
tags: project
---
area:: [[_Employer Name|🗃 Work.Employer Name]]
project:: [[1st Project|⭕️ Work.Employer Name.1st Project]]
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
