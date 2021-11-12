---
id: 20210824215955555
aliases: 🗃 PKM
display: PKM
tags: area
obsidianUIMode: preview
---
[[🎛 Dashboard|⤴️]]
# Personal Knowledge Management

```dataviewjs
function checksub() {
	const subAreas = dv.pages('"' + dv.current().file.folder + '"').where(p => (dv.func.contains(p.tags,"area")) & (p.file.name != dv.current().file.name)).map(p => dv.func.link(p.file.path,p.display));
  if (subAreas.length > 0) {
  	// dv.header(2,"Areas");
  	dv.paragraph(dv.func.join(subAreas.array(), " **•** "));
  }
}

checksub();
```

