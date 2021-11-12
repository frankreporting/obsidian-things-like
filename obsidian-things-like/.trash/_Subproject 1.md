---
id: 202107011835005
aliases: ⭕️ Work.KPCC.Merlin 2.0
display: Merlin 2.0
tags: project
---
start:: 
completed:: [[2021-07-13]]
project:: [[_Merlin|🗃 Work.KPCC.Merlin]]
area:: [[_KPCC|🗃 Work.KPCC]]

## Summary

### What's New
- Source Tracking
- Contacts
- Slack Notifications
- Improved Search

## Notes

- [[Merlin 2.0 training deck]]
- [[Merlin 2.0 rollout notes]]
- [[Initial Source Tracker implementation in Merlin]]
- User Testing:
  - [[Merlin 2.0 User Testing Recommendations and Questions]]
  - [[Merlin Source Tracker user testing 2nd round]]
  - [[Merlin 2.0 user testing 1st round takeaways]]
  - [[Merlin Source Tracker user testing 1st round]]

## Tasks

```dataview
list due.file.day from #task
where !completed.file and  project = this.file.link
```

## Projects

```dataviewjs
let projects = dv.pages("#project")
	.where(p => (p.area.path == dv.current().file.name) && (!p.completed))
  .map(p => dv.func.link(p.file.path,p.display) + (p.due ? ': ' + p.due : ''));
dv.list(projects);
```

## Completed

```dataview
list due.file.day from #task
where completed.file and project = this.file.link
```

## Training and Meetings

```dataview
table Who
from [[Merlin 2.0]] and #meeting 
```