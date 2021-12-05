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


```html
<p>Here is a tag</p>
<div class="something">
<span>Some more text</span>
</div>
```


```ad-bug
title: This
And here is some copy
```

```ad-error
collapse: closed

Here is some copy

```



> Here be a blockquote
Pretty handy but similar problem.. if this is still part of the original blockquote then why make it look like multiple stacked ones?
This is also blockquote? But why?
