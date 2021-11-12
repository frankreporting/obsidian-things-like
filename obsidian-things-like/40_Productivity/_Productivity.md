---
id: 20210821174053048
aliases: 🗃 Productivity
display: Productivity
tags: area
obsidianUIMode: preview
---
⤴️ [[🎛 Dashboard|Dashboard]]

```dataviewjs
function checksub() {
	const subAreas = dv.pages('"' + dv.current().file.folder + '"').where(p => (dv.func.contains(p.tags,"area")) & (p.file.name != dv.current().file.name)).map(p => dv.func.link(p.file.path,p.display));
  if (subAreas.length > 0) {
  	dv.header(2,"Areas");
  	dv.paragraph(dv.func.join(subAreas.array(), " **•** "));
  }
}

checksub();
```

## Tasks

```dataview
list due.file.day from #task
where !completed.file and area = this.file.link
```

## Projects

```dataviewjs
let projects = dv.pages("#project")
	.where(p => (p.area.path == dv.current().file.name) && (!p.completed))
  .map(p => dv.func.link(p.file.path,p.display) + (p.due ? ': ' + p.due : ''));
dv.list(projects);
```

## Notes

```dataviewjs
let notes = dv.pages('"' + dv.current().file.folder + '"')
	.where(p => !(dv.func.contains(p.tags,"task"||"project"||"area")) && p.file.name != dv.current().file.name);
dv.list(notes.file.link);
```

## Completed

```dataview
list due.file.day from #task
where completed.file and area = this.file.link
```