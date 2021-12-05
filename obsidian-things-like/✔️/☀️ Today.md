---
id: 20211112002632263
obsidianUIMode: preview
---
```dataviewjs
dv.header(1,moment().format("dddd, MMMM DD, YYYY"))
```
```dataviewjs
const {DvTasks} = customJS
const {MarkTask} = customJS

DvTasks.viewToday({app, dv, luxon, moment, markComplete:MarkTask.complete, that:this, date:moment().format("YYYY-MM-DD")})
```

