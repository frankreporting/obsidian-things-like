---
obsidianUIMode: preview
---
```dataviewjs
dv.header(1,moment().format("dddd, MMMM DD, YYYY"))
```

Here is some extra copy to **edit**. 

```ad-bug
title: Updates needed
collapse: true

- [x] Clone vault to create development environment
  - [x] Create GitHub repo to start working in a saner, safer way, testing all changes before applying to my main vault
- [ ] Consolidate DV scripts into DvTasks.js for all nav pages, daily note template, etc.
- [ ] Update mobile css to fix checkbox layout
- [ ] Update project/area pages with relevant DV scripts
- [ ] Update Quick Add commands
  - [ ] project (to create folder and project file)
  - [ ] area (to create folder and area file)
- [ ] consider new index page for tasks without dates
```
```dataviewjs
const {DvTasks} = customJS

const {MarkTask} = customJS

DvTasks.events({app, dv, luxon, that:this, date:luxon.DateTime.now().toFormat("yyyy-MM-dd")})

DvTasks.overdueTasks({app, dv, luxon, moment, markComplete:MarkTask.complete, that:this})
```
```dataviewjs
// ----- PROJECTS AND TASKS ----- //
// const { update } = this.app.plugins.plugins["metaedit"].api;
const {MarkTask} = customJS;

const checkboxMaker = (pn, pv, fpath) => {
	const checkbox = this.container.createEl('input')
  checkbox.type = "checkbox";
	checkbox.addClass("task-list-item");
	checkbox.id = fpath;
	checkbox.style["height"] = "1.1em";
	checkbox.style["width"] = "1.1em";
	checkbox.style["verticalAlign"] = "sub";
  checkbox.style["marginLeft"] = "0";
	const file = this.app.vault.getAbstractFileByPath(fpath);
	checkbox.addEventListener('click', async(evt) => {
		// evt.preventDefault();
		// await update(pn, pv, file);
    await MarkTask.complete({app, file, moment});
	});
	return checkbox;
}

function typeCheck(tags) {
	const project = tags.includes("#project");
	const task = tags.includes("#task");
	const area = tags.includes("#area");
	let icon = task ? "<span style='font-size: 1.1em;'><b>⃝</b></span> " : (project ? "⭕️ " : (area ? "🗄 " : ""));
	return icon;
}

const groupbyProjectOrArea = (p) => p.project ? p.project.path : (p.area ? p.area.path : "N/A");

const getGroupSort = (key) => dv.page(key).file.path;

let tasks = dv.pages("#task or #project")
	.where(p => !(p.completed) && (p.start) && (p.start.path <= moment().format("YYYY-MM-DD")) && (!(p.due) || (p.due.path >= moment().format("YYYY-MM-DD"))));

if (tasks) {
	for (let item of dv.array(tasks)
  	.groupBy(item => groupbyProjectOrArea(item))
    .sort(item => getGroupSort(item.key), "asc")) {
	 let header = dv.page(item.key) ? dv.fileLink(dv.page(item.key).file.path, false, typeCheck(dv.page(item.key).file.tags) + " " + dv.page(item.key).display) : "N/A";
    	dv.header(2,header);
			for (let i of item.rows) {
      	if (i.file.tags.includes("#task")) {
        	checkboxMaker("completed", "[[" + luxon.DateTime.now().toFormat("yyyy-MM-dd") + "]]", i.file.path);
					dv.el("label", " " + dv.fileLink(i.file.path, false, i.file.name) + (i.due ? " »" + luxon.DateTime.fromISO(i.due.path).toFormat("MMM d") : "") + "<br>");
        } else {
					dv.span("<span style='font-size: 1.2em;margin-right:2px;'>" + typeCheck(i.file.tags) + "</span>" + dv.fileLink(i.file.path, false, i.display) + (i.due ? " »" + luxon.DateTime.fromISO(i.due.path).toFormat("MMM d") + "</span>" : "") + "<br>");
        }
      }
   }
}
```


```dataviewjs
// ----- DEADLINES NEARING ----- //
const sorter = (day) => !day ? "Some Day" : day.path;
let tasks = dv.pages("#task")
	.where(p => !(p.completed) && (p.due) && (p.due.path >= moment().format("YYYY-MM-DD")) && (p.due.path < moment().add(7, 'days').format("YYYY-MM-DD")))
  .sort(p => sorter(p.due), "asc")
  .map(p => dv.fileLink(p.file.path, false, p.display) + (p.due ? " » " + moment(p.due.path).format("MMM D") : ""));

if (tasks.length > 0) {
	dv.header(2, "Deadlines Nearing");
  for (let t of tasks) {
		dv.span("◻️ " + t + " \n ");
	}
}
```

```dataviewjs
// ----- CREATED/COMPLETED ----- //
const {DvTasks} = customJS

DvTasks.completed({app, dv, luxon, that:this, date:luxon.DateTime.now().toFormat("yyyy-MM-dd")})

DvTasks.created({app, dv, luxon, that:this, date:luxon.DateTime.fromISO(luxon.DateTime.now().toFormat("yyyy-MM-dd")) })
```

