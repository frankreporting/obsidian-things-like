---
id: 20210821173258046
aliases: 🗃 Archive
display: Archive
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