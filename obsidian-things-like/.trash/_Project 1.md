---
id: 202105211121001
aliases: ⭕️ Work.KPCC.Merlin
display: Merlin
tags: project
obsidianUIMode: preview
---

# Merlin

area:: [[_KPCC|🗃 Work.KPCC]]
start::
completed:: 
things:: [🔗](things:///show?id=BJcdYsTp7eYQpczok8VkJg)

## Open Questions/Ideas

- Consider changing who "owns" the automations to Merlin account or scprweb@scpr.org so error notifications reach more than one person, or the right person.. I may need to train someone or ask IT to help take over managing this
- Improve how staffing calendars work by consolidating date fields: one start date and one end date, both with time, but with a separate checkbox to indicate an event should show up as "all day" instead of blocking the hours on the calendar view
  - Got the idea from the beta [Outlook Calendar Sync](https://community.airtable.com/t/new-beta-outlook-calendar-sync/42016) feature from Airtable, which showed a single start/end date with a checkbox for All Day, more in line with how digital calendars work. Not quite sure how to implement this yet, but may require a separate formula field that still uses `all day start` and `all day end` fields. Could be less than ideal, bc even though it's one less layer of complication for the user, it's still likely to prevent easy drag and drop for all day events.

## In Progress
```dataviewjs
let projects = dv.pages("#project")
	.where(p => p.project && !p.completed && (p.project.path = dv.current().file.name))
  .sort(p => p.due, 'asc')
  .map(p => dv.fileLink(p.file.path, false, p.display) + (p.due ? " » " + moment(p.due.path).format("MMM D") : ""));

dv.list(projects);
```

## Releases
```dataviewjs
let projects = dv.pages("#project")
	.where(p => (p.project) && (p.completed) && (p.project.path = dv.current().file.name))
  .sort(p => p.due, 'desc')
  .map(p => dv.fileLink(p.file.path,false, p.display) + (p.completed ? " ✔️ " + moment(p.completed.path).format("MMM D") : ""));
  
dv.list(projects);
```

## Some Notes to Review

- [[202010271144 Notes on SharePoint and Microsoft Lists]]
- [[202001231410 Merlin ideas]]
- [[201806211430 Merlin notes old]]
- [[201805141051 Merlin Newscasts]]
- [[201904061241 Merlin webinar deck]]
- [[201805101551 Merlin In Person notes]]
- [[201903272011 MERLIN FIELD REFERENCES]]
- [[201804181158 Merlin Basic Info and Ideas to try]]
- [[201810151108 Merlin Advisory Group Meeting 101518]]
- [[2018-09-24 Merlin Advisory Group Meeting]]
- [[201909231304 Finish Merlin post-rollout]]
- [[202007281123 Thoughts on Merlin improvements]]
- [[201904160740 AirTalk notes for Merlin]]
- [[201801301244 Survey report for Merlin]]