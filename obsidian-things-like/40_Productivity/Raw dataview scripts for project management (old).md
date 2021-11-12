This is a collection of raw dataview and dataviewjs scripts used to power my project management system. I am moving over gradually to a single customJS file, [[dvTasks.js]], to more easily keep everything in sync. But it may be worth preserving these for future reference.

# For daily notes.. 

## New Tasks

```dataviewjs
let tasks = dv.pages("#task")
	.where(p => !(p.completed) && (p.start) && (p.start.path == dv.current().file.name))
	.map(p => dv.func.link(p.file.path,p.display) + (p.due ? " » " + moment(p.due.path).format("MMM D") : ""));

for (let t of tasks) {
	dv.paragraph(" ◻️ " + t + " \n ");
}
```

## Due

```dataviewjs
let tasks = dv.pages("#task","#project")
	.where(p => !(p.completed) && (p.due) && (p.due.path == dv.current().file.name))
	.map(p => dv.func.link(p.file.path,p.display));

for (let t of tasks) {
	dv.paragraph(" ◻️ " + t + " \n ");
}
```

## Events

```dataview
list
where file.name != this.file.name and file.day = this.file.day
sort file.ctime asc
```

%% Reminders/Backlinks/Mentions: only visible when there are results %%
```dataviewjs
const day = dv.current().file.name;
let backlinks = dv.pages(`[[${day}]]`)
	.where(p => !(dv.func.contains(p.tags,"task")) && !(dv.func.contains(p.tags,"project")))
  .map(p => p.file.link);
if (backlinks.length > 0) {
	dv.header(2,"Reminders/Mentions");
  dv.list(backlinks);
}
```

## Completed

```dataview
list from #task
where completed.file.day = this.file.day
sort file.ctime asc
```

## Created

```dataview
list
where file.name != this.file.name and file.ctime > this.file.day and file.ctime < (this.file.day + dur(1 day)) and file.day != this.file.day
sort file.ctime asc
```

# Today view

# `$= moment().format("dddd, MMMM DD, YYYY")`

%% Overdue (hidden when 0 results) %%
```dataviewjs
const sorter = (day) => !day ? "Some Day" : dv.page(day).file.name;
let tasks = dv.pages("#task")
	.where(p => !(p.completed) && (p.due) && (p.due.path < moment().format("YYYY-MM-DD")))
  .sort(p => sorter(p.due), "asc")
  .map(p => dv.func.link(p.file.path,p.display) + (p.due ? " ❗️<span style='color:red;'>" + moment(dv.page(p.due).file.name).format("MMM D") +  "</span>" : ""));
if (tasks) {
	dv.header(2, "Overdue");
}
for (let t of tasks) {
	dv.paragraph(" ◻️ " + t + " \n ");
}
```

%% Tasks (hidden when 0 results) %%
```dataviewjs
let items = [];

function typeCheck(tags) {
	const project = dv.func.contains(tags,"project");
  const task = dv.func.contains(tags,"task");
  const area = dv.func.contains(tags,"area");
  let icon = task ? "◻️" : (project ? "⭕️" : (area ? "🗄" : ""));
  return icon;
}

const groupbyProjectOrArea = (p) => p.project ? p.project.path : (p.area ? p.area.path : "");

let tasks = dv.pages("#task")
	.where(p => !(p.completed) && (p.start) && (p.start.path <= moment().format("YYYY-MM-DD")) && (!(p.due) || (p.due.path > moment().format("YYYY-MM-DD"))));

let projects = dv.pages("#project")
	.where(p => !(p.completed) && (p.start) && (p.start.path < moment().format("YYYY-MM-DD")));
  
for (let task of tasks) {
	items.push(task);
}

for (let project of projects) {
	items.push(project);
}

//console.log(items);

if (items) {
	for (let item of dv.array(items)
  	.groupBy(item => groupbyProjectOrArea(item))) {
	 let header = dv.page(item.key);
    	dv.header(2,dv.func.link(header.file.path,typeCheck(header.file.tags) + " " + header.display));
			for (let i of item.rows) {
      			dv.paragraph((dv.func.contains(i.file.tags,"#project") ? "⭕️ " + dv.func.link(i.file.path,i.display) : "◻️ " + i.file.link) + (i.due ? " » " + moment(i.due.path).format("MMM D") : "") + " \n ");
      }
    }
}
```

