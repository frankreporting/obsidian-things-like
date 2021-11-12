---
obsidianUIMode: preview
---
# 📅 Upcoming
```dataviewjs
// ----- UPCOMING PROJECTS AND TASKS ----- //
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
      	dv.span((dv.func.contains(d.file.tags,"#project") ? "⭕️ " + dv.func.link(d.file.path,d.display) : "◻️ " + d.file.link) + (d.due ? " » " + moment(d.due.path).format("MMM D") : "") + "<br>");
      }
    }
}

if (sorted.byMonth) {
	for (let day of dv.array(sorted.byMonth)
  	.groupBy(p => groupbyDate(p,"byMonth",p.file.tags))) {
    	dv.header(2,moment(day.key).format("MMMM"));
			for (let d of day.rows) {
      	dv.span((dv.func.contains(d.file.tags,"#project") ? "⭕️ " + (d.start ? highlightDate(d.start.path) : "") + dv.func.link(d.file.path,d.display) : "◻️ " + highlightDate(d.start.path) + d.file.link) + (d.due ? " » " + moment(d.due.path).format("MMM D") : "") + "<br>");
      }
    }
}

if (sorted.byYear) {
	for (let day of dv.array(sorted.byYear)
  	.groupBy(p => groupbyDate(p,"byYear",p.file.tags))) {
    	dv.header(2,day.key);
			for (let d of day.rows) {
      	dv.span((dv.func.contains(d.file.tags,"#project") ? "⭕️ " + (d.start ? highlightDate(d.start.path) : "") + dv.func.link(d.file.path,d.display) : "◻️ " + highlightDate(d.start.path) + d.file.link) + (d.due ? " » " + moment(d.due.path).format("MMM D") : "") + "<br>");
      }
    }
}
```
