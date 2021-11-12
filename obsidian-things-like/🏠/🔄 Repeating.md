---
obsidianUIMode: preview
---
# Repeating tasks

```dataviewjs
// ----- REPEATING TASKS ----- //
const sorter = (day) => day ?? "Some Day";
const highlightDate = (x) => "<span style='background-color:#ddd;color:#666;border-radius:6px;font-size:0.7em;padding:1px 5px;'>" + moment(x).format("MMM D") + "</span> ";

for (let p of dv.pages("#task")
		.where(p => p.repeat)
    .sort(p => sorter(p.start))
    ) {
	dv.span((p.start ? highlightDate(p.start.path) : "") + dv.fileLink(p.file.path, false, p.display) + (p.due ? " » " + moment(p.due.path).format("MMM D") : "") + "<br>");
}
```