## Deadlines Nearing

```dataviewjs
const sorter = (day) => !day ? "Some Day" : dv.page(day).file.name;
let tasks = dv.pages("#task")
	.where(p => !(p.completed) && (p.due) && (p.due.path >= moment().format("YYYY-MM-DD")) && (p.due.path < moment().add(7, 'days').format("YYYY-MM-DD")))
  .sort(p => sorter(p.due), "asc")
  .map(p => dv.func.link(p.file.path,p.display) + (p.due ? " » " + moment(dv.page(p.due).file.name).format("MMM D") : ""));
for (let t of tasks) {
	dv.paragraph("◻️ " + t + " \n ");
}
```

## Events

```dataview
list time
where file.day = date(today) and date(file.name) != date(today)
sort file.ctime asc
```

%% Reminders/Backlinks/Mentions (Hidden when 0 results) %%
```dataviewjs
const today = moment().format("YYYY-MM-DD");
let backlinks = dv.pages(`[[${today}]]`)
	.where(p => !(dv.func.contains(p.tags,"task")) && !(dv.func.contains(p.tags,"project")))
  .map(p => p.file.link);
if (backlinks.length > 0) {
	dv.header(2,"Reminders/Mentions");
  dv.list(backlinks);
}
```

## Completed

```dataview
list from #task
where completed.file.day = date(today)
sort file.ctime asc
```

## Created

```dataview
list
where file.name != this.file.name and file.ctime > date(today) and file.ctime < (date(today) + dur(1 day)) and file.day != date(today)
sort file.ctime asc
```


# Upcoming view

---
obsidianUIMode: preview
---
# 📅 Upcoming

```dataviewjs
let sorted = {"byDay": [], "byMonth": [], "byYear": []};

const sorter = (day) => !day ? "Some Day" : dv.page(day).file.name;

function groupbyDate(p,type,tag) {
	let date = dv.func.contains(tag,"#task") ? p.start.path : (p.due ? p.due.path : p.start.path);
	let format = {"byDay": "YYYY-MM-DD", "byMonth": "YYYY-MM", "byYear": "YYYY"}
  return moment(date).format(format[type]);
}

const highlightDate = (x) => "<span style='background-color:#ddd;color:#666;border-radius:6px;font-size:0.7em;padding:1px 5px;'>" + moment(x).format("MMM D") + "</span> ";

const sort = (items) => {
	const f = (momt) => momt.format("YYYY-MM-DD");
  const iDate = (i) => dv.func.contains(i.file.tags,"#task") ? i.start.path : (i.due ? i.due.path : i.start.path);
	const bydays = (i) => (f(moment()) < iDate(i)) && (iDate(i) <= f(moment().add(7,'days')));
	const bymonths = (i) => (f(moment().add(7,'days')) < iDate(i)) && (iDate(i) <= f(moment().add(5,'months')));
  const byyears = (i) => iDate(i) > f(moment().add(5,'months'));
  for (let i of items) {
    if (byyears(i)) { sorted.byYear.push(i) }
		else if (bydays(i)) { sorted.byDay.push(i) }
    else if (bymonths(i)) { sorted.byMonth.push(i) }
  }
}

let tasks = dv.pages("#task")
	.where(p => !(p.completed) && (p.start) && (p.start.path > moment().format("YYYY-MM-DD")) && (!(p.due) || (p.due.path > moment().format("YYYY-MM-DD"))));

let projects = dv.pages("#project")
	.where(p => !(p.completed) && (p.start));
  
sort(tasks);
sort(projects);

if (sorted.byDay) {
	for (let day of dv.array(sorted.byDay)
  	.groupBy(p => groupbyDate(p,"byDay",p.file.tags)).sort(p => sorter(p.due), "asc")) {
    	dv.header(2,(day.key == moment().add(1,'days').format("YYYY-MM-DD")) ? moment(day.key).format("DD") + " Tomorrow" : moment(day.key).format("DD dddd"));
			for (let d of day.rows) {
      	dv.paragraph((dv.func.contains(d.file.tags,"#project") ? "⭕️ " + dv.func.link(d.file.path,d.display) : "◻️ " + d.file.link) + (d.due ? " » " + moment(d.due.path).format("MMM D") : "") + " \n ");
      }
    }
}

if (sorted.byMonth) {
	for (let day of dv.array(sorted.byMonth)
  	.groupBy(p => groupbyDate(p,"byMonth",p.file.tags))) {
    	dv.header(2,moment(day.key).format("MMMM"));
			for (let d of day.rows) {
      	dv.paragraph((dv.func.contains(d.file.tags,"#project") ? "⭕️ " + (d.start ? highlightDate(d.start.path) : "") + dv.func.link(d.file.path,d.display) : "◻️ " + highlightDate(d.start.path) + d.file.link) + (d.due ? " » " + moment(d.due.path).format("MMM D") : "") + " \n ");
      }
    }
}

if (sorted.byYear) {
	for (let day of dv.array(sorted.byYear)
  	.groupBy(p => groupbyDate(p,"byYear",p.file.tags))) {
    	dv.header(2,day.key);
			for (let d of day.rows) {
      	dv.paragraph((dv.func.contains(d.file.tags,"#project") ? "⭕️ " + (d.start ? highlightDate(d.start.path) : "") + dv.func.link(d.file.path,d.display) : "◻️ " + highlightDate(d.start.path) + d.file.link) + (d.due ? " » " + moment(d.due.path).format("MMM D") : "") + " \n ");
      }
    }
}
```

