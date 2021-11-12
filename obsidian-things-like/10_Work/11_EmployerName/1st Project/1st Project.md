---
id: 20211110184017970
alias: ⭕️ Work.Employer Name.1st Project
display: 1st Project
tags: project
---

# 1st Project

area:: [[_Employer Name|🗃 Work.Employer Name]]
start::
completed:: 
due:: 

## Tasks

```dataview
list due.file.day from #task
where !completed.file and project = this.file.link
```

## Notes

```dataviewjs
let notes = dv.pages('"' + dv.current().file.folder + '"')
	.where(p => (!dv.func.contains(p.tags,'area')) & (!dv.func.contains(p.tags,'project')) & (!dv.func.contains(p.tags,'task')) & (p.file.folder == dv.current().file.folder));
dv.list(notes.file.link);
```

## Completed

```dataview
list completed.file.day from #task
where completed.file and project = this.file.link
sort completed desc
```