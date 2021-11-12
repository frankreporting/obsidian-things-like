<%*
const prompt = await tp.system.prompt("New area note:");
const alias = tp.file.folder().replace(/[0-9_]/g,"").replace("/",".") + "." + prompt;
tR += "---\nid: " + tp.date.now("YYYYMMDDHHmmssSSS") + "\nalias: 🗃 " + alias + "\ndisplay: 🗃 " + prompt + "\ntags: area\n---"
%>
<% tp.file.rename("_" + prompt) %><% tp.file.cursor(0) %>

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
	.where(p => (!dv.func.contains(p.tags,'area')) & (!dv.func.contains(p.tags,'project')) & (!dv.func.contains(p.tags,'task')) & (p.file.folder == dv.current().file.folder));
dv.list(notes.file.link);
```

## Completed

```dataview
list completed.file.day from #task
where completed.file and area = this.file.link
sort completed desc
```
