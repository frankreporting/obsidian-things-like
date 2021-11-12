---
obsidianUIMode: preview
---
**[[📥 Inbox]] (`$=dv.pages('"00_Meta/05_Inbox"').length`)**

**[[☀️ Today]]**

**[[📅 Upcoming]]**

**[[🔄 Repeating]]**

**[[📔 Logbook]]**

```dataviewjs
let areas = dv.pages("#area")
  	.where(p => (p.file.name != dv.current().file.name))
    .sort(p => p.file.path,'asc');
    
const getArea = a => dv.func.contains(dv.page(a).file.tags,"area") ? a : dv.page(a).area.path;

for (let area of areas) {
	let [level,icon] = (area.area ? [3,"🗃"] : [2,"🗄"]);
	dv.header(level, dv.func.link(area.file.path,`${icon} ${area.display}`));
	let projects = dv.pages("#project")
  	.where(p => (!p.completed) && (dv.page(p.area.path).file.path == area.file.path));

	for (let p of projects) {
   		dv.span("⭕️ " + dv.func.link(p.file.path,p.display) + "<br>");
	 }
}
```

---

Total Vault Size: `$=dv.paragraph(dv.pages().length)`