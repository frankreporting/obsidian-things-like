<%*
const prompt = await tp.system.prompt("New project:")
tR += "---\nid: " + tp.date.now("YYYYMMDDHHmmssSSS") + "\nalias: ⦿ " + prompt + "\ntags: project\nstart: \ncompleted: \n---"
%>
<% tp.file.rename(prompt) %>area:: <% tp.file.cursor(0) %>
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