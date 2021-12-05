---
id: 20210821184633724
aliases: 🗃 Personal.Recipes
display: Recipes
tags: area
obsidianUIMode: preview
---
area:: [[_Personal|🗃 Personal]]

# Recipes
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
```dataviewjs
const {DvTasks} = customJS
const {MarkTask} = customJS
DvTasks.areaOrProject({app, dv, moment, luxon, that:this, markComplete:MarkTask.complete})
```