# For Logbook view..


```dataview
list from "00_Meta/06_Logbook"
sort file.day desc
```

# For Dashboard view..

---
obsidianUIMode: preview
---
**[[📥 Inbox]] (`$=dv.pages('"00_Meta/05_Inbox"').length`)**

**[[☀️ Today]]**

**[[📅 Upcoming]]**

**[[🔄 Repeating]]**

**[[📔 Logbook]]**

%%
```dataviewjs
function checksub() {
	const subAreas = dv.pages("#area")
  	.where(p => (dv.func.contains(p.tags,"area")) & (p.file.name != dv.current().file.name) & !p.area)
    .sort(p => p.file.path,'asc')
    .map(p => dv.func.link(p.file.path,p.display));
  if (subAreas.length > 0) {
  	dv.paragraph(dv.func.join(subAreas.array(), " **•** "));
  }
}

checksub();
```
%%

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
  	dv.paragraph("⭕️ " + dv.func.link(p.file.path,p.display) + " \n ");
  }
}
```

%%
```dataviewjs
let groups = dv.pages("#project").where(p => !p.completed).groupBy(p => p.area);

for (let group of groups.sort(g => dv.page(g.key).file.path, 'asc')) {
	let projects = group.rows.map(p => dv.func.link(p.file.path,p.display));
	dv.header(3, dv.func.link(group.key,"🗃 " + dv.page(group.key).display));
	for (let p of projects) {
		dv.paragraph("⭕️ " + p + " \n ");
	}
}
```
%%

# For Inbox view..

```dataview
list from "00_Meta/05_Inbox"
sort file.ctime desc
```

# For Repeating view...

```dataviewjs
const sorter = (day) => !day ? "Some Day" : dv.page(day).file.name;
const highlightDate = (x) => "<span style='background-color:#ddd;color:#666;border-radius:6px;font-size:0.7em;padding:1px 5px;'>" + moment(x).format("MMM D") + "</span> ";

for (let p of dv.pages("#task")
		.where(p => p.repeat)
    .sort(p => sorter(p.start))) {
	dv.paragraph("◻️ " + (p.start ? highlightDate(p.start.path) : "") + dv.func.link(p.file.path,p.display) + (p.due ? " » " + moment(p.due.path).format("MMM D") : "") + " \n ");
}
```