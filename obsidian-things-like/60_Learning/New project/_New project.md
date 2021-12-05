---
id: 20211204184912934
aliases: ["⭕️ Learning.New project"]
display: New project
tags: project
---
area:: [[_Learning|🗃 Learning]]

```dataviewjs
customJS.DvTasks.checkboxInNote({app, dv, luxon, moment, markComplete: customJS.MarkTask.complete, that:this})
```

start:: [[2021-12-04]]
due:: 
completed:: 

---

```dataviewjs
const {DvTasks} = customJS
const {MarkTask} = customJS
DvTasks.areaOrProject({app, dv, moment, luxon, that:this, markComplete:MarkTask.complete})
```
